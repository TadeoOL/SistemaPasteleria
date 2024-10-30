import { Navigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../../auth/store/authStore';

const RequestView = () => {
  const { branchId } = useParams();
  const user = useAuthStore((state) => state.profile);
  return <Navigate to={`/solicitudes/${branchId || user?.id_Sucursal}`} />;
};

export default RequestView;
