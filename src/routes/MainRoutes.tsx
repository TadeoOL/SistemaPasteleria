import { Navigate } from 'react-router-dom';
import DashboardLayout from '../layout/Dashboard/DashboardLayout';
import { CheckoutProductsView } from '../features/checkoutRegister/screens/checkoutProducts/CheckoutProductsView';
import { Warehouse } from '../features/catalog/components/warehouse/Warehouse';
import { patch } from '@mui/material';

const MainRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          index: true,
          element: <Navigate to="ventas" replace />
        },
        {
          path: 'ventas',
          element: <CheckoutProductsView />
        },
        {
          path: 'catalogo',
          children: [
            {
              index: true,
              element: <Navigate to="inventario" replace />
            },
            {
              path: 'inventario',
              element: <Warehouse />
            }
          ]
        }
      ]
    }
  ]
};

export default MainRoutes;
