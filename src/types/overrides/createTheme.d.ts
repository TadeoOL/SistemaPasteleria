import { Theme } from '@mui/material';

// project import
import { CustomShadowProps } from 'types/theme';

declare module '@mui/material/styles' {
  interface Theme {
    customShadows: CustomShadowProps;
  }
}
