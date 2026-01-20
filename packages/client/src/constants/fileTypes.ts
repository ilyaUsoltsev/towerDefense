/**
 * Конфигурация допустимых типов файлов для загрузки
 */

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
] as const;

/**
 * Получить список допустимых расширений для отображения пользователю
 * @returns Строка с перечислением форматов (например: "JPEG, JPG, PNG, GIF, WebP")
 */
export const getAllowedImageFormatsText = (): string => {
  return ALLOWED_IMAGE_TYPES.map(type =>
    type.replace('image/', '').toUpperCase()
  ).join(', ');
};

/**
 * Получить строку для атрибута accept в input type="file"
 * @returns Строка вида "image/jpeg,image/jpg,image/png,image/gif,image/webp"
 */
export const getAllowedImageTypesAccept = (): string => {
  return ALLOWED_IMAGE_TYPES.join(',');
};

/**
 * Проверить, является ли тип файла допустимым
 * @param fileType MIME-тип файла
 * @returns true, если тип файла допустим
 */
export const isAllowedImageType = (fileType: string): boolean => {
  return ALLOWED_IMAGE_TYPES.includes(
    fileType as typeof ALLOWED_IMAGE_TYPES[number]
  );
};

/**
 * Получить сообщение об ошибке для недопустимого типа файла
 * @returns Сообщение об ошибке
 */
export const getInvalidFileTypeMessage = (): string => {
  return `Допустимы только файлы ${getAllowedImageFormatsText()}`;
};
