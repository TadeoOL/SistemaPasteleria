import { z } from 'zod';

const WarehouseSchema = z.object({
  nombre: z.string().min(1, { message: 'Nombre es requerido' }),
  descripcion: z.any().optional(),
  id_Sucursal: z.string({ invalid_type_error: 'Sucursal es requerida', required_error: 'Sucursal es requerida' }).min(1, { message: 'Sucursal es requerida' })
});

export default WarehouseSchema;
