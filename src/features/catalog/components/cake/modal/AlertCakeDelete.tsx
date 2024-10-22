// project import
import GenericAlertDelete from '../../../../../components/GenericAlertDelete';

// assets
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { deleteCake } from '../../../services/cakeService';
import { ICake } from '../../../../../types/catalog/cake';

// types
interface Props {
  id: string;
  title: string;
  open: boolean;
  handleClose: () => void;
}

export default function AlertCakeDelete({ id, title, open, handleClose }: Props) {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await deleteCake(id);
      queryClient.setQueryData(['cakes'], (oldData: ICake[] | undefined) => {
        if (!oldData) return [];
        return oldData.filter((cake) => cake.id !== id);
      });
      toast.success('Pastel eliminado correctamente');
      handleClose();
    } catch (error) {
      console.log({ error });
      toast.error('Error al eliminar el pastel');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GenericAlertDelete
      open={open}
      title={title}
      type="pastel"
      additionalInfo="no se podrá deshacer."
      onClose={handleClose}
      onDelete={handleDelete}
      isLoading={isLoading}
    />
  );
}
