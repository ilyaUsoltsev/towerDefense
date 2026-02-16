import {
  fetchUserThunk,
  selectIsLoading,
  selectUser,
} from '../../slices/userSlice';
import { TextInput, Button } from '@gravity-ui/uikit';
import { usePage } from '../../hooks/usePage';
import { PageInitArgs } from '../../routes';
import FormLog from '../../components/FormLog';
import { Field } from 'react-final-form';
import SectionLog from '../../components/SectionLog';
import { useAuth } from '../../hooks/useAuth';
import { LoginRequestData } from '../../api/type';
import Loader from '../../components/Loader';
import ErrorText from '../../components/ErrorText';
import { ROUTE } from '../../constants/ROUTE';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from '../../store';

export const LoginPage = () => {
  const {
    checkLoginUser,
    login,
    oauthLogin,
    redirectToYandexOAuth,
    isLoading,
    error,
  } = useAuth();
  const userData = useSelector(selectUser);
  const [hasAttemptedAuthCheck, setHasAttemptedAuthCheck] = useState(false);
  const [searchParams] = useSearchParams();
  const oauthHandledRef = useRef(false);

  const navigate = useNavigate();

  usePage({ initPage: initLoginPage });

  useEffect(() => {
    const code = searchParams.get('code');
    if (code && !oauthHandledRef.current) {
      oauthHandledRef.current = true;
      oauthLogin(code);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!hasAttemptedAuthCheck) {
      checkLoginUser();
      setHasAttemptedAuthCheck(true);
    }
  }, [checkLoginUser, hasAttemptedAuthCheck]);

  useEffect(() => {
    if (!isLoading && hasAttemptedAuthCheck && userData) {
      navigate(ROUTE.ROOT, { replace: true });
    }
  }, [isLoading, hasAttemptedAuthCheck, userData, navigate]);

  const validate = (values: LoginRequestData) => {
    const errors: Record<string, string> = {};

    if (!values.login) {
      errors.login = 'Поле обязательно для заполнения';
    }

    if (!values.password) {
      errors.password = 'Поле обязательно для заполнения';
    }

    return errors;
  };

  const handleSubmit = (data: Record<string, unknown>) => {
    login(data as LoginRequestData);
    console.log('Валидация');
    console.log('Данные формы:', data);
  };
  return (
    <SectionLog>
      <Loader isLoading={isLoading}></Loader>
      <FormLog
        validate={validate}
        onSubmit={handleSubmit}
        text="Войти"
        titleLink="Нет аккаунта ?"
        hrefLink={ROUTE.REGISTER}>
        <Field name="login">
          {({ input, meta }) => (
            <TextInput
              {...input} // Передаём все пропсы от input (value, onChange и др.)
              size="xl"
              type="text"
              placeholder="Логин"
              validationState={
                meta.error && meta.touched ? 'invalid' : undefined
              }
              errorMessage={meta.touched ? meta.error || '' : ''}
              errorPlacement="outside"
            />
          )}
        </Field>

        <Field name="password">
          {({ input, meta }) => (
            <TextInput
              {...input}
              size="xl"
              type="password"
              placeholder="Пароль"
              validationState={
                meta.error && meta.touched ? 'invalid' : undefined
              }
              errorMessage={meta.touched ? meta.error || '' : ''}
              errorPlacement="outside"
            />
          )}
        </Field>
        <ErrorText>{error}</ErrorText>
      </FormLog>
      <Button
        width="max"
        view="outlined"
        size="xl"
        onClick={redirectToYandexOAuth}
        style={{ maxWidth: 500, width: '100%' }}>
        Войти через Яндекс
      </Button>
    </SectionLog>
  );
};

export const initLoginPage = async ({ dispatch, state }: PageInitArgs) => {
  const user = selectUser(state);
  if (!user) {
    // Только если нет пользователя И не идёт загрузка
    const isLoading = selectIsLoading(state);
    if (!isLoading) {
      return dispatch(fetchUserThunk());
    }
  }
};
