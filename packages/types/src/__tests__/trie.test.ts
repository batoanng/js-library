import { describe, expect, it } from 'vitest';
import { Trie } from '../structures/trie';

describe('Trie', () => {
  it('supports insertion and exact lookup', () => {
    const trie = new Trie();

    expect(trie.insert('cat')).toBe(true);
    expect(trie.insert('cat')).toBe(false);
    expect(trie.has('cat')).toBe(true);
    expect(trie.has('car')).toBe(false);
    expect(trie.size).toBe(1);
  });

  it('supports prefix lookup, deletion, autocomplete, and clear', () => {
    const trie = new Trie();

    ['car', 'card', 'care', 'dog'].forEach((word) => trie.insert(word));

    expect(trie.startsWith('car')).toBe(true);
    expect(trie.startsWith('cat')).toBe(false);
    expect(trie.wordsWithPrefix('car')).toEqual(['car', 'card', 'care']);
    expect(trie.delete('card')).toBe(true);
    expect(trie.has('car')).toBe(true);
    expect(trie.has('card')).toBe(false);
    expect(trie.wordsWithPrefix('car')).toEqual(['car', 'care']);

    trie.clear();
    expect(trie.size).toBe(0);
    expect(trie.wordsWithPrefix('c')).toEqual([]);
  });
});
