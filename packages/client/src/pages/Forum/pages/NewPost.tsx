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
        <title>New Post</title>
      </Helmet>

      <div className={ux.blur_layer}></div>

      <header className={`${ux.forum_header} ${ux.flex_row}`}>
        <div className={ux.flex_col}>
          <h1>War Room</h1>
          <h3>Community strategies & discussions</h3>
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
              Cancel
            </Button>
          </Link>
          <Link to={ROUTE.FORUM}>
            <Button view="action" size="l">
              Create
            </Button>
          </Link>
        </div>
        <div className={`${bodyUx.topic_fields}`}>
          <h3>Title</h3>
          <TextInput
            view="normal"
            size="m"
            placeholder="Discussion title"
            hasClear
          />
          <h3>Body</h3>
          <TextArea
            view="normal"
            size="m"
            placeholder="Tell everything about your discussion idea"
            minRows={20}
            maxRows={20}
            hasClear></TextArea>
        </div>

        <Outlet />
      </div>
    </div>
  );
};
