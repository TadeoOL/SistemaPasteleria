import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCashRegisterStore } from '../store/cashRegister';
import { getCashRegisterByUser, createCashRegister } from '../services/cashRegisterService';
import { useAuthStore } from '../../auth/store/authStore';
import InitialFundModal from '../components/modal/InitialFundModal';
import CashRegisterLoader from '../components/CashRegisterLoader';
import { toast } from 'react-toastify';

const CheckoutRegister = () => {
  const { cashRegister, setCashRegister } = useCashRegisterStore();
  const { profile } = useAuthStore();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkCashRegister = async () => {
      if (!cashRegister && profile) {
        try {
          const userCashRegister = await getCashRegisterByUser(profile.id);
          if (userCashRegister) {
            setCashRegister(userCashRegister);
            navigate(`/ventas/caja/${userCashRegister.id}`);
          } else {
            setShowModal(true);
          }
        } catch (error) {
          console.error('Error al obtener la caja del usuario:', error);
          // Manejar el error, tal vez redirigir a una página de error
        } finally {
          setIsLoading(false);
        }
      } else if (cashRegister) {
        navigate(`/ventas/caja/${cashRegister.id}`);
      } else {
        setIsLoading(false);
      }
    };

    checkCashRegister();
  }, [cashRegister, profile, setCashRegister, navigate]);

  const handleCreateCashRegister = async (initialFund: number) => {
    setIsLoading(true);
    try {
      const newRegister = await createCashRegister(initialFund);
      setCashRegister(newRegister);
      navigate(`/ventas/caja/${newRegister.id}`);
    } catch (error) {
      console.error('Error al crear la caja:', error);
      toast.error('Error al crear la caja');
      navigate('/catalogo/almacenes');
    } finally {
      setIsLoading(false);
      setShowModal(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/catalogo/almacenes');
  };

  if (isLoading && !cashRegister) {
    return <CashRegisterLoader />;
  }

  if (showModal) {
    return <InitialFundModal onSubmit={handleCreateCashRegister} onClose={handleCloseModal} />;
  }

  // Este return probablemente nunca se alcanzará, pero lo dejamos por si acaso
  return null;
};

export default CheckoutRegister;
