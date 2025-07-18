/**
 * A simple, generic event bus for publish/subscribe-style communication.
 *
 * This class allows different parts of your application to communicate by emitting and listening for events.
 * You can register event listeners with `.on()`, remove them with `.off()`, and trigger them with `.emit()`.
 *
 * @example
 * ```ts
 * import eventBus from './EventBus';
 *
 * // Subscribe to an event
 * const onUserLogin = (user) => console.log('User logged in:', user);
 * eventBus.on('user:login', onUserLogin);
 *
 * // Emit the event
 * eventBus.emit('user:login', { id: 123, name: 'Alice' });
 *
 * // Remove the listener
 * eventBus.off('user:login', onUserLogin);
 * ```
 */
type EventCallback<T = any> = (data: T) => void;

class EventBus {
  private listeners: Record<string, EventCallback[]> = {};

  /**
   * Register a callback for a specific event.
   *
   * @param event - The name of the event to listen for.
   * @param callback - The function to call when the event is emitted.
   */
  on<T = any>(event: string, callback: EventCallback<T>): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  /**
   * Remove a previously registered callback for a specific event.
   *
   * @param event - The name of the event.
   * @param callback - The function to remove.
   */
  off<T = any>(event: string, callback: EventCallback<T>): void {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter((listener) => listener !== callback);
    }
  }

  /**
   * Emit an event, calling all registered listeners with the provided data.
   *
   * @param event - The name of the event to emit.
   * @param data - The data to pass to the event listeners.
   */
  emit<T = any>(event: string, data: T): void {
    if (this.listeners[event]) {
      this.listeners[event].forEach((listener) => listener(data));
    }
  }
}

const eventBus = new EventBus();
export default eventBus;
