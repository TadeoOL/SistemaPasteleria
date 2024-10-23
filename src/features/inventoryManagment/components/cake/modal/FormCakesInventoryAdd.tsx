import {
  Box,
  Button,
  DialogContent,
  DialogTitle,
  Divider,
  FormHelperText,
  Grid2,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';

import { useEffect, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';

// third-party
import _ from 'lodash';

// project imports
import CircularWithPath from '../../../../../components/@extended/progress/CircularWithPath';

// assets
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// types
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useGetCakes } from '../../../../catalog/hooks/useGetCakes';
import { useAuthStore } from '../../../../auth/store/authStore';
import useWarehouseSelectedStore from '../../../store/warehouseSelected';
import { ICakeInventory } from '../../../../../types/inventoryManagment/cakeInventory';
import { insertCakeInventory } from '../../../services/inventoryService';
import { cakeInventorySchema } from '../../../schema/cakeInventorySchema';

// constant
const getInitialValues = (productInventory: ICakeInventory | null) => {
  const newProductInventory: ICakeInventory = {
    id_Pastel: '',
    id_Sucursal: '',
    id_Almacen: '',
    cantidad: 0
  };

  if (productInventory) {
    return _.merge({}, newProductInventory, productInventory);
  }

  return newProductInventory;
};

// ==============================|| CUSTOMER ADD / EDIT - FORM ||============================== //

interface FormCakesInventoryAddProps {
  cakeInventory: ICakeInventory | null;
  closeModal: () => void;
}

const FormCakesInventoryAdd: React.FC<FormCakesInventoryAddProps> = ({ cakeInventory, closeModal }) => {
  const profile = useAuthStore((state) => state.profile);
  const warehouse = useWarehouseSelectedStore((state) => state.warehouse);
  const queryClient = useQueryClient();
  const { data: cakes, isLoading: isLoadingCakes } = useGetCakes();

  const [loading, setLoading] = useState<boolean>(true);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<ICakeInventory>({
    resolver: zodResolver(cakeInventorySchema),
    defaultValues: {
      id_Pastel: '',
      id_Sucursal: '',
      id_Almacen: '',
      cantidad: 0
    }
  });

  useEffect(() => {
    const loadInitialValues = () => {
      const values = getInitialValues(cakeInventory);
      values.id_Sucursal = profile?.id_Sucursal || '';

      reset({
        ...values,
        id_Almacen: warehouse?.id
      });
      setLoading(false);
    };

    loadInitialValues();
  }, [cakeInventory, reset]);

  const onSubmit = async (data: ICakeInventory) => {
    const isEdit = cakeInventory && cakeInventory.id_Pastel;
    if (isEdit) {
      data.id_Pastel = cakeInventory.id_Pastel;
    }
    data.id_Sucursal = profile?.id_Sucursal || '';
    try {
      const response = await insertCakeInventory(data);
      const newProduct = {
        ...response
      };
      queryClient.setQueryData(['cakesInventory', warehouse?.id], (oldData: ICakeInventory[] | undefined) => {
        if (!oldData) return [newProduct];
        if (isEdit) {
          return oldData.map((item) => (item.id_Pastel === newProduct.id_Pastel ? { ...newProduct, nombre: item.nombre } : item));
        }
        return [newProduct, ...oldData];
      });

      toast.success(isEdit ? 'Inventario editado correctamente' : 'Inventario agregado correctamente');
      closeModal();
    } catch (error) {
      console.log({ error });
      toast.error(isEdit ? 'Error al editar el inventario' : 'Error al agregar el inventario');
    }
  };

  if (loading || isLoadingCakes) {
    return (
      <Box sx={{ p: 5 }}>
        <Stack direction="row" justifyContent="center">
          <CircularWithPath />
        </Stack>
      </Box>
    );
  }

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <form autoComplete="off" noValidate onSubmit={handleSubmit(onSubmit, (e) => console.log(e))}>
          <DialogTitle>{cakeInventory ? 'Editar Pastel' : 'Nuevo Pastel'}</DialogTitle>
          <Divider />
          <DialogContent sx={{ p: 2.5 }}>
            <Grid2 container spacing={3}>
              <Grid2 size={{ xs: 12 }}>
                <Grid2 container spacing={3}>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="cake-id">Pastel</InputLabel>
                      <Controller
                        name="id_Pastel"
                        control={control}
                        render={({ field }) => (
                          <>
                            <Select
                              {...field}
                              fullWidth
                              id="cake-id"
                              placeholder="Seleccione el pastel"
                              disabled
                              error={!!errors.id_Pastel}
                            >
                              {cakes?.map((cake) => (
                                <MenuItem key={cake.id} value={cake.id}>
                                  {cake.nombre}
                                </MenuItem>
                              ))}
                            </Select>
                            <FormHelperText error={!!errors.id_Pastel}>{errors.id_Pastel?.message}</FormHelperText>
                          </>
                        )}
                      />
                    </Stack>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="cake-quantity">Cantidad</InputLabel>
                      <Controller
                        name="cantidad"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            id="cake-quantity"
                            type="number"
                            placeholder="Escriba la cantidad del pastel"
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === '') {
                                field.onChange(value);
                              } else {
                                const intValue = parseInt(value, 10);
                                if (!isNaN(intValue) && intValue >= 0) {
                                  field.onChange(intValue);
                                }
                              }
                            }}
                            value={field.value === 0 ? '' : field.value}
                            error={!!errors.cantidad}
                            helperText={errors.cantidad?.message}
                          />
                        )}
                      />
                    </Stack>
                  </Grid2>
                </Grid2>
              </Grid2>
            </Grid2>
          </DialogContent>
          <Divider />
          <Box
            sx={{
              p: 2.5
            }}
          >
            <Grid2 container justifyContent="flex-end" alignItems="center">
              <Grid2 size={{ xs: 6 }} container justifyContent="flex-end">
                <Stack direction="row" spacing={2} alignItems="center">
                  <Button color="error" onClick={closeModal}>
                    Cancelar
                  </Button>
                  <Button type="submit" variant="contained" disabled={isSubmitting}>
                    {cakeInventory ? 'Editar' : 'Agregar'}
                  </Button>
                </Stack>
              </Grid2>
            </Grid2>
          </Box>
        </form>
      </LocalizationProvider>
    </>
  );
};

export default FormCakesInventoryAdd;
