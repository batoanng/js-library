import eventBus from '../EventBus'; // Adjust path if needed

describe('EventBus', () => {
  beforeEach(() => {
    // Clear all listeners before each test by re-initializing the module
    // This is a workaround since `eventBus` is a singleton
    jest.resetModules();
  });

  it('should register and call an event listener', () => {
    const callback = jest.fn();
    eventBus.on('test-event', callback);

    eventBus.emit('test-event', 'payload');

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('payload');
  });

  it('should remove an event listener', () => {
    const callback = jest.fn();
    eventBus.on('remove-event', callback);
    eventBus.off('remove-event', callback);

    eventBus.emit('remove-event', 'data');
    expect(callback).not.toHaveBeenCalled();
  });

  it('should handle multiple listeners for the same event', () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();

    eventBus.on('multi-event', callback1);
    eventBus.on('multi-event', callback2);

    eventBus.emit('multi-event', { key: 'value' });

    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledTimes(1);
  });

  it('should not throw when emitting an event with no listeners', () => {
    expect(() => {
      eventBus.emit('no-listener-event', 'data');
    }).not.toThrow();
  });

  it('should allow listeners for different events', () => {
    const callbackA = jest.fn();
    const callbackB = jest.fn();

    eventBus.on('event-a', callbackA);
    eventBus.on('event-b', callbackB);

    eventBus.emit('event-a', 123);
    eventBus.emit('event-b', 456);

    expect(callbackA).toHaveBeenCalledWith(123);
    expect(callbackB).toHaveBeenCalledWith(456);
  });
});
