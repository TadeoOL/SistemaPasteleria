import { Link } from 'react-router-dom';
import { To } from 'history';

// material-ui
import { SxProps } from '@mui/material/styles';
import ButtonBase from '@mui/material/ButtonBase';

// project import
import Logo from './LogoMain';
import LogoIcon from './LogoIcon';
import { APP_DEFAULT_PATH } from '../../config';
import { useAuthStore } from '../../features/auth/store/authStore';

// ==============================|| MAIN LOGO ||============================== //

interface Props {
  isIcon?: boolean;
  sx?: SxProps;
  to?: To;
}

export default function LogoSection({ isIcon, sx, to }: Props) {
  const { isAuthenticated } = useAuthStore();

  return (
    <ButtonBase disableRipple {...(isAuthenticated && { component: Link, to: !to ? APP_DEFAULT_PATH : to, sx })}>
      {isIcon ? <LogoIcon /> : <Logo />}
    </ButtonBase>
  );
}
