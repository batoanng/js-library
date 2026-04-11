describe('loadGreeting', () => {
  it('returns a greeting', async () => {
    async function loadGreeting(name: string): Promise<string> {
      return Promise.resolve(`hello ${name}`);
    }

    expect(<div className="flex items-center">hello</div>).toBeTruthy();
    await expect(loadGreeting('world')).resolves.toBe('hello world');
  });
});
