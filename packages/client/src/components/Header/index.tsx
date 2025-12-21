import { ArrowRightFromSquare, Person } from '@gravity-ui/icons';
import { Avatar } from '@gravity-ui/uikit';
import { FC } from 'react';

import { selectUser } from '../../slices/userSlice';
import { useSelector } from '../../store';

import { AvatarWrapper, HeaderWrapper, IconButton } from './styles';

const Header: FC = () => {
  const user = useSelector(selectUser);

  const onLogout = () => {
    console.log('logout');
  };

  return (
    <HeaderWrapper>
      <AvatarWrapper>
        <Avatar icon={Person} aria-label="avatar" size="l" theme="brand" />
        <p>{user?.name}</p>
      </AvatarWrapper>

      <IconButton onClick={onLogout}>
        <ArrowRightFromSquare />
      </IconButton>
    </HeaderWrapper>
  );
};

export default Header;
