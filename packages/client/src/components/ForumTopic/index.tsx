import ux from '../../pages/Forum/main.module.css';
import bodyUx from '../../pages/Forum/pages/forum.module.css';

export interface ForumTopic {
  title: string;
  message: string;
  image?: string;
  lastActivityMinutes?: number;
}

export const Topic = ({
  image = '/topic-image.png',
  title = 'Discussion Title',
  message,
  lastActivityMinutes = 0,
}: ForumTopic) => {
  return (
    <div className={`${bodyUx.topic} ${ux.flex_row}`}>
      <div className={bodyUx.topic_image}>
        <img src={image} alt="topic image" />
      </div>
      <div className={`${bodyUx.topic_header} ${ux.flex_col}`}>
        <h2>{title}</h2>
        <p>{message}</p>
      </div>

      <span className={bodyUx.last_activity}>
        <h4>Last Activity:</h4>
        <p>{lastActivityMinutes} minutes ago</p>
      </span>
    </div>
  );
};
