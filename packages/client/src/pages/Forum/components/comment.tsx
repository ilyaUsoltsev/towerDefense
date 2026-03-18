import ux from '../main.module.css';
import comUx from './Comment.module.css';

export interface CommentProps {
  id?: number;
  avatar?: string;
  userLogin?: string;
  commentText: string;
  createdAt?: string;
}

function formatCommentDate(iso: string): string {
  try {
    const d = new Date(iso);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    if (isToday) {
      return d.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    return d.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

export const Comment = ({
  id,
  avatar = '/default-user-icon.png',
  userLogin,
  commentText,
  createdAt,
}: CommentProps) => {
  const displayName = userLogin ?? 'Участник';
  const dateStr = createdAt ? formatCommentDate(createdAt) : '';
  return (
    <div className={`${comUx.comment} ${ux.flex_row}`}>
      <img src={avatar} alt="user avatar" />
      <div>
        <h3>
          {displayName}
          {dateStr ? ` · ${dateStr}` : ''}
        </h3>
        <p>{commentText}</p>
      </div>
    </div>
  );
};
