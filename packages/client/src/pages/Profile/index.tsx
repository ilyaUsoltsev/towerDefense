import { useSelector } from '../../store';
import { fetchUserThunk, selectUser } from '../../slices/userSlice';
import { usePage } from '../../hooks/usePage';
import { PageInitArgs } from '../../routes';
import { AvatarUpload } from '../../components/AvatarUpload';
import { ProfileForm } from '../../components/ProfileForm';
import { PasswordForm } from '../../components/PasswordForm';
import styles from './Profile.module.css';

export const ProfilePage = () => {
  const user = useSelector(selectUser);
  usePage({ initPage: initProfilePage });

  return (
    <div className={styles.profilePage}>
      <h1 className={styles.title}>Профиль пользователя</h1>

      <div className={styles.content}>
        <AvatarUpload user={user} />
        <ProfileForm user={user} />
        <PasswordForm />
      </div>
    </div>
  );
};

export const initProfilePage = async ({ dispatch, state }: PageInitArgs) => {
  if (!selectUser(state)) {
    return dispatch(fetchUserThunk());
  }
};
