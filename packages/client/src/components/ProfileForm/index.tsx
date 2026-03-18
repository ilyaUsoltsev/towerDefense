import { Button, Card } from '@gravity-ui/uikit';
import { Form } from 'react-final-form';
import { User } from '../../api/type';
import {
  isNotEmpty,
  isValidEmail,
  isValidPhone,
  VALIDATION_MESSAGES,
} from '../../utils/validation';
import { FormField } from '../FormField';
import styles from './ProfileForm.module.css';

interface ProfileFormProps {
  user: User | null;
}

export const ProfileForm = ({ user }: ProfileFormProps) => {
  const validateProfile = (values: Record<string, string>) => {
    const errors: Record<string, string> = {};

    if (!isNotEmpty(values.first_name)) {
      errors.first_name = VALIDATION_MESSAGES.REQUIRED;
    }

    if (!isNotEmpty(values.second_name)) {
      errors.second_name = VALIDATION_MESSAGES.REQUIRED;
    }

    if (!isNotEmpty(values.login)) {
      errors.login = VALIDATION_MESSAGES.REQUIRED;
    }

    if (!isNotEmpty(values.email)) {
      errors.email = VALIDATION_MESSAGES.REQUIRED;
    } else if (!isValidEmail(values.email)) {
      errors.email = VALIDATION_MESSAGES.INVALID_EMAIL;
    }

    if (!isNotEmpty(values.phone)) {
      errors.phone = VALIDATION_MESSAGES.REQUIRED;
    } else if (!isValidPhone(values.phone)) {
      errors.phone = VALIDATION_MESSAGES.INVALID_PHONE;
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
            <FormField
              name="first_name"
              type="text"
              placeholder="Имя"
              label="Имя"
            />

            <FormField
              name="second_name"
              type="text"
              placeholder="Фамилия"
              label="Фамилия"
            />

            <FormField
              name="display_name"
              type="text"
              placeholder="Отображаемое имя"
              label="Отображаемое имя"
            />

            <FormField
              name="login"
              type="text"
              placeholder="Логин"
              label="Логин"
            />

            <FormField
              name="email"
              type="email"
              placeholder="Email"
              label="Email"
            />

            <FormField
              name="phone"
              type="tel"
              placeholder="+79001001100"
              label="Телефон"
            />

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
