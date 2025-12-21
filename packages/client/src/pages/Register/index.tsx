import { fetchUserThunk, selectUser } from '../../slices/userSlice';
import { TextInput } from '@gravity-ui/uikit';
import { usePage } from '../../hooks/usePage';
import { PageInitArgs } from '../../routes';
import FormLog from '../../components/FormLog';
import { Field } from 'react-final-form';
import SectionLog from '../../components/SectionLog';
import { useAuth } from '../../services/auth';
import { CreateUser } from '../../api/type';
import Loader from '../../components/Loader';
import ErrorText from '../../components/ErrorText';
import { ROUTE } from '../../constants/ROUTE';

export const RegisterPage = () => {
  const { register, isLoading, error } = useAuth();
  usePage({ initPage: initRegisterPage });
  const validate = (values: Record<string, unknown>) => {
    const errors: Record<string, string> = {};

    if (!values.first_name) {
      errors.login = 'Поле обязательно для заполнения';
    }
    if (!values.second_name) {
      errors.password = 'Поле обязательно для заполнения';
    }
    if (!values.login) {
      errors.login = 'Поле обязательно для заполнения';
    }

    if (!values.email) {
      errors.password = 'Поле обязательно для заполнения';
    }
    if (!values.password) {
      errors.login = 'Поле обязательно для заполнения';
    }

    if (!values.phone) {
      errors.password = 'Поле обязательно для заполнения';
    }

    return errors;
  };

  const handleSubmit = (data: Record<string, unknown>) => {
    register(data as CreateUser);
    console.log('Валидация');
    console.log('Данные формы:', data);
  };
  return (
    <SectionLog>
      <Loader isLoading={isLoading}></Loader>
      <FormLog
        validate={validate}
        onSubmit={handleSubmit}
        text="Регистрация"
        titleLink="Уже есть аккаунт ?"
        hrefLink={ROUTE.LOGIN}>
        <Field name="first_name">
          {({ input, meta }) => (
            <TextInput
              {...input} // Передаём все пропсы от input (value, onChange и др.)
              size="xl"
              type="text"
              placeholder="Имя"
              validationState={
                meta.error && meta.touched ? 'invalid' : undefined
              }
              errorMessage={meta.touched ? meta.error || '' : ''}
              errorPlacement="outside"
            />
          )}
        </Field>

        <Field name="second_name">
          {({ input, meta }) => (
            <TextInput
              {...input} // Передаём все пропсы от input (value, onChange и др.)
              size="xl"
              type="text"
              placeholder="Фамилия"
              validationState={
                meta.error && meta.touched ? 'invalid' : undefined
              }
              errorMessage={meta.touched ? meta.error || '' : ''}
              errorPlacement="outside"
            />
          )}
        </Field>

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

        <Field name="email">
          {({ input, meta }) => (
            <TextInput
              {...input} // Передаём все пропсы от input (value, onChange и др.)
              size="xl"
              type="email"
              placeholder="E-mail"
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
        <Field name="phone">
          {({ input, meta }) => (
            <TextInput
              {...input}
              size="xl"
              type="tel"
              placeholder="Телефон"
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

export const initRegisterPage = async ({ dispatch, state }: PageInitArgs) => {
  if (!selectUser(state)) {
    return dispatch(fetchUserThunk());
  }
};
