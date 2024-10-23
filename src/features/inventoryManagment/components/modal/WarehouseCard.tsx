import { Avatar, Box, Card, CardActionArea, CardContent, Chip, Typography } from '@mui/material';
import React from 'react';
import { Warehouse as WarehouseIcon } from '@mui/icons-material';
import { IWarehouse } from '../../../../types/catalog/warehouse';

interface WarehouseCardProps {
  warehouse: IWarehouse;
  onSelect: () => void;
  isSelected?: boolean;
}

export const WarehouseCard: React.FC<WarehouseCardProps> = ({ warehouse, onSelect, isSelected = false }) => {
  return (
    <Card
      elevation={isSelected ? 8 : 1}
      sx={{
        transition: 'all 0.3s',
        transform: isSelected ? 'scale(1.05)' : 'scale(1)',
        border: isSelected ? '2px solid #1976d2' : 'none'
      }}
    >
      <CardActionArea onClick={onSelect}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <Avatar sx={{ bgcolor: '#1976d2', mr: 2 }}>
              <WarehouseIcon />
            </Avatar>
            <Typography variant="h6" component="div" noWrap>
              {warehouse.nombre}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            ID: {warehouse.id}
          </Typography>
          <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
            <Chip label={`Capacidad: ${'N/A'}`} size="small" color="primary" variant="outlined" />
            <Typography variant="caption" color="text.secondary">
              {'Sin ubicación'}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
