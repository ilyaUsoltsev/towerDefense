import React, { useState, useRef, FormEvent } from 'react'
import styles from './Form.module.css'

interface FormProps {
  onSubmit: (data: Record<string, string>) => void
  children: React.ReactNode
  className?: string
}

export const Form: React.FC<FormProps> = ({
  onSubmit,
  children,
  className,
}) => {
  const formRef = useRef<HTMLFormElement>(null)
  const [values, setValues] = useState<Record<string, string>>({})

  const handleFieldChange = (name: string, value: string) => {
    setValues(prev => ({
      ...prev,
      [name]: value,
    }))
    console.log('Может валидация')
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit(values)
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className={styles.form}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            onChange: (value: string) =>
              handleFieldChange(child.props.name, value),
            value: values[child.props.name] || '',
          })
        }
        return child
      })}
    </form>
  )
}

export default Form
