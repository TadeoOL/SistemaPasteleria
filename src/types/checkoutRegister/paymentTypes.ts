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

  export enum EstatusVenta {
    VentaCancelada = 0,
    VentaAnticipo = 1,
    VentaContado = 2,
    VentaAnticipoCompletada = 3
  }

  export const EstatusVentaLabels: Record<EstatusVenta, string> = {
    [EstatusVenta.VentaCancelada]: 'Venta Cancelada',
    [EstatusVenta.VentaAnticipo]: 'Venta Anticipo',
    [EstatusVenta.VentaContado]: 'Venta Contado',
    [EstatusVenta.VentaAnticipoCompletada]: 'Venta Anticipo Completada'
  };

