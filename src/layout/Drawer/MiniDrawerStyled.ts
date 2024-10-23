import { Drawer, styled } from '@mui/material';

// project import
import { DRAWER_WIDTH, ThemeMode } from '../../config';
import { Theme } from '@mui/material/styles';
import { CSSObject } from '@mui/material';

const openedMixin = (theme: Theme) =>
  (({
    width: DRAWER_WIDTH,
    borderRight: '1px solid',
    borderRightColor: theme.palette.divider,

    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    }),

    overflowX: 'hidden',
    boxShadow: theme.palette.mode === ThemeMode.DARK ? theme.customShadows.z1 : 'none'
  }) as CSSObject);

const closedMixin = (theme: Theme) =>
  (({
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),

    overflowX: 'hidden',
    width: theme.spacing(7.5),
    borderRight: 'none',
    boxShadow: theme.customShadows.z1
  }) as CSSObject);

// ==============================|| DRAWER - MINI STYLED ||============================== //

const MiniDrawerStyled = styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  width: DRAWER_WIDTH,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme)
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme)
  })
}));

export default MiniDrawerStyled;
