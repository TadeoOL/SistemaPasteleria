import { useEffect, useState } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
// import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import InputLabel from '@mui/material/InputLabel';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Grid2 from '@mui/material/Grid2';
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
import AlertCakeDelete from './AlertCakeDelete';
import { insertCake } from '../../../services/cakeService';
import { cakeSchema } from '../../../schema/cakeSchema';
import { ICake } from '../../../../../types/catalog/cake';

// constant
const getInitialValues = (cake: ICake | null) => {
  const newCake: ICake = {
    id: '',
    nombre: '',
    precioCompra: 0,
    precioVenta: 0
  };

  if (cake) {
    return _.merge({}, newCake, cake);
  }

  return newCake;
};

// ==============================|| CUSTOMER ADD / EDIT - FORM ||============================== //

interface FormCakeAddProps {
  cake: ICake | null;
  closeModal: () => void;
}

const FormCakeAdd: React.FC<FormCakeAddProps> = ({ cake, closeModal }) => {
  const queryClient = useQueryClient();

  // const theme = useTheme();
  const [loading, setLoading] = useState<boolean>(true);
  const [openAlert, setOpenAlert] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<ICake>({
    resolver: zodResolver(cakeSchema),
    defaultValues: {
      nombre: '',
      precioCompra: 0,
      precioVenta: 0
    }
  });

  useEffect(() => {
    const loadInitialValues = () => {
      const values = getInitialValues(cake);
      reset({
        ...values
      });
      setLoading(false);
    };

    loadInitialValues();
  }, [cake, reset]);

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
    closeModal();
  };

  const onSubmit = async (data: ICake) => {
    const isEdit = cake && cake.id;
    if (isEdit) {
      data.id = cake.id;
    }
    try {
      const response = await insertCake(data);
      const newCake = {
        ...response
      };
      queryClient.setQueryData(['cakes'], (oldData: ICake[] | undefined) => {
        if (!oldData) return [newCake];
        if (isEdit) {
          return oldData.map((item) => (item.id === newCake.id ? newCake : item));
        }
        return [newCake, ...oldData];
      });

      toast.success(isEdit ? 'Pastel editado correctamente' : 'Pastel agregado correctamente');
      closeModal();
    } catch (error) {
      console.log({ error });
      toast.error(isEdit ? 'Error al editar el pastel' : 'Error al agregar el pastel');
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
          <DialogTitle>{cake ? 'Editar Pastel' : 'Nuevo Pastel'}</DialogTitle>
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
                            placeholder="Escriba el nombre del pastel"
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
                            placeholder="Escriba el precio de compra del pastel"
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
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="cake-price-sale">Precio de Venta</InputLabel>
                      <Controller
                        name="precioVenta"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            id="cake-price-sale"
                            type="number"
                            placeholder="Escriba el precio de venta del pastel"
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
                            error={!!errors.precioVenta}
                            helperText={errors.precioVenta?.message}
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
                {cake && (
                  <Tooltip title="Eliminar Pastel" placement="top">
                    <IconButton onClick={() => setOpenAlert(true)} size="large" color="error">
                      <DeleteFilled />
                    </IconButton>
                  </Tooltip>
                )}
              </Grid2>
              <Grid2 size={{ xs: 6 }} container justifyContent="flex-end">
                <Stack direction="row" spacing={2} alignItems="center">
                  <Button color="error" onClick={closeModal}>
                    Cancelar
                  </Button>
                  <Button type="submit" variant="contained" disabled={isSubmitting}>
                    {cake ? 'Editar' : 'Agregar'}
                  </Button>
                </Stack>
              </Grid2>
            </Grid2>
          </Box>
        </form>
      </LocalizationProvider>
      {cake && <AlertCakeDelete id={cake.id!} title={cake.nombre} open={openAlert} handleClose={handleAlertClose} />}
    </>
  );
};

export default FormCakeAdd;
