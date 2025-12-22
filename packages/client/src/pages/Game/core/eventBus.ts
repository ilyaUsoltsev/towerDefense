import { GameEventName, GameEventPayload } from './types';

type EventHandler<T extends GameEventName> = (
  payload: GameEventPayload<T>
) => void;

export class EventBus {
  private static instance: EventBus;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private handlers: Map<GameEventName, Set<EventHandler<any>>> = new Map();

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  public on<T extends GameEventName>(
    event: T,
    handler: EventHandler<T>
  ): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }

    this.handlers.get(event)!.add(handler);

    // Return unsubscribe function
    return () => {
      this.off(event, handler);
    };
  }

  public once<T extends GameEventName>(
    event: T,
    handler: EventHandler<T>
  ): void {
    const onceHandler = (payload: GameEventPayload<T>) => {
      handler(payload);
      this.off(event, onceHandler);
    };
    this.on(event, onceHandler);
  }

  public off<T extends GameEventName>(
    event: T,
    handler: EventHandler<T>
  ): void {
    const handlers = this.handlers.get(event);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.handlers.delete(event);
      }
    }
  }

  public emit<T extends GameEventName>(
    event: T,
    payload: GameEventPayload<T>
  ): void {
    const handlers = this.handlers.get(event);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(payload);
        } catch (error) {
          console.error('Error emitting event:', error);
        }
      });
    }
  }

  public clear(): void {
    this.handlers.clear();
  }

  public clearEvent(event: GameEventName): void {
    this.handlers.delete(event);
  }

  public hasListeners(event: GameEventName): boolean {
    const handlers = this.handlers.get(event);
    return handlers ? handlers.size > 0 : false;
  }

  public listenerCount(event: GameEventName): number {
    const handlers = this.handlers.get(event);
    return handlers ? handlers.size : 0;
  }
}

export const eventBus = EventBus.getInstance();
