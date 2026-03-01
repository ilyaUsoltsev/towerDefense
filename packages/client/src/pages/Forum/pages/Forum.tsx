import { useEffect, useState } from 'react';
import { Button } from '@gravity-ui/uikit';
import { ROUTE } from '../../../constants/ROUTE';
import ux from '../main.module.css';
import bodyUx from './forum.module.css';
import { Link } from 'react-router-dom';
import { ForumTopic, Topic } from '../components/topic';
import { PageHelmet } from '../../../components/PageHelmet';
import { forumApi } from '../../../api/forum';
import type { TopicApi } from '../../../api/forum';

function topicToForumTopic(t: TopicApi): ForumTopic {
  const createdAt = t.createdAt ? new Date(t.createdAt).getTime() : Date.now();
  const lastActivityMinutes = Math.max(
    0,
    Math.floor((Date.now() - createdAt) / 60_000)
  );
  const message =
    t.content.length > 200 ? t.content.slice(0, 200) + '...' : t.content;
  return {
    id: t.id,
    title: t.title,
    message,
    lastActivityMinutes,
  };
}

export const Forum = () => {
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [filterQuery, setFilterQuery] = useState('');

  useEffect(() => {
    forumApi.getTopics().then(res => {
      setLoading(false);
      if (res && typeof res === 'object' && 'status' in res) {
        const err = res as {
          message?: string;
          reason?: string;
          error?: string;
        };
        const msg =
          err.reason || err.message || err.error || 'Не удалось загрузить темы';
        setError(
          msg === 'Network error or server unreachable'
            ? 'Сервер недоступен. Запустите сервер: yarn dev --scope=server'
            : msg
        );
        return;
      }
      setTopics(res.topics.map(topicToForumTopic));
    });
  }, []);

  const filteredTopics = !filterQuery.trim()
    ? topics
    : topics.filter(t =>
        t.title.toLowerCase().includes(filterQuery.trim().toLowerCase())
      );

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setFilterQuery((e.target as HTMLInputElement).value);
    }
  };
  return (
    <div className={`${ux.forum} ${ux.flex_col}`}>
      <PageHelmet
        title="Форум"
        description="This is forum. Create, read, and comment on content."
      />

      <div className={ux.blur_layer}></div>

      <header className={`${ux.forum_header} ${ux.flex_row}`}>
        <div className={ux.flex_col}>
          <h1>Военный штаб</h1>
          <h3>Стратегии и обсуждения</h3>
        </div>
        <img
          src="./tower-defence.png"
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
          <Link to={ROUTE.FORUM_NEW}>
            <Button view="action" size="l">
              Создать тему
            </Button>
          </Link>
          <input
            type="text"
            placeholder="Поиск по темам... (введите и нажмите Enter)"
            className={ux.topic_search}
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
        </div>
        <h2>Все темы</h2>

        <div className={`${bodyUx.topics} ${ux.flex_col}`}>
          {loading && <p>Загрузка...</p>}
          {error && <p>{error}</p>}
          {!loading && !error && topics.length === 0 && (
            <p>Пока нет тем. Создайте первую.</p>
          )}
          {!loading &&
            !error &&
            filteredTopics.length === 0 &&
            topics.length > 0 && <p>По запросу ничего не найдено.</p>}
          {!loading &&
            !error &&
            filteredTopics.map(t => (
              <Topic
                key={t.id}
                id={t.id}
                title={t.title}
                message={t.message}
                lastActivityMinutes={t.lastActivityMinutes}
              />
            ))}
        </div>
      </div>
    </div>
  );
};
