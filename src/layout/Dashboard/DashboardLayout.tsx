import { Box, Container, Theme, Toolbar, useMediaQuery } from '@mui/material';
import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

// project import
import Loader from '../../components/Loader';
import Header from '../Header/Header';
import { PrivateRoute } from '../../components/privateRoute/PrivateRoute';
import Footer from '../Footer';
import Breadcrumbs from '../../components/@extended/Breadcrumbs';
import { handlerDrawerOpen, useGetMenuMaster } from '../../api/menu';
import Drawer from '../Drawer';
import { MenuOrientation } from '../../config';
import { useConfigStore } from '../../store/configStore';
import HorizontalBar from '../Drawer/HorizontalBar';

// ==============================|| MAIN LAYOUT ||============================== //

export default function DashboardLayout() {
  const { pathname } = useLocation();
  const { menuMasterLoading } = useGetMenuMaster();
  const downXL = useMediaQuery((theme: Theme) => theme.breakpoints.down('xl'));
  const downLG = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));

  const { menuOrientation } = useConfigStore();

  const isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downLG;

  // set media wise responsive drawer
  useEffect(() => {
    handlerDrawerOpen(!downXL);
  }, [downXL]);

  if (menuMasterLoading) return <Loader />;

  return (
    <PrivateRoute>
      <Box sx={{ display: 'flex', width: '100%' }}>
        <Header />
        {!isHorizontal ? <Drawer /> : <HorizontalBar />}
        <Box component="main" sx={{ width: 'calc(100% - 260px)', flexGrow: 1, p: { xs: 2, sm: 3 } }}>
          <Toolbar sx={{ mt: isHorizontal ? 8 : 'inherit' }} />
          <Container
            maxWidth={false}
            sx={{
              position: 'relative',
              minHeight: 'calc(100vh - 110px)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {pathname !== '/apps/profiles/account/my-account' && <Breadcrumbs />}
            <Outlet />
            <Footer />
          </Container>
        </Box>
      </Box>
    </PrivateRoute>
  );
}
