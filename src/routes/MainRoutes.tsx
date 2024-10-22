import { Navigate } from 'react-router-dom';
import DashboardLayout from '../layout/Dashboard/DashboardLayout';
import { CheckoutProductsView } from '../features/checkoutRegister/screens/checkoutProducts/CheckoutProductsView';
import Loadable from '../components/Loadable';
import { lazy } from 'react';
import { InventoryManagment } from '../features/inventoryManagment/screens/InventoryManagment';

const WarehouseView = Loadable(lazy(() => import('../features/catalog/components/warehouse/Warehouse')));
const BranchView = Loadable(lazy(() => import('../features/catalog/components/branch/Branch')));
const CakeView = Loadable(lazy(() => import('../features/catalog/components/cake/Cake')));
const ProductView = Loadable(lazy(() => import('../features/catalog/components/product/Product')));
const InventoryProductsView = Loadable(lazy(() => import('../features/inventoryManagment/components/product/InventoryProducts')));
const InventoryCakesView = Loadable(lazy(() => import('../features/inventoryManagment/components/cake/InventoryCakes')));

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
              element: <Navigate to="almacenes" replace />
            },
            {
              path: 'almacenes',
              element: <WarehouseView />
            },
            {
              path: 'sucursales',
              element: <BranchView />
            },
            {
              path: 'pasteles',
              element: <CakeView />
            },
            {
              path: 'productos',
              element: <ProductView />
            }
          ]
        },
        {
          path: 'inventario',
          element: <InventoryManagment />,
          children: [
            {
              path: 'productos/:warehouseId',
              element: <InventoryProductsView />
            },
            {
              path: 'pasteles/:warehouseId',
              element: <InventoryCakesView />
            }
          ]
        }
      ]
    }
  ]
};

export default MainRoutes;
