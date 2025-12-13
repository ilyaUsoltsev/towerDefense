import React, { useState, ChangeEvent } from 'react'
import { Button } from '@gravity-ui/uikit'
import styles from './ButtonLog.module.css'

interface ButtonLogProps {
  text: string
  onClick?: () => void // обязательно передаём извне
  [key: string]: any // остальные пропсы Gravity UI
}

const ButtonLog: React.FC<ButtonLogProps> = ({ text, onClick, ...rest }) => {
  return (
    <Button
      width="max"
      view="action"
      size="xl"
      type="submit"
      className={styles.login__button}>
      {text}
    </Button>
  )
}

export default ButtonLog
