import { Collapse, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

interface NavItem {
  title: string;
  icon: React.ReactNode;
  path?: string;
  children?: NavItem[];
}

// Componente para renderizar un elemento de navegación
const NavListItem: React.FC<{ item: NavItem; level: number }> = ({ item, level }) => {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    if (item.children) {
      setOpen(!open);
    }
  };

  return (
    <>
      <ListItem component={item.path ? Link : 'div'} to={item.path || ''} onClick={handleClick} sx={{ pl: 2 * level }}>
        <ListItemIcon>{item.icon}</ListItemIcon>
        <ListItemText primary={item.title} />
        {item.children && (open ? <ExpandLess /> : <ExpandMore />)}
      </ListItem>
      {item.children && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.children.map((child, index) => (
              <NavListItem key={index} item={child} level={level + 1} />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

// Componente principal de navegación
const Navigation: React.FC<{ items: NavItem[] }> = ({ items }) => {
  return (
    <List>
      {items.map((item, index) => (
        <NavListItem key={index} item={item} level={0} />
      ))}
    </List>
  );
};

export default Navigation;
