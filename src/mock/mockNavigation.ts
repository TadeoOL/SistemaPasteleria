export const mockNavigationItems = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      path: '/dashboard',
      icon: 'dashboard',
      children: []
    },
    {
      id: 'users',
      title: 'Users',
      path: '/users',
      icon: 'people',
      children: []
    },
    {
      id: 'products',
      title: 'Products',
      icon: 'inventory',
      children: [
        {
          id: 'product-list',
          title: 'Product List',
          path: '/products/list',
          icon: 'list'
        },
        {
          id: 'add-product',
          title: 'Add Product',
          path: '/products/add',
          icon: 'add'
        }
      ]
    },
    {
      id: 'orders',
      title: 'Orders',
      path: '/orders',
      icon: 'shopping_cart',
      children: []
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: 'settings',
      children: [
        {
          id: 'general-settings',
          title: 'General',
          path: '/settings/general',
          icon: 'tune'
        },
        {
          id: 'security-settings',
          title: 'Security',
          path: '/settings/security',
          icon: 'security'
        }
      ]
    }
  ];