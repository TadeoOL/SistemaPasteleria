import { Box, Button, Stack, Typography } from '@mui/material';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import GenericModal from '../../../components/GenericModal';
import { useState, useEffect } from 'react';
import { WarehouseSelector } from '../components/modal/WarehouseSelector';
import useWarehouseSelectedStore from '../store/warehouseSelected';
import { useAuthStore } from '../../auth/store/authStore';
import { useGetWarehousesByBranch } from '../../catalog/hooks/useGetWarehousesByBranch';
import CashRegisterLoader from '../../checkoutRegister/components/CashRegisterLoader';
import { InventoryOutlined } from '@mui/icons-material';
import { toast } from 'react-toastify';

export const InventoryManagment = () => {
  const [openWarehouseSelector, setOpenWarehouseSelector] = useState(false);
  const { warehouse: selectedWarehouse, setWarehouse } = useWarehouseSelectedStore();
  const profile = useAuthStore((state) => state.profile);

  const navigate = useNavigate();
  const { warehouseId } = useParams();
  const location = useLocation();
  const isProducts = location.pathname.includes('productos');

  if (profile && !profile.id_Sucursal) {
    toast.error('No tienes ninguna sucursal asignada');
    navigate('/');
  }

  const { data: warehouses, isLoading: isLoadingWarehouses } = useGetWarehousesByBranch(profile?.id_Sucursal as string);

  useEffect(() => {
    if (isLoadingWarehouses) return;

    if (selectedWarehouse) {
      navigate(`/inventario/${isProducts ? 'productos' : 'pasteles'}/${selectedWarehouse.id}`);
      return;
    }

    if (warehouseId && warehouses) {
      const warehouse = warehouses.find((w) => w.id === warehouseId);
      if (warehouse) {
        setWarehouse(warehouse);
        navigate(`/inventario/${isProducts ? 'productos' : 'pasteles'}/${warehouseId}`);
      } else {
        setOpenWarehouseSelector(true);
      }
    } else {
      setOpenWarehouseSelector(true);
    }
  }, [warehouseId, warehouses, isLoadingWarehouses, selectedWarehouse, setWarehouse, navigate]);

  const handleCloseWarehouseSelector = () => {
    setOpenWarehouseSelector(false);
  };

  const handleChangeWarehouse = () => {
    setWarehouse(null);
    navigate('/inventario/pasteles/:warehouseId');
  };

  if (isLoadingWarehouses)
    return (
      <CashRegisterLoader
        message="Cargando almacenes..."
        icon={<InventoryOutlined sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />}
      />
    );

  return (
    <>
      <GenericModal
        open={openWarehouseSelector}
        modalToggler={() => {}}
        formData={null}
        FormComponent={() => (
          <WarehouseSelector
            onClose={handleCloseWarehouseSelector}
            warehouses={warehouses || []}
            isLoadingWarehouses={isLoadingWarehouses}
          />
        )}
        formDataPropName="warehouse"
      />
      <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ alignSelf: 'flex-end', fontWeight: 'bold' }}>
          Almacén Actual: {selectedWarehouse?.nombre}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button variant="contained" color="error" onClick={handleChangeWarehouse}>
            Cambiar Almacén
          </Button>
        </Box>
      </Stack>
      {selectedWarehouse && <Outlet />}
    </>
  );
};

export default InventoryManagment;
