import { Box, IconButton, IconButtonProps, List, ListItem, ListItemAvatar, ListItemText, Menu, MenuItem, styled } from '@mui/material';

import { useState, MouseEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// project import
import Avatar from '../../../components/@extended/Avatar';
import { useGetMenuMaster } from '../../../api/menu';
// assets
import RightOutlined from '@ant-design/icons/RightOutlined';
import avatar1 from '../../../assets/images/users/avatar-1.png';
import { useAuthStore } from '../../../features/auth/store/authStore';

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
  drawerOpen: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, drawerOpen, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand, drawerOpen }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(-90deg)',
  marginLeft: 'auto',
  color: theme.palette.secondary.dark,
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest
  }),
  ...(!drawerOpen && {
    opacity: 0,
    width: 50,
    height: 50
  })
}));

// ==============================|| DRAWER - USER ||============================== //

export default function NavUser() {
  const navigate = useNavigate();

  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  const { logout } = useAuthStore();
  const handleLogout = async () => {
    try {
      await logout();
      navigate(`/login`, {
        state: {
          from: ''
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ p: 1.25, px: !drawerOpen ? 1.25 : 3, borderTop: '2px solid', borderTopColor: 'divider' }}>
      <List disablePadding>
        <ListItem
          disablePadding
          secondaryAction={
            <ExpandMore
              drawerOpen={drawerOpen}
              id="basic-button"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              expand={open}
              onClick={handleClick}
              aria-label="show more"
            >
              <RightOutlined style={{ fontSize: '0.625rem' }} />
            </ExpandMore>
          }
          sx={{ '& .MuiListItemSecondaryAction-root': { right: !drawerOpen ? -20 : -16 } }}
        >
          <ListItemAvatar>
            <Avatar alt="Avatar" src={avatar1} sx={{ ...(drawerOpen && { width: 46, height: 46 }) }} />
          </ListItemAvatar>
          <ListItemText primary={'Pruebas'} secondary="Panadero" />
        </ListItem>
      </List>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ 'aria-labelledby': 'basic-button' }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
        <MenuItem component={Link} to="/apps/profiles/user/personal" onClick={handleClose}>
          Profile
        </MenuItem>
        <MenuItem component={Link} to="/apps/profiles/account/my-account" onClick={handleClose}>
          My account
        </MenuItem>
      </Menu>
    </Box>
  );
}
