export const validateContent = (
  content: unknown,
  name: unknown,
  maxLength = 0
): { isValid: boolean; errorMessage?: string } => {
  // Проверяем, что content — строка
  if (typeof content !== 'string') {
    return {
      isValid: false,
      errorMessage: `Содержимое ${name} должно быть строкой`,
    };
  }

  const trimmed = content.trim();

  // Проверяем, что строка не пустая
  if (!trimmed) {
    return {
      isValid: false,
      errorMessage: 'Содержимое комментария обязательно',
    };
  }

  // Новая проверка: длина комментария
  if (maxLength != 0) {
    if (trimmed.length > maxLength) {
      return {
        isValid: false,
        errorMessage: `Комментарий слишком длинный (максимум ${maxLength} символов)`,
      };
    }
  }

  return { isValid: true };
};
