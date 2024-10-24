// project import

// assets
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useCashRegisterStore } from '../../store/cashRegister';
import { deleteSale } from '../../services/cashRegisterService';
import { ICashRegisterDetails, ICashRegisterSales } from '../../../../types/checkoutRegister/cashRegister';
import GenericAlertDelete from '../../../../components/GenericAlertDelete';
import { useParams } from 'react-router-dom';
import { PaymentType } from '../../../../types/checkoutRegister/paymentTypes';

// types
interface Props {
  product: ICashRegisterSales;
  title: string;
  open: boolean;
  handleClose: () => void;
}

export default function AlertDeleteProductSold({ product, title, open, handleClose }: Props) {
  const queryClient = useQueryClient();
  const { cashRegister, setCashRegister } = useCashRegisterStore();
  const { cashRegisterId: cashRegisterIdParam } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await deleteSale(product.id);
      queryClient.setQueryData(['cashRegister', cashRegisterIdParam || cashRegister?.id], (oldData: ICashRegisterDetails | undefined) => {
        if (!oldData) return {};
        return {
          ...oldData,
          ventas: oldData.ventas.filter((sale) => sale.id !== product.id)
        };
      });
      if (cashRegister) {
        const updatedCashRegister = { ...cashRegister, ventas: cashRegister.ventas.filter((sale) => sale.id !== product.id) };
        switch (product.tipoPago) {
          case PaymentType.Efectivo:
            updatedCashRegister.efectivo = cashRegister.efectivo - product.totalVenta;
            break;
          case PaymentType.Transferencia:
            updatedCashRegister.transferencia = cashRegister.transferencia - product.totalVenta;
            break;
          case PaymentType.Debito:
            updatedCashRegister.debito = cashRegister.debito - product.totalVenta;
            break;
          case PaymentType.Credito:
            updatedCashRegister.credito = cashRegister.credito - product.totalVenta;
            break;
        }
        setCashRegister(updatedCashRegister);
      }
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
      type="venta"
      additionalInfo="se eliminarán todos los detalles de la venta."
      onClose={handleClose}
      onDelete={handleDelete}
      isLoading={isLoading}
    />
  );
}
