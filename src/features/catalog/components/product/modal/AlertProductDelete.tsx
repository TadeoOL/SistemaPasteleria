// project import
import GenericAlertDelete from '../../../../../components/GenericAlertDelete';

// assets
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import IProduct from '../../../../../types/catalog/product';
import { deleteProduct } from '../../../services/productService';

// types
interface Props {
  id: string;
  title: string;
  open: boolean;
  handleClose: () => void;
}

export default function AlertProductDelete({ id, title, open, handleClose }: Props) {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await deleteProduct(id);
      queryClient.setQueryData(['products'], (oldData: IProduct[] | undefined) => {
        if (!oldData) return [];
        return oldData.filter((product) => product.id !== id);
      });
      toast.success('Producto eliminado correctamente');
      handleClose();
    } catch (error) {
      console.log({ error });
      toast.error('Error al eliminar el producto');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GenericAlertDelete
      open={open}
      title={title}
      type="producto"
      additionalInfo="no se podrá deshacer."
      onClose={handleClose}
      onDelete={handleDelete}
      isLoading={isLoading}
    />
  );
}
