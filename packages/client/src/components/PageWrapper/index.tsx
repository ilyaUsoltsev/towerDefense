import { FC, PropsWithChildren } from 'react';
import styled from 'styled-components';

import Header from '../Header';
import { Helmet } from 'react-helmet';

const Page = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const PageWrapper: FC<
  PropsWithChildren & { description: string; withHeader?: boolean }
> = ({ description, withHeader = true, children }) => (
  <Page>
    <Helmet>
      <meta charSet="utf-8" />
      <title>Tower Defense</title>
      <meta name="description" content={description} />
    </Helmet>
    {withHeader && <Header />}
    {children}
  </Page>
);

export default PageWrapper;
