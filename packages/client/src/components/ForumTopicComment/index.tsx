import ux from '../../pages/Forum/main.module.css';
import comUx from './Comment.module.css';

export interface CommentProps {
  id?: number;
  avatar?: string;
  userLogin?: string;
  commentText: string;
}

export const Comment = ({
  avatar = '/default-user-icon.png',
  userLogin = 'Anonymous',
  commentText,
}: CommentProps) => {
  return (
    <div className={`${comUx.comment} ${ux.flex_row}`}>
      <img src={avatar} alt="user avatar" />
      <div>
        <h3>{userLogin}</h3>
        <p>{commentText}</p>
      </div>
    </div>
  );
};
