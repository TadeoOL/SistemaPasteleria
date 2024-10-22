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
import FormProductAdd from './modal/FormProductAdd';
import AlertProductDelete from './modal/AlertProductDelete';
import IProduct from '../../../../types/catalog/product';
import { useGetProducts } from '../../hooks/useGetProducts';

export default function Product() {
  const { data, isLoading } = useGetProducts();
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [productModal, setProductModal] = useState<boolean>(false);
  const [alertProductDelete, setAlertProductDelete] = useState<boolean>(false);

  const columns = useMemo<ColumnDef<IProduct>[]>(
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
                  setSelectedProduct(row.original);
                  setProductModal(true);
                }}
              >
                <EditOutlined />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar">
              <IconButton
                color="error"
                onClick={() => {
                  setSelectedProduct(row.original);
                  setAlertProductDelete(true);
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
      <GenericTable<IProduct>
        data={data as IProduct[]}
        columns={columns}
        title="Producto"
        availableFilter
        onAdd={() => {
          setProductModal(true);
          setSelectedProduct(null);
        }}
        onEdit={(product) => {
          setSelectedProduct(product);
          setProductModal(true);
        }}
        onDelete={(product) => {
          setSelectedProduct(product);
          setAlertProductDelete(true);
        }}
        AddComponent={() => (
          <GenericModal<IProduct>
            open={productModal && !selectedProduct}
            modalToggler={setProductModal}
            formData={null}
            FormComponent={(props: FormComponentProps<IProduct>) => (
              <FormProductAdd product={props.product as IProduct | null} closeModal={props.closeModal as () => void} />
            )}
            formDataPropName="product"
          />
        )}
        EditComponent={() => (
          <GenericModal<IProduct>
            open={productModal && !!selectedProduct}
            modalToggler={setProductModal}
            formData={selectedProduct}
            FormComponent={(props: FormComponentProps<IProduct>) => (
              <FormProductAdd product={props.product as IProduct | null} closeModal={props.closeModal as () => void} />
            )}
            formDataPropName="product"
          />
        )}
        DeleteComponent={() => (
          <AlertProductDelete
            open={alertProductDelete}
            handleClose={() => setAlertProductDelete(false)}
            id={selectedProduct?.id || ''}
            title={selectedProduct?.nombre || ''}
          />
        )}
      />
    </>
  );
}
