import React, { useState, ChangeEvent } from 'react'
import { TextInput } from '@gravity-ui/uikit'

type ValidateFunction = (value: string) => string | null

interface InputProps {
  name: string
  value: string // обязательно передаём извне
  onChange?: (value: string) => void // обязательно передаём извне
  validate?: ValidateFunction
  [key: string]: any // остальные пропсы Gravity UI
}

const Input: React.FC<InputProps> = ({
  name,
  value,
  onChange,
  validate,
  ...rest
}) => {
  const [error, setError] = useState<string | null>(null)

  React.useEffect(() => {
    if (validate) {
      setError(validate(value))
    }
  }, [value, validate])
  // Валидируем при каждом изменении
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value
    if (onChange) onChange(newValue) // передаём наверх
    if (validate) setError(validate(newValue))
  }

  return (
    <TextInput
      size="xl"
      name={name}
      value={value}
      onChange={handleChange}
      validationState={error ? 'invalid' : undefined}
      errorMessage={error || ''}
      errorPlacement="outside"
      {...rest}
    />
  )
}

export default Input
