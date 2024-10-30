import { ShoppingCartCheckoutOutlined } from '@mui/icons-material';
import { NavItemType } from '../../types/menu';
import { FormattedMessage } from 'react-intl';

const icons = { ShoppingCartCheckoutOutlined };

const requests: NavItemType = {
  id: 'requests',
  type: 'group',
  children: [
    {
      id: 'requests-products',
      title: <FormattedMessage id="requests-products" />,
      type: 'item',
      url: '/solicitudes',
      icon: icons.ShoppingCartCheckoutOutlined
    }
  ]
};

export default requests;
