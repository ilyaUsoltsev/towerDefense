import { Helmet } from 'react-helmet';
import { Button, TextArea, TextInput } from '@gravity-ui/uikit';
import { ROUTE } from '../../../constants/ROUTE';
import ux from '../main.module.css';
import { Outlet, Link } from 'react-router-dom';
import bodyUx from './NewPost.module.css';

export const ForumNew = () => {
  return (
    <div className={`${ux.forum} ${ux.flex_col}`}>
      <Helmet>
        <title>Новая тема</title>
      </Helmet>

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
          <Link to={ROUTE.FORUM}>
            <Button view="action" size="l">
              Опубликовать
            </Button>
          </Link>
        </div>
        <div className={`${bodyUx.topic_fields}`}>
          <h3>Заголовок</h3>
          <TextInput
            view="normal"
            size="m"
            placeholder="Навзание вашей темы"
            hasClear
          />
          <h3>Основная тема</h3>
          <TextArea
            view="normal"
            size="m"
            placeholder="Опишите вашу тему подробно..."
            minRows={20}
            maxRows={20}
            hasClear
          />
        </div>

        <Outlet />
      </div>
    </div>
  );
};
