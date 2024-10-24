import { Button, Divider, Typography } from '@mui/material';
import { DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useCashRegisterStore } from '../../store/cashRegister';
import MainCard from '../../../../components/MainCard';
import { TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { withdrawMoney } from '../../services/cashRegisterService';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import { ICashRegisterDetails } from '../../../../types/checkoutRegister/cashRegister';

export const WithdrawMoney = ({ onClose }: { onClose: () => void }) => {
  const { cashRegister, setCashRegister } = useCashRegisterStore();
  const queryClient = useQueryClient();
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      cash: 0
    }
  });

  const onSubmit = async (data: any) => {
    try {
      const withdraw = await withdrawMoney(data.cash, cashRegister?.id as string);
      queryClient.setQueryData(['cashRegister', cashRegister?.id], (oldData: ICashRegisterDetails | undefined) => {
        if (!oldData) return {};
        return {
          ...oldData,
          efectivo: oldData.efectivo - data.cash,
          retiros: [...oldData.retiros, withdraw]
        };
      });
      if (cashRegister) {
        const updatedCashRegister = {
          ...cashRegister,
          efectivo: cashRegister.efectivo - data.cash,
          retiros: [...cashRegister.retiros, withdraw]
        };
        setCashRegister(updatedCashRegister);
      }
      onClose();
      toast.success('Retiro registrado correctamente');
    } catch (error) {
      console.error({ error });
      toast.error('Error al registrar el retiro');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Retirar de efectivo</DialogTitle>
        <Divider />
        <DialogContent>
          <MainCard>
            <Typography variant="h5">Efectivo disponible: {cashRegister?.efectivo}</Typography>
            <Typography variant="h5">Fondo inicial: {cashRegister?.fondoInicial}</Typography>

            <Controller
              control={control}
              name="cash"
              rules={{
                required: 'La cantidad es requerida',
                min: { value: 1, message: 'La cantidad mínima a retirar es de 1 peso' },
                max: {
                  value: Number(cashRegister?.efectivo ?? 0),
                  message: `La cantidad máxima a retirar es de ${cashRegister?.efectivo} pesos`
                },
                validate: (value: number) => {
                  const val = value.toString();
                  if (val.startsWith('0') && val !== '0') {
                    return 'El número no debe comenzar con ceros';
                  }
                  return true;
                }
              }}
              render={({ field }) => (
                <TextField
                  label="Cantidad a retirar"
                  type="number"
                  fullWidth
                  {...field}
                  sx={{ maxWidth: '100% - 30px', mt: 2 }}
                  error={!!errors.cash}
                  helperText={errors.cash?.message}
                />
              )}
            />
          </MainCard>
        </DialogContent>
        <DialogActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="outlined" color="error" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button variant="contained" type="submit" disabled={isSubmitting}>
            Retirar
          </Button>
        </DialogActions>
      </form>
    </>
  );
};
