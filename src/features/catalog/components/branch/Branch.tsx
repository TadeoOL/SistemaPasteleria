import { ColumnDef } from '@tanstack/react-table';
import Loader from '../../../../components/Loader';
import { useMemo, useState } from 'react';
import { IWarehouse } from '../../../../types/catalog/warehouse';
import { Stack, Tooltip } from '@mui/material';
import IconButton from '../../../../components/@extended/IconButton';

import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import EditOutlined from '@ant-design/icons/EditOutlined';
import GenericTable from '../../../../components/third-party/react-table/GenericTable';
import { useGetBranches } from '../../hooks/useGetBranches';
import { FormComponentProps } from '../../../../components/GenericModal';
import GenericModal from '../../../../components/GenericModal';
import FormBranchAdd from './modal/FormBranchAdd';
import AlertBranchDelete from './modal/AlertBranchDelete';
import { IBranch } from '../../../../types/catalog/branch';

export default function Branch() {
  const { data, isLoading } = useGetBranches();
  const [selectedBranch, setSelectedBranch] = useState<IBranch | null>(null);
  const [branchModal, setBranchModal] = useState<boolean>(false);
  const [alertBranchDelete, setAlertBranchDelete] = useState<boolean>(false);

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
                  setSelectedBranch(row.original);
                  setBranchModal(true);
                }}
              >
                <EditOutlined />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar">
              <IconButton
                color="error"
                onClick={() => {
                  setSelectedBranch(row.original);
                  setAlertBranchDelete(true);
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
      <GenericTable<IBranch>
        data={data}
        columns={columns}
        title="Sucursal"
        availableFilter
        onAdd={() => {
          setBranchModal(true);
          setSelectedBranch(null);
        }}
        onEdit={(branch) => {
          setSelectedBranch(branch);
          setBranchModal(true);
        }}
        onDelete={(branch) => {
          setSelectedBranch(branch);
          setAlertBranchDelete(true);
        }}
        AddComponent={() => (
          <GenericModal<IBranch>
            open={branchModal && !selectedBranch}
            modalToggler={setBranchModal}
            formData={null}
            FormComponent={(props: FormComponentProps<IBranch>) => (
              <FormBranchAdd branch={props.branch as IBranch | null} closeModal={props.closeModal as () => void} />
            )}
            formDataPropName="branch"
          />
        )}
        EditComponent={() => (
          <GenericModal<IBranch>
            open={branchModal && !!selectedBranch}
            modalToggler={setBranchModal}
            formData={selectedBranch}
            FormComponent={(props: FormComponentProps<IBranch>) => (
              <FormBranchAdd branch={props.branch as IBranch | null} closeModal={props.closeModal as () => void} />
            )}
            formDataPropName="branch"
          />
        )}
        DeleteComponent={() => (
          <AlertBranchDelete
            open={alertBranchDelete}
            handleClose={() => setAlertBranchDelete(false)}
            id={selectedBranch?.id || ''}
            title={selectedBranch?.nombre || ''}
          />
        )}
      />
    </>
  );
}
