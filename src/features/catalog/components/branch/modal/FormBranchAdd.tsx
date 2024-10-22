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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// types
import { IWarehouse } from '../../../../../types/catalog/warehouse';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import AlertBranchDelete from './AlertBranchDelete';
import { IBranch } from '../../../../../types/catalog/branch';
import { insertBranch } from '../../../services/branchService';
import { branchSchema } from '../../../schema/branchSchema';

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

interface FormBranchAddProps {
  branch: IBranch | null;
  closeModal: () => void;
}

const FormBranchAdd: React.FC<FormBranchAddProps> = ({ branch, closeModal }) => {
  const queryClient = useQueryClient();

  // const theme = useTheme();
  const [loading, setLoading] = useState<boolean>(true);
  const [openAlert, setOpenAlert] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<IBranch>({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      descripcion: '',
      nombre: ''
    }
  });

  useEffect(() => {
    const loadInitialValues = () => {
      const values = getInitialValues(branch);
      reset({
        ...values
      });
      setLoading(false);
    };

    loadInitialValues();
  }, [branch, reset]);

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
    closeModal();
  };

  const onSubmit = async (data: IWarehouse) => {
    const isEdit = branch && branch.id;
    if (isEdit) {
      data.id = branch.id;
    }
    try {
      const response = await insertBranch(data);
      const newBranch = {
        ...response
      };
      queryClient.setQueryData(['branches'], (oldData: IBranch[] | undefined) => {
        if (!oldData) return [newBranch];
        if (isEdit) {
          return oldData.map((item) => (item.id === newBranch.id ? newBranch : item));
        }
        return [newBranch, ...oldData];
      });

      toast.success(isEdit ? 'Almacen editado correctamente' : 'Almacen agregado correctamente');
      closeModal();
    } catch (error) {
      console.log({ error });
      toast.error(isEdit ? 'Error al editar el almacen' : 'Error al agregar el almacen');
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
          <DialogTitle>{branch ? 'Editar Sucursal' : 'Nueva Sucursal'}</DialogTitle>
          <Divider />
          <DialogContent sx={{ p: 2.5 }}>
            <Grid2 container spacing={3}>
              <Grid2 size={{ xs: 12 }}>
                <Grid2 container spacing={3}>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="branch-name">Nombre</InputLabel>
                      <TextField
                        fullWidth
                        id="branch-name"
                        placeholder="Escriba el nombre de la sucursal"
                        {...register('nombre')}
                        error={!!errors.nombre}
                        helperText={errors.nombre?.message}
                      />
                    </Stack>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="branch-description">Descripcion</InputLabel>
                      <TextField
                        fullWidth
                        id="branch-description"
                        multiline
                        rows={4}
                        placeholder="Escriba la descripcion de la sucursal"
                        {...register('descripcion')}
                        error={!!errors.descripcion}
                        helperText={errors.descripcion?.message}
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
                {branch && (
                  <Tooltip title="Eliminar Sucursal" placement="top">
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
                    {branch ? 'Editar' : 'Agregar'}
                  </Button>
                </Stack>
              </Grid2>
            </Grid2>
          </Box>
        </form>
      </LocalizationProvider>
      {branch && <AlertBranchDelete id={branch.id!} title={branch.nombre} open={openAlert} handleClose={handleAlertClose} />}
    </>
  );
};

export default FormBranchAdd;
