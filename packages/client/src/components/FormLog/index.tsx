import React from 'react'
import { Form } from 'react-final-form'
import { DynamicField, Spec } from '@gravity-ui/dynamic-forms' // Импортируем Spec
import styles from './FormLog.module.css'
import { Button } from '@gravity-ui/uikit'
interface FormLogProps {
  onSubmit: (values: Record<string, unknown>) => void | Promise<void>
  spec: any // Теперь строго по типу библиотеки
  config: any
  text: string
  [key: string]: any
}

function isObjectSpec(spec: Spec): spec is Spec & {
  type: 'object'
  properties: Record<string, Spec>
} {
  return spec.type === 'object' && !!spec.properties
}

const FormLog: React.FC<FormLogProps> = ({
  onSubmit,
  spec,
  config,
  text,
  ...rest
}) => {
  const values = {
    name: 'John Doe',
    age: 30,
    license: true,
  }
  return (
    <Form onSubmit={onSubmit}>
      {({ handleSubmit }) => (
        <form onSubmit={handleSubmit} className={styles.form} {...rest}>
          <DynamicField name="dynamicfield" spec={spec} config={config} />
          <Button
            width="max"
            view="action"
            size="xl"
            type="submit"
            className={styles.login__button}>
            {text}
          </Button>
        </form>
      )}
    </Form>
  )
}

export default FormLog
