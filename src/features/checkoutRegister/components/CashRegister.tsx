import { useMemo, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import GenericTable from '../../../components/third-party/react-table/GenericTable';
import { useGetCashRegister } from '../hooks/useGetCashRegister';
import Loader from '../../../components/Loader';
import { ICashRegisterSales } from '../../../types/checkoutRegister/cashRegister';
import { useCashRegisterStore } from '../store/cashRegister';
import { useParams } from 'react-router-dom';
import { Box, Grid2, Stack, useMediaQuery, Theme } from '@mui/material';
import { Tooltip } from '@mui/material';
import IconButton from '../../../components/@extended/IconButton';
import { EditOutlined } from '@mui/icons-material';
import AlertDeleteProductSold from './modal/AlertDeleteProductSold';
import ShoppingCart from './ShoppingCart';

export default function CashRegister() {
  const { cashRegister } = useCashRegisterStore();
  const { cashRegisterId } = useParams();
  const { data, isLoading } = useGetCashRegister((cashRegister?.id as string) || (cashRegisterId as string));
  const [selectedProduct, setSelectedProduct] = useState<ICashRegisterSales | null>(null);
  const [productModal, setProductModal] = useState(false);

  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  const columns = useMemo<ColumnDef<ICashRegisterSales>[]>(
    () => [
      {
        id: 'id',
        accessorKey: 'id_Producto',
        header: 'ID',
        enableHiding: true,
        show: false
      },
      {
        header: 'Nombre',
        accessorKey: 'nombre'
      },
      {
        header: 'Cantidad',
        accessorKey: 'cantidad'
      },
      {
        header: 'Acciones',
        cell: ({ row }) => (
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
            <Tooltip title="Cancelar">
              <IconButton
                color="primary"
                onClick={() => {
                  setSelectedProduct(row.original);
                  setProductModal(true);
                }}
              >
                <EditOutlined />
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
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Grid2 container spacing={2} sx={{ flexGrow: 1 }}>
        {isMobile ? (
          <>
            <Grid2 size={{ xs: 12, md: 4, lg: 3 }} sx={{ height: isMobile ? 'auto' : '100%' }}>
              <ShoppingCart />
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
                    id={selectedProduct?.id || ''}
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
                    id={selectedProduct?.id || ''}
                    title={selectedProduct?.folio || ''}
                  />
                )}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4, lg: 3 }} sx={{ height: isMobile ? 'auto' : '100%' }}>
              <ShoppingCart />
            </Grid2>
          </>
        )}
      </Grid2>
    </Box>
  );
}
