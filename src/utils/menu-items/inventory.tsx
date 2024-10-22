import { Inventory2Outlined } from '@mui/icons-material';
import { NavItemType } from '../../types/menu';
import { FormattedMessage } from 'react-intl';

const icons = { Inventory2Outlined };

const inventory: NavItemType = {
  id: 'inventory',
  type: 'group',
  children: [
    {
      id: 'inventory-products',
      title: <FormattedMessage id="inventory-products" />,
      type: 'item',
      url: '/inventario/productos/:warehouseId',
      icon: icons.Inventory2Outlined
    },
    {
      id: 'inventory-cakes',
      title: <FormattedMessage id="inventory-cakes" />,
      type: 'item',
      url: '/inventario/pasteles/:warehouseId',
      icon: icons.Inventory2Outlined
    }
  ]
};

export default inventory;
