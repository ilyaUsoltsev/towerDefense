export type ApiError = {
  status: number;
  reason: string;
};

export const isApiError = (error: unknown): error is ApiError => {
  if (!error || typeof error !== 'object' || error === null) {
    return false;
  }

  // Проверяем наличие нужных полей
  const hasStatus =
    'status' in error && typeof (error as any).status === 'number';
  const hasReason =
    'reason' in error && typeof (error as any).reason === 'string';

  return hasStatus && hasReason;
};
