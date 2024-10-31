import { useMemo, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import GenericTable from '../../../components/third-party/react-table/GenericTable';
import { useGetUsers } from '../hooks/useGetUsers';
import Loader from '../../../components/Loader';
import ChipGroup from '../../../components/ChipGroup';
import { IUserDto } from '../../../types/users/user';
import { Box, IconButton } from '@mui/material';
import { Button } from '@mui/material';
import { AddCircleOutline, DeleteOutline, EditOutlined } from '@mui/icons-material';
import GenericModal from '../../../components/GenericModal';
import { AddUserForm } from './modal/AddUserForm';
import { Tooltip } from '@mui/material';
import Swal from 'sweetalert2';
import { deleteUser } from '../services/usersService';
import { useQueryClient } from '@tanstack/react-query';

const Users = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useGetUsers();
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUserDto | null>(null);
  const [openEditUser, setOpenEditUser] = useState(false);
  const columns = useMemo<ColumnDef<IUserDto>[]>(
    () => [
      {
        id: 'id',
        accessorKey: 'id',
        header: 'ID',
        enableHiding: true,
        show: false
      },
      {
        header: 'Nombre',
        cell: ({ row }) => `${row.original.nombre} ${row.original.apellidoPaterno} ${row.original.apellidoMaterno}`
      },
      {
        header: 'Correo',
        accessorKey: 'correo'
      },
      {
        header: 'Sucursal',
        accessorKey: 'sucursal'
      },
      {
        header: 'Rol',
        cell: ({ row }) => (
          <ChipGroup<{ id: string; name: string }>
            items={row.original.roles.map((role, index) => ({ id: index.toString(), name: role }))}
          />
        )
      },
      {
        header: 'Acciones',
        accessorKey: 'actions',
        cell: ({ row }) => (
          <>
            <Tooltip title="Editar">
              <IconButton
                onClick={() => {
                  setSelectedUser(row.original);
                  setOpenEditUser(true);
                }}
              >
                <EditOutlined />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar">
              <IconButton onClick={() => handleDeleteUser(row.original.id)}>
                <DeleteOutline />
              </IconButton>
            </Tooltip>
          </>
        )
      }
    ],
    []
  );

  const deleteUserFunction = async (id: string) => {
    try {
      await deleteUser(id);
      queryClient.setQueryData(['users'], (oldData: IUserDto[]) => oldData.filter((user) => user.id !== id));
      Swal.fire('Usuario eliminado', 'El usuario ha sido eliminado correctamente', 'success');
    } catch (error) {
      console.log(error);
      Swal.fire('Error', 'Error al eliminar el usuario', 'error');
    }
  };

  function handleDeleteUser(id: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      preConfirm: () => deleteUserFunction(id)
    });
  }

  if (isLoading) return <Loader />;
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
        <Button startIcon={<AddCircleOutline />} variant="contained" onClick={() => setOpen(true)}>
          Agregar Usuario
        </Button>
      </Box>
      <GenericTable<IUserDto> title="Usuarios" columns={columns} data={data} />
      <GenericModal
        open={open}
        modalToggler={setOpen}
        formData={null}
        FormComponent={(props) => <AddUserForm onClose={props.closeModal} />}
        formDataPropName="user"
      />
      <GenericModal
        open={openEditUser}
        modalToggler={setOpenEditUser}
        formData={selectedUser}
        FormComponent={(props) => <AddUserForm onClose={props.closeModal} user={selectedUser as IUserDto} isEdit />}
        formDataPropName="user"
      />
    </>
  );
};

export default Users;
