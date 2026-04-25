import { describe, expect, it } from 'vitest';
import { AvlTree } from '../structures/avl-tree';

function expectBalanced(node: any): number {
  if (!node) {
    return 0;
  }

  const leftHeight = expectBalanced(node.left);
  const rightHeight = expectBalanced(node.right);

  expect(Math.abs(leftHeight - rightHeight)).toBeLessThanOrEqual(1);
  expect(node.height).toBe(Math.max(leftHeight, rightHeight) + 1);

  return node.height;
}

describe('AvlTree', () => {
  it('performs LL, RR, LR, and RL rotations', () => {
    const ll = new AvlTree<number>();
    [30, 20, 10].forEach((value) => ll.insert(value, value));
    expect((ll as any).root.key).toBe(20);

    const rr = new AvlTree<number>();
    [10, 20, 30].forEach((value) => rr.insert(value, value));
    expect((rr as any).root.key).toBe(20);

    const lr = new AvlTree<number>();
    [30, 10, 20].forEach((value) => lr.insert(value, value));
    expect((lr as any).root.key).toBe(20);

    const rl = new AvlTree<number>();
    [10, 30, 20].forEach((value) => rl.insert(value, value));
    expect((rl as any).root.key).toBe(20);
  });

  it('stays sorted and balanced after many inserts and removals', () => {
    const tree = new AvlTree<number>();

    [50, 20, 70, 10, 30, 60, 80, 25, 27, 26].forEach((value) => tree.insert(value, value));

    expect(tree.inOrder()).toEqual([10, 20, 25, 26, 27, 30, 50, 60, 70, 80]);
    expectBalanced((tree as any).root);

    expect(tree.remove(20)).toBe(true);
    expect(tree.remove(80)).toBe(true);
    expect(tree.remove(999)).toBe(false);
    expect(tree.inOrder()).toEqual([10, 25, 26, 27, 30, 50, 60, 70]);
    expectBalanced((tree as any).root);
  });
});
