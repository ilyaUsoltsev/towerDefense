import { useState, useRef } from 'react';
import { Form, Field } from 'react-final-form';
import { TextInput, Button, Card, Avatar, User } from '@gravity-ui/uikit';
import styles from './Profile.module.css';
import { useSelector } from '../../store';
import { fetchUserThunk, selectUser } from '../../slices/userSlice';
import { usePage } from '../../hooks/usePage';
import { PageInitArgs } from '../../routes';

export const ProfilePage = () => {
  const user = useSelector(selectUser);
  usePage({ initPage: initProfilePage });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handlePasswordSubmit = (data: Record<string, unknown>) => {
    const passwordData = {
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    };
    console.log('Данные изменения пароля:', passwordData);
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
      ];
      if (!allowedTypes.includes(file.type)) {
        alert('Допустимы только файлы JPEG, JPG, PNG, GIF, WebP');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append('avatar', file);

      console.log('Данные аватара:', {
        file: file.name,
        size: file.size,
        type: file.type,
      });
    }
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
    <div className={styles.profilePage}>
      <h1 className={styles.title}>Профиль пользователя</h1>

      <div className={styles.content}>
        <Card className={styles.card}>
          <h2 className={styles.cardTitle}>Аватар</h2>
          <div className={styles.avatarSection}>
            <div className={styles.avatarWrapper}>
              {avatarPreview || user?.avatar ? (
                <Avatar
                  imgUrl={avatarPreview || user?.avatar || ''}
                  size="xl"
                  className={styles.avatar}
                />
              ) : (
                <User
                  name={user?.display_name || user?.login || 'User'}
                  size="xl"
                />
              )}
            </div>
            <div className={styles.avatarActions}>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handleAvatarChange}
                className={styles.fileInput}
              />
              <Button
                view="action"
                size="l"
                className={styles.uploadButton}
                onClick={() => fileInputRef.current?.click()}>
                Загрузить аватар
              </Button>
              <p className={styles.hint}>
                Допустимы: JPEG, JPG, PNG, GIF, WebP
              </p>
            </div>
          </div>
        </Card>

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
      </div>
    </div>
  );
};

export const initProfilePage = async ({ dispatch, state }: PageInitArgs) => {
  if (!selectUser(state)) {
    return dispatch(fetchUserThunk());
  }
};
