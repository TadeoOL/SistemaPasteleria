import { Button, Dialog, DialogContent, Stack, Typography } from '@mui/material';

// project import
import Avatar from '../components/@extended/Avatar';
import { PopupTransition } from '../components/@extended/Transitions';

// assets
import DeleteFilled from '@ant-design/icons/DeleteFilled';

// types
interface Props {
  open: boolean;
  title: string;
  type: string;
  additionalInfo?: string;
  onClose: () => void;
  onDelete: () => Promise<void>;
  isLoading: boolean;
}

// ==============================|| GENERIC - DELETE ALERT ||============================== //

export default function GenericAlertDelete({ open, title, type, additionalInfo, onClose, onDelete, isLoading }: Props) {
  return (
    <Dialog
      open={open}
      onClose={isLoading ? undefined : onClose}
      keepMounted
      TransitionComponent={PopupTransition}
      maxWidth="xs"
      aria-labelledby="generic-delete-title"
      aria-describedby="generic-delete-description"
    >
      <DialogContent sx={{ mt: 2, my: 1 }}>
        <Stack alignItems="center" spacing={3.5}>
          <Avatar color="error" sx={{ width: 72, height: 72, fontSize: '1.75rem' }}>
            <DeleteFilled />
          </Avatar>
          <Stack spacing={2}>
            <Typography variant="h4" align="center">
              ¿Estás seguro de eliminar?
            </Typography>
            <Typography align="center">
              Al eliminar el {type}
              <Typography variant="subtitle1" component="span">
                {' '}
                &quot;{title}&quot;{' '}
              </Typography>
              {additionalInfo && <Typography component="span">{additionalInfo}</Typography>}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={2} sx={{ width: 1 }}>
            <Button fullWidth onClick={onClose} color="secondary" variant="outlined">
              Cancelar
            </Button>
            <Button fullWidth color="error" variant="contained" onClick={onDelete} autoFocus disabled={isLoading}>
              Eliminar
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
