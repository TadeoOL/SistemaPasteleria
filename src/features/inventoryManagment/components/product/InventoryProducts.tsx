import { Stack, Tooltip } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import IconButton from '../../../../components/@extended/IconButton';
import { ColumnDef } from '@tanstack/react-table';
import EditOutlined from '@ant-design/icons/EditOutlined';
import Loader from '../../../../components/Loader';
import GenericTable from '../../../../components/third-party/react-table/GenericTable';
import GenericModal, { FormComponentProps } from '../../../../components/GenericModal';
import { useGetProductsInvetory } from '../../hooks/useGetProductsInvetory';
import FormProductInventoryAdd from './modal/FormProductInventoryAdd';
import { useAuthStore } from '../../../auth/store/authStore';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { IProductInventory } from '../../../../types/inventoryManagment/productInventory';

export default function Product() {
  const { data, isLoading } = useGetProductsInvetory();
  const [selectedProduct, setSelectedProduct] = useState<IProductInventory | null>(null);
  const [productModal, setProductModal] = useState<boolean>(false);
  const navigate = useNavigate();

  const profile = useAuthStore((state) => state.profile);

  useEffect(() => {
    if (!profile?.id_Sucursal) {
      toast.error('No tienes ninguna sucursal asignada');
      navigate('/');
    }
  }, [profile]);

  const columns = useMemo<ColumnDef<IProductInventory>[]>(
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
                  setSelectedProduct(row.original);
                  setProductModal(true);
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
    <GenericTable<IProductInventory>
      data={data as IProductInventory[]}
      columns={columns}
      title="Inventario de Producto"
      onEdit={(product) => {
        setSelectedProduct(product);
        setProductModal(true);
      }}
      EditComponent={() => (
        <GenericModal<IProductInventory>
          open={productModal && !!selectedProduct}
          modalToggler={setProductModal}
          formData={selectedProduct}
          FormComponent={(props: FormComponentProps<IProductInventory>) => (
            <FormProductInventoryAdd
              productInventory={props.productInventory as IProductInventory | null}
              closeModal={props.closeModal as () => void}
            />
          )}
          formDataPropName="productInventory"
        />
      )}
    />
  );
}
