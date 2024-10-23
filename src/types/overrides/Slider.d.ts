import { Slider } from '@mui/material';

declare module '@mui/material/Slider' {
  interface SliderPropsColorOverrides {
    error;
    success;
    warning;
    info;
  }
}
