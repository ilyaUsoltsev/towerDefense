import { useState } from 'react';
import { Button, TextArea, TextInput } from '@gravity-ui/uikit';
import { ROUTE } from '../../../constants/ROUTE';
import ux from '../main.module.css';
import { Link, useNavigate } from 'react-router-dom';
import bodyUx from './NewPost.module.css';
import { PageHelmet } from '../../../components/PageHelmet';
import { forumApi } from '../../../api/forum';

export const ForumNew = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePublish = () => {
    if (!title.trim() || !content.trim()) return;
    setError(null);
    setSubmitting(true);
    forumApi
      .createTopic({ title: title.trim(), content: content.trim() })
      .then(res => {
        setSubmitting(false);
        if (res && typeof res === 'object' && 'status' in res) {
          const err = res as {
            message?: string;
            reason?: string;
            error?: string;
          };
          const msg =
            err.reason || err.message || err.error || 'Не удалось создать тему';
          setError(
            msg === 'Ошибка сервера или недоступен'
              ? 'Сервер недоступен. Запустите сервер: yarn dev --scope=server'
              : msg
          );
          return;
        }
        navigate(`${ROUTE.FORUM_TOPIC}/${res.id}`);
      });
  };

  return (
    <div className={`${ux.forum} ${ux.flex_col}`}>
      <PageHelmet
        title="Новая тема"
        description="Создать новую тему и начать обсуждение"
      />

      <div className={ux.blur_layer}></div>

      <header className={`${ux.forum_header} ${ux.flex_row}`}>
        <div className={ux.flex_col}>
          <h1>Военный штаб</h1>
          <h3>Стратегии и обсуждения</h3>
        </div>
        <img
          src="/tower-defence.png"
          alt="forum theme picture"
          className={ux.forum_header_inline_image}
        />

        <Link to={ROUTE.ROOT}>
          <img
            src="/logoBig.png"
            alt="logo - Tower Defence"
            className={ux.forum_header_image}
          />
        </Link>
      </header>

      <div className={`${ux.forum_body}`}>
        <div className={`${ux.body_header} ${ux.flex_row}`}>
          <Link to={ROUTE.FORUM}>
            <Button view="normal" size="l">
              Назад
            </Button>
          </Link>
          <Button
            view="action"
            size="l"
            onClick={handlePublish}
            disabled={submitting || !title.trim() || !content.trim()}>
            Опубликовать
          </Button>
        </div>
        {error && <p>{error}</p>}
        <div className={`${bodyUx.topic_fields}`}>
          <h3>Заголовок</h3>
          <TextInput
            view="normal"
            size="m"
            placeholder="Название вашей темы"
            hasClear
            value={title}
            onUpdate={setTitle}
          />
          <h3>Основная тема</h3>
          <TextArea
            view="normal"
            size="m"
            placeholder="Опишите вашу тему подробно..."
            minRows={20}
            maxRows={20}
            hasClear
            value={content}
            onUpdate={setContent}
          />
        </div>
      </div>
    </div>
  );
};
