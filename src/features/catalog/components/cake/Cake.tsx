import { ColumnDef } from '@tanstack/react-table';
import Loader from '../../../../components/Loader';
import { useMemo, useState } from 'react';
import { Stack, Tooltip } from '@mui/material';
import IconButton from '../../../../components/@extended/IconButton';

import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import EditOutlined from '@ant-design/icons/EditOutlined';
import GenericTable from '../../../../components/third-party/react-table/GenericTable';
import { FormComponentProps } from '../../../../components/GenericModal';
import GenericModal from '../../../../components/GenericModal';
import { ICake } from '../../../../types/catalog/cake';
import FormCakeAdd from './modal/FormCakeAdd';
import AlertCakeDelete from './modal/AlertCakeDelete';
import { useGetCakes } from '../../hooks/useGetCakes';

export default function Branch() {
  const { data, isLoading } = useGetCakes();
  const [selectedCake, setSelectedCake] = useState<ICake | null>(null);
  const [cakeModal, setCakeModal] = useState<boolean>(false);
  const [alertCakeDelete, setAlertCakeDelete] = useState<boolean>(false);

  const columns = useMemo<ColumnDef<ICake>[]>(
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
        accessorKey: 'nombre'
      },
      {
        header: 'Precio de venta',
        accessorKey: 'precioVenta'
      },
      {
        header: 'Precio de compra',
        accessorKey: 'precioCompra'
      },
      {
        header: 'Estado',
        accessorKey: 'habilitado',
        cell: ({ getValue }) => (getValue() ? 'Habilitado' : 'Deshabilitado')
      },
      {
        header: 'Acciones',
        cell: ({ row }) => (
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
            <Tooltip title="Editar">
              <IconButton
                color="primary"
                onClick={() => {
                  setSelectedCake(row.original);
                  setCakeModal(true);
                }}
              >
                <EditOutlined />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar">
              <IconButton
                color="error"
                onClick={() => {
                  setSelectedCake(row.original);
                  setAlertCakeDelete(true);
                }}
              >
                <DeleteOutlined />
              </IconButton>
            </Tooltip>
          </Stack>
        )
      }
    ],
    []
  );

  if (isLoading) return <Loader />;
  return (
    <>
      <GenericTable<ICake>
        data={data as ICake[]}
        columns={columns}
        title="Pastel"
        availableFilter
        onAdd={() => {
          setCakeModal(true);
          setSelectedCake(null);
        }}
        onEdit={(cake) => {
          setSelectedCake(cake);
          setCakeModal(true);
        }}
        onDelete={(cake) => {
          setSelectedCake(cake);
          setAlertCakeDelete(true);
        }}
        AddComponent={() => (
          <GenericModal<ICake>
            open={cakeModal && !selectedCake}
            modalToggler={setCakeModal}
            formData={null}
            FormComponent={(props: FormComponentProps<ICake>) => (
              <FormCakeAdd cake={props.cake as ICake | null} closeModal={props.closeModal as () => void} />
            )}
            formDataPropName="cake"
          />
        )}
        EditComponent={() => (
          <GenericModal<ICake>
            open={cakeModal && !!selectedCake}
            modalToggler={setCakeModal}
            formData={selectedCake}
            FormComponent={(props: FormComponentProps<ICake>) => (
              <FormCakeAdd cake={props.cake as ICake | null} closeModal={props.closeModal as () => void} />
            )}
            formDataPropName="cake"
          />
        )}
        DeleteComponent={() => (
          <AlertCakeDelete
            open={alertCakeDelete}
            handleClose={() => setAlertCakeDelete(false)}
            id={selectedCake?.id || ''}
            title={selectedCake?.nombre || ''}
          />
        )}
      />
    </>
  );
}
