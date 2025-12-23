import React from 'react';
import { Label, LabelProps } from '@gravity-ui/uikit';

const ErrorText: React.FC<LabelProps> = ({ children, ...rest }) => {
  if (!children) return null;
  return (
    <Label theme="danger" size="m" {...rest}>
      {children}
    </Label>
  );
};

export default ErrorText;
