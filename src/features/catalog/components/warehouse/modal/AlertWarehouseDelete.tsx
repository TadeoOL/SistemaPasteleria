// project import
import GenericAlertDelete from '../../../../../components/GenericAlertDelete';

// assets
import { deleteWarehouse } from '../../../services/warehouseService';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import { IWarehouse } from '../../../../../types/catalog/warehouse';
import { useState } from 'react';

// types
interface Props {
  id: string;
  title: string;
  open: boolean;
  handleClose: () => void;
}

// ==============================|| WAREHOUSE - DELETE ||============================== //

export default function AlertWarehouseDelete({ id, title, open, handleClose }: Props) {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await deleteWarehouse(id);
      queryClient.setQueryData(['warehouses'], (oldData: IWarehouse[] | undefined) => {
        if (!oldData) return [];
        return oldData.filter((warehouse) => warehouse.id !== id);
      });
      toast.success('Almacén eliminado correctamente');
      handleClose();
    } catch (error) {
      console.log({ error });
      toast.error('Error al eliminar el almacén');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GenericAlertDelete
      open={open}
      title={title}
      type="almacén"
      additionalInfo="se eliminarán todos los almacenes asociados."
      onClose={handleClose}
      onDelete={handleDelete}
      isLoading={isLoading}
    />
  );
}
