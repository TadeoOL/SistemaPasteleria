import { NavItemType } from '../../types/menu';
import catalog from './catalog';
import checkoutRegister from './checkoutRegister';
import inventory from './inventory';

const menuItems: { items: NavItemType[] } = {
  items: [checkoutRegister, catalog, inventory]
};

export default menuItems;
