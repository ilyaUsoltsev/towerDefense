import React from 'react'
import { Form } from 'react-final-form'
import styles from './FormLog.module.css'
import { Button, Link } from '@gravity-ui/uikit'

interface FormLogProps {
  onSubmit: (values: Record<string, unknown>) => void | Promise<void>
  text: string
  children: React.ReactNode
  titleLink?: string
  hrefLink?: string
  [key: string]: any
}

const FormLog: React.FC<FormLogProps> = ({
  onSubmit,
  text,
  children,
  titleLink,
  hrefLink,
  ...rest
}) => {
  return (
    <Form onSubmit={onSubmit} {...rest}>
      {({ handleSubmit }) => (
        <form onSubmit={handleSubmit} className={styles.form}>
          {children}
          <Button
            width="max"
            view="action"
            size="xl"
            type="submit"
            className={styles.login__button}>
            {text}
          </Button>
          <Link href={hrefLink || ''}> {titleLink} </Link>
        </form>
      )}
    </Form>
  )
}

export default FormLog
