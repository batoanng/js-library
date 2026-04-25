# @batoanng/types

[![npm version](https://img.shields.io/npm/v/@batoanng/types)](https://www.npmjs.com/package/@batoanng/types)
[![install size](https://packagephobia.com/badge?p=@batoanng/types)](https://packagephobia.com/result?p=@batoanng/types)

`@batoanng/types` is a mixed runtime and type package. It ships reusable error contracts, shared low-level helpers, and a practical set of data structures for TypeScript and JavaScript projects.

## Features

- Root exports for common usage from `@batoanng/types`
- Stable subpath exports for `errors`, `structures`, and `shared`
- Runtime data structures with Vitest coverage
- Comparator and hashing helpers for ordered and hashed structures
- Shared error contracts for cross-package and client-server use

## Installation

```bash
npm install @batoanng/types
```

## Entry Points

Use the root entry when you want a single import surface:

```ts
import { Stack, Queue, BinarySearchTree, NormalisedError } from '@batoanng/types';
```

Use subpath imports when you want a narrower dependency boundary:

```ts
import type { ApiError, NormalisedError } from '@batoanng/types/errors';
import { Trie, HashTable, PriorityQueue } from '@batoanng/types/structures';
import { defaultComparator, hashValue } from '@batoanng/types/shared';
```

Public subpaths:

- `@batoanng/types`
- `@batoanng/types/errors`
- `@batoanng/types/structures`
- `@batoanng/types/shared`

## Quick Start

### Stack and Queue

```ts
import { Queue, Stack } from '@batoanng/types';

const stack = new Stack<number>();
stack.push(1);
stack.push(2);
stack.push(3);

console.log(stack.peek()); // 3
console.log(stack.pop()); // 3

const queue = new Queue<string>();
queue.enqueue('first');
queue.enqueue('second');

console.log(queue.peek()); // "first"
console.log(queue.dequeue()); // "first"
```

### Trees with a comparator

```ts
import { AvlTree } from '@batoanng/types';

type User = {
  id: number;
  name: string;
};

const users = new AvlTree<number, User>();

users.insert(20, { id: 20, name: 'Ada' });
users.insert(10, { id: 10, name: 'Linus' });
users.insert(30, { id: 30, name: 'Grace' });

console.log(users.get(10)?.name); // "Linus"
console.log(users.inOrder().map((user) => user.id)); // [10, 20, 30]
```

### Priority queues and tries

```ts
import { PriorityQueue, Trie } from '@batoanng/types';

const queue = new PriorityQueue<number>();
queue.insert(4);
queue.insert(2);
queue.insert(7);

console.log(queue.peek()); // 2
console.log(queue.extract()); // 2

const trie = new Trie();
trie.insert('car');
trie.insert('card');
trie.insert('care');

console.log(trie.startsWith('car')); // true
console.log(trie.wordsWithPrefix('car')); // ["car", "card", "care"]
```

### Graphs

```ts
import { Graph } from '@batoanng/types';

const graph = new Graph<string>();

graph.addEdge('A', 'B');
graph.addEdge('A', 'C');
graph.addEdge('B', 'D');

console.log(graph.neighbors('A')); // ["B", "C"]
console.log(graph.bfs('A')); // ["A", "B", "C", "D"]
```

## Shared Helpers

The `shared` entrypoint exposes the primitives reused across the structure implementations.

- `Comparator<T>`: `(a: T, b: T) => number`
- `defaultComparator`: ordering helper for primitive-like values
- `stableStringify`: deterministic structural stringification for hashing
- `polynomialHash`: string hash function used by `HashTable`
- `normalizeBucketIndex`: converts raw hash values into valid bucket indexes
- `hashValue`: convenience wrapper for deterministic hash key generation
- Node types such as `LinkedListNode<T>`, `DoublyNode<T>`, `CircularNode<T>`, `TreeNode<K, V>`, and `AvlNode<K, V>`

Comparator note:

- `defaultComparator` works for ordered primitive-like values such as numbers, strings, booleans, bigints, and symbols.
- For object ordering, pass a custom comparator into `MinStack`, `BinarySearchTree`, `AvlTree`, or `PriorityQueue`.

Hashing note:

- `HashTable` and `HashSet` use deterministic structural hashing.
- JSON-like objects with the same shape and values hash the same way.
- Circular object graphs are intentionally out of scope.

## Data Structures

### Array-Based

#### `ArrayList<T>`

Use `ArrayList` for ordered, index-based storage with fast random access and append-heavy workloads.

Core API:

- `size`
- `get(index)`
- `set(index, value)`
- `push(value)`
- `pop()`
- `insertAt(index, value)`
- `removeAt(index)`
- `search(value)`
- `clear()`
- `toArray()`

#### `Stack<T>`

Use `Stack` for LIFO workflows such as undo history, parsing, depth-first search, and expression evaluation.

Core API:

- `size`
- `push(value)`
- `pop()`
- `peek()`
- `isEmpty()`
- `contains(value)`
- `clear()`

#### `MinStack<T>`

`MinStack` extends the stack pattern with `min()` in constant time by tracking current minima alongside pushed values.

Core API:

- `size`
- `push(value)`
- `pop()`
- `peek()`
- `min()`
- `isEmpty()`
- `clear()`

### Queue and Linked Structures

#### `Queue<T>`

`Queue` is FIFO and uses `Map<number, T>` internally, so it avoids the `Array.shift()` cost that would otherwise make repeated dequeues slow.

Core API:

- `size`
- `enqueue(value)`
- `dequeue()`
- `peek()`
- `isEmpty()`
- `contains(value)`
- `clear()`

#### `Deque<T>`

`Deque` supports insertion and removal from both ends and is implemented with doubly linked pointers.

Core API:

- `size`
- `addFront(value)`
- `addBack(value)`
- `removeFront()`
- `removeBack()`
- `peekFront()`
- `peekBack()`
- `isEmpty()`
- `contains(value)`
- `clear()`

#### `LinkedList<T>`

`LinkedList` is a singly linked list with both head and tail references. Prepend, append, and head removal are constant time.

Core API:

- `size`
- `prepend(value)`
- `append(value)`
- `removeHead()`
- `headValue()`
- `tailValue()`
- `insertAt(index, value)`
- `removeAt(index)`
- `indexOf(value)`
- `clear()`
- `toArray()`

#### `DoublyLinkedList<T>`

`DoublyLinkedList` stores previous and next links, which makes removal from either end and removal by a known node reference constant time.

Core API:

- `size`
- `prepend(value)`
- `append(value)`
- `removeHead()`
- `removeTail()`
- `removeNode(node)`
- `peekHead()`
- `peekTail()`
- `find(value)`
- `insertAt(index, value)`
- `clear()`
- `toArray()`

#### `CircularLinkedList<T>`

`CircularLinkedList` keeps the tail pointing back to the head. It is useful for round-robin iteration, playlists, and cyclic schedulers.

Core API:

- `size`
- `append(value)`
- `prepend(value)`
- `removeHead()`
- `peekHead()`
- `peekTail()`
- `rotate()`
- `find(value)`
- `removeByValue(value)`
- `clear()`
- `toArray()`

### Sets, Maps, and Hashing

#### `MySet<T>`

`MySet` is a uniqueness-oriented collection implemented on top of `Map`.

Core API:

- `size`
- `add(value)`
- `has(value)`
- `delete(value)`
- `clear()`
- `values()`
- `union(other)`
- `intersection(other)`
- `difference(other)`
- `isSubsetOf(other)`

#### `Dictionary<K, V>`

`Dictionary` is a thin wrapper around `Map<K, V>` for key-value storage, including object keys.

Core API:

- `size`
- `set(key, value)`
- `get(key)`
- `has(key)`
- `delete(key)`
- `clear()`
- `keys()`
- `values()`
- `entries()`
- `forEach(callback)`

#### `HashTable<K, V>`

`HashTable` is a bucketed hash map implementation with separate chaining and resize-on-load-factor behavior.

Defaults:

- Initial capacity: `16`
- Resize threshold: `0.75`
- Collision strategy: separate chaining

Core API:

- `size`
- `put(key, value)`
- `get(key)`
- `has(key)`
- `remove(key)`
- `clear()`

#### `HashSet<T>`

`HashSet` wraps `HashTable<T, true>` to provide a set backed by the same hashing behavior.

Core API:

- `size`
- `add(value)`
- `has(value)`
- `delete(value)`
- `clear()`

### Ordered Trees and Heaps

#### `BinarySearchTree<K, V = K>`

`BinarySearchTree` maintains sorted order via left and right child links. It updates values when the same key is inserted again.

Core API:

- `size`
- `insert(key, value)`
- `get(key)`
- `has(key)`
- `min()`
- `max()`
- `remove(key)`
- `inOrder()`

#### `AvlTree<K, V = K>`

`AvlTree` is a self-balancing binary search tree. It keeps height logarithmic by performing rotations during insert and remove operations.

Core API:

- `size`
- `insert(key, value)`
- `get(key)`
- `has(key)`
- `min()`
- `max()`
- `remove(key)`
- `inOrder()`

#### `PriorityQueue<T>`

`PriorityQueue` is a binary heap stored in an array. The default comparator gives min-heap behavior.

Core API:

- `size`
- `insert(value)`
- `peek()`
- `extract()`
- `update(value)`
- `remove(value)`
- `clear()`

### String and Graph Structures

#### `Trie`

`Trie` is a prefix tree for string lookup, prefix checks, and autocomplete-style queries. It is case-sensitive.

Core API:

- `size`
- `insert(word)`
- `has(word)`
- `startsWith(prefix)`
- `delete(word)`
- `wordsWithPrefix(prefix)`
- `clear()`

#### `Graph<V>`

`Graph` is an undirected adjacency-map graph.

Behavior defaults:

- Missing vertices are auto-created by `addEdge`
- Duplicate edges are ignored
- Self-loops are ignored
- `edgeCount` counts each undirected edge once

Core API:

- `vertexCount`
- `edgeCount`
- `addVertex(vertex)`
- `addEdge(a, b)`
- `removeVertex(vertex)`
- `removeEdge(a, b)`
- `hasVertex(vertex)`
- `hasEdge(a, b)`
- `neighbors(vertex)`
- `bfs(start)`
- `dfs(start)`
- `clear()`

## Complexity Reference

The table below focuses on the typical or core operation costs for each structure.

| Structure | Typical strengths | Core operation complexity |
| --- | --- | --- |
| `ArrayList` | Random access and append | `get`/`set`: `O(1)`, `push` amortized `O(1)`, `pop`: `O(1)`, `insertAt`/`removeAt`: `O(n)` |
| `Stack` | LIFO push/pop | `push`/`pop`/`peek`: `O(1)`, `contains`: `O(n)` |
| `MinStack` | Stack with constant-time min lookup | `push`/`pop`/`peek`/`min`: `O(1)` |
| `Queue` | FIFO enqueue/dequeue | `enqueue`/`dequeue`/`peek`: `O(1)`, `contains`: `O(n)` |
| `Deque` | Double-ended access | end insert/remove/peek: `O(1)`, `contains`: `O(n)` |
| `LinkedList` | Head operations plus tail append | `prepend`/`append`/`removeHead`: `O(1)`, `insertAt`/`removeAt`/`indexOf`: `O(n)` |
| `DoublyLinkedList` | Both-end removal and known-node deletion | `prepend`/`append`/`removeHead`/`removeTail`/`removeNode`: `O(1)`, `find`/`insertAt`: `O(n)` |
| `CircularLinkedList` | Cyclic iteration and rotation | `append`/`prepend`/`removeHead`/`rotate`: `O(1)`, `find`/`removeByValue`: `O(n)` |
| `MySet` | Unique values with set algebra | `add`/`has`/`delete`: average `O(1)`, `union`/`intersection`/`difference`: `O(n + m)` or better depending on overlap |
| `Dictionary` | Key-value storage with object keys | `set`/`get`/`has`/`delete`: average `O(1)`, `keys`/`values`/`entries`/`forEach`: `O(n)` |
| `HashTable` | Learning-oriented hashed storage | `put`/`get`/`has`/`remove`: average `O(1)`, worst `O(n)`, resize: `O(n)` |
| `HashSet` | Set backed by `HashTable` | `add`/`has`/`delete`: average `O(1)`, worst `O(n)` |
| `BinarySearchTree` | Sorted storage without balancing | average `insert`/`get`/`remove`: `O(log n)`, worst `O(n)`, `inOrder`: `O(n)` |
| `AvlTree` | Sorted storage with balancing | `insert`/`get`/`remove`: `O(log n)`, rotations: `O(1)`, `inOrder`: `O(n)` |
| `PriorityQueue` | Priority ordering | `peek`: `O(1)`, `insert`/`extract`/`update`/`remove`: `O(log n)` |
| `Trie` | Prefix lookups | `insert`/`has`/`delete`: `O(k)`, `startsWith`: `O(p)`, `wordsWithPrefix`: `O(p + output)` |
| `Graph` | Sparse relationship storage and traversal | vertex/edge add and existence checks: average `O(1)`, `neighbors`: `O(degree)`, `bfs`/`dfs`: `O(V + E)` |

## Exported Structure List

- `ArrayList`
- `Stack`
- `MinStack`
- `Queue`
- `Deque`
- `LinkedList`
- `DoublyLinkedList`
- `CircularLinkedList`
- `MySet`
- `Dictionary`
- `HashTable`
- `HashSet`
- `BinarySearchTree`
- `AvlTree`
- `PriorityQueue`
- `Trie`
- `Graph`

## Package Layout

```text
src/
├── errors/
├── shared/
│   ├── comparator.ts
│   ├── hash.ts
│   ├── node.ts
│   └── index.ts
├── structures/
│   ├── array-list.ts
│   ├── stack.ts
│   ├── min-stack.ts
│   ├── queue.ts
│   ├── deque.ts
│   ├── linked-list.ts
│   ├── doubly-linked-list.ts
│   ├── circular-linked-list.ts
│   ├── set.ts
│   ├── dictionary.ts
│   ├── hash-table.ts
│   ├── hash-set.ts
│   ├── binary-search-tree.ts
│   ├── avl-tree.ts
│   ├── heap.ts
│   ├── trie.ts
│   ├── graph.ts
│   └── index.ts
└── index.tsx
```
