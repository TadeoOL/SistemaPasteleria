import { Navigate } from 'react-router-dom';
import Loadable from '../components/Loadable';
import { lazy } from 'react';
import ErrorPage from '../components/ErrorPage';

const DashboardLayout = Loadable(lazy(() => import('../layout/Dashboard/DashboardLayout')));
const InventoryManagment = Loadable(lazy(() => import('../features/inventoryManagment/screens/InventoryManagment')));

const WarehouseView = Loadable(lazy(() => import('../features/catalog/components/warehouse/Warehouse')));
const BranchView = Loadable(lazy(() => import('../features/catalog/components/branch/Branch')));
const CakeView = Loadable(lazy(() => import('../features/catalog/components/cake/Cake')));
const ProductView = Loadable(lazy(() => import('../features/catalog/components/product/Product')));
const InventoryProductsView = Loadable(lazy(() => import('../features/inventoryManagment/components/product/InventoryProducts')));
const InventoryCakesView = Loadable(lazy(() => import('../features/inventoryManagment/components/cake/InventoryCakes')));
const CheckoutRegister = Loadable(lazy(() => import('../features/checkoutRegister/screens/CheckoutRegister')));
const Sales = Loadable(lazy(() => import('../features/checkoutRegister/components/CashRegister')));
const RequestsView = Loadable(lazy(() => import('../features/request/components/Request')));
const RequestScreen = Loadable(lazy(() => import('../features/request/screens/RequestView')));
const MainRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      errorElement: <ErrorPage />,
      element: <DashboardLayout />,
      children: [
        {
          index: true,
          element: <Navigate to="ventas" replace />
        },
        {
          path: 'ventas',
          children: [
            {
              path: '',
              element: <CheckoutRegister />
            },
            {
              path: 'caja/:cashRegisterId',
              element: <Sales />
            }
          ]
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
        },
        {
          path: 'solicitudes',
          children: [
            {
              path: '',
              element: <RequestScreen />
            },
            {
              path: ':branchId',
              element: <RequestsView />
            }
          ]
        }
      ]
    }
  ]
};

export default MainRoutes;
