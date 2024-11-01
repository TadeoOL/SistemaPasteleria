import { Box, Button, Divider, FormControl, Select, TextField } from '@mui/material';
import { DialogActions, DialogTitle } from '@mui/material';
import { ICashRegisterDetails, ICashRegisterSales, ISaleDetails } from '../../../../types/checkoutRegister/cashRegister';
import { DialogContent } from '@mui/material';
import GenericCollapseTable from '../../../../components/GenericCollapseTable';
import { InputLabel } from '@mui/material';
import { MenuItem } from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form';
import { EstatusVenta, PaymentType, PaymentTypeLabels } from '../../../../types/checkoutRegister/paymentTypes';
import { createFinishAdvanceFormSchema, IFinishAdvanceFormData } from '../../schema/salesSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Typography } from '@mui/material';
import { useEffect } from 'react';
import { finishAdvance } from '../../services/cashRegisterService';
import Swal from 'sweetalert2';
import { useQueryClient } from '@tanstack/react-query';
import LoadingButton from '../../../../components/@extended/LoadingButton';

export const FinishAdvance = ({ onClose, saleSelected }: { onClose: () => void; saleSelected: ICashRegisterSales }) => {
  const totalAnticipo = saleSelected.anticipoDetalles?.flatMap((detail) => detail.totalAnticipo).reduce((acc, curr) => acc + curr, 0);
  const totalRestante = saleSelected.totalVenta - (totalAnticipo ?? 0);
  const queryClient = useQueryClient();
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<IFinishAdvanceFormData>({
    resolver: zodResolver(createFinishAdvanceFormSchema(totalRestante)),
    defaultValues: {
      paymentType: PaymentType.Efectivo,
      cashAmount: 0
    }
  });
  const paymentType = watch('paymentType');

  const onSubmit: SubmitHandler<IFinishAdvanceFormData> = async (data) => {
    try {
      await finishAdvance({
        ...data,
        saleId: saleSelected.id,
        cashRegisterId: saleSelected.id_Caja
      });
      queryClient.setQueryData(['cashRegister', saleSelected.id_Caja], (prevData: ICashRegisterDetails) => {
        return {
          ...prevData,
          ventas: prevData.ventas.map((sale) =>
            sale.id === saleSelected.id ? { ...sale, estatus: EstatusVenta.VentaAnticipoCompletada } : sale
          )
        };
      });
      onClose();
      Swal.fire({
        title: 'Anticipo finalizado',
        text: `Se ha finalizado el anticipo de la venta, su cambio es de $${(data.cashAmount - totalRestante).toFixed(2)}`,
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'paymentType' && value.paymentType !== PaymentType.Efectivo) {
        setValue('cashAmount', totalRestante);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue, totalRestante]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Finalizar Anticipo</DialogTitle>
        <Divider />
        <DialogContent>
          <GenericCollapseTable<ISaleDetails & { total: number }>
            data={saleSelected?.detalleVentas?.map((detail) => ({ ...detail, total: detail.cantidad * detail.precioPastel })) || []}
            type="Pasteles"
            headers={['Nombre', 'Cantidad', 'Precio Unitario', 'Total']}
            fields={['pastel', 'cantidad', 'precioPastel', 'total']}
            idField="id_Pastel"
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Tipo de Pago</InputLabel>
            <Select value={paymentType} {...register('paymentType')}>
              {Object.values(PaymentType)
                .filter((value) => typeof value === 'number')
                .map((value) => (
                  <MenuItem key={value} value={value}>
                    {PaymentTypeLabels[value as PaymentType]}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          {paymentType === PaymentType.Efectivo && (
            <TextField
              fullWidth
              label={'Total restante'}
              type="number"
              error={!!errors.cashAmount}
              helperText={errors.cashAmount?.message}
              {...register('cashAmount', {
                valueAsNumber: true,
                setValueAs: (v: string) => (v === '' ? undefined : parseFloat(v))
              })}
              margin="normal"
              slotProps={{
                input: {
                  slotProps: {
                    input: {
                      step: 0.01
                    }
                  }
                }
              }}
            />
          )}
          {paymentType === PaymentType.Efectivo && watch('cashAmount') !== null && (
            <Box mt={2}>
              <Typography variant="body2">
                Cambio: ${Math.max(0, (watch('cashAmount') ? watch('cashAmount') : 0) - totalRestante).toFixed(2)}
              </Typography>
            </Box>
          )}
          <Divider />
          <Typography variant="body2">Anticipo: ${totalAnticipo?.toFixed(2)}</Typography>
          <Typography variant="body2">Total restante: ${totalRestante.toFixed(2)}</Typography>
          <Typography variant="body2">Total venta: ${saleSelected.totalVenta.toFixed(2)}</Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between' }}>
          <Button variant="outlined" color="error" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <LoadingButton variant="contained" type="submit" loading={isSubmitting} loadingPosition="end">
            Finalizar
          </LoadingButton>
        </DialogActions>
      </form>
    </>
  );
};
