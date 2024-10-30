import { Box, DialogContent, FormHelperText, MenuItem, Select, Stack, TextField, Tooltip } from '@mui/material';
import { Divider } from '@mui/material';
import { Button } from '@mui/material';
import { DialogActions } from '@mui/material';
import { DialogTitle } from '@mui/material';
import { useGetBranches } from '../../../catalog/hooks/useGetBranches';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IRequestSchema, requestSchema } from '../../schema/requestSchema';
import { InputLabel } from '@mui/material';
import { FormControl } from '@mui/material';
import { useGetCakes } from '../../../catalog/hooks/useGetCakes';
import { useGetProducts } from '../../../catalog/hooks/useGetProducts';
import GenericCollapseTable from '../../../../components/GenericCollapseTable';
import { useState } from 'react';
import CircularWithPath from '../../../../components/@extended/progress/CircularWithPath';
import { IconButton } from '@mui/material';
import { DeleteOutline, EditOutlined } from '@mui/icons-material';
import { createRequest } from '../../services/requestService';
import { toast } from 'react-toastify';
import { IBranch } from '../../../../types/catalog/branch';
import { useQueryClient } from '@tanstack/react-query';
import { IRequest } from '../../../../types/request/request';
import GenericSelect from '../../../../components/GenericSelect';

interface RequestFormProps {
  onClose: () => void;
}

export const RequestForm = ({ onClose }: RequestFormProps) => {
  const { data: branch, isLoading: isLoadingBranch } = useGetBranches();
  const { data: cakes, isLoading: isLoadingCakes } = useGetCakes();
  const { data: products, isLoading: isLoadingProducts } = useGetProducts();

  const {
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors }
  } = useForm<IRequestSchema>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      pasteles: [],
      productos: [],
      id_Sucursal: ''
    }
  });
  const branchId = watch('id_Sucursal');
  const cakesSelected = watch('pasteles');
  const productsSelected = watch('productos');

  const [currentCake, setCurrentCake] = useState('');
  const [currentProduct, setCurrentProduct] = useState('');
  const [quantityCake, setQuantityCake] = useState<string>('1');
  const [quantityProduct, setQuantityProduct] = useState<string>('1');

  const [isEditingCakes, setIsEditingCakes] = useState(false);
  const [isEditingProducts, setIsEditingProducts] = useState(false);
  const queryClient = useQueryClient();

  const isEditing = isEditingCakes || isEditingProducts;

  const handleAddCake = () => {
    const cake = cakes?.find((c) => c.id === currentCake);
    const quantity = Number(quantityCake);
    if (cake && quantity > 0) {
      setValue('pasteles', [...(cakesSelected ?? []), { id_Pastel: cake.id, cantidad: quantity, nombre: cake.nombre }]);
      setCurrentCake('');
      setQuantityCake('1');
    }
  };

  const handleAddProduct = () => {
    const product = products?.find((p) => p.id === currentProduct);
    const quantity = Number(quantityProduct);
    if (product && quantity > 0) {
      setValue('productos', [...(productsSelected ?? []), { id_Producto: product.id, cantidad: quantity, nombre: product.nombre }]);
      setCurrentProduct('');
      setQuantityProduct('1');
    }
  };

  const handleRemoveProduct = (id: string) => {
    setValue(
      'productos',
      productsSelected.filter((p) => p.id_Producto !== id)
    );
  };

  const handleEditProduct = (id: string, newValue: number) => {
    const updatedProducts = productsSelected.map((p) => (p.id_Producto === id ? { ...p, cantidad: newValue } : p));
    setValue('productos', updatedProducts);
  };

  const handleRemoveCake = (id: string) => {
    setValue(
      'pasteles',
      cakesSelected.filter((p) => p.id_Pastel !== id)
    );
  };

  const handleEditCake = (item: any, newValue: number) => {
    const updatedCakes = cakesSelected.map((cake) => (cake.id_Pastel === item.id_Pastel ? { ...cake, cantidad: newValue } : cake));
    setValue('pasteles', updatedCakes);
  };

  const onSubmit: SubmitHandler<IRequestSchema> = async (data: IRequestSchema) => {
    try {
      const response = await createRequest(data);
      queryClient.setQueryData(['requests', branchId], (old: IRequest[] | undefined) => [...(old ?? []), response]);
      onClose();
      toast.success('Solicitud creada con éxito');
    } catch (error) {
      console.log(error);
      toast.error('Error al crear la solicitud');
    }
  };

  if (isLoadingBranch || isLoadingCakes || isLoadingProducts)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularWithPath />
      </Box>
    );
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Crear solicitud</DialogTitle>
        <Divider />
        <DialogContent
          sx={{
            maxHeight: '70vh'
          }}
        >
          <Stack sx={{ overflowY: 'auto', p: 1 }} spacing={1}>
            <GenericSelect<IRequestSchema, IBranch>
              label="Sucursal"
              name="id_Sucursal"
              control={control}
              options={branch ?? []}
              getOptionLabel={(option) => option.nombre}
              getOptionValue={(option) => option.id}
            />
            <Divider textAlign="center">Pasteles</Divider>
            <FormControl fullWidth>
              <InputLabel htmlFor="cakes-select">Pasteles</InputLabel>
              <Stack spacing={2}>
                <Select id="cakes-select" value={currentCake} onChange={(e) => setCurrentCake(e.target.value)} error={!!errors.pasteles}>
                  {cakes
                    ?.filter((cake) => !cakesSelected.find((c) => c.id_Pastel === cake.id))
                    .map((cake) => (
                      <MenuItem key={cake.id} value={cake.id}>
                        {cake.nombre}
                      </MenuItem>
                    ))}
                </Select>
                {errors.pasteles && <FormHelperText error>{errors.pasteles.message}</FormHelperText>}
                <Stack direction="row" spacing={2}>
                  <TextField
                    label="Cantidad"
                    type="number"
                    value={quantityCake}
                    onChange={(e) => setQuantityCake(e.target.value)}
                    error={quantityCake !== '' && Number(quantityCake) <= 0}
                    helperText={quantityCake !== '' && Number(quantityCake) <= 0 ? 'La cantidad debe ser mayor a 0' : ''}
                    inputProps={{ min: 1 }}
                  />
                  <Button variant="contained" onClick={handleAddCake} disabled={quantityCake === '' || Number(quantityCake) <= 0}>
                    Agregar Pastel
                  </Button>
                </Stack>
              </Stack>
            </FormControl>

            {cakesSelected.length > 0 && (
              <GenericCollapseTable
                data={cakesSelected}
                type="Pasteles Seleccionados"
                headers={['Nombre', 'Cantidad']}
                fields={['nombre', 'cantidad']}
                onEdit={handleEditCake}
                idField="id_Pastel"
                onEditingChange={setIsEditingCakes}
                actions={(item, onStartEdit) => (
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="Editar">
                      <IconButton onClick={() => onStartEdit(item)}>
                        <EditOutlined />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton onClick={() => handleRemoveCake(item.id_Pastel)}>
                        <DeleteOutline />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                )}
              />
            )}
            <Divider textAlign="center">Productos</Divider>

            <FormControl fullWidth>
              <InputLabel htmlFor="products-select">Productos</InputLabel>
              <Stack spacing={2}>
                <Select
                  id="products-select"
                  value={currentProduct}
                  onChange={(e) => setCurrentProduct(e.target.value)}
                  error={!!errors.productos}
                >
                  {products
                    ?.filter((product) => !productsSelected.find((p) => p.id_Producto === product.id))
                    .map((product) => (
                      <MenuItem key={product.id} value={product.id}>
                        {product.nombre}
                      </MenuItem>
                    ))}
                </Select>
                {errors.productos && <FormHelperText error>{errors.productos.message}</FormHelperText>}
                <Stack direction="row" spacing={2}>
                  <TextField
                    label="Cantidad"
                    type="number"
                    value={quantityProduct}
                    onChange={(e) => setQuantityProduct(e.target.value)}
                    error={quantityProduct !== '' && Number(quantityProduct) <= 0}
                    helperText={quantityProduct !== '' && Number(quantityProduct) <= 0 ? 'La cantidad debe ser mayor a 0' : ''}
                    inputProps={{ min: 1 }}
                  />
                  <Button variant="contained" onClick={handleAddProduct} disabled={quantityProduct === '' || Number(quantityProduct) <= 0}>
                    Agregar Producto
                  </Button>
                </Stack>
              </Stack>
            </FormControl>
            {productsSelected.length > 0 && (
              <GenericCollapseTable
                data={productsSelected}
                type="Productos Seleccionados"
                headers={['Nombre', 'Cantidad']}
                fields={['nombre', 'cantidad']}
                idField="id_Producto"
                onEditingChange={setIsEditingProducts}
                onEdit={(item, newValue) => handleEditProduct(item.id_Producto, newValue)}
                actions={(item, onStartEdit) => (
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="Editar">
                      <IconButton onClick={() => onStartEdit(item)}>
                        <EditOutlined />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton onClick={() => handleRemoveProduct(item.id_Producto)}>
                        <DeleteOutline />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                )}
              />
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="outlined" color="error" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="contained" type="submit" disabled={isEditing}>
            Crear
          </Button>
        </DialogActions>
      </form>
    </>
  );
};
