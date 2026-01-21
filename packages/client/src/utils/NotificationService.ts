export class NotificationService {
  private static permissionGranted = false;
  private static lastNotificationTime: Record<string, number> = {};
  private static readonly RATE_LIMIT_MS = 60000;

  static isSupported(): boolean {
    return 'Notification' in window;
  }

  static async requestPermission(): Promise<boolean> {
    if (!this.isSupported()) {
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      this.permissionGranted = permission === 'granted';
      return this.permissionGranted;
    } catch (error) {
      console.warn('Ошибка при запросе разрешения на уведомления:', error);
      return false;
    }
  }

  private static canNotify(type: string): boolean {
    if (!this.permissionGranted || Notification.permission !== 'granted') {
      return false;
    }

    const now = Date.now();
    const lastTime = this.lastNotificationTime[type] || 0;
    if (now - lastTime < this.RATE_LIMIT_MS) {
      return false;
    }

    this.lastNotificationTime[type] = now;
    return true;
  }

  private static showNotification(
    title: string,
    options?: NotificationOptions
  ): void {
    if (!this.isSupported()) {
      return;
    }

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

  static notifyLowHP(hp: number): void {
    if (!this.canNotify('low-hp')) {
      return;
    }

    this.showNotification('⚠️ Низкий уровень здоровья!', {
      body: `Осталось всего ${hp} жизней! Срочно требуется ваше внимание!`,
      icon: '/favicon.ico',
      tag: 'low-hp',
    });
  }

  static notifyGameOver(isWin: boolean): void {
    if (!this.canNotify('game-over')) {
      return;
    }

    if (isWin) {
      this.showNotification('🎉 Победа!', {
        body: 'Поздравляем! Вы прошли все волны!',
        icon: '/favicon.ico',
        tag: 'game-over',
      });
    } else {
      this.showNotification('💀 Поражение', {
        body: 'Игра окончена. Попробуйте еще раз!',
        icon: '/favicon.ico',
        tag: 'game-over',
      });
    }
  }
}
