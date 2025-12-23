import { usePage } from '../../hooks/usePage';
import SectionLog from '../../components/SectionLog';
import { ErrorContent } from '../../components/ErrorContent';
import { PageInitArgs } from '../../routes';

export const Error400Page = () => {
  usePage({ initPage: initError400Page });

  return (
    <SectionLog>
      <ErrorContent
        code="400"
        title="Неверный запрос"
        description="К сожалению, ваш запрос содержит ошибку. Пожалуйста, проверьте введенные данные и попробуйте снова."
      />
    </SectionLog>
  );
};

export const initError400Page = async ({ dispatch, state }: PageInitArgs) => {
  return Promise.resolve();
};
