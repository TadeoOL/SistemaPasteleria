import { Chip } from '@mui/material';

declare module '@mui/material/Chip' {
  interface ChipPropsVariantOverrides {
    light;
    combined;
  }
  interface ChipPropsSizeOverrides {
    large;
  }
}
