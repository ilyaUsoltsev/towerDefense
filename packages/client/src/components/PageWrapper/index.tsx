import { FC, PropsWithChildren } from 'react';
import { Helmet } from 'react-helmet';

import Header from '../Header';

import styles from './PageWrapper.module.css';

const PageWrapper: FC<
  PropsWithChildren & { description: string; withHeader?: boolean }
> = ({ description, withHeader = true, children }) => (
  <div className={styles.page}>
    <Helmet>
      <meta charSet="utf-8" />
      <title>Tower Defense</title>
      <meta name="description" content={description} />
    </Helmet>
    {withHeader && <Header />}
    {children}
  </div>
);

export default PageWrapper;
