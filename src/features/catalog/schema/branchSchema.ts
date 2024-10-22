import { z } from 'zod';

export const branchSchema = z.object({
  nombre: z.string().min(1, { message: 'El nombre es requerido' }),
  descripcion: z.any().optional(),
});
