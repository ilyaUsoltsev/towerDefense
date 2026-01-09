import { useNavigate } from 'react-router-dom';
import { CreateUser, LoginRequestData, APIError } from '../api/type';
import { ROUTE } from '../constants/ROUTE';
import { useDispatch, useSelector } from '../store';
import {
  checkUserThunk,
  loginThunk,
  logoutThunk,
  registerThunk,
  selectError,
  selectIsLoading,
} from '../slices/userSlice';

export const useAuth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Состояние из стора (больше не управляем вручную)
  const isLoading: boolean = useSelector(selectIsLoading);
  const error = useSelector(selectError);

  const checkLoginUser = async (): Promise<boolean> => {
    try {
      const result = await dispatch(checkUserThunk());
      // result.payload может быть null (если 401) или User
      return result.payload !== null;
    } catch {
      return false;
    }
  };

  /**
   * Вход в систему
   * @param model — данные для авторизации (email, password)
   */
  const login = async (model: LoginRequestData) => {
    const result = await dispatch(loginThunk(model));

    if (result.meta.requestStatus === 'fulfilled') {
      navigate(ROUTE.ROOT, { replace: true });
    }
    // Если ошибка — она уже сохранена в сторе (selectError)
  };

  /**
   * Регистрация нового пользователя
   * @param model — данные пользователя для регистрации
   */
  const register = async (model: CreateUser) => {
    const result = await dispatch(registerThunk(model));

    if (result.meta.requestStatus === 'fulfilled') {
      navigate(ROUTE.ROOT, { replace: true });
    }
    // Ошибка также попадает в стор через extraReducers
  };

  /**
   * Выход из системы
   */
  const logout = async () => {
    await dispatch(logoutThunk());
    navigate(ROUTE.LOGIN, { replace: true });
  };

  return {
    login,
    register,
    logout,
    checkLoginUser,
    isLoading,
    error, // Теперь это состояние из стора
  };
};
