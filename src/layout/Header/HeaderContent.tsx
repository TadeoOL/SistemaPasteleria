import { Box, Theme, useMediaQuery } from '@mui/material';
import DrawerHeader from '../Drawer/DrawerHeader';
import Search from './HeaderContent/Search';
import Profile from './HeaderContent/Profile';
import { useConfigStore } from '../../store/configStore';
import { MenuOrientation } from '../../config';

// project import

// ==============================|| HEADER - CONTENT ||============================== //

export default function HeaderContent() {
  const downLG = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));
  const { menuOrientation } = useConfigStore();
  // const localization = useMemo(() => <Localization />, []);

  // const megaMenu = useMemo(() => <MegaMenuSection />, []);

  return (
    <>
      {menuOrientation === MenuOrientation.HORIZONTAL && !downLG && <DrawerHeader open={true} />}
      {!downLG && <Search />}
      {/* {!downLG && megaMenu} */}
      {/* {!downLG && localization} */}
      {downLG && <Box sx={{ width: '100%', ml: 1 }} />}

      {/* <Notification /> */}
      {/* <Message /> */}
      {/* {!downLG && <FullScreen />} */}
      {/* <Customization /> */}
      {!downLG && <Profile />}
      {/* {downLG && <MobileSection />} */}
    </>
  );
}
