import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../services/auth';
import { useSelector } from 'react-redux';
import { selectUser } from '../../slices/userSlice'; // Путь к селектору

export interface ProtectedRouteProps {
  children: JSX.Element;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  const { checkLoginUser, isLoading } = useAuth();

  // Читаем данные пользователя из глобального state
  const userData = useSelector(selectUser);

  // Автоматически проверяем авторизацию при mount или если userData отсутствует
  useEffect(() => {
    if (userData === null && !isLoading) {
      checkLoginUser();
    }
  }, [userData, isLoading, checkLoginUser]);

  // Пока идёт загрузка — показываем спиннер (или null)
  if (isLoading) {
    return <div>Загрузка...</div>; // Или спиннер
  }

  // Если пользователь не авторизован — редирект на логин
  if (!userData) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Всё ок — отдаём дочерние компоненты
  return children;
};
