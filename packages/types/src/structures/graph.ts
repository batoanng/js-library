export class Graph<V> {
  private adjacency = new Map<V, Set<V>>();
  private edges = 0;

  get vertexCount(): number {
    return this.adjacency.size;
  }

  get edgeCount(): number {
    return this.edges;
  }

  addVertex(vertex: V): boolean {
    if (this.adjacency.has(vertex)) {
      return false;
    }

    this.adjacency.set(vertex, new Set<V>());
    return true;
  }

  addEdge(a: V, b: V): void {
    if (Object.is(a, b)) {
      this.addVertex(a);
      return;
    }

    if (!this.adjacency.has(a)) {
      this.addVertex(a);
    }

    if (!this.adjacency.has(b)) {
      this.addVertex(b);
    }

    const neighborsA = this.adjacency.get(a)!;
    const neighborsB = this.adjacency.get(b)!;

    if (neighborsA.has(b)) {
      return;
    }

    neighborsA.add(b);
    neighborsB.add(a);
    this.edges += 1;
  }

  removeVertex(vertex: V): boolean {
    const neighbors = this.adjacency.get(vertex);

    if (!neighbors) {
      return false;
    }

    for (const neighbor of neighbors) {
      this.adjacency.get(neighbor)?.delete(vertex);
      this.edges -= 1;
    }

    this.adjacency.delete(vertex);
    return true;
  }

  removeEdge(a: V, b: V): boolean {
    const neighborsA = this.adjacency.get(a);
    const neighborsB = this.adjacency.get(b);

    if (!neighborsA || !neighborsB || !neighborsA.has(b)) {
      return false;
    }

    neighborsA.delete(b);
    neighborsB.delete(a);
    this.edges -= 1;
    return true;
  }

  hasVertex(vertex: V): boolean {
    return this.adjacency.has(vertex);
  }

  hasEdge(a: V, b: V): boolean {
    return this.adjacency.get(a)?.has(b) ?? false;
  }

  neighbors(vertex: V): V[] {
    return [...(this.adjacency.get(vertex) ?? [])];
  }

  bfs(start: V): V[] {
    if (!this.adjacency.has(start)) {
      return [];
    }

    const visited = new Set<V>([start]);
    const queue: V[] = [start];
    const order: V[] = [];

    while (queue.length > 0) {
      const vertex = queue.shift()!;
      order.push(vertex);

      for (const neighbor of this.adjacency.get(vertex)!) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }

    return order;
  }

  dfs(start: V): V[] {
    if (!this.adjacency.has(start)) {
      return [];
    }

    const visited = new Set<V>();
    const order: V[] = [];

    const walk = (vertex: V): void => {
      if (visited.has(vertex)) {
        return;
      }

      visited.add(vertex);
      order.push(vertex);

      for (const neighbor of this.adjacency.get(vertex)!) {
        walk(neighbor);
      }
    };

    walk(start);
    return order;
  }

  clear(): void {
    this.adjacency = new Map<V, Set<V>>();
    this.edges = 0;
  }
}
