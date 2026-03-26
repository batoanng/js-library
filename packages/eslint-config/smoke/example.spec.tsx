describe('loadGreeting', () => {
  it('returns a greeting', async () => {
    async function loadGreeting(name: string): Promise<string> {
      return Promise.resolve(`hello ${name}`);
    }

    await expect(loadGreeting('world')).resolves.toBe('hello world');
  });
});
