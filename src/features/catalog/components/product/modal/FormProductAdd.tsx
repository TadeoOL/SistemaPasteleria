import { Box, Button, DialogContent, DialogTitle, Divider, Grid2, InputLabel, Stack, TextField, Tooltip } from '@mui/material';

import { useEffect, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';

// third-party
import _ from 'lodash';

// project imports
import IconButton from '../../../../../components/@extended/IconButton';
import CircularWithPath from '../../../../../components/@extended/progress/CircularWithPath';

// assets
import DeleteFilled from '@ant-design/icons/DeleteFilled';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// types
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import IProduct from '../../../../../types/catalog/product';
import { productSchema } from '../../../schema/productSchema';
import AlertProductDelete from './AlertProductDelete';
import { insertProduct } from '../../../services/productService';
import LoadingButton from '../../../../../components/@extended/LoadingButton';

// constant
const getInitialValues = (product: IProduct | null) => {
  const newProduct: IProduct = {
    id: '',
    nombre: '',
    precioCompra: 0
  };

  if (product) {
    return _.merge({}, newProduct, product);
  }

  return newProduct;
};

// ==============================|| CUSTOMER ADD / EDIT - FORM ||============================== //

interface FormProductAddProps {
  product: IProduct | null;
  closeModal: () => void;
}

const FormProductAdd: React.FC<FormProductAddProps> = ({ product, closeModal }) => {
  const queryClient = useQueryClient();

  // const theme = useTheme();
  const [loading, setLoading] = useState<boolean>(true);
  const [openAlert, setOpenAlert] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<IProduct>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      nombre: '',
      precioCompra: 0
    }
  });

  useEffect(() => {
    const loadInitialValues = () => {
      const values = getInitialValues(product);
      reset({
        ...values
      });
      setLoading(false);
    };

    loadInitialValues();
  }, [product, reset]);

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
    closeModal();
  };

  const onSubmit = async (data: IProduct) => {
    const isEdit = product && product.id;
    if (isEdit) {
      data.id = product.id;
    }
    try {
      const response = await insertProduct(data);
      const newProduct = {
        ...response
      };
      queryClient.setQueryData(['products'], (oldData: IProduct[] | undefined) => {
        if (!oldData) return [newProduct];
        if (isEdit) {
          return oldData.map((item) => (item.id === newProduct.id ? newProduct : item));
        }
        return [newProduct, ...oldData];
      });

      toast.success(isEdit ? 'Producto editado correctamente' : 'Producto agregado correctamente');
      closeModal();
    } catch (error) {
      console.log({ error });
      toast.error(isEdit ? 'Error al editar el producto' : 'Error al agregar el producto');
    }
  };

  if (loading) {
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
        <form autoComplete="off" noValidate onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>{product ? 'Editar Producto' : 'Nuevo Producto'}</DialogTitle>
          <Divider />
          <DialogContent sx={{ p: 2.5 }}>
            <Grid2 container spacing={3}>
              <Grid2 size={{ xs: 12 }}>
                <Grid2 container spacing={3}>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="cake-name">Nombre</InputLabel>
                      <Controller
                        name="nombre"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            id="cake-name"
                            placeholder="Escriba el nombre del producto"
                            error={!!errors.nombre}
                            helperText={errors.nombre?.message}
                          />
                        )}
                      />
                    </Stack>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="cake-price-purchase">Precio de Compra</InputLabel>
                      <Controller
                        name="precioCompra"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            id="cake-price-purchase"
                            type="number"
                            placeholder="Escriba el precio de compra del producto"
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === '' || value === '.') {
                                field.onChange(value);
                              } else {
                                const numberValue = parseFloat(value);
                                if (!isNaN(numberValue)) {
                                  field.onChange(numberValue);
                                }
                              }
                            }}
                            value={field.value === 0 ? '' : field.value}
                            error={!!errors.precioCompra}
                            helperText={errors.precioCompra?.message}
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
            <Grid2 container justifyContent="space-between" alignItems="center">
              <Grid2 size={{ xs: 6 }}>
                {product && (
                  <Tooltip title="Eliminar Producto" placement="top">
                    <IconButton onClick={() => setOpenAlert(true)} size="large" color="error">
                      <DeleteFilled />
                    </IconButton>
                  </Tooltip>
                )}
              </Grid2>
              <Grid2 size={{ xs: 6 }} container justifyContent="flex-end">
                <Stack direction="row" spacing={2} alignItems="center">
                  <Button color="error" onClick={closeModal} disabled={isSubmitting}>
                    Cancelar
                  </Button>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting} loadingPosition="end">
                    {product ? 'Editar' : 'Agregar'}
                  </LoadingButton>
                </Stack>
              </Grid2>
            </Grid2>
          </Box>
        </form>
      </LocalizationProvider>
      {product && <AlertProductDelete id={product.id!} title={product.nombre} open={openAlert} handleClose={handleAlertClose} />}
    </>
  );
};

export default FormProductAdd;
