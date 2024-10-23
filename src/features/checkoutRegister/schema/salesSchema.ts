import { z } from 'zod';
import { PaymentType } from '../../../types/checkoutRegister/paymentTypes';

export const createSaleFormSchema = (totalAmount: number) => z.object({
  paymentType: z.nativeEnum(PaymentType),
  cashAmount: z.number({ invalid_type_error: 'El monto en efectivo es requerido' })
    .min(totalAmount, { message: `El monto en efectivo debe ser al menos $${totalAmount.toFixed(2)}` }),
  notes: z.string().optional()
}).refine(
  (data) => {
    if (data.paymentType === PaymentType.Efectivo) {
      return data.cashAmount !== null && data.cashAmount !== undefined;
    }
    return true;
  },
  {
    message: "El monto en efectivo es requerido para pagos en efectivo",
    path: ["cashAmount"],
  }
);


export type ISaleFormData = z.infer<ReturnType<typeof createSaleFormSchema>>;