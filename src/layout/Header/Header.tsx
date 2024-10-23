import { AppBar, AppBarProps, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import { ReactNode, useMemo } from 'react';

// project import
import HeaderContent from './HeaderContent';

// import { ThemeMode } from '../../config';

// assets
import MenuFoldOutlined from '@ant-design/icons/MenuFoldOutlined';
import MenuUnfoldOutlined from '@ant-design/icons/MenuUnfoldOutlined';
import AppBarStyled from './AppBarStyled';
import IconButton from '../../components/@extended/IconButton';
import { handlerDrawerOpen, useGetMenuMaster } from '../../api/menu';
import { useConfigStore } from '../../store/configStore';
import { DRAWER_WIDTH, MenuOrientation, MINI_DRAWER_WIDTH, ThemeMode } from '../../config';

// ==============================|| MAIN LAYOUT - HEADER ||============================== //

export default function Header() {
  const theme = useTheme();
  const downLG = useMediaQuery(theme.breakpoints.down('lg'));

  // header content
  const headerContent = useMemo(() => <HeaderContent />, []);
  const { menuMaster } = useGetMenuMaster();
  const { menuOrientation, mode } = useConfigStore();

  const iconBackColor = mode === ThemeMode.DARK ? 'background.default' : 'grey.100';
  const drawerOpen = menuMaster.isDashboardDrawerOpened;
  const isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downLG;

  // common header
  const mainHeader: ReactNode = (
    <Toolbar>
      {!isHorizontal ? (
        <IconButton
          aria-label="open drawer"
          onClick={() => handlerDrawerOpen(!drawerOpen)}
          edge="start"
          color="secondary"
          variant="light"
          sx={{ color: 'text.primary', bgcolor: drawerOpen ? 'transparent' : iconBackColor, ml: { xs: 0, lg: -2 } }}
        >
          {!drawerOpen ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </IconButton>
      ) : null}
      {headerContent}
    </Toolbar>
  );

  // app-bar params
  const appBar: AppBarProps = {
    position: 'fixed',
    color: 'inherit',
    elevation: 0,
    sx: {
      borderBottom: '1px solid',
      borderBottomColor: 'divider',
      zIndex: 1200,
      width: isHorizontal
        ? '100%'
        : { xs: '100%', lg: drawerOpen ? `calc(100% - ${DRAWER_WIDTH}px)` : `calc(100% - ${MINI_DRAWER_WIDTH}px)` }
    }
  };

  return (
    <>
      {!downLG ? (
        <AppBarStyled open={drawerOpen} {...appBar}>
          {mainHeader}
        </AppBarStyled>
      ) : (
        <AppBar {...appBar}>{mainHeader}</AppBar>
      )}
    </>
  );
}
