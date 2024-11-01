import { Box, Divider } from '@mui/material';
import { Button, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AddUserSchema, createUserSchema } from '../../schema/addUserSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGetRoles } from '../../hooks/useGetRoles';
import GenericTextField from '../../../../components/GenericTextField';
import GenericSelect from '../../../../components/GenericSelect';
import { IRoleDto } from '../../../../types/users/rol';
import { useGetBranches } from '../../../catalog/hooks/useGetBranches';
import { IBranch } from '../../../../types/catalog/branch';
import { Grid2 } from '@mui/material';
import { addUser, updateUser } from '../../services/usersService';
import { toast } from 'react-toastify';
import { IUserDto } from '../../../../types/users/user';
import CircularWithPath from '../../../../components/@extended/progress/CircularWithPath';
import { useQueryClient } from '@tanstack/react-query';
import LoadingButton from '../../../../components/@extended/LoadingButton';

interface AddUserFormProps {
  onClose: () => void;
  user?: IUserDto;
  isEdit?: boolean;
}

export const AddUserForm = ({ onClose, user, isEdit = false }: AddUserFormProps) => {
  const { data: roles, isLoading } = useGetRoles();
  const queryClient = useQueryClient();
  const { data: branches, isLoading: isLoadingBranches } = useGetBranches();
  const {
    control,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<AddUserSchema>({
    defaultValues: {
      id: user?.id || undefined,
      roles: user?.roles || [],
      apellidoMaterno: user?.apellidoMaterno || '',
      apellidoPaterno: user?.apellidoPaterno || '',
      nombre: user?.nombre || '',
      correo: user?.correo || '',
      telefono: user?.telefono || '',
      contraseña: '',
      confirmarContraseña: '',
      nombreUsuario: user?.nombreUsuario || '',
      id_Sucursal: user?.id_Sucursal || ''
    },
    resolver: zodResolver(createUserSchema(isEdit))
  });
  const onSubmit: SubmitHandler<AddUserSchema> = async (data: AddUserSchema) => {
    try {
      isEdit ? await updateUser(data) : await addUser(data);
      queryClient.setQueryData(['users'], (oldData: IUserDto[]) => {
        if (isEdit) {
          return oldData.map((user) => (user.id === data.id ? data : user));
        }
        return [...oldData, data];
      });
      onClose();
      toast.success('Usuario agregado correctamente!');
    } catch (error) {
      console.log(error);
      toast.error('Error al agregar el usuario');
    }
  };

  console.log({ user });

  if (isLoading || isLoadingBranches)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularWithPath />
      </Box>
    );
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>{isEdit ? 'Editar Usuario' : 'Agregar Usuario'}</DialogTitle>
        <Divider />
        <DialogContent
          sx={{
            maxHeight: '70vh',
            padding: 2,
            height: '100%'
          }}
        >
          <Grid2
            container
            spacing={2}
            sx={{
              maxHeight: '100%',
              overflowY: 'auto',
              padding: 1
            }}
          >
            <Grid2 size={{ xs: 12, md: 6 }}>
              <GenericTextField control={control} name="nombre" label="Nombre" />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <GenericTextField control={control} name="apellidoPaterno" label="Apellido Paterno" />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <GenericTextField control={control} name="apellidoMaterno" label="Apellido Materno" />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <GenericTextField control={control} name="correo" label="Correo" />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <GenericTextField control={control} name="telefono" label="Telefono" />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <GenericSelect<AddUserSchema, IRoleDto>
                control={control}
                name="roles"
                label="Rol"
                options={roles}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.name}
                multiple
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <GenericSelect<AddUserSchema, IBranch>
                control={control}
                name="id_Sucursal"
                label="Sucursal"
                options={branches}
                getOptionLabel={(option) => option.nombre}
                getOptionValue={(option) => option.id}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 12 }}>
              <Divider />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <GenericTextField control={control} name="nombreUsuario" label="Nombre de Usuario" />
            </Grid2>
            {!isEdit && (
              <>
                <Grid2 size={{ xs: 12, md: 6 }}>
                  <GenericTextField control={control} name="contraseña" label="Contraseña" type="password" />
                </Grid2>
                <Grid2 size={{ xs: 12, md: 6 }}>
                  <GenericTextField control={control} name="confirmarContraseña" label="Confirmar Contraseña" type="password" />
                </Grid2>
              </>
            )}
          </Grid2>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between' }}>
          <Button variant="outlined" color="error" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <LoadingButton variant="contained" type="submit" loading={isSubmitting} loadingPosition="end">
            {isEdit ? 'Editar' : 'Agregar'}
          </LoadingButton>
        </DialogActions>
      </form>
    </>
  );
};
