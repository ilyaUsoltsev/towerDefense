import { useState, useRef } from 'react';
import { Card, Avatar, User, Button } from '@gravity-ui/uikit';
import { User as UserType } from '../../slices/userSlice';
import {
  isAllowedImageType,
  getAllowedImageTypesAccept,
  getAllowedImageFormatsText,
  getInvalidFileTypeMessage,
} from '../../constants/fileTypes';
import styles from './AvatarUpload.module.css';

interface AvatarUploadProps {
  user: UserType | null;
}

export const AvatarUpload = ({ user }: AvatarUploadProps) => {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!isAllowedImageType(file.type)) {
        alert(getInvalidFileTypeMessage());
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append('avatar', file);

      console.log('Данные аватара:', {
        file: file.name,
        size: file.size,
        type: file.type,
      });
    }
  };

  return (
    <Card className={styles.card}>
      <h2 className={styles.cardTitle}>Аватар</h2>
      <div className={styles.avatarSection}>
        <div className={styles.avatarWrapper}>
          {avatarPreview || user?.avatar ? (
            <Avatar
              imgUrl={avatarPreview || user?.avatar || ''}
              size="xl"
              className={styles.avatar}
            />
          ) : (
            <User
              name={user?.display_name || user?.login || 'User'}
              size="xl"
            />
          )}
        </div>
        <div className={styles.avatarActions}>
          <input
            type="file"
            ref={fileInputRef}
            accept={getAllowedImageTypesAccept()}
            onChange={handleAvatarChange}
            className={styles.fileInput}
          />
          <Button
            view="action"
            size="l"
            className={styles.uploadButton}
            onClick={() => fileInputRef.current?.click()}>
            Загрузить аватар
          </Button>
          <p className={styles.hint}>
            Допустимы: {getAllowedImageFormatsText()}
          </p>
        </div>
      </div>
    </Card>
  );
};
