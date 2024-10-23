import { Button } from '@mui/material';

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    dashed;
    shadow;
    light;
  }

  interface ButtonPropsSizeOverrides {
    extraSmall;
  }
}
