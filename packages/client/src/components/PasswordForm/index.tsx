import { Form } from 'react-final-form';
import { Button, Card } from '@gravity-ui/uikit';
import { FormField } from '../FormField';
import {
  isNotEmpty,
  hasMinLength,
  VALIDATION_MESSAGES,
} from '../../utils/validation';
import styles from './PasswordForm.module.css';

export const PasswordForm = () => {
  const validatePassword = (values: Record<string, string>) => {
    const errors: Record<string, string> = {};

    if (!isNotEmpty(values.oldPassword)) {
      errors.oldPassword = VALIDATION_MESSAGES.REQUIRED;
    }

    if (!isNotEmpty(values.newPassword)) {
      errors.newPassword = VALIDATION_MESSAGES.REQUIRED;
    } else if (!hasMinLength(values.newPassword, 8)) {
      errors.newPassword = VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH;
    }

    if (!isNotEmpty(values.confirmPassword)) {
      errors.confirmPassword = VALIDATION_MESSAGES.REQUIRED;
    } else if (values.newPassword !== values.confirmPassword) {
      errors.confirmPassword = VALIDATION_MESSAGES.PASSWORDS_NOT_MATCH;
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
            <FormField
              name="oldPassword"
              type="password"
              placeholder="Текущий пароль"
              label="Текущий пароль"
            />

            <FormField
              name="newPassword"
              type="password"
              placeholder="Новый пароль"
              label="Новый пароль"
            />

            <FormField
              name="confirmPassword"
              type="password"
              placeholder="Подтвердите новый пароль"
              label="Подтверждение пароля"
            />

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
