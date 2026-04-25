---
name: use-types-structures
description: Use when implementing or reviewing a new feature, helper, algorithm, or function in this repo and data-structure choice or complexity matters. Before adding custom storage logic, check `packages/types` for an existing structure to reuse. Call out the expected time complexity of the new function and justify the chosen structure.
---

# Use Types Structures

Before implementing a new feature or function in this repo, check whether `packages/types` already provides the right data structure. Prefer reusing that package over ad hoc arrays, objects, or one-off storage utilities when the behavior matches.

## Workflow

1. Identify the dominant operations in the new code path.
2. Estimate the target complexity for the hot path before writing code.
3. Check `packages/types/README.md` and `packages/types/src/structures` for an existing structure that matches those operations.
4. Reuse `@batoanng/types` from other packages when the structure already exists.
5. Only build a new local structure if `packages/types` does not fit the problem or would materially complicate the code.
6. In the final explanation, state which structure was chosen and the expected complexity of the new function or critical operations.

## Structure Selection Heuristics

- Use `ArrayList` for indexed reads and append-heavy ordered storage.
- Use `Stack` or `MinStack` for LIFO workflows, parsing, DFS, undo, or min-tracking.
- Use `Queue` for FIFO processing and BFS.
- Use `Deque` when both ends need efficient insertion or removal.
- Use `LinkedList`, `DoublyLinkedList`, or `CircularLinkedList` only when pointer-style insert/remove behavior is the reason.
- Use `MySet`, `HashSet`, or `Dictionary` for average `O(1)` membership and keyed lookups.
- Use `HashTable` when lower-level hashing behavior is part of the requirement.
- Use `BinarySearchTree` or `AvlTree` when ordered lookups or sorted traversal matter.
- Use `PriorityQueue` for top-k, scheduling, repeated best-item extraction, or heap semantics.
- Use `Trie` for prefix lookup and autocomplete.
- Use `Graph` for adjacency and traversal problems.

## Complexity Expectations

Always mention the complexity of the important operation(s) in the new function when it is not trivial. Focus on:

- Lookup cost
- Insert or update cost
- Removal cost
- Traversal cost
- Any amortized behavior

If the code intentionally accepts a slower operation, explain why that tradeoff is acceptable.

## Repo-Specific Guidance

- Read `packages/types/README.md` for the current exported structures, behaviors, and complexity table.
- Check `packages/types/src/structures/index.ts` for the exported structure list.
- Check `packages/types/src/shared/index.ts` for reusable comparator and hash helpers before inventing local equivalents.
- Outside `packages/types`, prefer importing from `@batoanng/types` instead of duplicating queue, stack, set, tree, trie, or graph logic.
- Inside `packages/types`, extend the package only when the repo genuinely needs a missing reusable structure.

## Expected Output

When you finish a relevant coding task, include a short note covering:

- The chosen structure, or that no existing structure fit
- Why it matches the access pattern
- The expected complexity of the critical path
