import { NavItemType } from '../../types/menu';
import catalog from './catalog';
import checkoutRegister from './checkoutRegister';
import inventory from './inventory';
import requests from './requests';
import users from './users';

const menuItems: { items: NavItemType[] } = {
  items: [checkoutRegister, catalog, inventory, requests, users]
};

export default menuItems;
