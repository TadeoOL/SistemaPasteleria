interface IProduct {
  id: string;
  nombre: string;
  precioCompra: number;
  fechaCreacion?: Date;
  fechaModificacion?: Date;
  habilitado?: boolean;
}

export default IProduct;