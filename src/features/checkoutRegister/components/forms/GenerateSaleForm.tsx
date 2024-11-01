import React, { useEffect } from 'react';
import { Button, DialogActions, DialogContent, Divider, Switch, FormControlLabel } from '@mui/material';
import { DialogTitle } from '@mui/material';
import { TextField, Select, MenuItem, FormControl, InputLabel, Typography, Box } from '@mui/material';
import { PaymentType, PaymentTypeLabels } from '../../../../types/checkoutRegister/paymentTypes';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createSale } from '../../services/cashRegisterService';
import { createSaleFormSchema } from '../../schema/salesSchema';
import { useParams } from 'react-router-dom';
import { ICartItem, ICashRegisterDetails, ISaleDetails } from '../../../../types/checkoutRegister/cashRegister';
import { useQueryClient } from '@tanstack/react-query';
import { useCashRegisterStore } from '../../store/cashRegister';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import LoadingButton from '../../../../components/@extended/LoadingButton';

interface GenerateSaleFormProps {
  onClose: () => void;
  totalAmount: number;
  saleDetails: ISaleDetails[];
  setCartItems: (items: ICartItem[]) => void;
}

type ISaleFormData = z.infer<ReturnType<typeof createSaleFormSchema>>;

const GenerateSaleForm: React.FC<GenerateSaleFormProps> = React.memo(({ onClose, totalAmount, saleDetails, setCartItems }) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<ISaleFormData>({
    resolver: zodResolver(createSaleFormSchema(totalAmount)),
    defaultValues: {
      paymentType: PaymentType.Efectivo,
      cashAmount: 0,
      notes: '',
      isAdvancePayment: false
    }
  });
  const { cashRegisterId } = useParams();
  const { setCashRegister, cashRegister } = useCashRegisterStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'paymentType' && value.paymentType !== PaymentType.Efectivo) {
        setValue('cashAmount', totalAmount);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue, totalAmount]);

  const onSubmit: SubmitHandler<ISaleFormData> = async (data) => {
    try {
      const sale = await createSale({
        ...data,
        totalAmount,
        cashRegisterId: cashRegisterId as string,
        saleDetails: saleDetails,
        isAdvancePayment: data.isAdvancePayment
      });
      queryClient.setQueryData(['cashRegister', cashRegisterId], (prevData: ICashRegisterDetails) => {
        if (prevData.ventas.length > 0) {
          return {
            ...prevData,
            ventas: [...prevData.ventas, { ...sale, estatus: 2 }]
          };
        }
        return {
          ...prevData,
          ventas: [{ ...sale, estatus: 2 }]
        };
      });
      if (cashRegister) {
        const updatedCashRegister = {
          ...cashRegister,
          ventas: [...cashRegister.ventas, { ...sale, estatus: 2 }],
          ventaTotal: cashRegister.ventaTotal + totalAmount
        };

        switch (data.paymentType) {
          case PaymentType.Efectivo:
            updatedCashRegister.efectivo = (cashRegister.efectivo || 0) + data.cashAmount;
            break;
          case PaymentType.Transferencia:
            updatedCashRegister.transferencia = (cashRegister.transferencia || 0) + totalAmount;
            break;
          case PaymentType.Debito:
            updatedCashRegister.debito = (cashRegister.debito || 0) + totalAmount;
            break;
          case PaymentType.Credito:
            updatedCashRegister.credito = (cashRegister.credito || 0) + totalAmount;
            break;
          default:
            break;
        }
        setCashRegister(updatedCashRegister);
        setCartItems([]);
        toast.success('Venta registrada correctamente');
        Swal.fire({
          title: 'Venta registrada correctamente',
          text: 'Su cambio es de $' + Math.max(0, (watch('cashAmount') ? watch('cashAmount') : 0) - totalAmount).toFixed(2),
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
        onClose();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const isAdvancePayment = watch('isAdvancePayment');
  const paymentType = watch('paymentType');

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Generar Venta</DialogTitle>
        <Divider />
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            Total de la venta: ${totalAmount.toFixed(2)}
          </Typography>
          <FormControlLabel control={<Switch {...register('isAdvancePayment')} />} label="Anticipo" />
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
          {(isAdvancePayment || paymentType === PaymentType.Efectivo) && (
            <TextField
              fullWidth
              label={isAdvancePayment ? 'Monto del Anticipo' : 'Monto en Efectivo'}
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
          <TextField fullWidth label="Notas" multiline rows={3} {...register('notes')} margin="normal" />
          {!isAdvancePayment && paymentType === PaymentType.Efectivo && watch('cashAmount') !== null && (
            <Box mt={2}>
              <Typography>Cambio: ${Math.max(0, (watch('cashAmount') ? watch('cashAmount') : 0) - totalAmount).toFixed(2)}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between' }}>
          <Button variant="outlined" color="error" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <LoadingButton variant="contained" type="submit" loading={isSubmitting} loadingPosition="end">
            Generar Venta
          </LoadingButton>
        </DialogActions>
      </form>
    </>
  );
});

export default GenerateSaleForm;
