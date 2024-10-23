import { Alert } from '@mui/material';

declare module '@mui/material/Alert' {
  interface AlertPropsColorOverrides {
    primary;
    secondary;
  }
  interface AlertPropsVariantOverrides {
    border;
  }
}
