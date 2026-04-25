import { defaultComparator, type AvlNode, type Comparator } from '../shared';

type DetachMinResult<K, V> = {
  min: AvlNode<K, V>;
  tree?: AvlNode<K, V>;
};

export class AvlTree<K, V = K> {
  private root?: AvlNode<K, V>;
  private count = 0;

  constructor(private readonly compare: Comparator<K> = defaultComparator) {}

  get size(): number {
    return this.count;
  }

  insert(key: K, value: V): void {
    let inserted = false;

    const insertNode = (node: AvlNode<K, V> | undefined): AvlNode<K, V> => {
      if (!node) {
        inserted = true;
        return { key, value, height: 1 };
      }

      const comparison = this.compare(key, node.key);

      if (comparison < 0) {
        return this.rebalance({
          ...node,
          left: insertNode(node.left),
        });
      }

      if (comparison > 0) {
        return this.rebalance({
          ...node,
          right: insertNode(node.right),
        });
      }

      return {
        ...node,
        value,
      };
    };

    this.root = insertNode(this.root);

    if (inserted) {
      this.count += 1;
    }
  }

  get(key: K): V | undefined {
    let current = this.root;

    while (current) {
      const comparison = this.compare(key, current.key);

      if (comparison === 0) {
        return current.value;
      }

      current = comparison < 0 ? current.left : current.right;
    }

    return undefined;
  }

  has(key: K): boolean {
    return this.get(key) !== undefined;
  }

  min(): V | undefined {
    const node = this.minNode(this.root);
    return node?.value;
  }

  max(): V | undefined {
    let current = this.root;

    while (current?.right) {
      current = current.right;
    }

    return current?.value;
  }

  remove(key: K): boolean {
    let removed = false;

    const removeNode = (node: AvlNode<K, V> | undefined): AvlNode<K, V> | undefined => {
      if (!node) {
        return undefined;
      }

      const comparison = this.compare(key, node.key);

      if (comparison < 0) {
        return this.rebalance({
          ...node,
          left: removeNode(node.left),
        });
      }

      if (comparison > 0) {
        return this.rebalance({
          ...node,
          right: removeNode(node.right),
        });
      }

      removed = true;

      if (!node.left) {
        return node.right;
      }

      if (!node.right) {
        return node.left;
      }

      const { min, tree } = this.detachMin(node.right);
      return this.rebalance({
        ...min,
        left: node.left,
        right: tree,
      });
    };

    this.root = removeNode(this.root);

    if (removed) {
      this.count -= 1;
    }

    return removed;
  }

  inOrder(): V[] {
    const values: V[] = [];

    const traverse = (node: AvlNode<K, V> | undefined): void => {
      if (!node) {
        return;
      }

      traverse(node.left);
      values.push(node.value);
      traverse(node.right);
    };

    traverse(this.root);
    return values;
  }

  private detachMin(node: AvlNode<K, V>): DetachMinResult<K, V> {
    if (!node.left) {
      return {
        min: node,
        tree: node.right,
      };
    }

    const result = this.detachMin(node.left);
    return {
      min: result.min,
      tree: this.rebalance({
        ...node,
        left: result.tree,
      }),
    };
  }

  private minNode(node: AvlNode<K, V> | undefined): AvlNode<K, V> | undefined {
    let current = node;

    while (current?.left) {
      current = current.left;
    }

    return current;
  }

  private rebalance(node: AvlNode<K, V>): AvlNode<K, V> {
    const balancedNode = this.withUpdatedHeight(node);
    const balance = this.balanceFactor(balancedNode);

    if (balance > 1) {
      const adjustedLeft =
        this.balanceFactor(balancedNode.left) < 0 ? this.rotateLeft(balancedNode.left!) : balancedNode.left;

      return this.rotateRight({
        ...balancedNode,
        left: adjustedLeft,
      });
    }

    if (balance < -1) {
      const adjustedRight =
        this.balanceFactor(balancedNode.right) > 0 ? this.rotateRight(balancedNode.right!) : balancedNode.right;

      return this.rotateLeft({
        ...balancedNode,
        right: adjustedRight,
      });
    }

    return balancedNode;
  }

  private rotateLeft(node: AvlNode<K, V>): AvlNode<K, V> {
    const pivot = node.right!;
    const nextNode = this.withUpdatedHeight({
      ...node,
      right: pivot.left,
    });

    return this.withUpdatedHeight({
      ...pivot,
      left: nextNode,
    });
  }

  private rotateRight(node: AvlNode<K, V>): AvlNode<K, V> {
    const pivot = node.left!;
    const nextNode = this.withUpdatedHeight({
      ...node,
      left: pivot.right,
    });

    return this.withUpdatedHeight({
      ...pivot,
      right: nextNode,
    });
  }

  private height(node: AvlNode<K, V> | undefined): number {
    return node?.height ?? 0;
  }

  private withUpdatedHeight(node: AvlNode<K, V>): AvlNode<K, V> {
    return {
      ...node,
      height: Math.max(this.height(node.left), this.height(node.right)) + 1,
    };
  }

  private balanceFactor(node: AvlNode<K, V> | undefined): number {
    if (!node) {
      return 0;
    }

    return this.height(node.left) - this.height(node.right);
  }
}
