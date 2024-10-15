import { FormattedMessage } from 'react-intl';
import { NavItemType } from '../../types/menu';
import ShoppingCartOutlined from '@ant-design/icons/ShoppingCartOutlined';

const icons = {
  ShoppingCartOutlined
};

const checkoutRegister: NavItemType = {
  id: 'checkout-register',
  type: 'group',
  title: <FormattedMessage id="checkout-register" />,
  children: [
    {
      id: 'checkout-products',
      title: <FormattedMessage id="checkout-products" />,
      type: 'item',
      url: '/ventas',
      icon: icons.ShoppingCartOutlined
    }
  ]
};

export default checkoutRegister;
