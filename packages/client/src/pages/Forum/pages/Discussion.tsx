import { useEffect, useState } from 'react';
import { Button, TextArea } from '@gravity-ui/uikit';
import { ROUTE } from '../../../constants/ROUTE';
import ux from '../main.module.css';
import { Link, useParams } from 'react-router-dom';
import discUx from './Discussion.module.css';
import { Comment, CommentProps } from '../components/comment';
import { PageHelmet } from '../../../components/PageHelmet';
import { forumApi } from '../../../api/forum';
import type { TopicApi, CommentApi } from '../../../api/forum';

function commentToProps(c: CommentApi): CommentProps {
  return {
    id: c.id,
    commentText: c.content,
    userLogin: c.author_login ?? `Пользователь #${c.userid}`,
    createdAt: c.createdAt,
  };
}

export const ForumDiscussion = () => {
  const { id } = useParams<{ id: string }>();
  const topicId = id ? parseInt(id, 10) : NaN;
  const [topic, setTopic] = useState<TopicApi | null>(null);
  const [comments, setComments] = useState<CommentProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [sending, setSending] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || isNaN(topicId) || topicId <= 0) {
      setError('Неверный адрес темы');
      setLoading(false);
      return;
    }
    Promise.all([
      forumApi.getTopic(topicId),
      forumApi.getComments(topicId),
    ]).then(([topicRes, commentsRes]) => {
      setLoading(false);
      if (topicRes && typeof topicRes === 'object' && 'status' in topicRes) {
        const err = topicRes as {
          message?: string;
          reason?: string;
          error?: string;
        };
        setError(err.reason || err.message || err.error || 'Тема не найдена');
        return;
      }
      setTopic(topicRes as TopicApi);
      if (
        commentsRes &&
        typeof commentsRes === 'object' &&
        !('status' in commentsRes)
      ) {
        setComments((commentsRes as CommentApi[]).map(commentToProps));
      }
    });
  }, [id, topicId]);

  function sendComment() {
    if (!commentText.trim() || isNaN(topicId) || topicId <= 0) return;
    setCommentError(null);
    setSending(true);
    forumApi.createComment(topicId, commentText.trim()).then(res => {
      setSending(false);
      if (res && typeof res === 'object' && 'status' in res) {
        const err = res as {
          message?: string;
          reason?: string;
          error?: string;
        };
        setCommentError(
          err.reason ||
            err.message ||
            err.error ||
            'Не удалось отправить комментарий'
        );
        return;
      }
      const newComment = res as CommentApi;
      setComments(prev => [commentToProps(newComment), ...prev]);
      setCommentText('');
    });
  }

  if (loading) {
    return (
      <div className={`${ux.forum} ${ux.flex_col}`}>
        <PageHelmet
          title="Тема"
          description="Read discussion and leave comments."
        />
        <div className={ux.blur_layer} />
        <div className={`${ux.forum_body} ${discUx.forum_body}`}>
          <p>Загрузка...</p>
        </div>
      </div>
    );
  }
  if (error || !topic) {
    return (
      <div className={`${ux.forum} ${ux.flex_col}`}>
        <PageHelmet title="Ошибка" description="" />
        <div className={ux.blur_layer} />
        <div className={`${ux.forum_body} ${discUx.forum_body}`}>
          <Link to={ROUTE.FORUM}>
            <Button view="normal" size="l">
              Назад
            </Button>
          </Link>
          <p>{error || 'Тема не найдена'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${ux.forum} ${ux.flex_col}`}>
      <PageHelmet
        title={topic.title}
        description="Read discussion and leave comments."
      />

      <div className={ux.blur_layer}></div>

      <div className={`${ux.forum_body} ${discUx.forum_body} ${ux.flex_col}`}>
        <div className={`${ux.body_header} ${ux.flex_row}`}>
          <Link to={ROUTE.FORUM}>
            <Button view="normal" size="l">
              Назад
            </Button>
          </Link>
        </div>

        <div className={discUx.content}>
          <div className={discUx.discussion_img}>
            <img src="/tower-defence.png" alt="topic image" />
          </div>
          <div className={discUx.topic}>
            <h1>{topic.title}</h1>
            <p>{topic.content}</p>
          </div>
          <div className={`${ux.flex_col} ${discUx.comments}`}>
            <h2>Комментарии</h2>
            <div className={`${ux.flex_row} ${discUx.comments_wrapper}`}>
              <div className={discUx.comments_section}>
                {comments.length === 0 ? (
                  <div className={discUx.comments_filler}>
                    Здесь пока нет комментариев
                  </div>
                ) : (
                  comments.map(comment => (
                    <Comment
                      key={
                        comment.id ?? `new-${comment.commentText.slice(0, 20)}`
                      }
                      id={comment.id}
                      avatar={comment.avatar}
                      userLogin={comment.userLogin}
                      commentText={comment.commentText}
                      createdAt={comment.createdAt}
                    />
                  ))
                )}
              </div>

              <div className={discUx.vertical_separator}></div>

              <div className={discUx.write_comment_section}>
                <h3>Оставьте свой комментарий</h3>
                {commentError && (
                  <p style={{ color: 'var(--g-color-text-danger)' }}>
                    {commentError}
                  </p>
                )}
                <TextArea
                  view="normal"
                  size="m"
                  placeholder="Пишите здесь"
                  minRows={18}
                  maxRows={18}
                  hasClear
                  value={commentText}
                  onChange={e => {
                    setCommentError(null);
                    setCommentText(e.target.value);
                  }}
                />
                <Button
                  view="action"
                  size="l"
                  onClick={sendComment}
                  disabled={sending || !commentText.trim()}>
                  {sending ? 'Отправка...' : 'Отправить'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
