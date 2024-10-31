import UserOutlined from '@ant-design/icons/UserOutlined';
import { NavItemType } from '../../types/menu';
import { FormattedMessage } from 'react-intl';

const icons = { UserOutlined };

const users: NavItemType = {
  id: 'users',
  type: 'group',
  children: [
    {
      id: 'users',
      title: <FormattedMessage id="users" />,
      type: 'item',
      url: '/usuarios',
      icon: icons.UserOutlined
    }
  ]
};

export default users;
