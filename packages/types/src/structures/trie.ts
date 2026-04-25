type TrieNode = {
  children: Map<string, TrieNode>;
  isWord: boolean;
};

export class Trie {
  private root: TrieNode = { children: new Map<string, TrieNode>(), isWord: false };
  private count = 0;

  get size(): number {
    return this.count;
  }

  insert(word: string): boolean {
    let node = this.root;

    for (const char of word) {
      let next = node.children.get(char);

      if (!next) {
        next = { children: new Map<string, TrieNode>(), isWord: false };
        node.children.set(char, next);
      }

      node = next;
    }

    if (node.isWord) {
      return false;
    }

    node.isWord = true;
    this.count += 1;
    return true;
  }

  has(word: string): boolean {
    const node = this.findNode(word);
    return node?.isWord === true;
  }

  startsWith(prefix: string): boolean {
    return this.findNode(prefix) !== undefined;
  }

  delete(word: string): boolean {
    const deleteRecursively = (node: TrieNode, depth: number): [boolean, boolean] => {
      const currentNode = node;

      if (depth === word.length) {
        if (!currentNode.isWord) {
          return [false, false];
        }

        currentNode.isWord = false;
        return [currentNode.children.size === 0, true];
      }

      const char = word[depth];
      const child = currentNode.children.get(char);

      if (!child) {
        return [false, false];
      }

      const [shouldDeleteChild, deleted] = deleteRecursively(child, depth + 1);

      if (shouldDeleteChild) {
        currentNode.children.delete(char);
      }

      return [currentNode.children.size === 0 && !currentNode.isWord, deleted];
    };

    const [, deleted] = deleteRecursively(this.root, 0);

    if (deleted) {
      this.count -= 1;
    }

    return deleted;
  }

  wordsWithPrefix(prefix: string): string[] {
    const start = this.findNode(prefix);

    if (!start) {
      return [];
    }

    const words: string[] = [];

    const collect = (node: TrieNode, current: string): void => {
      if (node.isWord) {
        words.push(current);
      }

      for (const [char, child] of node.children.entries()) {
        collect(child, `${current}${char}`);
      }
    };

    collect(start, prefix);
    return words.sort((left, right) => left.localeCompare(right));
  }

  clear(): void {
    this.root = { children: new Map<string, TrieNode>(), isWord: false };
    this.count = 0;
  }

  private findNode(input: string): TrieNode | undefined {
    let node = this.root;

    for (const char of input) {
      const next = node.children.get(char);

      if (!next) {
        return undefined;
      }

      node = next;
    }

    return node;
  }
}
