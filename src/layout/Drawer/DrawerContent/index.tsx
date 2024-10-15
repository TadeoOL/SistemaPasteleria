// project import
import NavUser from './NavUser';
import Navigation from './Navigation';
import SimpleBar from '../../../components/third-party/SimpleBar';
// import { useGetMenuMaster } from '../../../api/menu';
// import NavCard from './NavCard';
// import useMediaQuery from '@mui/material/useMediaQuery';
// import { useTheme } from '@mui/material/styles';

// ==============================|| DRAWER CONTENT ||============================== //

export default function DrawerContent() {
  // const { menuMaster } = useGetMenuMaster();
  // const theme = useTheme();
  // const drawerOpen = menuMaster.isDashboardDrawerOpened;
  // const downLG = useMediaQuery(theme.breakpoints.down('lg'));

  return (
    <>
      <SimpleBar sx={{ '& .simplebar-content': { display: 'flex', flexDirection: 'column' } }}>
        <Navigation />
        {/* No descomentar */}
        {/* {drawerOpen && !downLG && <NavCard />} */}
      </SimpleBar>
      <NavUser />
    </>
  );
}
