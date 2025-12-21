import React from 'react';
import { Button } from '@gravity-ui/uikit';
import { Link } from 'react-router-dom';
import styles from './ErrorContent.module.css';

interface ErrorContentProps {
  code: string;
  title: string;
  description: string;
}

export const ErrorContent: React.FC<ErrorContentProps> = ({
  code,
  title,
  description,
}) => {
  return (
    <div className={styles.error__container}>
      <h1 className={styles.error__code}>{code}</h1>
      <h2 className={styles.error__title}>{title}</h2>
      <p className={styles.error__description}>{description}</p>
      <Link to="/">
        <Button view="action" size="xl" width="max">
          Вернуться на главную
        </Button>
      </Link>
    </div>
  );
};
