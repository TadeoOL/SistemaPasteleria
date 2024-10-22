import axios from "../../../utils/axios";
const apiUrl = "/api/Usuario";

export const login = async (username: string, password: string) => {
  const response = await axios.post(`${apiUrl}/iniciar-sesion`, {
    nombreUsuario: username,
    contraseña: password,
  });
  return response.data;
};
