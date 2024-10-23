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
import { ICashRegisterSales } from '../../../../types/checkoutRegister/cashRegister';
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

interface CloseCashRegisterProps {
  onClose: () => void;
  sales: ICashRegisterSales[];
  cashRegisterId: string;
}

export const CloseCashRegister = ({ onClose, sales, cashRegisterId }: CloseCashRegisterProps) => {
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
      <DialogContent
        sx={{
          maxHeight: 'calc(100vh - 200px)',
          overflowY: 'auto'
        }}
      >
        {sales.length > 0 &&
          Object.entries(salesByTypeOfPayment).map(([type, salesOfType]) => (
            <CollapseTable key={type} sales={salesOfType} type={PaymentTypeLabels[type as unknown as PaymentType]} />
          ))}
        <TotalSalesCardByType sales={salesByTypeOfPayment} cashAmount={cashAmount} handleCashAmountChange={handleCashAmountChange} />
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

const CollapseTable = ({ sales, type }: { sales: ICashRegisterSales[]; type: string }) => {
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
                <TableCell>Folio</TableCell>
                <TableCell>Monto Pago</TableCell>
                <TableCell>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>{sale.folio}</TableCell>
                  <TableCell>{sale.montoPago}</TableCell>
                  <TableCell>{sale.totalVenta}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Collapse>
    </MainCard>
  );
};

const TotalSalesCardByType = ({
  sales,
  cashAmount,
  handleCashAmountChange
}: {
  sales: Record<PaymentType, ICashRegisterSales[]>;
  cashAmount: string;
  handleCashAmountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <MainCard sx={{ mt: 2 }} title="Total de ventas">
      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          {Object.entries(sales).map(([type, salesOfType]) => (
            <Box key={type} sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography sx={{ fontSize: '1.1rem' }}>{PaymentTypeLabels[type as unknown as PaymentType]}:</Typography>
              <Typography sx={{ fontSize: '1.1rem' }}>${salesOfType.reduce((acc, sale) => acc + sale.totalVenta, 0)}</Typography>
            </Box>
          ))}
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ fontSize: '1.1rem' }}>Total:</Typography>
            <Typography sx={{ fontSize: '1.1rem' }}>
              ${Object.values(sales).reduce((acc, sale) => acc + sale.reduce((acc, sale) => acc + sale.totalVenta, 0), 0)}
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
