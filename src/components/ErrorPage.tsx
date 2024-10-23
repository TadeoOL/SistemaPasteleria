import { Box, Button, Container, Paper, Typography } from '@mui/material';
import React from 'react';
import { useRouteError, useNavigate } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { keyframes } from '@mui/system';

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(100px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ErrorPage: React.FC = () => {
  const error: any = useRouteError();
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center'
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
            backgroundColor: 'background.paper',
            animation: `${fadeIn} 0.5s ease-out`
          }}
        >
          <ErrorOutlineIcon
            sx={{
              fontSize: 100,
              color: 'error.main',
              mb: 2,
              animation: `${pulse} 2s infinite ease-in-out`
            }}
          />
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            ¡Oops!
          </Typography>
          <Typography variant="h6" gutterBottom>
            Lo sentimos, ha ocurrido un error inesperado.
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            {error.statusText || error.message || 'Algo salió mal'}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleGoHome}
            size="large"
            sx={{
              mt: 2,
              px: 4,
              py: 1,
              borderRadius: 50,
              fontWeight: 'bold',
              transition: 'all 0.3s',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: 3
              }
            }}
          >
            Volver al inicio
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default ErrorPage;
