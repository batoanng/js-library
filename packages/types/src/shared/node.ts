export interface LinkedListNode<T> {
  value: T;
  next?: LinkedListNode<T>;
}

export interface DoublyNode<T> {
  value: T;
  next?: DoublyNode<T>;
  prev?: DoublyNode<T>;
}

export interface CircularNode<T> {
  value: T;
  next: CircularNode<T>;
}

export interface TreeNode<K, V> {
  key: K;
  value: V;
  left?: TreeNode<K, V>;
  right?: TreeNode<K, V>;
}

export interface AvlNode<K, V> extends TreeNode<K, V> {
  height: number;
  left?: AvlNode<K, V>;
  right?: AvlNode<K, V>;
}
