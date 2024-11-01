import { Box, Button, DialogActions, Divider } from '@mui/material';
import { DialogContent, DialogTitle } from '@mui/material';
import { IRequest } from '../../../../types/request/request';
import { useGetWarehousesByBranch } from '../../../catalog/hooks/useGetWarehousesByBranch';
import CircularWithPath from '../../../../components/@extended/progress/CircularWithPath';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { IWarehouse } from '../../../../types/catalog/warehouse';
import GenericCollapseTable from '../../../../components/GenericCollapseTable';
import { Stack } from '@mui/material';
import { RequestStatus } from '../../../../types/request/requstTypes';
import { changeRequestStatus } from '../../services/requestService';
import Swal from 'sweetalert2';
import { useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import GenericSelect from '../../../../components/GenericSelect';
import { useParams } from 'react-router-dom';
import LoadingButton from '../../../../components/@extended/LoadingButton';

interface RequestCompleteFormProps {
  onClose: () => void;
  request: IRequest;
}

const schema = z.object({
  id_Almacen: z.string({ required_error: 'Es necesario seleccionar un almacén' }).min(1, { message: 'Es necesario seleccionar un almacén' })
});

type Schema = z.infer<typeof schema>;

export const RequestCompleteForm = ({ onClose, request }: RequestCompleteFormProps) => {
  const { data: warehouses, isLoading: isLoadingWarehouses } = useGetWarehousesByBranch(request.id_Sucursal);
  const queryClient = useQueryClient();
  const { branchId } = useParams();

  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting }
  } = useForm<Schema>({
    defaultValues: {
      id_Almacen: ''
    },
    resolver: zodResolver(schema)
  });

  const onSubmit: SubmitHandler<Schema> = (data) => {
    Swal.fire({
      title: '¿Estás seguro de completar la solicitud?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Completar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      preConfirm: async () => {
        try {
          const response = await changeRequestStatus(request.id_SolicitudEntrega, RequestStatus.Completada, data.id_Almacen);
          console.log(request.id_SolicitudEntrega);
          console.log({ response });
          queryClient.setQueryData(['requests', branchId], (old: IRequest[]) => {
            return old.map((request) =>
              request.id_SolicitudEntrega === response.id_SolicitudEntrega
                ? { ...request, estatus: RequestStatus.Completada, usuarioAutorizo: response.usuarioAutorizo }
                : request
            );
          });
          onClose();
          Swal.fire({
            title: 'Solicitud completada',
            icon: 'success',
            text: 'La solicitud ha sido completada exitosamente'
          });
        } catch (error) {
          console.log(error);
          Swal.fire({
            title: 'Error',
            icon: 'error',
            text: 'Error al completar la solicitud'
          });
        }
      }
    });
  };

  if (isLoadingWarehouses)
    return (
      <Box height="100%" display="flex" justifyContent="center" alignItems="center">
        <CircularWithPath />
      </Box>
    );
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Completar solicitud</DialogTitle>
        <Divider />
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <GenericSelect<Schema, IWarehouse>
            {...register('id_Almacen')}
            options={warehouses}
            getOptionLabel={(option) => option.nombre}
            getOptionValue={(option) => option.id}
            label="Almacén"
            control={control}
            name="id_Almacen"
          />
          <Stack spacing={2}>
            {request.pasteles && request.pasteles.length > 0 && (
              <GenericCollapseTable
                data={request.pasteles || []}
                type="Pasteles Seleccionados"
                headers={['Nombre', 'Cantidad']}
                fields={['nombre', 'cantidad']}
                idField="id_Pastel"
              />
            )}
            {request.productos && request.productos.length > 0 && (
              <GenericCollapseTable
                data={request.productos || []}
                type="Productos Seleccionados"
                headers={['Nombre', 'Cantidad']}
                fields={['nombre', 'cantidad']}
                idField="id_Producto"
              />
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between' }}>
          <Button onClick={onClose} color="error" variant="outlined" disabled={isSubmitting}>
            Cancelar
          </Button>
          <LoadingButton variant="contained" type="submit" loading={isSubmitting} loadingPosition="end">
            Completar
          </LoadingButton>
        </DialogActions>
      </form>
    </>
  );
};
