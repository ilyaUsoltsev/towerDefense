import { usePage } from '../../hooks/usePage';
import SectionLog from '../../components/SectionLog';
import { ErrorContent } from '../../components/ErrorContent';
import { PageInitArgs } from '../../routes';

export const Error500Page = () => {
  usePage({ initPage: initError500Page });

  return (
    <SectionLog>
      <ErrorContent
        code="500"
        title="Внутренняя ошибка сервера"
        description="К сожалению, произошла внутренняя ошибка сервера. Мы уже работаем над её устранением. Пожалуйста, попробуйте позже."
      />
    </SectionLog>
  );
};

export const initError500Page = async ({ dispatch, state }: PageInitArgs) => {
  return Promise.resolve();
};
