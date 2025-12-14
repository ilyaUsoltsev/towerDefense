import { useSelector } from '../../store'
import { fetchUserThunk, selectUser } from '../../slices/userSlice'
import { TextInput } from '@gravity-ui/uikit'
import { usePage } from '../../hooks/usePage'
import { PageInitArgs } from '../../routes'
import FormLog from '../../components/FormLog'
import styles from './Login.module.css'
import { Field } from 'react-final-form'
import { useState } from 'react'
import { Link } from 'react-router-dom'

export const LoginPage = () => {
  const user = useSelector(selectUser)
  const [formErrors, setFormErrors] = useState<Record<string, string> | null>(
    null
  )
  usePage({ initPage: initLoginPage })
  const handleSubmit = (data: Record<string, unknown>) => {
    const errors: Record<string, string> = {}

    if (!data.login) errors.login = 'Поле обязательно для заполнения'
    if (!data.password) errors.password = 'Поле обязательно для заполнения'
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return // Не отправляем форму
    }

    setFormErrors(null)
    console.log('Валидация')
    console.log('Данные формы:', data)
  }
  return (
    <section className={styles.login__page}>
      <img
        src="/logoBig.png"
        alt="tower defence"
        className={styles.logo__big}
      />
      <FormLog onSubmit={handleSubmit} text="Войти" titleLink="Нет аккаунта ?">
        <Field name="login">
          {({ input }) => (
            <TextInput
              {...input} // Передаём все пропсы от input (value, onChange и др.)
              size="xl"
              type="text"
              placeholder="Логин"
              validationState={formErrors?.login ? 'invalid' : undefined}
              errorMessage={formErrors?.login || ''}
              errorPlacement="outside"
            />
          )}
        </Field>

        <Field name="password">
          {({ input }) => (
            <TextInput
              {...input}
              size="xl"
              type="password"
              placeholder="Пароль"
              validationState={formErrors?.password ? 'invalid' : undefined}
              errorMessage={formErrors?.password || ''}
              errorPlacement="outside"
            />
          )}
        </Field>
      </FormLog>
    </section>
  )
}

export const initLoginPage = async ({ dispatch, state }: PageInitArgs) => {
  if (!selectUser(state)) {
    return dispatch(fetchUserThunk())
  }
}
