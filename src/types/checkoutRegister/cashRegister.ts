import { ICake } from "../catalog/cake";

export interface CashRegister {
  id_UsuarioCaja: string;  
  fondoInicial: number;  
  debito?: number | null;
  credito?: number | null;
  transferencia?: number | null;
  efectivo?: number | null;
  ventaTotal?: number | null;
  dineroAlCorte?: number | null;
  diaHoraCorte?: string | null;  
  usuario?: IUser | null;
  cajaVentas?: ICashRegisterSales[] | null;
  cajaRetiros?: CashRegisterWithdrawa[] | null;
  id: string;  
  fechaCreacion?: string;
  fechaModificacion?: string;
  habilitado?: boolean;
}

export interface ICashRegisterSales {
    id_Caja: string; 
    folio: string;
    totalVenta: number; 
    montoPago: number;
    tipoPago: number;
    notas?: string | null;
    caja?: CashRegister | null;
    detalleVentas?: any[] | null;
    id: string; 
    fechaCreacion?: string;
    fechaModificacion?: string;
    habilitado?: boolean;
    anticipoDetalles?: ICashRegisterAdvance[];
    esAnticipo: boolean;
    estatus: number;
  }

export interface CashRegisterWithdrawa {
    id_Caja: string;
    folio: string;
    totalRetiro: number;
    notas?: string | null;
    caja?: CashRegister | null;
    id: string;  
    fechaCreacion?: string;
    fechaModificacion?: string;
    habilitado?: boolean;
  }

  export interface ICashRegisterDetails {
  id: string;
  fondoInicial: number;
  debito: number;
  credito: number;
  transferencia: number;
  efectivo: number;
  ventaTotal: number;
  dineroAlCorte: number;
  ventas: ICashRegisterSales[];  
  retiros: CashRegisterWithdrawa[];  
}

export interface ISaleDetails {
  id_Pastel: string;
  cantidad: number;
  precioPastel: number;
  pastel?: string;
}

export interface ICartItem {
  cake: ICake;
  quantity: number;
  price: number;
}

export interface ICashRegisterAdvance {
  id_Usuario: string;
  usuario: string
  totalAnticipo: number;
  tipoPago: number;
}
