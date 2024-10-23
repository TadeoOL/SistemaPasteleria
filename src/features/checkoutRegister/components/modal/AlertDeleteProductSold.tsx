// project import

// assets
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useCashRegisterStore } from '../../store/cashRegister';
import { deleteProductSold } from '../../services/cashRegisterService';
import { ICashRegisterDetails } from '../../../../types/checkoutRegister/cashRegister';
import GenericAlertDelete from '../../../../components/GenericAlertDelete';

// types
interface Props {
  id: string;
  title: string;
  open: boolean;
  handleClose: () => void;
}

export default function AlertDeleteProductSold({ id, title, open, handleClose }: Props) {
  const queryClient = useQueryClient();
  const { cashRegister: cashRegisterId } = useCashRegisterStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await deleteProductSold(id);
      queryClient.setQueryData(['cashRegister', cashRegisterId?.id], (oldData: ICashRegisterDetails | undefined) => {
        if (!oldData) return {};
        return {
          ...oldData,
          ventas: oldData.ventas.filter((sale) => sale.id !== id)
        };
      });
      toast.success('Venta eliminada correctamente');
      handleClose();
    } catch (error) {
      console.log({ error });
      toast.error('Error al eliminar la venta');
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
