import { Form, Field } from 'react-final-form';
import { TextInput, Button, Card } from '@gravity-ui/uikit';
import { User } from '../../slices/userSlice';
import styles from './ProfileForm.module.css';

interface ProfileFormProps {
  user: User | null;
}

export const ProfileForm = ({ user }: ProfileFormProps) => {
  const validateProfile = (values: Record<string, unknown>) => {
    const errors: Record<string, string> = {};

    if (!values.first_name) {
      errors.first_name = 'Поле обязательно для заполнения';
    }

    if (!values.second_name) {
      errors.second_name = 'Поле обязательно для заполнения';
    }

    if (!values.login) {
      errors.login = 'Поле обязательно для заполнения';
    }

    if (!values.email) {
      errors.email = 'Поле обязательно для заполнения';
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email as string)
    ) {
      errors.email = 'Некорректный email';
    }

    if (!values.phone) {
      errors.phone = 'Поле обязательно для заполнения';
    } else if (!/^\+?[0-9]{10,15}$/.test(values.phone as string)) {
      errors.phone = 'Некорректный номер телефона';
    }

    return errors;
  };

  const handleProfileSubmit = (data: Record<string, unknown>) => {
    const profileData = {
      first_name: data.first_name,
      second_name: data.second_name,
      display_name: data.display_name,
      login: data.login,
      email: data.email,
      phone: data.phone,
    };
    console.log('Данные профиля:', profileData);
  };

  const initialProfileValues = {
    first_name: user?.first_name || '',
    second_name: user?.second_name || '',
    display_name: user?.display_name || '',
    login: user?.login || '',
    email: user?.email || '',
    phone: user?.phone || '',
  };

  return (
    <Card className={styles.card}>
      <h2 className={styles.cardTitle}>Данные профиля</h2>
      <Form
        onSubmit={handleProfileSubmit}
        validate={validateProfile}
        initialValues={initialProfileValues}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit} className={styles.form}>
            <Field name="first_name">
              {({ input, meta }) => (
                <TextInput
                  {...input}
                  size="l"
                  type="text"
                  placeholder="Имя"
                  label="Имя"
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
                  {...input}
                  size="l"
                  type="text"
                  placeholder="Фамилия"
                  label="Фамилия"
                  validationState={
                    meta.error && meta.touched ? 'invalid' : undefined
                  }
                  errorMessage={meta.touched ? meta.error || '' : ''}
                  errorPlacement="outside"
                />
              )}
            </Field>

            <Field name="display_name">
              {({ input, meta }) => (
                <TextInput
                  {...input}
                  size="l"
                  type="text"
                  placeholder="Отображаемое имя"
                  label="Отображаемое имя"
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
                  {...input}
                  size="l"
                  type="text"
                  placeholder="Логин"
                  label="Логин"
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
                  {...input}
                  size="l"
                  type="email"
                  placeholder="Email"
                  label="Email"
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
                  size="l"
                  type="tel"
                  placeholder="+79001001100"
                  label="Телефон"
                  validationState={
                    meta.error && meta.touched ? 'invalid' : undefined
                  }
                  errorMessage={meta.touched ? meta.error || '' : ''}
                  errorPlacement="outside"
                />
              )}
            </Field>

            <Button
              width="max"
              view="action"
              size="l"
              type="submit"
              className={styles.submitButton}>
              Сохранить изменения
            </Button>
          </form>
        )}
      </Form>
    </Card>
  );
};
