import { useSelector } from '../../store';
import { fetchUserThunk, selectUser } from '../../slices/userSlice';
import { TextInput } from '@gravity-ui/uikit';
import { usePage } from '../../hooks/usePage';
import { PageInitArgs } from '../../routes';
import FormLog from '../../components/FormLog';
import styles from './Register.module.css';
import { Field } from 'react-final-form';

export const RegisterPage = () => {
  const user = useSelector(selectUser);
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
    console.log('Валидация');
    console.log('Данные формы:', data);
  };
  return (
    <section className={styles.login__page}>
      <img
        src="/logoBig.png"
        alt="tower defence"
        className={styles.logo__big}
      />
      <FormLog
        validate={validate}
        onSubmit={handleSubmit}
        text="Регистрация"
        titleLink="Уже есть аккаунт ?">
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
      </FormLog>
    </section>
  );
};

export const initRegisterPage = async ({ dispatch, state }: PageInitArgs) => {
  if (!selectUser(state)) {
    return dispatch(fetchUserThunk());
  }
};
