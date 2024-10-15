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
      url: '/inventario',
      icon: icons.Inventory2Outlined
    }
  ]
};

export default inventory;
