import { z } from 'zod';

export const requestSchema = z.object({
  pasteles: z.array(
    z.object({
      id_Pastel: z.string(),
      nombre: z.string(),
      cantidad: z.number().min(1, { message: 'La cantidad debe ser mayor a 0' })
    })
  ),
  productos: z.array(
    z.object({
      id_Producto: z.string(),
      nombre: z.string(),
      cantidad: z.number().min(1, { message: 'La cantidad debe ser mayor a 0' })
    })
  ),
  id_Sucursal: z.string().min(1, { message: 'La sucursal es requerida' }),
}).superRefine((data, ctx) => {
  if (data.pasteles.length === 0 && data.productos.length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Debe seleccionar al menos un elemento',
      path: ['pasteles']
    });
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Debe seleccionar al menos un elemento',
      path: ['productos']
    });
  }
});

export type IRequestSchema = z.infer<typeof requestSchema>;
