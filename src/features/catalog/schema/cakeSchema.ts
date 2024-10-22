import { z } from 'zod';

export const cakeSchema = z.object({
  nombre: z.string().min(1, { message: 'El nombre del pastel es requerido' }),
  precioCompra: z.number().min(0.01, { message: 'El precio de compra debe ser mayor que 0' }),
  precioVenta: z.number().min(0.01, { message: 'El precio de venta debe ser mayor que 0' })
});

export type ICake = z.infer<typeof cakeSchema>;
