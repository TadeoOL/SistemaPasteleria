import { Pagination } from '@mui/material';

declare module '@mui/material/Pagination' {
  interface PaginationPropsColorOverrides {
    error;
    success;
    warning;
    info;
  }
  interface PaginationPropsVariantOverrides {
    contained;
    combined;
  }
}
