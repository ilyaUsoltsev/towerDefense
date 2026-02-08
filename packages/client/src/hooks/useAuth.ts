import { useNavigate } from 'react-router-dom';
import {
  CreateUser,
  LoginRequestData,
  APIError,
  OauthServiceIdResponse,
} from '../api/type';
import OauthApi from '../api/oauth';
import { isApiError } from '../api/isApiError';
import { ROUTE } from '../constants/ROUTE';
import { useDispatch, useSelector } from '../store';
import {
  checkUserThunk,
  loginThunk,
  logoutThunk,
  oauthLoginThunk,
  registerThunk,
  selectError,
  selectIsLoading,
} from '../slices/userSlice';

const oauthApi = new OauthApi();

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

  const oauthLogin = async (code: string) => {
    const redirectUri = window.location.origin;
    const result = await dispatch(oauthLoginThunk({ code, redirectUri }));

    if (result.meta.requestStatus === 'fulfilled') {
      navigate(ROUTE.ROOT, { replace: true });
    }
  };

  const redirectToYandexOAuth = async () => {
    const redirectUri = window.location.origin;
    const result = await oauthApi.getServiceId(redirectUri);

    if (isApiError(result)) {
      return;
    }

    const serviceId = (result as OauthServiceIdResponse).service_id;
    window.location.href = `https://oauth.yandex.ru/authorize?response_type=code&client_id=${serviceId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}`;
  };

  return {
    login,
    register,
    logout,
    checkLoginUser,
    oauthLogin,
    redirectToYandexOAuth,
    isLoading,
    error,
  };
};
