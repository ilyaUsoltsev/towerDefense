import React from 'react';
import styles from './SectionLog.module.css';

interface SectionLogProps {
  children: React.ReactNode;
}

const SectionLog: React.FC<SectionLogProps> = ({ children }) => {
  return (
    <section className={styles.login__page}>
      <img
        src="/logoBig.png"
        alt="tower defence"
        className={styles.logo__big}
      />
      {children}
    </section>
  );
};

export default SectionLog;
