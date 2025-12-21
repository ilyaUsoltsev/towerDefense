import { ArrowRightFromSquare, Person } from '@gravity-ui/icons';
import { Avatar } from '@gravity-ui/uikit';
import { FC } from 'react';
import { Link } from 'react-router-dom';

import { selectUser } from '../../slices/userSlice';
import { useSelector } from '../../store';

import { ROUTE } from '../../constants/ROUTE';

import styles from './Header.module.css';

const Header: FC = () => {
  const user = useSelector(selectUser);

  const onLogout = () => {
    console.log('logout');
  };

  return (
    <div className={styles.headerWrapper}>
      <Link to={ROUTE.USER} className={styles.userLink}>
        <div className={styles.avatarWrapper}>
          <Avatar icon={Person} aria-label="avatar" size="l" theme="brand" />
          <p>{user?.name}</p>
        </div>
      </Link>

      <button className={styles.iconButton} onClick={onLogout}>
        <ArrowRightFromSquare />
      </button>
    </div>
  );
};

export default Header;
