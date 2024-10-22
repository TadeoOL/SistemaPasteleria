import { z } from 'zod';

export const cakeInventorySchema = z.object({
  id_Pastel: z.string().min(1, { message: 'El pastel es requerido' }),
  id_Sucursal: z.string().min(1, { message: 'La sucursal es requerida' }),
  id_Almacen: z.string().min(1, { message: 'El almacen es requerido' }),
  cantidad: z.number().min(1, { message: 'La cantidad debe ser mayor a 0' })
});
