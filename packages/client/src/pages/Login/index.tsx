import { useSelector } from '../../store'
import { fetchUserThunk, selectUser } from '../../slices/userSlice'
import { usePage } from '../../hooks/usePage'
import { PageInitArgs } from '../../routes'
import Input from '../../components/Input'
import { Form } from '../../components/Form'
import ButtonLog from '../../components/ButtonLog'
import styles from './Login.module.css'

export const LoginPage = () => {
  const user = useSelector(selectUser)
  usePage({ initPage: initLoginPage })
  const handleSubmit = (data: Record<string, string>) => {
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
      <Form onSubmit={handleSubmit}>
        <Input
          name="login"
          autocomplete="login"
          value=""
          placeholder="Логин"
          type="login"
        />
        <Input
          name="password"
          autocomplete="password"
          value=""
          placeholder="Пароль"
          type="password"
        />
        <ButtonLog text="Отправить" />
      </Form>
    </section>
  )
}

export const initLoginPage = async ({ dispatch, state }: PageInitArgs) => {
  if (!selectUser(state)) {
    return dispatch(fetchUserThunk())
  }
}
