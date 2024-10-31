export interface IUser {
  id: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  phoneNumber: string;
  email: string;
  role: string;
  id_Sucursal?: string;
  token: string;
}

export interface IUserDto {
  id: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  telefono: string;
  correo: string;
  nombreUsuario: string;
  roles: string[];
  id_Sucursal: string;
  sucursal: string;
}