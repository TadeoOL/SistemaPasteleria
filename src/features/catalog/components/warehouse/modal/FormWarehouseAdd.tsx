import { useEffect, useState } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
// import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
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
import { useForm } from 'react-hook-form';
import WarehouseSchema from '../../../schema/warehouseSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGetBranches } from '../../../hooks/useGetBranches';

// types
import { IWarehouse } from '../../../../../types/catalog/warehouse';
import AlertWarehouseDelete from './AlertWarehouseDelete';
import { insertWarehouse } from '../../../services/warehouseService';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { IBranch } from '../../../../../types/catalog/branch';

// constant
const getInitialValues = (warehouse: IWarehouse | null) => {
  const newWarehouse: IWarehouse = {
    id: '',
    nombre: '',
    id_Sucursal: ''
  };

  if (warehouse) {
    return _.merge({}, newWarehouse, warehouse);
  }

  return newWarehouse;
};

// ==============================|| CUSTOMER ADD / EDIT - FORM ||============================== //

interface FormWarehouseAddProps {
  warehouse: IWarehouse | null;
  closeModal: () => void;
}

const FormWarehouseAdd: React.FC<FormWarehouseAddProps> = ({ warehouse, closeModal }) => {
  const queryClient = useQueryClient();

  // const theme = useTheme();
  const { data: branches, isLoading } = useGetBranches();
  const [loading, setLoading] = useState<boolean>(true);
  const [openAlert, setOpenAlert] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset
  } = useForm<IWarehouse>({
    resolver: zodResolver(WarehouseSchema),
    defaultValues: {
      descripcion: '',
      id_Sucursal: '',
      nombre: ''
    }
  });

  useEffect(() => {
    const loadInitialValues = () => {
      const values = getInitialValues(warehouse);
      reset({
        ...values,
        id_Sucursal: values?.sucursal?.id
      });
      setLoading(false);
    };

    loadInitialValues();
  }, [warehouse, reset]);

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
    closeModal();
  };

  const onSubmit = async (data: IWarehouse) => {
    const isEdit = warehouse && warehouse.id;
    if (isEdit) {
      data.id = warehouse.id;
    }
    try {
      const response = await insertWarehouse(data);
      const newWarehouse = {
        ...response,
        sucursal: { id: response.id_Sucursal, nombre: branches?.find((branch) => branch.id === response.id_Sucursal)?.nombre }
      };
      queryClient.setQueryData(['warehouses'], (oldData: IWarehouse[] | undefined) => {
        if (!oldData) return [newWarehouse];
        if (isEdit) {
          return oldData.map((item) => (item.id === newWarehouse.id ? newWarehouse : item));
        }
        return [newWarehouse, ...oldData];
      });

      toast.success(isEdit ? 'Almacen editado correctamente' : 'Almacen agregado correctamente');
      closeModal();
    } catch (error) {
      console.log({ error });
      toast.error(isEdit ? 'Error al editar el almacen' : 'Error al agregar el almacen');
    }
  };

  if (loading || isLoading) {
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
          <DialogTitle>{warehouse ? 'Editar Almacen' : 'Nuevo Almacen'}</DialogTitle>
          <Divider />
          <DialogContent sx={{ p: 2.5 }}>
            <Grid2 container spacing={3}>
              <Grid2 size={{ xs: 12 }}>
                <Grid2 container spacing={3}>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="warehouse-name">Nombre</InputLabel>
                      <TextField
                        fullWidth
                        id="warehouse-name"
                        placeholder="Escriba el nombre del almacen"
                        {...register('nombre')}
                        error={!!errors.nombre}
                        helperText={errors.nombre?.message}
                      />
                    </Stack>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="warehouse-description">Descripcion</InputLabel>
                      <TextField
                        fullWidth
                        id="warehouse-description"
                        multiline
                        rows={4}
                        placeholder="Escriba la descripcion del almacen"
                        {...register('descripcion')}
                        error={!!errors.descripcion}
                        helperText={errors.descripcion?.message}
                      />
                    </Stack>
                  </Grid2>

                  <Grid2 size={{ xs: 12 }}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="branch-select">Sucursal</InputLabel>
                      <FormControl fullWidth>
                        <Select
                          id="branch-select"
                          displayEmpty
                          value={watch('id_Sucursal') || ''}
                          onChange={(event: SelectChangeEvent<string>) => setValue('id_Sucursal', event.target.value as string)}
                          input={<OutlinedInput id="select-column-hiding" placeholder="Sort by" />}
                          renderValue={(selected) => {
                            if (!selected) {
                              return <Typography variant="subtitle1">Seleccione una sucursal</Typography>;
                            }

                            const selectedStatus = branches?.find((item) => item.id === selected);
                            return <Typography variant="subtitle2">{selectedStatus?.nombre}</Typography>;
                          }}
                        >
                          {branches?.map((branch: IBranch) => (
                            <MenuItem key={branch.id} value={branch.id}>
                              <ListItemText primary={branch.nombre} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      {errors.id_Sucursal && (
                        <FormHelperText error id="standard-weight-helper-text-email-login" sx={{ pl: 1.75 }}>
                          {errors.id_Sucursal?.message}
                        </FormHelperText>
                      )}
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
                {warehouse && (
                  <Tooltip title="Eliminar Almacen" placement="top">
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
                    {warehouse ? 'Editar' : 'Agregar'}
                  </Button>
                </Stack>
              </Grid2>
            </Grid2>
          </Box>
        </form>
      </LocalizationProvider>
      {warehouse && <AlertWarehouseDelete id={warehouse.id!} title={warehouse.nombre} open={openAlert} handleClose={handleAlertClose} />}
    </>
  );
};

export default FormWarehouseAdd;
