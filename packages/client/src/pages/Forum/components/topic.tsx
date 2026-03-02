import { useNavigate } from 'react-router-dom';
import ux from '../main.module.css';
import bodyUx from '../pages/Forum.module.css';
import { ROUTE } from '../../../constants/ROUTE';

export interface ForumTopic {
  title: string;
  message: string;
  image?: string;
  lastActivityMinutes?: number;
}

export const Topic = ({
  image = '/topic-default-image.svg',
  title = 'Discussion Title',
  message,
  lastActivityMinutes = 0,
}: ForumTopic) => {
  const nav = useNavigate(); // временная мера чтобы переходить на страницу темы

  return (
    <div
      className={`${bodyUx.topic} ${ux.flex_row}`}
      onClick={() => {
        nav(ROUTE.FORUM_TOPIC);
      }}>
      <div className={bodyUx.topic_image}>
        <img src={image} alt="topic image" />
      </div>
      <div className={`${bodyUx.topic_header} ${ux.flex_col}`}>
        <h2>{title}</h2>
        <p>{message}</p>
      </div>

      <div className={bodyUx.last_activity}>
        <h4>Last Activity:</h4>
        <p>{lastActivityMinutes} minutes ago</p>
      </div>
    </div>
  );
};
