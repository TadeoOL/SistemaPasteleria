import { useState, useMemo } from 'react';
import { Box, Typography, TextField, List, ListItem, Card, CardContent, IconButton, Autocomplete, Divider, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useGetCakes } from '../../catalog/hooks/useGetCakes';
import { ICake } from '../../../types/catalog/cake';
import GenericModal from '../../../components/GenericModal';
import GenerateSaleForm from './forms/GenerateSaleForm';

interface ICartItem {
  cake: ICake;
  quantity: number;
}

interface ISaleFormData {
  totalAmount: number;
  paymentType: string;
  cashAmount: number | null;
  notes: string;
}

const ShoppingCart = () => {
  const [searchTerm, setSearchTerm] = useState<ICake | null>(null);
  const [cartItems, setCartItems] = useState<ICartItem[]>([]);
  const { data: cakes } = useGetCakes();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saleFormData, setSaleFormData] = useState<ISaleFormData>({
    totalAmount: 0,
    paymentType: 'tarjeta',
    cashAmount: null,
    notes: ''
  });

  const addToCart = (cake: ICake) => {
    const existingItem = cartItems.find((item) => item.cake.id === cake.id);
    if (existingItem) {
      setCartItems(cartItems.map((item) => (item.cake.id === cake.id ? { ...item, quantity: item.quantity + 1 } : item)));
    } else {
      setCartItems([...cartItems, { cake, quantity: 1 }]);
    }
  };

  const removeFromCart = (cakeId: string) => {
    setCartItems(cartItems.filter((item) => item.cake.id !== cakeId));
  };

  const updateQuantity = (cakeId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(cakeId);
    } else {
      setCartItems(cartItems.map((item) => (item.cake.id === cakeId ? { ...item, quantity: newQuantity } : item)));
    }
  };

  const totalAmount = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.cake.precioVenta * item.quantity, 0);
  }, [cartItems]);

  const handleGenerateSale = () => {
    setSaleFormData((prev) => ({ ...prev, totalAmount: totalAmount }));
    setIsModalOpen(true);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        maxHeight: 'calc(100vh - 160px)',
        overflow: 'hidden',
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        padding: '20px'
      }}
    >
      <Autocomplete
        fullWidth
        value={searchTerm}
        onChange={(_, value) => {
          setSearchTerm(value);
          if (value) {
            addToCart(value);
          }
        }}
        options={cakes.filter((cake) => !cartItems.some((item) => item.cake.id === cake.id)) || []}
        getOptionLabel={(option) => option.nombre}
        renderInput={(params) => <TextField {...params} label="Buscar pastel" />}
        sx={{ mb: 2 }}
      />
      <List
        sx={{
          flexGrow: 1,
          overflow: 'auto',
          maxHeight: 'calc(100% - 220px)'
        }}
      >
        {cartItems.map((item) => (
          <ListItem key={item.cake.id}>
            <Card sx={{ width: '100%' }}>
              <CardContent>
                <Typography variant="subtitle1">{item.cake.nombre}</Typography>
                <Typography variant="body2">Precio: ${item.cake.precioVenta}</Typography>
                <Box display="flex" alignItems="center" justifyContent="space-between" mt={1}>
                  <Box>
                    <IconButton size="small" onClick={() => updateQuantity(item.cake.id, item.quantity - 1)}>
                      <RemoveIcon />
                    </IconButton>
                    <Typography component="span" mx={1}>
                      {item.quantity}
                    </Typography>
                    <IconButton size="small" onClick={() => updateQuantity(item.cake.id, item.quantity + 1)}>
                      <AddIcon />
                    </IconButton>
                  </Box>
                  <IconButton size="small" onClick={() => removeFromCart(item.cake.id)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
        <Typography variant="h6" align="right" gutterBottom>
          Total: ${totalAmount.toFixed(2)}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          startIcon={<ShoppingCartIcon />}
          onClick={handleGenerateSale}
          disabled={cartItems.length === 0}
        >
          Generar Venta
        </Button>
      </Box>

      <GenericModal<ISaleFormData>
        open={isModalOpen}
        modalToggler={setIsModalOpen}
        formData={saleFormData}
        FormComponent={() => <GenerateSaleForm totalAmount={totalAmount} onClose={() => setIsModalOpen(false)} />}
        formDataPropName="formData"
      />
    </Box>
  );
};

export default ShoppingCart;
