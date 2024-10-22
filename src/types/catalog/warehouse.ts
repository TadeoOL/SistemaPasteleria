import { IBranch } from "./branch";
  

export interface IWarehouse {
  id: string;
  nombre: string;
  descripcion?: string | null;
  id_Sucursal?: string;
  sucursal?: IBranch;
  fechaCreacion?: string;
  fechaModificacion?: string;
  habilitado?: boolean;
}

