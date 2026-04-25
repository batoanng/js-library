import { describe, expect, it } from 'vitest';
import { BinarySearchTree } from '../structures/binary-search-tree';

describe('BinarySearchTree', () => {
  it('inserts values in sorted order and updates existing keys', () => {
    const tree = new BinarySearchTree<number, string>();

    tree.insert(2, 'root');
    tree.insert(1, 'left');
    tree.insert(3, 'right');
    tree.insert(2, 'updated');

    expect(tree.size).toBe(3);
    expect(tree.get(2)).toBe('updated');
    expect(tree.get(4)).toBeUndefined();
    expect(tree.inOrder()).toEqual(['left', 'updated', 'right']);
    expect(tree.min()).toBe('left');
    expect(tree.max()).toBe('right');
  });

  it('removes leaf, one-child, and two-child nodes', () => {
    const tree = new BinarySearchTree<number>();

    [10, 5, 15, 12, 18, 11].forEach((value) => tree.insert(value, value));

    expect(tree.remove(11)).toBe(true);
    expect(tree.remove(12)).toBe(true);
    expect(tree.remove(15)).toBe(true);
    expect(tree.remove(999)).toBe(false);
    expect(tree.has(15)).toBe(false);
    expect(tree.inOrder()).toEqual([5, 10, 18]);
    expect(tree.size).toBe(3);
  });
});
