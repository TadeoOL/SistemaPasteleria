import { ColumnDef } from '@tanstack/react-table';
import Loader from '../../../../components/Loader';
import { useGetWarehouses } from '../../hooks/useGetWarehouses';
import { useMemo, useState } from 'react';
import { IWarehouse } from '../../../../types/catalog/warehouse';
import { Stack, Tooltip } from '@mui/material';
import IconButton from '../../../../components/@extended/IconButton';

import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import EditOutlined from '@ant-design/icons/EditOutlined';
import AlertWarehouseDelete from './modal/AlertWarehouseDelete';
import GenericTable from '../../../../components/third-party/react-table/GenericTable';
import GenericModal, { FormComponentProps } from '../../../../components/GenericModal';
import FormWarehouseAdd from './modal/FormWarehouseAdd';

export default function Warehouse() {
  const { data, isLoading } = useGetWarehouses();
  const [selectedWarehouse, setSelectedWarehouse] = useState<IWarehouse | null>(null);
  const [warehouseModal, setWarehouseModal] = useState<boolean>(false);
  const [alertWarehouseDelete, setAlertWarehouseDelete] = useState<boolean>(false);

  const columns = useMemo<ColumnDef<IWarehouse>[]>(
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
        header: 'Descripción',
        accessorKey: 'descripcion',
        cell: ({ getValue }) => getValue() || 'N/A'
      },
      {
        header: 'Sucursal',
        accessorKey: 'sucursal.nombre'
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
                  setSelectedWarehouse(row.original);
                  setWarehouseModal(true);
                }}
              >
                <EditOutlined />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar">
              <IconButton
                color="error"
                onClick={() => {
                  setSelectedWarehouse(row.original);
                  setAlertWarehouseDelete(true);
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
      <GenericTable<IWarehouse>
        data={data}
        columns={columns}
        title="Almacen"
        availableFilter
        onAdd={() => {
          setWarehouseModal(true);
          setSelectedWarehouse(null);
        }}
        onEdit={(warehouse) => {
          setSelectedWarehouse(warehouse);
          setWarehouseModal(true);
        }}
        onDelete={(warehouse) => {
          setSelectedWarehouse(warehouse);
          setAlertWarehouseDelete(true);
        }}
        AddComponent={() => (
          <GenericModal<IWarehouse>
            open={warehouseModal && !selectedWarehouse}
            modalToggler={setWarehouseModal}
            formData={null}
            FormComponent={(props: FormComponentProps<IWarehouse>) => (
              <FormWarehouseAdd warehouse={props.formData as IWarehouse | null} closeModal={props.closeModal as () => void} />
            )}
            formDataPropName="warehouse"
          />
        )}
        EditComponent={() => (
          <GenericModal<IWarehouse>
            open={warehouseModal && !!selectedWarehouse}
            modalToggler={setWarehouseModal}
            formData={selectedWarehouse}
            FormComponent={(props: FormComponentProps<IWarehouse>) => (
              <FormWarehouseAdd warehouse={props.warehouse as IWarehouse} closeModal={props.closeModal as () => void} />
            )}
            formDataPropName="warehouse"
          />
        )}
        DeleteComponent={() => (
          <AlertWarehouseDelete
            open={alertWarehouseDelete}
            handleClose={() => setAlertWarehouseDelete(false)}
            id={selectedWarehouse?.id || ''}
            title={selectedWarehouse?.nombre || ''}
          />
        )}
      />
    </>
  );
}
