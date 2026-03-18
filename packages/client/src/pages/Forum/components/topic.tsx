import { useNavigate } from 'react-router-dom';
import ux from '../main.module.css';
import bodyUx from '../pages/Forum.module.css';
import { ROUTE } from '../../../constants/ROUTE';

function formatLastActivity(minutes: number): string {
  if (minutes < 1) return 'только что';
  if (minutes < 60) return `${minutes} мин. назад`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ч. назад`;
  const days = Math.floor(minutes / (60 * 24));
  if (days < 30) return `${days} дн. назад`;
  const months = Math.floor(minutes / (60 * 24 * 30));
  return `${months} мес. назад`;
}

export interface ForumTopic {
  id?: number;
  title: string;
  message: string;
  image?: string;
  lastActivityMinutes?: number;
}

export const Topic = ({
  id,
  image = '/topic-image.png',
  title = 'Discussion Title',
  message,
  lastActivityMinutes = 0,
}: ForumTopic) => {
  const nav = useNavigate();

  return (
    <div
      className={`${bodyUx.topic} ${ux.flex_row}`}
      onClick={() => {
        if (id != null) nav(`${ROUTE.FORUM_TOPIC}/${id}`);
      }}>
      <div className={bodyUx.topic_image}>
        <img src={image} alt="topic image" />
      </div>
      <div className={`${bodyUx.topic_header} ${ux.flex_col}`}>
        <h2>{title}</h2>
        <p>{message}</p>
      </div>

      <div className={bodyUx.last_activity}>
        <h4>Активность:</h4>
        <p>{formatLastActivity(lastActivityMinutes)}</p>
      </div>
    </div>
  );
};
