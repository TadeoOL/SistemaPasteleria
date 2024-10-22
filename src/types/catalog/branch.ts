export interface IBranch {
  id: string;
  nombre: string;
  descripcion?: string | null;
  almacenes?: any | null;
  sucursalUsuarios?: any | null;
  fechaCreacion?: string;
  fechaModificacion?: string;
  habilitado?: boolean;
  }