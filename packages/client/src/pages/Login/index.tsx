import { useSelector } from '../../store'
import { fetchUserThunk, selectUser } from '../../slices/userSlice'
import { usePage } from '../../hooks/usePage'
import { PageInitArgs } from '../../routes'
import FormLog from '../../components/FormLog'
import styles from './Login.module.css'

export const LoginPage = () => {
  const user = useSelector(selectUser)
  usePage({ initPage: initLoginPage })
  const handleSubmit = (data: Record<string, string>) => {
    console.log('Валидация')
    console.log('Данные формы:', data)
  }
  const loginSpec = {
    type: 'object',
    properties: {
      username: {
        type: 'string',
        viewSpec: {
          type: 'base',
          layout: 'row',
          layoutTitle: 'Логин',
        },
      },
      password: {
        type: 'string',
        viewSpec: {
          type: 'base',
          layout: 'row',
          layoutTitle: 'Пароль',
        },
      },
    },
  }

  // Конфигурация полей (config)
  const loginConfig = {
    fields: {
      username: {
        component: 'input',
        props: {
          type: 'text',
          placeholder: 'Введите логин',
        },
      },
      password: {
        component: 'input',
        props: {
          type: 'password',
          placeholder: 'Введите пароль',
        },
      },
    },
  }
  return (
    <section className={styles.login__page}>
      <img
        src="/logoBig.png"
        alt="tower defence"
        className={styles.logo__big}
      />
      <FormLog
        onSubmit={handleSubmit}
        spec={loginSpec}
        config={loginConfig}
        text="Войти"
      />
    </section>
  )
}

export const initLoginPage = async ({ dispatch, state }: PageInitArgs) => {
  if (!selectUser(state)) {
    return dispatch(fetchUserThunk())
  }
}
