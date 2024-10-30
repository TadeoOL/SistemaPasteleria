import { IBranch } from "../catalog/branch";

export interface IRequest {
  id_SolicitudEntrega: string;
  id_Sucursal: string;
  id_Almacen: string;
  estatus:number;
  folio: string;
  pasteles?: ICakeRequest[];
  sucursal?: IBranch;
  productos?: IProductRequest[];
  usuarioSolicito?: string;
  usuarioAutorizo?: string;
  fechaSolicitud?: string;
  
}

export interface ICakeRequest {
  id_Pastel: string;
  cantidad: number;
  nombre: string;
}

export interface IProductRequest {
  id_Producto: string;
  cantidad: number;
  nombre: string;
}

export interface ICreateRequest {
  pasteles: ICakeRequest[];
  productos: IProductRequest[];
  id_Sucursal: string;
  id_Almacen?: string;
}

