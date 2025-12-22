import { fetchUserThunk, selectUser } from '../../slices/userSlice';
import { TextInput } from '@gravity-ui/uikit';
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
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from '../../store';

export const LoginPage = () => {
  const { checkLoginUser, login, isLoading, error } = useAuth();
  const userData = useSelector(selectUser);
  const [hasAttemptedAuthCheck, setHasAttemptedAuthCheck] = useState(false);
  // Читаем данные пользователя из глобального state

  const navigate = useNavigate(); // Hook для навигации

  // Читаем данные пользователя из глобального state
  usePage({ initPage: initLoginPage });

  useEffect(() => {
    if (!hasAttemptedAuthCheck) {
      checkLoginUser(); // Инициируем проверку
      setHasAttemptedAuthCheck(true);
    }
  }, [checkLoginUser, hasAttemptedAuthCheck]);

  useEffect(() => {
    if (!isLoading && hasAttemptedAuthCheck && userData) {
      navigate(ROUTE.ROOT, { replace: true });
    }
  }, [isLoading, hasAttemptedAuthCheck, userData, navigate]);

  if (isLoading || !hasAttemptedAuthCheck) {
    return <Loader isLoading={isLoading} />;
  }

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
    </SectionLog>
  );
};

export const initLoginPage = async ({ dispatch, state }: PageInitArgs) => {
  if (!selectUser(state)) {
    return dispatch(fetchUserThunk());
  }
};
