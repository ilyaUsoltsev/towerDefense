import { PropsWithChildren, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useSelector } from 'react-redux';
import { selectUser } from '../../slices/userSlice';
import { ROUTE } from '../../constants/ROUTE';
import Loader from '../Loader';

export const ProtectedRoute: React.FC<PropsWithChildren> = ({ children }) => {
  const location = useLocation();
  const { checkLoginUser, isLoading } = useAuth();

  // Читаем данные пользователя из глобального state
  const userData = useSelector(selectUser);

  // Флаг: была ли попытка проверки
  const [hasAttemptedAuthCheck, setHasAttemptedAuthCheck] = useState(false);

  useEffect(() => {
    // Если ещё не проверяли и нет загрузки — запускаем проверку
    if (!hasAttemptedAuthCheck && !isLoading) {
      setHasAttemptedAuthCheck(true);
      checkLoginUser();
    }
  }, [hasAttemptedAuthCheck, isLoading, checkLoginUser]);

  // Пока идёт загрузка или ещё не было проверки — показываем Loader
  if (isLoading || !hasAttemptedAuthCheck) {
    return <Loader isLoading={true} />;
  }

  // Если проверка завершена, но userData отсутствует — редирект
  if (!userData) {
    return <Navigate to={ROUTE.LOGIN} state={{ from: location }} replace />;
  }

  // Всё ок — отдаём дочерние компоненты
  return children as JSX.Element;
};
