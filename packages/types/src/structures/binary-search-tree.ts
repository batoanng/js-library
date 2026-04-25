import { defaultComparator, type Comparator, type TreeNode } from '../shared';

type DetachMinResult<K, V> = {
  min: TreeNode<K, V>;
  tree?: TreeNode<K, V>;
};

export class BinarySearchTree<K, V = K> {
  private root?: TreeNode<K, V>;
  private count = 0;

  constructor(private readonly compare: Comparator<K> = defaultComparator) {}

  get size(): number {
    return this.count;
  }

  insert(key: K, value: V): void {
    let inserted = false;

    const insertNode = (node: TreeNode<K, V> | undefined): TreeNode<K, V> => {
      if (!node) {
        inserted = true;
        return { key, value };
      }

      const comparison = this.compare(key, node.key);

      if (comparison < 0) {
        return {
          ...node,
          left: insertNode(node.left),
        };
      }

      if (comparison > 0) {
        return {
          ...node,
          right: insertNode(node.right),
        };
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

    const removeNode = (node: TreeNode<K, V> | undefined): TreeNode<K, V> | undefined => {
      if (!node) {
        return undefined;
      }

      const comparison = this.compare(key, node.key);

      if (comparison < 0) {
        return {
          ...node,
          left: removeNode(node.left),
        };
      }

      if (comparison > 0) {
        return {
          ...node,
          right: removeNode(node.right),
        };
      }

      removed = true;

      if (!node.left) {
        return node.right;
      }

      if (!node.right) {
        return node.left;
      }

      const { min, tree } = this.detachMin(node.right);
      return {
        ...min,
        left: node.left,
        right: tree,
      };
    };

    this.root = removeNode(this.root);

    if (removed) {
      this.count -= 1;
    }

    return removed;
  }

  inOrder(): V[] {
    const values: V[] = [];

    const traverse = (node: TreeNode<K, V> | undefined): void => {
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

  private minNode(node: TreeNode<K, V> | undefined): TreeNode<K, V> | undefined {
    let current = node;

    while (current?.left) {
      current = current.left;
    }

    return current;
  }

  private detachMin(node: TreeNode<K, V>): DetachMinResult<K, V> {
    if (!node.left) {
      return {
        min: node,
        tree: node.right,
      };
    }

    const result = this.detachMin(node.left);
    return {
      min: result.min,
      tree: {
        ...node,
        left: result.tree,
      },
    };
  }
}
