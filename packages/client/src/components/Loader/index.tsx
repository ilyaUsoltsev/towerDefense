import React from 'react';
import styles from './Loader.module.css';
import { Spin } from '@gravity-ui/uikit';

interface LoaderProps {
  isLoading: boolean;
}

const Loader: React.FC<LoaderProps> = ({ isLoading }) => {
  if (!isLoading) {
    return null;
  }

  return (
    <section className={styles.loader__back}>
      <Spin size="xl" />
    </section>
  );
};

export default Loader;
