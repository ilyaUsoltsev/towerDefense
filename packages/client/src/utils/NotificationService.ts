type NotificationType = 'low-hp' | 'game-over';

interface NotificationConfig {
  title: string;
  body: string;
}

type NotificationPayload =
  | { type: 'low-hp'; hp: number }
  | { type: 'game-over'; isWin: boolean };

const NOTIFICATION_TEMPLATES: Record<
  NotificationType,
  (payload: never) => NotificationConfig
> = {
  'low-hp': (payload: { hp: number }) => ({
    title: '⚠️ Низкий уровень здоровья!',
    body: `Осталось всего ${payload.hp} жизней! Срочно требуется ваше внимание!`,
  }),
  'game-over': (payload: { isWin: boolean }) =>
    payload.isWin
      ? { title: '🎉 Победа!', body: 'Поздравляем! Вы прошли все волны!' }
      : { title: '💀 Поражение', body: 'Игра окончена. Попробуйте еще раз!' },
};

export class NotificationService {
  private static lastNotificationTime: Partial<
    Record<NotificationType, number>
  > = {};
  private static readonly RATE_LIMIT_MS = 60000;

  private static get hasPermission(): boolean {
    return this.isSupported() && Notification.permission === 'granted';
  }

  static isSupported(): boolean {
    return 'Notification' in window;
  }

  static async requestPermission(): Promise<boolean> {
    if (!this.isSupported()) {
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.warn('Ошибка при запросе разрешения на уведомления:', error);
      return false;
    }
  }

  static notify(payload: NotificationPayload): void {
    if (!this.canNotify(payload.type)) {
      return;
    }

    const template = NOTIFICATION_TEMPLATES[payload.type];
    const { title, body } = template(payload as never);

    this.showNotification(title, { body, tag: payload.type });
  }

  private static canNotify(type: NotificationType): boolean {
    if (!this.hasPermission) {
      return false;
    }

    const now = Date.now();
    const lastTime = this.lastNotificationTime[type] ?? 0;
    if (now - lastTime < this.RATE_LIMIT_MS) {
      return false;
    }

    this.lastNotificationTime[type] = now;
    return true;
  }

  private static showNotification(
    title: string,
    options: NotificationOptions
  ): void {
    try {
      const notification = new Notification(title, options);

      setTimeout(() => {
        notification.close();
      }, 5000);

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    } catch (error) {
      console.warn('Ошибка при показе уведомления:', error);
    }
  }
}
