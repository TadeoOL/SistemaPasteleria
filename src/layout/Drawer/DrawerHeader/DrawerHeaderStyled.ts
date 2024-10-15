// material-ui
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

// ==============================|| DRAWER HEADER - STYLED ||============================== //

interface Props {
  open: boolean;
}

const DrawerHeaderStyled = styled(Box, { shouldForwardProp: (prop) => prop !== 'open' })<Props>(
  ({ theme, open }) => ({
    // Aquí, 'theme' es inyectado automáticamente por styled-components
    // 'open' es la única prop que necesitas pasar cuando uses el componente
    ...theme.mixins.toolbar,
    display: 'flex',
    alignItems: 'center',
    justifyContent: open ? 'flex-start' : 'center',
    paddingLeft: theme.spacing(open ? 3 : 0)
  })
);

export default DrawerHeaderStyled;
