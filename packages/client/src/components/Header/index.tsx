import { ArrowRightFromSquare, Person } from '@gravity-ui/icons';
import { Avatar } from '@gravity-ui/uikit';
import { FC } from 'react';
import { Link } from 'react-router-dom';

import { selectUser } from '../../slices/userSlice';
import { useSelector } from '../../store';

import { ROUTE } from '../../constants/ROUTE';

import { AvatarWrapper, HeaderWrapper, IconButton } from './styles';

const Header: FC = () => {
  const user = useSelector(selectUser);

  const onLogout = () => {
    console.log('logout');
  };

  return (
    <HeaderWrapper>
      <Link
        to={ROUTE.USER}
        style={{ textDecoration: 'none', color: 'var(--g-color-text-brand)' }}>
        <AvatarWrapper>
          <Avatar icon={Person} aria-label="avatar" size="l" theme="brand" />
          <p>{user?.name}</p>
        </AvatarWrapper>
      </Link>

      <IconButton onClick={onLogout}>
        <ArrowRightFromSquare />
      </IconButton>
    </HeaderWrapper>
  );
};

export default Header;
