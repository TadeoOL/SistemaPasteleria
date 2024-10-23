import { Badge } from '@mui/material';

declare module '@mui/material/Badge' {
  interface BadgePropsVariantOverrides {
    light;
  }
}
