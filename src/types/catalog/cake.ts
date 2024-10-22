
export interface ICake {
  id: string;
  nombre: string;
  precioCompra: number;
  precioVenta: number;
  almacenPasteles?: any[];
  ventaDetalles?: any[];
  fechaCreacion?: Date;
  fechaModificacion?: Date;
  habilitado?: boolean;
}

