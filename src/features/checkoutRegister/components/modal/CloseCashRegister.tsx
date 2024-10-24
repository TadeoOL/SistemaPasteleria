import {
  Box,
  Button,
  Collapse,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableContainer,
  TableHead,
  Typography,
  Grid2,
  TextField,
  Stack
} from '@mui/material';
import MainCard from '../../../../components/MainCard';
import { CashRegisterWithdrawa, ICashRegisterSales } from '../../../../types/checkoutRegister/cashRegister';
import { useState } from 'react';
import { TableRow } from '@mui/material';
import { TableCell } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { TableBody } from '@mui/material';
import { PaymentType, PaymentTypeLabels } from '../../../../types/checkoutRegister/paymentTypes';
import React from 'react';
import { InputAdornment } from '@mui/material';
import { toast } from 'react-toastify';
import { closeCashRegister } from '../../services/cashRegisterService';
import { useCashRegisterStore } from '../../store/cashRegister';
import { useNavigate } from 'react-router-dom';
import { Divider } from '@mui/material';

// Generic type for the data
type DataItem = Record<string, any>;

interface CloseCashRegisterProps {
  onClose: () => void;
  sales: ICashRegisterSales[];
  cashRegisterId: string;
  withdrawals: CashRegisterWithdrawa[];
}

export const CloseCashRegister = ({ onClose, sales, cashRegisterId, withdrawals }: CloseCashRegisterProps) => {
  const salesByTypeOfPayment: Record<PaymentType, ICashRegisterSales[]> = sales.reduce((acc, sale) => {
    acc[sale.tipoPago as PaymentType] = acc[sale.tipoPago as PaymentType] || [];
    acc[sale.tipoPago as PaymentType].push(sale);
    return acc;
  }, {} as Record<PaymentType, ICashRegisterSales[]>);
  const [cashAmount, setCashAmount] = useState('');
  const setCashRegister = useCashRegisterStore((state) => state.setCashRegister);
  const navigate = useNavigate();

  const handleCashAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCashAmount(event.target.value);
  };

  const handleCloseCashRegister = async () => {
    if (cashAmount === '' || Number(cashAmount) <= 0) {
      toast.error('El monto en caja no puede ser 0 o negativo');
      return;
    }
    try {
      await closeCashRegister(cashAmount, cashRegisterId);
      toast.success('Caja cerrada correctamente');
      setCashRegister(null);
      onClose();
      navigate('/ventas');
    } catch (error) {
      toast.error('Error al cerrar caja');
      console.error(error);
    }
    console.log('cerrar caja');
  };

  return (
    <>
      <DialogTitle>Cerrar caja</DialogTitle>
      <Divider />
      <DialogContent
        sx={{
          maxHeight: 'calc(100vh - 200px)',
          overflowY: 'auto'
        }}
      >
        {sales.length > 0 &&
          Object.entries(salesByTypeOfPayment).map(([type, salesOfType]) => (
            <CollapseTable<ICashRegisterSales>
              key={type}
              data={salesOfType}
              type={PaymentTypeLabels[type as unknown as PaymentType]}
              headers={['Folio', 'Monto Pago', 'Total']}
              fields={['folio', 'montoPago', 'totalVenta']}
            />
          ))}
        {withdrawals.length > 0 && (
          <CollapseTable<CashRegisterWithdrawa>
            data={withdrawals}
            type="Retiros"
            headers={['Folio', 'Monto Total', 'Notas']}
            fields={['folio', 'totalRetiro', 'notas']}
          />
        )}
        <TotalSalesCardByType
          sales={salesByTypeOfPayment}
          cashAmount={cashAmount}
          handleCashAmountChange={handleCashAmountChange}
          withdrawals={withdrawals}
        />
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between' }}>
        <Button variant="outlined" onClick={onClose} color="error">
          Cancelar
        </Button>
        <Button variant="contained" onClick={handleCloseCashRegister}>
          Cerrar
        </Button>
      </DialogActions>
    </>
  );
};

interface CollapseTableProps<T extends DataItem> {
  data: T[];
  type: string;
  headers: string[];
  fields: (keyof T)[];
}

function CollapseTable<T extends DataItem>({ data, type, headers, fields }: CollapseTableProps<T>) {
  const [open, setOpen] = useState(false);

  return (
    <MainCard>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {open ? (
          <ExpandLess onClick={() => setOpen(!open)} aria-expanded={open} aria-label="show less" />
        ) : (
          <ExpandMore onClick={() => setOpen(!open)} aria-expanded={open} aria-label="show more" />
        )}
        <Typography sx={{ fontWeight: 'bold' }}>{type}</Typography>
      </Box>
      <Collapse in={open}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  <TableCell key={header}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={index}>
                  {fields.map((field) => (
                    <TableCell key={String(field)}>{item[field]}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Collapse>
    </MainCard>
  );
}

const TotalSalesCardByType = ({
  sales,
  cashAmount,
  handleCashAmountChange,
  withdrawals
}: {
  sales: Record<PaymentType, ICashRegisterSales[]>;
  cashAmount: string;
  handleCashAmountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  withdrawals: CashRegisterWithdrawa[];
}) => {
  const totalWithdrawals = withdrawals.reduce((acc, withdrawal) => acc + withdrawal.totalRetiro, 0);

  return (
    <MainCard sx={{ mt: 2 }} title="Total de ventas">
      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          {withdrawals.length > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography sx={{ fontSize: '1.1rem' }}>Retiros:</Typography>
              <Typography sx={{ fontSize: '1.1rem' }}>${totalWithdrawals.toFixed(2)}</Typography>
            </Box>
          )}
          {Object.entries(sales).map(([type, salesOfType]) => {
            const totalSales = salesOfType.reduce((acc, sale) => acc + sale.totalVenta, 0);
            const isEffectivo = type === PaymentType.Efectivo.toString();
            const adjustedTotal = isEffectivo ? totalSales - totalWithdrawals : totalSales;

            return (
              <Box key={type} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontSize: '1.1rem' }}>{PaymentTypeLabels[type as unknown as PaymentType]}:</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {isEffectivo && withdrawals.length > 0 && (
                    <Typography
                      sx={{
                        fontSize: '1.1rem',
                        textDecoration: 'line-through',
                        color: 'error.main',
                        mr: 1
                      }}
                    >
                      ${totalSales.toFixed(2)}
                    </Typography>
                  )}
                  <Typography sx={{ fontSize: '1.1rem' }}>${adjustedTotal.toFixed(2)}</Typography>
                </Box>
              </Box>
            );
          })}
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ fontSize: '1.1rem' }}>Total:</Typography>
            <Typography sx={{ fontSize: '1.1rem' }}>
              $
              {(
                Object.values(sales).reduce((acc, sale) => acc + sale.reduce((acc, sale) => acc + sale.totalVenta, 0), 0) - totalWithdrawals
              ).toFixed(2)}
            </Typography>
          </Box>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <Stack spacing={2}>
            <Typography sx={{ fontSize: '1.1rem' }}>Efectivo en caja:</Typography>
            <TextField
              label="Efectivo en caja"
              variant="outlined"
              fullWidth
              value={cashAmount}
              type="number"
              onChange={handleCashAmountChange}
              slotProps={{
                input: {
                  slotProps: {
                    input: {
                      step: 0.01
                    }
                  },
                  startAdornment: <InputAdornment position="start">$</InputAdornment>
                }
              }}
            />
          </Stack>
        </Grid2>
      </Grid2>
    </MainCard>
  );
};
