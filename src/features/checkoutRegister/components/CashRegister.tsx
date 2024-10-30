import { useEffect, useMemo, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import GenericTable from '../../../components/third-party/react-table/GenericTable';
import { useGetCashRegister } from '../hooks/useGetCashRegister';
import Loader from '../../../components/Loader';
import { ICashRegisterSales } from '../../../types/checkoutRegister/cashRegister';
import { useCashRegisterStore } from '../store/cashRegister';
import { useParams } from 'react-router-dom';
import { Box, Grid2, Stack, useMediaQuery, Theme, Button } from '@mui/material';
import { Tooltip } from '@mui/material';
import IconButton from '../../../components/@extended/IconButton';
import { AttachMoneyOutlined, DeleteOutline } from '@mui/icons-material';
import AlertDeleteProductSold from './modal/AlertDeleteProductSold';
import ShoppingCart from './ShoppingCart';
import { EstatusVenta, EstatusVentaLabels, PaymentType, PaymentTypeLabels } from '../../../types/checkoutRegister/paymentTypes';
import GenericModal from '../../../components/GenericModal';
import { CloseCashRegister } from './modal/CloseCashRegister';
import { WithdrawMoney } from './modal/WithdrawMoney';
import { useGetCakes } from '../../catalog/hooks/useGetCakes';
import { FinishAdvance } from './modal/FinishAdvance';

export default function CashRegister() {
  const { cashRegister, setCashRegister } = useCashRegisterStore();
  const { cashRegisterId } = useParams();
  const { data, isLoading } = useGetCashRegister((cashRegister?.id as string) || (cashRegisterId as string));
  const [selectedProduct, setSelectedProduct] = useState<ICashRegisterSales | null>(null);
  const [productModal, setProductModal] = useState(false);
  const [closeModal, setCloseModal] = useState(false);
  const [withdrawalModal, setWithdrawalModal] = useState(false);
  const { data: userCashRegister } = useGetCashRegister(cashRegisterId as string);
  const { data: cakes } = useGetCakes();
  const [finishAdvanceModal, setFinishAdvanceModal] = useState(false);

  useEffect(() => {
    if (userCashRegister && !cashRegister) {
      setCashRegister(userCashRegister);
    }
  }, [userCashRegister]);

  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const handleFinishAdvance = (row: ICashRegisterSales) => {
    setSelectedProduct(row);
    setFinishAdvanceModal(true);
  };

  const columns = useMemo<ColumnDef<ICashRegisterSales>[]>(
    () => [
      {
        id: 'id',
        accessorKey: 'id',
        header: 'ID',
        show: false,
        enableHiding: true
      },
      {
        accessorKey: 'folio',
        header: 'Folio'
      },
      {
        header: 'Tipo de Pago',
        accessorKey: 'tipoPago',
        cell: ({ row }) => PaymentTypeLabels[row.original.tipoPago as PaymentType] || (row.original.esAnticipo ? 'Anticipo' : 'Desconocido')
      },
      {
        header: 'Estatus',
        accessorKey: 'estatus',
        cell: ({ row }) => EstatusVentaLabels[row.original.estatus as EstatusVenta]
      },
      {
        header: 'Monto Pago',
        accessorKey: 'montoPago'
      },
      {
        header: 'Total Venta',
        accessorKey: 'totalVenta'
      },
      {
        header: 'Acciones',
        cell: ({ row }) => (
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
            {row.original.esAnticipo && row.original.estatus !== EstatusVenta.VentaAnticipoCompletada && (
              <Tooltip title="Pagar">
                <IconButton color="primary" onClick={() => handleFinishAdvance(row.original)}>
                  <AttachMoneyOutlined />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Cancelar">
              <IconButton
                color="primary"
                onClick={() => {
                  setSelectedProduct(row.original);
                  setProductModal(true);
                }}
              >
                <DeleteOutline />
              </IconButton>
            </Tooltip>
          </Stack>
        )
      }
    ],
    []
  );

  if (isLoading) return <Loader />;

  return (
    <>
      <Stack sx={{ flexDirection: 'row', justifyContent: 'flex-end', mb: 2, gap: 2 }}>
        <Button variant="contained" onClick={() => setWithdrawalModal(true)}>
          Retirar efectivo
        </Button>
        <Button variant="contained" onClick={() => setCloseModal(true)}>
          Cerrar caja
        </Button>
      </Stack>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Grid2 container spacing={2} sx={{ flexGrow: 1 }}>
          {isMobile ? (
            <>
              <Grid2 size={{ xs: 12, md: 4, lg: 3 }} sx={{ height: isMobile ? 'auto' : '100%' }}>
                <ShoppingCart cakes={cakes} />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 8, lg: 9 }} sx={{ height: isMobile ? 'auto' : '100%' }}>
                <GenericTable<ICashRegisterSales>
                  data={data?.ventas as ICashRegisterSales[]}
                  columns={columns}
                  title="Ventas"
                  onDelete={(sale) => {
                    setSelectedProduct(sale);
                    setProductModal(true);
                  }}
                  DeleteComponent={() => (
                    <AlertDeleteProductSold
                      open={productModal && !!selectedProduct}
                      handleClose={() => setProductModal(false)}
                      product={selectedProduct as ICashRegisterSales}
                      title={selectedProduct?.folio || ''}
                    />
                  )}
                />
              </Grid2>
            </>
          ) : (
            <>
              <Grid2 size={{ xs: 12, md: 8, lg: 9 }} sx={{ height: isMobile ? 'auto' : '100%' }}>
                <GenericTable<ICashRegisterSales>
                  data={data?.ventas as ICashRegisterSales[]}
                  columns={columns}
                  title="Ventas"
                  onDelete={(sale) => {
                    setSelectedProduct(sale);
                    setProductModal(true);
                  }}
                  DeleteComponent={() => (
                    <AlertDeleteProductSold
                      open={productModal && !!selectedProduct}
                      handleClose={() => setProductModal(false)}
                      product={selectedProduct as ICashRegisterSales}
                      title={selectedProduct?.folio || ''}
                    />
                  )}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 4, lg: 3 }} sx={{ height: isMobile ? 'auto' : '100%' }}>
                <ShoppingCart cakes={cakes} />
              </Grid2>
            </>
          )}
        </Grid2>
      </Box>
      <GenericModal
        open={closeModal}
        formDataPropName="close"
        modalToggler={setCloseModal}
        formData={null}
        FormComponent={(props) => (
          <CloseCashRegister
            onClose={() => setCloseModal(false)}
            sales={data?.ventas || []}
            withdrawals={data?.retiros || []}
            cashRegisterId={cashRegister?.id || cashRegisterId || ''}
            {...props}
          />
        )}
      />
      <GenericModal
        open={withdrawalModal}
        formDataPropName="withdrawal"
        modalToggler={setWithdrawalModal}
        formData={null}
        FormComponent={(props) => <WithdrawMoney onClose={() => setWithdrawalModal(false)} {...props} />}
      />
      <GenericModal
        open={finishAdvanceModal}
        modalToggler={setFinishAdvanceModal}
        formData={null}
        formDataPropName="finishAdvance"
        FormComponent={(props) => (
          <FinishAdvance onClose={() => setFinishAdvanceModal(false)} saleSelected={selectedProduct as ICashRegisterSales} {...props} />
        )}
      />
    </>
  );
}
