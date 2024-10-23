import { Box, Button, Container, IconButton, InputAdornment, Paper, TextField, Typography, useTheme } from '@mui/material';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { loginSchema } from '../schema/loginSchema';
import { login as loginService } from '../services/authService';
import { toast } from 'react-toastify';

type LoginFormData = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const theme = useTheme();
  const [showPassword, setShowPassword] = React.useState(false);
  const { login: loginStore } = useAuthStore();
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await loginService(data.email, data.password);
      console.log(response);
      loginStore(response);
      navigate('/');
    } catch (error) {
      if (typeof error === 'string' && error.includes('Las credenciales de acceso son incorrectas')) {
        toast.error('Las credenciales de acceso son incorrectas. Por favor, inténtalo de nuevo.');
      } else {
        toast.error('Ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.');
      }
      console.error({ error });
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Paper
          elevation={6}
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(4px)'
          }}
        >
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
            <Box
              component="img"
              src="/images/bakery-logo2.png"
              alt="Pastelería Logo"
              sx={{
                width: '250px',
                height: 'auto',
                filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.1))',
                position: 'absolute',
                top: -80,
                left: '50%',
                transform: 'translateX(-50%)'
              }}
            />
          </motion.div>
          <Typography
            component="h2"
            variant="h5"
            sx={{
              color: theme.palette.primary.main,
              marginBottom: 3,
              marginTop: 15
            }}
          >
            Iniciar Sesión
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{
              mt: 1,
              width: '100%',
              '& .MuiTextField-root': { mb: 2 }
            }}
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  fullWidth
                  id="email"
                  label="Correo Electrónico"
                  autoComplete="email"
                  autoFocus
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  slotProps={{
                    input: {
                      sx: {
                        borderRadius: 2,
                        backgroundColor: theme.palette.primary.lighter
                      }
                    }
                  }}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  fullWidth
                  label="Contraseña"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="current-password"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton aria-label="toggle password visibility" onClick={() => setShowPassword(!showPassword)} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                      sx: {
                        borderRadius: 2,
                        backgroundColor: theme.palette.primary.lighter
                      }
                    }
                  }}
                />
              )}
            />
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  borderRadius: 2,
                  fontWeight: 'bold',
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  boxShadow: `0 4px 6px ${theme.palette.primary.light}`,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark
                  }
                }}
              >
                Iniciar Sesión
              </Button>
            </motion.div>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

const LoginPage: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'url("/images/bakery-background.jpg")', // Asegúrate de tener esta imagen en tu carpeta public/images
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.5)', // Ajusta la opacidad según necesites
          backdropFilter: 'blur(8px)' // Ajusta el valor de blur según prefieras
        }
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Login />
      </Box>
    </Box>
  );
};

export default LoginPage;
