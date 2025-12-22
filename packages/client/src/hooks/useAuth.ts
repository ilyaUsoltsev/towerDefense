import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import AuthApi from '../api/auth';
import { CreateUser, LoginRequestData, User, APIError } from '../api/type';
import { ROUTE } from '../constants/ROUTE';
import { isApiError } from '../api/isApiError';
import { useDispatch } from '../store';
import { setUser } from '../slices/userSlice';

export const useAuth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const authApi = new AuthApi();

  // Общий обработчик ошибок API
  const handleApiError = (error: APIError): string => {
    if (error.status === 401) return 'Неверный логин или пароль';
    if (error.status === 400) return ''; // Обрабатывается отдельно
    return error.reason || error.message || 'Произошла ошибка';
  };

  // Обновление глобального состояния и локального state
  const updateUserState = (user: User | null) => {
    dispatch(setUser(user));
  };

  // Проверка авторизации пользователя
  const checkLoginUser = async (throwOnError = false): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await authApi.me();

      if (isApiError(result)) {
        if (throwOnError) throw result;

        if (result.status === 401) {
          updateUserState(null);
          return false;
        }

        setError('Ошибка проверки авторизации');
        return false;
      }

      updateUserState(result as User);
      return true;
    } catch (err) {
      if (throwOnError) throw err;
      setError('Ошибка проверки авторизации');
      updateUserState(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Вход в систему
  const login = async (model: LoginRequestData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await authApi.login(model);

      if (isApiError(result)) {
        const errorMsg = handleApiError(result as APIError);
        if (result.status === 400) {
          navigate(ROUTE.ROOT, { replace: true });
          return;
        }
        setError(errorMsg);
        return;
      }
      navigate(ROUTE.ROOT, { replace: true });
    } catch (err) {
      setError('Произошла ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  // Регистрация
  const register = async (model: CreateUser) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await authApi.create(model);

      if (isApiError(result)) {
        setError(handleApiError(result as APIError));
        return;
      }

      navigate(ROUTE.ROOT, { replace: true });
    } catch {
      setError('Произошла ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  // Выход из системы
  const logout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await authApi.logout();

      if (isApiError(result)) {
        setError(handleApiError(result as APIError));
        return;
      }

      updateUserState(null);
      navigate(ROUTE.LOGIN, { replace: true });
    } catch {
      setError('Ошибка при выходе из системы');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    register,
    logout,
    checkLoginUser,
    isLoading,
    error,
  };
};
