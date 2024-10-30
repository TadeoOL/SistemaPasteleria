import { Divider } from '@mui/material';
import { Button, DialogActions, DialogContent } from '@mui/material';
import { DialogTitle } from '@mui/material';
import { ICakeRequest, IProductRequest, IRequest } from '../../../../types/request/request';
import GenericCollapseTable from '../../../../components/GenericCollapseTable';
import { Box } from '@mui/material';

interface IRequestDetailsProps {
  onClose: () => void;
  request: IRequest;
}

export const RequestDetails = ({ onClose, request }: IRequestDetailsProps) => {
  return (
    <>
      <DialogTitle>Detalles de la solicitud</DialogTitle>
      <Divider />
      <DialogContent sx={{ overflowY: 'auto' }}>
        <Box sx={{ maxHeight: '70vh' }}>
          {request.pasteles && request.pasteles.length > 0 && (
            <GenericCollapseTable<ICakeRequest>
              data={request.pasteles}
              type="Pasteles"
              headers={['Nombre', 'Cantidad']}
              fields={['nombre', 'cantidad']}
              idField="id_Pastel"
            />
          )}
          {request.productos && request.productos.length > 0 && (
            <GenericCollapseTable<IProductRequest>
              data={request.productos}
              type="Productos"
              headers={['Nombre', 'Cantidad']}
              fields={['nombre', 'cantidad']}
              idField="id_Producto"
            />
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between' }}>
        <Button variant="outlined" color="error" onClick={onClose}>
          Cerrar
        </Button>
      </DialogActions>
    </>
  );
};
