import { Stack, Tooltip } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import IconButton from '../../../../components/@extended/IconButton';
import { ColumnDef } from '@tanstack/react-table';
import EditOutlined from '@ant-design/icons/EditOutlined';
import Loader from '../../../../components/Loader';
import GenericTable from '../../../../components/third-party/react-table/GenericTable';
import GenericModal, { FormComponentProps } from '../../../../components/GenericModal';
import { useAuthStore } from '../../../auth/store/authStore';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useGetCakesInventory } from '../../hooks/useGetCakesInventory';
import FormCakesInventoryAdd from './modal/FormCakesInventoryAdd';
import { ICakeInventory } from '../../../../types/inventoryManagment/cakeInventory';

export default function Product() {
  const { data, isLoading } = useGetCakesInventory();
  const [selectedCake, setSelectedCake] = useState<ICakeInventory | null>(null);
  const [cakeModal, setCakeModal] = useState<boolean>(false);
  const navigate = useNavigate();

  const profile = useAuthStore((state) => state.profile);

  useEffect(() => {
    if (!profile?.id_Sucursal) {
      toast.error('No tienes ninguna sucursal asignada');
      navigate('/');
    }
  }, [profile]);

  const columns = useMemo<ColumnDef<ICakeInventory>[]>(
    () => [
      {
        id: 'id',
        accessorKey: 'id_Producto',
        header: 'ID',
        enableHiding: true,
        show: false
      },
      {
        header: 'Nombre',
        accessorKey: 'nombre'
      },
      {
        header: 'Cantidad',
        accessorKey: 'cantidad'
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
          </Stack>
        )
      }
    ],
    []
  );

  if (isLoading) return <Loader />;
  return (
    <GenericTable<ICakeInventory>
      data={data as ICakeInventory[]}
      columns={columns}
      title="Inventario de Producto"
      onEdit={(cake) => {
        setSelectedCake(cake);
        setCakeModal(true);
      }}
      EditComponent={() => (
        <GenericModal<ICakeInventory>
          open={cakeModal && !!selectedCake}
          modalToggler={setCakeModal}
          formData={selectedCake}
          FormComponent={(props: FormComponentProps<ICakeInventory>) => (
            <FormCakesInventoryAdd
              cakeInventory={props.cakeInventory as ICakeInventory | null}
              closeModal={props.closeModal as () => void}
            />
          )}
          formDataPropName="cakeInventory"
        />
      )}
    />
  );
}
