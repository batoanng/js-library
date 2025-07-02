import { generateShortId } from './generateShortId';

describe('generateShortId', () => {
  it('should return a string of length 8', () => {
    const id = generateShortId();
    expect(typeof id).toBe('string');
    expect(id.length).toBe(8);
  });

  it('should generate different IDs on multiple calls (not guaranteed but likely)', () => {
    const id1 = generateShortId();
    const id2 = generateShortId();
    expect(id1).not.toBe(id2); // might occasionally fail due to randomness
  });

  it('should be statistically random over many generations (basic entropy check)', () => {
    const ids = new Set();
    for (let i = 0; i < 10000; i++) {
      ids.add(generateShortId());
    }
    expect(ids.size).toBeGreaterThan(9900); // Allow some duplicates but very few
  });
});
