import React, { PropsWithChildren } from 'react';
import styles from './SectionLog.module.css';

const SectionLog: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <section className={styles.login__page}>
      <img
        src="/logoBig.png"
        alt="tower defense"
        className={styles.logo__big}
      />
      {children}
    </section>
  );
};

export default SectionLog;
