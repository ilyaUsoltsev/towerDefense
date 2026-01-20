import { Helmet } from 'react-helmet';
import { Button, TextArea, TextInput } from '@gravity-ui/uikit';
import { ROUTE } from '../../../constants/ROUTE';
import ux from '../main.module.css';
import { Outlet, Link } from 'react-router-dom';
import discUx from './Discussion.module.css';
import { Comment, CommentProps } from '../../../components/ForumTopicComment';
import { useState } from 'react';

export const ForumDiscussion = () => {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<CommentProps[]>([
    {
      // default clear comment
      id: 1,
      commentText: 'Comment content...',
    },
    {
      // anonymoius comment
      id: 2,
      avatar: '/logo1.png',
      commentText: 'Comment text content...',
    },
    {
      // comment with long text
      id: 3,
      avatar: '/logo1.png',
      userLogin: 'RandomGuy111',
      commentText:
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui porro nesciunt delectus, harum laboriosam laborum obcaecati numquam sed asperiores aut. Obcaecati consequatur nostrum reiciendis harum, sint reprehenderit impedit fuga quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui porro nesciunt delectus, harum laboriosam laborum obcaecati numquam sed asperiores aut. Obcaecati consequatur nostrum reiciendis harum, sint reprehenderit impedit fuga quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui porro nesciunt delectus, harum laboriosam laborum obcaecati numquam sed asperiores aut. Obcaecati consequatur nostrum reiciendis harum, sint reprehenderit impedit fuga quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui porro nesciunt delectus, harum laboriosam laborum obcaecati numquam sed asperiores aut. Obcaecati consequatur nostrum reiciendis harum, sint reprehenderit impedit fuga quam.',
    },
    {
      id: 4,
      avatar: '/logo2.png',
      userLogin: 'Killer2012',
      commentText: 'Just a normal comment text content',
    },
  ]);

  function sendComment() {
    if (!commentText.trim()) return;

    setComments(prev => [
      {
        id: Date.now(),
        commentText: commentText,
      },
      ...prev,
    ]);

    setCommentText('');
  }

  return (
    <div className={`${ux.forum} ${ux.flex_col}`}>
      <Helmet>
        <title>New Post</title>
      </Helmet>

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
            <h1>Навзание темы</h1>
            <p>
              Это полный текст обсуждения. В отличие от списка тем форума, он не
              сокращается и предназначен для полного прочтения внутри страницы
              темы.
            </p>
          </div>
          <div className={`${ux.flex_col} ${discUx.comments}`}>
            <h2>Комментарии</h2>
            <div className={`${ux.flex_row} ${discUx.comments_wrapper}`}>
              <div className={discUx.comments_section}>
                {comments.map(comment => (
                  <Comment
                    key={comment.id}
                    avatar={comment.avatar}
                    userLogin={comment.userLogin}
                    commentText={comment.commentText}
                  />
                ))}
              </div>

              <div className={discUx.vertical_separator}></div>

              <div className={discUx.write_comment_section}>
                <h3>Оставьте свой комментарий</h3>
                <TextArea
                  view="normal"
                  size="m"
                  placeholder="Пишите здесь"
                  minRows={18}
                  maxRows={18}
                  hasClear
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                />
                <Button view="action" size="l" onClick={sendComment}>
                  Отправить
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Outlet />
      </div>
    </div>
  );
};
