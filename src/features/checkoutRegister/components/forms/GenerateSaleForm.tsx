import React from 'react';
import { Button, DialogActions, DialogContent, Divider } from '@mui/material';
import { DialogTitle } from '@mui/material';
import { TextField, Select, MenuItem, FormControl, InputLabel, Typography, Box } from '@mui/material';
import { PaymentType, PaymentTypeLabels } from '../../../../types/checkoutRegister/paymentTypes';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createSale } from '../../services/cashRegisterService';
import { createSaleFormSchema } from '../../schema/salesSchema';

interface GenerateSaleFormProps {
  onClose: () => void;
  totalAmount: number;
}

type ISaleFormData = z.infer<ReturnType<typeof createSaleFormSchema>>;

const GenerateSaleForm: React.FC<GenerateSaleFormProps> = React.memo(({ onClose, totalAmount }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<ISaleFormData>({
    resolver: zodResolver(createSaleFormSchema(totalAmount)),
    defaultValues: {
      paymentType: PaymentType.Efectivo,
      cashAmount: 0,
      notes: ''
    }
  });

  const onSubmit: SubmitHandler<ISaleFormData> = async (data) => {
    try {
      await createSale(data);
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
