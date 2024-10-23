import React, { useEffect } from 'react';
import { Button, DialogActions, DialogContent, Divider } from '@mui/material';
import { DialogTitle } from '@mui/material';
import { TextField, Select, MenuItem, FormControl, InputLabel, Typography, Box } from '@mui/material';
import { PaymentType, PaymentTypeLabels } from '../../../../types/checkoutRegister/paymentTypes';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createSale } from '../../services/cashRegisterService';
import { createSaleFormSchema } from '../../schema/salesSchema';
import { useParams } from 'react-router-dom';
import { ICashRegisterDetails, ISaleDetails } from '../../../../types/checkoutRegister/cashRegister';
import { useQueryClient } from '@tanstack/react-query';

interface GenerateSaleFormProps {
  onClose: () => void;
  totalAmount: number;
  saleDetails: ISaleDetails[];
}

type ISaleFormData = z.infer<ReturnType<typeof createSaleFormSchema>>;

const GenerateSaleForm: React.FC<GenerateSaleFormProps> = React.memo(({ onClose, totalAmount, saleDetails }) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<ISaleFormData>({
    resolver: zodResolver(createSaleFormSchema(totalAmount)),
    defaultValues: {
      paymentType: PaymentType.Efectivo,
      cashAmount: 0,
      notes: ''
    }
  });
  const { cashRegisterId } = useParams();
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
      const sale = await createSale({ ...data, totalAmount, cashRegisterId: cashRegisterId as string, saleDetails: saleDetails });
      queryClient.setQueryData(['cashRegister', cashRegisterId], (prevData: ICashRegisterDetails) => {
        return {
          ...prevData,
          ventas: [...prevData.ventas, sale]
        };
      });
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Generar Venta</DialogTitle>
        <Divider />
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            Total de la venta: ${totalAmount.toFixed(2)}
          </Typography>
          <FormControl fullWidth margin="normal">
            <InputLabel>Tipo de Pago</InputLabel>
            <Select value={watch('paymentType')} {...register('paymentType')}>
              {Object.values(PaymentType)
                .filter((value) => typeof value === 'number')
                .map((value) => (
                  <MenuItem key={value} value={value}>
                    {PaymentTypeLabels[value as PaymentType]}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          {watch('paymentType') === PaymentType.Efectivo && (
            <TextField
              fullWidth
              label="Monto en Efectivo"
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
          {watch('paymentType') === PaymentType.Efectivo && watch('cashAmount') !== null && (
            <Box mt={2}>
              <Typography>Cambio: ${Math.max(0, (watch('cashAmount') ? watch('cashAmount') : 0) - totalAmount).toFixed(2)}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between' }}>
          <Button variant="outlined" color="error" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="contained" type="submit">
            Generar Venta
          </Button>
        </DialogActions>
      </form>
    </>
  );
});

export default GenerateSaleForm;
