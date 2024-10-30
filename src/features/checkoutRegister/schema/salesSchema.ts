import { z } from 'zod';
import { PaymentType } from '../../../types/checkoutRegister/paymentTypes';

export const createSaleFormSchema = (totalAmount: number) => z.object({
  paymentType: z.nativeEnum(PaymentType),
  cashAmount: z.number({ invalid_type_error: 'El monto es requerido' }),
  notes: z.string().optional(),
  isAdvancePayment: z.boolean()
}).superRefine((data, ctx) => {
  if (data.isAdvancePayment) {
    if (data.cashAmount <= 0 || data.cashAmount > totalAmount) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `El monto del anticipo debe ser mayor que 0 y no exceder $${totalAmount.toFixed(2)}`,
        path: ['cashAmount']
      });
    }
  } else if (data.paymentType === PaymentType.Efectivo) {
    if (data.cashAmount < totalAmount) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `El monto en efectivo debe ser al menos $${totalAmount.toFixed(2)}`,
        path: ['cashAmount']
      });
    }
  }
});

export type ISaleFormData = z.infer<ReturnType<typeof createSaleFormSchema>>;

export const createFinishAdvanceFormSchema = (totalAmount: number) => z.object({
  paymentType: z.nativeEnum(PaymentType),
  cashAmount: z.number({ invalid_type_error: 'El monto es requerido' })
}).superRefine((data, ctx) => {
  if (data.paymentType === PaymentType.Efectivo) {
    if (data.cashAmount < totalAmount) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `El monto en efectivo debe ser al menos $${totalAmount.toFixed(2)}`,
        path: ['cashAmount']
      });
    }
  } else {
    if (data.cashAmount !== totalAmount) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `El monto debe ser exactamente $${totalAmount.toFixed(2)}`,
        path: ['cashAmount']
      });
    }
  }
});

export type IFinishAdvanceFormData = z.infer<ReturnType<typeof createFinishAdvanceFormSchema>>;
