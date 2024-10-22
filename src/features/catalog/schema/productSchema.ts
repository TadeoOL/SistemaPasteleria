import { z } from 'zod';

export const productSchema = z.object({
  nombre: z.string().min(1),
  precioCompra: z.number().min(1),
});
