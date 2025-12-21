import { Form, Field } from 'react-final-form';
import { TextInput, Button, Card } from '@gravity-ui/uikit';
import styles from './PasswordForm.module.css';

export const PasswordForm = () => {
  const validatePassword = (values: Record<string, unknown>) => {
    const errors: Record<string, string> = {};

    if (!values.oldPassword) {
      errors.oldPassword = 'Поле обязательно для заполнения';
    }

    if (!values.newPassword) {
      errors.newPassword = 'Поле обязательно для заполнения';
    } else if ((values.newPassword as string).length < 8) {
      errors.newPassword = 'Пароль должен быть не менее 8 символов';
    }

    if (!values.confirmPassword) {
      errors.confirmPassword = 'Поле обязательно для заполнения';
    } else if (values.newPassword !== values.confirmPassword) {
      errors.confirmPassword = 'Пароли не совпадают';
    }

    return errors;
  };

  const handlePasswordSubmit = (data: Record<string, unknown>) => {
    const passwordData = {
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    };
    console.log('Данные изменения пароля:', passwordData);
  };

  return (
    <Card className={styles.card}>
      <h2 className={styles.cardTitle}>Изменение пароля</h2>
      <Form onSubmit={handlePasswordSubmit} validate={validatePassword}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit} className={styles.form}>
            <Field name="oldPassword">
              {({ input, meta }) => (
                <TextInput
                  {...input}
                  size="l"
                  type="password"
                  placeholder="Текущий пароль"
                  label="Текущий пароль"
                  validationState={
                    meta.error && meta.touched ? 'invalid' : undefined
                  }
                  errorMessage={meta.touched ? meta.error || '' : ''}
                  errorPlacement="outside"
                />
              )}
            </Field>

            <Field name="newPassword">
              {({ input, meta }) => (
                <TextInput
                  {...input}
                  size="l"
                  type="password"
                  placeholder="Новый пароль"
                  label="Новый пароль"
                  validationState={
                    meta.error && meta.touched ? 'invalid' : undefined
                  }
                  errorMessage={meta.touched ? meta.error || '' : ''}
                  errorPlacement="outside"
                />
              )}
            </Field>

            <Field name="confirmPassword">
              {({ input, meta }) => (
                <TextInput
                  {...input}
                  size="l"
                  type="password"
                  placeholder="Подтвердите новый пароль"
                  label="Подтверждение пароля"
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
              Изменить пароль
            </Button>
          </form>
        )}
      </Form>
    </Card>
  );
};
