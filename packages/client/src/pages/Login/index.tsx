import { useSelector } from '../../store';
import { fetchUserThunk, selectUser } from '../../slices/userSlice';
import { TextInput } from '@gravity-ui/uikit';
import { usePage } from '../../hooks/usePage';
import { PageInitArgs } from '../../routes';
import FormLog from '../../components/FormLog';
import { Field } from 'react-final-form';
import SectionLog from '../../components/SectionLog';

export const LoginPage = () => {
  const user = useSelector(selectUser);
  usePage({ initPage: initLoginPage });
  const validate = (values: Record<string, unknown>) => {
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
    console.log('Валидация');
    console.log('Данные формы:', data);
  };
  return (
    <SectionLog>
      <FormLog
        validate={validate}
        onSubmit={handleSubmit}
        text="Войти"
        titleLink="Нет аккаунта ?">
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
      </FormLog>
    </SectionLog>
  );
};

export const initLoginPage = async ({ dispatch, state }: PageInitArgs) => {
  if (!selectUser(state)) {
    return dispatch(fetchUserThunk());
  }
};
