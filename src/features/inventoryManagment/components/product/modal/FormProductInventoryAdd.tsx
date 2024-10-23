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
import { IProductInventory } from '../../../../../types/inventoryManagment/productInventory';
import { productInventorySchema } from '../../../schema/productInventorySchema';
import { insertProductInventory } from '../../../services/inventoryService';
import { useGetProducts } from '../../../../catalog/hooks/useGetProducts';
import { useAuthStore } from '../../../../auth/store/authStore';
import useWarehouseSelectedStore from '../../../store/warehouseSelected';

// constant
const getInitialValues = (productInventory: IProductInventory | null) => {
  const newProductInventory: IProductInventory = {
    id_Producto: '',
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

interface FormProductInventoryAddProps {
  productInventory: IProductInventory | null;
  closeModal: () => void;
}

const FormProductInventoryAdd: React.FC<FormProductInventoryAddProps> = ({ productInventory, closeModal }) => {
  const profile = useAuthStore((state) => state.profile);
  const warehouse = useWarehouseSelectedStore((state) => state.warehouse);
  const queryClient = useQueryClient();
  const { data: products, isLoading: isLoadingProducts } = useGetProducts();

  const [loading, setLoading] = useState<boolean>(true);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<IProductInventory>({
    resolver: zodResolver(productInventorySchema),
    defaultValues: {
      id_Producto: '',
      id_Sucursal: '',
      id_Almacen: '',
      cantidad: 0
    }
  });

  useEffect(() => {
    const loadInitialValues = () => {
      const values = getInitialValues(productInventory);
      values.id_Sucursal = profile?.id_Sucursal || '';
      values.id_Almacen = warehouse?.id || '';

      reset({
        ...values
      });
      setLoading(false);
    };

    loadInitialValues();
  }, [productInventory, reset]);

  const onSubmit = async (data: IProductInventory) => {
    const isEdit = productInventory && productInventory.id_Producto;
    if (isEdit) {
      data.id_Producto = productInventory.id_Producto;
    }
    data.id_Sucursal = profile?.id_Sucursal || '';
    try {
      const response = await insertProductInventory(data);
      const newProduct = {
        ...response
      };
      queryClient.setQueryData(['productsInventory', warehouse?.id], (oldData: IProductInventory[] | undefined) => {
        if (!oldData) return [newProduct];
        if (isEdit) {
          return oldData.map((item) => (item.id_Producto === newProduct.id_Producto ? { ...newProduct, nombre: item.nombre } : item));
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

  if (loading || isLoadingProducts) {
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
          <DialogTitle>{productInventory ? 'Editar Producto' : 'Nuevo Producto'}</DialogTitle>
          <Divider />
          <DialogContent sx={{ p: 2.5 }}>
            <Grid2 container spacing={3}>
              <Grid2 size={{ xs: 12 }}>
                <Grid2 container spacing={3}>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="product-id">Producto</InputLabel>
                      <Controller
                        name="id_Producto"
                        control={control}
                        render={({ field }) => (
                          <>
                            <Select
                              disabled
                              {...field}
                              fullWidth
                              id="product-id"
                              placeholder="Seleccione el producto"
                              error={!!errors.id_Producto}
                            >
                              {products?.map((product) => (
                                <MenuItem key={product.id} value={product.id}>
                                  {product.nombre}
                                </MenuItem>
                              ))}
                            </Select>
                            <FormHelperText error={!!errors.id_Producto}>{errors.id_Producto?.message}</FormHelperText>
                          </>
                        )}
                      />
                    </Stack>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="product-quantity">Cantidad</InputLabel>
                      <Controller
                        name="cantidad"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            id="product-quantity"
                            type="number"
                            placeholder="Escriba la cantidad del producto"
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
                    {productInventory ? 'Editar' : 'Agregar'}
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

export default FormProductInventoryAdd;
