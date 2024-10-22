import { z } from 'zod';

export const productInventorySchema = z.object({
  id_Producto: z.string({required_error:"El producto es requerido"}).min(1, { message: 'El producto es requerido' }),
  id_Sucursal: z.string().min(1, { message: 'La sucursal es requerida' }),
  id_Almacen: z.string().min(1, { message: 'El almacen es requerido' }),
  cantidad: z.number().min(1, { message: 'La cantidad es requerida' })
});
