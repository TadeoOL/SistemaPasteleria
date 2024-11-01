import { Box, Button, Divider, Grid2, Paper, Typography } from '@mui/material';
import React, { useState, useCallback } from 'react';
import { WarehouseCard } from './WarehouseCard';
import { IWarehouse } from '../../../../types/catalog/warehouse';
import useWarehouseSelectedStore from '../../store/warehouseSelected';
import CircularWithPath from '../../../../components/@extended/progress/CircularWithPath';
import { Warehouse as WarehouseIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface WarehouseSelectorProps {
  onClose: () => void;
  warehouses: IWarehouse[];
  isLoadingWarehouses: boolean;
}

export const WarehouseSelector: React.FC<WarehouseSelectorProps> = ({ onClose, warehouses, isLoadingWarehouses }) => {
  const { setWarehouse } = useWarehouseSelectedStore();
  const [selectedWarehouse, setSelectedWarehouse] = useState<IWarehouse | null>(null);
  const navigate = useNavigate();

  const handleWarehouseSelect = useCallback((warehouse: IWarehouse) => {
    setSelectedWarehouse(warehouse);
  }, []);

  const handleConfirm = () => {
    if (selectedWarehouse) {
      setWarehouse(selectedWarehouse);
      onClose();
    }
  };

  const handleCancel = () => {
    setSelectedWarehouse(null);
    onClose();
    navigate('/');
  };

  if (isLoadingWarehouses) return <CircularWithPath />;

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <WarehouseIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
        <Typography variant="h4" component="h2" color="primary.main">
          Selección de Almacén
        </Typography>
      </Box>
      <Divider sx={{ mb: 3 }} />
      <Typography variant="body1" gutterBottom sx={{ mb: 3 }}>
        Por favor, selecciona el almacén con el que deseas trabajar:
      </Typography>
      <Grid2 container spacing={3}>
        {warehouses?.map((warehouse) => (
          <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={warehouse.id}>
            <WarehouseCard
              warehouse={warehouse}
              onSelect={() => handleWarehouseSelect(warehouse)}
              isSelected={selectedWarehouse?.id === warehouse.id}
            />
          </Grid2>
        ))}
      </Grid2>
      {selectedWarehouse && (
        <Box mt={4}>
          <Typography variant="subtitle1" color="primary">
            Almacén seleccionado: {selectedWarehouse.nombre}
          </Typography>
        </Box>
      )}
      <Box mt={4} display="flex" justifyContent="space-between">
        <Button variant="outlined" color="error" onClick={handleCancel}>
          Cancelar
        </Button>
        <Button variant="contained" color="primary" onClick={handleConfirm} disabled={!selectedWarehouse}>
          Confirmar selección
        </Button>
      </Box>
    </Paper>
  );
};
