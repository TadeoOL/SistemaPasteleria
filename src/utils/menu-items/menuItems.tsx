import { NavItemType } from '../../types/menu';
import catalog from './catalog';
import checkoutRegister from './checkoutRegister';
import inventory from './inventory';
import requests from './requests';

const menuItems: { items: NavItemType[] } = {
  items: [checkoutRegister, catalog, inventory, requests]
};

export default menuItems;
