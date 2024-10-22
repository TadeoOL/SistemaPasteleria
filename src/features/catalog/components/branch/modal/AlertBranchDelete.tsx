// project import
import GenericAlertDelete from '../../../../../components/GenericAlertDelete';

// assets
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { IBranch } from '../../../../../types/catalog/branch';
import { deleteBranch } from '../../../services/branchService';

// types
interface Props {
  id: string;
  title: string;
  open: boolean;
  handleClose: () => void;
}

export default function AlertBranchDelete({ id, title, open, handleClose }: Props) {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await deleteBranch(id);
      queryClient.setQueryData(['branches'], (oldData: IBranch[] | undefined) => {
        if (!oldData) return [];
        return oldData.filter((branch) => branch.id !== id);
      });
      toast.success('Sucursal eliminada correctamente');
      handleClose();
    } catch (error) {
      console.log({ error });
      toast.error('Error al eliminar la sucursal');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GenericAlertDelete
      open={open}
      title={title}
      type="sucursal"
      additionalInfo="se eliminarán todas las sucursales asociadas."
      onClose={handleClose}
      onDelete={handleDelete}
      isLoading={isLoading}
    />
  );
}
