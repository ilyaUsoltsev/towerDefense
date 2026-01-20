import { PropsWithChildren, useEffect, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useSelector } from 'react-redux';
import {
  selectUser,
  selectIsLoading,
  selectError,
} from '../../slices/userSlice';
import { ROUTE } from '../../constants/ROUTE';
import Loader from '../Loader';

export const ProtectedRoute: React.FC<PropsWithChildren> = ({ children }) => {
  const location = useLocation();
  const { checkLoginUser } = useAuth();

  // Берём состояние из глобального стора
  const userData = useSelector(selectUser);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const checkedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!checkedRef.current && userData === null && !isLoading && !error) {
      checkedRef.current = true;
      checkLoginUser();
    }
  }, [userData, isLoading, error]);

  // Пока идёт загрузка — показываем Loader
  if (isLoading) {
    return <Loader isLoading={true} />;
  }

  // Если пользователь не авторизован (нет данных)
  if (!userData || error) {
    return (
      <Navigate to={ROUTE.LOGIN} state={{ from: location.pathname }} replace />
    );
  }

  // Всё ок — отдаём дочерние компоненты
  return children as JSX.Element;
};
