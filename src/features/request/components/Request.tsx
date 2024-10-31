import { ColumnDef } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { IRequest } from '../../../types/request/request';
import GenericTable from '../../../components/third-party/react-table/GenericTable';
import { useGetRequests } from '../hooks/useGetRequests';
import { useParams } from 'react-router-dom';
import Loader from '../../../components/Loader';
import { Button, Stack, Tooltip } from '@mui/material';
import { AddCircleOutlineOutlined, CheckOutlined, CloseOutlined, VisibilityOutlined } from '@mui/icons-material';
import GenericModal from '../../../components/GenericModal';
import { RequestForm } from './modal/RequestForm';
import { IconButton } from '@mui/material';
import { RequestDetails } from './modal/RequestDetails';
import { changeRequestStatus } from '../services/requestService';
import Swal from 'sweetalert2';
import { useQueryClient } from '@tanstack/react-query';
import { RequestStatus, RequestStatusLabels } from '../../../types/request/requstTypes';
import { RequestCompleteForm } from './modal/RequestCompleteForm';
import { useAuthStore } from '../../auth/store/authStore';

const Request = () => {
  const { branchId } = useParams();
  const { data, isLoading } = useGetRequests(branchId || '');
  const [open, setOpen] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [requestSelected, setRequestSelected] = useState<IRequest | null>(null);
  const [openComplete, setOpenComplete] = useState(false);
  const queryClient = useQueryClient();
  const profile = useAuthStore((state) => state.profile);

  const handleCancelRequest = async (request: IRequest) => {
    Swal.fire({
      title: '¿Estás seguro de querer cancelar la solicitud?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      allowOutsideClick: false,
      allowEscapeKey: false,
      preConfirm: async () => {
        try {
          await changeRequestStatus(request.id_SolicitudEntrega, RequestStatus.Cancelada, request.id_Almacen);
          queryClient.setQueryData(['requests', branchId], (old: IRequest[] | undefined) => {
            if (!old) return old;

            return old.map((r) => (r.id_SolicitudEntrega === request.id_SolicitudEntrega ? { ...r, estatus: RequestStatus.Cancelada } : r));
          });
          Swal.fire({
            title: 'Solicitud cancelada',
            icon: 'success'
          });
        } catch (error) {
          console.log(error);
          Swal.fire({
            title: 'Error al cancelar la solicitud',
            icon: 'error'
          });
        }
      }
    });
  };

  const columns = useMemo<ColumnDef<IRequest>[]>(
    () => [
      {
        id: 'id_SolicitudEntrega',
        header: 'id_SolicitudEntrega',
        accessorKey: 'id_SolicitudEntrega',
        show: false,
        enableHiding: true
      },
      {
        header: 'Folio',
        accessorKey: 'folio'
      },
      {
        header: 'Usuario que solicitó',
        accessorKey: 'usuarioSolicito'
      },
      {
        header: 'Usuario que autorizó',
        accessorKey: 'usuarioAutorizo',
        cell: ({ row }) => <div>{row.original.usuarioAutorizo?.trim() ? row.original.usuarioAutorizo : 'Sin autorizar'}</div>
      },
      {
        header: 'Fecha de solicitud',
        accessorKey: 'fechaSolicitud'
      },
      {
        header: 'Sucursal',
        accessorKey: 'sucursal'
      },
      {
        header: 'Estatus',
        accessorKey: 'estatus',
        cell: ({ row }) => <div>{RequestStatusLabels[row.original.estatus as RequestStatus]}</div>
      },
      {
        header: 'Acciones',
        cell: ({ row }) => (
          <Stack direction="row" spacing={0.2}>
            <Tooltip title="Ver detalles">
              <IconButton
                size="small"
                onClick={() => {
                  setRequestSelected(row.original);
                  setOpenDetails(true);
                }}
              >
                <VisibilityOutlined fontSize="small" />
              </IconButton>
            </Tooltip>
            {row.original.estatus === RequestStatus.Creada && profile?.roles.includes('ADMIN') && (
              <>
                <Tooltip title="Aceptar">
                  <IconButton
                    size="small"
                    onClick={() => {
                      setRequestSelected(row.original);
                      setOpenComplete(true);
                    }}
                  >
                    <CheckOutlined fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Cancelar">
                  <IconButton size="small" onClick={() => handleCancelRequest(row.original)}>
                    <CloseOutlined fontSize="small" />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Stack>
        )
      }
    ],
    []
  );

  if (isLoading) return <Loader />;
  return (
    <>
      {profile?.roles.includes('ADMIN') && (
        <Stack direction="row" justifyContent="flex-end" alignItems="center" mb={1}>
          <Button variant="contained" startIcon={<AddCircleOutlineOutlined />} onClick={() => setOpen(true)}>
            Crear solicitud
          </Button>
        </Stack>
      )}
      <GenericTable<IRequest> data={data} columns={columns} title="Solicitudes" />
      <GenericModal<IRequest>
        FormComponent={(props) => <RequestForm onClose={props.closeModal} />}
        formDataPropName="request"
        formData={null}
        open={open && profile?.roles.includes('ADMIN')}
        modalToggler={() => setOpen(false)}
      />
      <GenericModal<IRequest>
        FormComponent={(props) => {
          return <RequestDetails onClose={props.closeModal} request={props.request} />;
        }}
        formDataPropName="request"
        formData={requestSelected}
        open={openDetails}
        modalToggler={() => setOpenDetails(false)}
      />
      <GenericModal<IRequest>
        FormComponent={(props) => <RequestCompleteForm onClose={props.closeModal} request={props.request} />}
        formDataPropName="request"
        formData={requestSelected}
        open={openComplete && profile?.roles.includes('ADMIN')}
        modalToggler={() => setOpenComplete(false)}
      />
    </>
  );
};

export default Request;
