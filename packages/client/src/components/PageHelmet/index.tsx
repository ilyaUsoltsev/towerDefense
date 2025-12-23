import React from 'react';
import { Helmet } from 'react-helmet';

interface PageHelmetProps {
  title: string;
  description: string;
}

export const PageHelmet: React.FC<PageHelmetProps> = ({
  title,
  description,
}) => {
  return (
    <Helmet>
      <meta charSet="utf-8" />
      <title>{title}</title>
      <meta name="description" content={description} />
    </Helmet>
  );
};
