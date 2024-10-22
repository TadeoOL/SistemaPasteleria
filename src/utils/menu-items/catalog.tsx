// third-party
import { FormattedMessage } from 'react-intl';

// assets
import PieChartOutlined from '@ant-design/icons/PieChartOutlined';
import EnvironmentOutlined from '@ant-design/icons/EnvironmentOutlined';
import ReconciliationOutlined from '@ant-design/icons/ReconciliationOutlined';
import { CakeOutlined, Inventory2Outlined } from '@mui/icons-material';

// type
import { NavItemType } from '../../types/menu';

// icons
const icons = { PieChartOutlined, EnvironmentOutlined, CakeOutlined, ReconciliationOutlined, Inventory2Outlined };

// ==============================|| MENU ITEMS - FORMS & TABLES ||============================== //

const catalog: NavItemType = {
  id: 'group-catalog-map',
  title: <FormattedMessage id="catalog-map" />,
  icon: icons.PieChartOutlined,
  type: 'group',
  children: [
    {
      id: 'warehouse',
      title: <FormattedMessage id="warehouse" />,
      type: 'item',
      url: '/catalogo/almacenes',
      icon: icons.ReconciliationOutlined
    },
    {
      id: 'cakes',
      title: <FormattedMessage id="cakes" />,
      type: 'item',
      url: '/catalogo/pasteles',
      icon: icons.CakeOutlined
    },
    {
      id: 'product',
      title: <FormattedMessage id="product" />,
      type: 'item',
      url: '/catalogo/productos',
      icon: icons.Inventory2Outlined
    },
    {
      id: 'branches',
      title: <FormattedMessage id="branches" />,
      type: 'item',
      url: '/catalogo/sucursales',
      icon: icons.EnvironmentOutlined
    }
  ]
};

export default catalog;
