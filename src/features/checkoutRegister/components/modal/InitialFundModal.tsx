import { Box, Button, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import PointOfSaleOutlined from '@mui/icons-material/PointOfSaleOutlined';
import GenericModal, { FormComponentProps } from '../../../../components/GenericModal';

interface InitialFundModalProps {
  onSubmit: (initialFund: number) => void;
  onClose: () => void | null;
}

const InitialFundForm: React.FC<FormComponentProps<null, InitialFundModalProps>> = ({ closeModal, onSubmit, onClose }) => {
  const [initialFund, setInitialFund] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fundAmount = parseFloat(initialFund);
    if (!isNaN(fundAmount) && fundAmount > 0) {
      onSubmit(fundAmount);
    }
  };

  const handleClose = () => {
    onClose();
    closeModal?.();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 3, textAlign: 'center' }}>
      <PointOfSaleOutlined sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
      <Typography variant="h5" gutterBottom>
        Crear Nueva Caja
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Es necesario crear una nueva caja. Por favor, ingrese el fondo inicial.
      </Typography>
      <TextField
        fullWidth
        label="Fondo Inicial"
        type="number"
        value={initialFund}
        onChange={(e) => setInitialFund(e.target.value)}
        InputProps={{ inputProps: { min: 0, step: 0.01 } }}
        sx={{ mb: 3 }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={handleClose} variant="outlined" color="secondary">
          Cancelar
        </Button>
        <Button type="submit" variant="contained" color="primary">
          Crear Caja
        </Button>
      </Box>
    </Box>
  );
};

const InitialFundModal: React.FC<InitialFundModalProps> = ({ onSubmit, onClose }) => {
  return (
    <GenericModal
      open={true}
      modalToggler={() => {}}
      formData={null}
      FormComponent={(props) => <InitialFundForm {...props} onSubmit={onSubmit} onClose={onClose} />}
      formDataPropName="initialFundData"
    />
  );
};

export default InitialFundModal;
