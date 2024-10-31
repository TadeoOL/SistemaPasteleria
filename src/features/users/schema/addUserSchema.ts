import { z } from 'zod';

const PASSWORD_REQUIREMENTS = z
  .string()
  .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  .regex(/[a-z]/, { message: 'La contraseña debe contener al menos una letra minúscula' })
  .regex(/[A-Z]/, { message: 'La contraseña debe contener al menos una letra mayúscula' })
  .regex(/[0-9]/, { message: 'La contraseña debe contener al menos un número' });

export const createUserSchema = (isEdit: boolean) => {
  const baseSchema = {
    id: z.string().optional(),
    nombre: z.string().min(1, { message: 'El nombre es requerido' }),
    apellidoPaterno: z.string().min(1, { message: 'El apellido paterno es requerido' }),
    apellidoMaterno: z.string().min(1, { message: 'El apellido materno es requerido' }),
    correo: z.string().email({ message: 'El correo es requerido' }),
    telefono: z.string().min(1, { message: 'El teléfono es requerido' }),
    roles: z.array(z.string()).min(1, { message: 'El rol es requerido' }),
    nombreUsuario: z.string().min(1, { message: 'El nombre de usuario es requerido' }),
    id_Sucursal: z.string().min(1, { message: 'La sucursal es requerida' })
  };
  const passwordFields = isEdit
    ? {
        contraseña: z.string().optional(),
        confirmarContraseña: z.string().optional()
      }
    : {
        contraseña: PASSWORD_REQUIREMENTS,
        confirmarContraseña: z.string().min(1, { message: 'La confirmación de contraseña es requerida' })
      };

  return z
    .object({
      ...baseSchema,
      ...passwordFields
    })
    .superRefine((data, ctx) => {
      if (!isEdit || data.contraseña) {
        if (data.contraseña !== data.confirmarContraseña) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Las contraseñas no coinciden',
            path: ['confirmarContraseña']
          });
        }
      }
    });
};

export type AddUserSchema = z.infer<ReturnType<typeof createUserSchema>>;
