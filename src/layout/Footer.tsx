import { Link, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function Footer() {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: '24px 16px 0px', mt: 'auto' }}>
      <Typography variant="caption">&copy; All rights reserved</Typography>
      <Stack spacing={1.5} direction="row" justifyContent="space-between" alignItems="center">
        <Link component={RouterLink} to="https://plugmx.com" target="_blank" variant="caption" color="text.primary">
          About us
        </Link>
        <Link component={RouterLink} to="#" target="_blank" variant="caption" color="text.primary">
          Privacy
        </Link>
        <Link component={RouterLink} to="#" target="_blank" variant="caption" color="text.primary">
          Terms
        </Link>
      </Stack>
    </Stack>
  );
}
