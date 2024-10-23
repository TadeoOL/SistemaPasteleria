export enum PaymentType {
    Efectivo = 1,
    Transferencia = 2,
    Credito = 3,
    Debito = 4
  }

  export const PaymentTypeLabels: Record<PaymentType, string> = {
    [PaymentType.Efectivo]: 'Efectivo',
    [PaymentType.Transferencia]: 'Transferencia',
    [PaymentType.Credito]: 'Crédito',
    [PaymentType.Debito]: 'Débito'
  };