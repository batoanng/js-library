import { describe, expect, it } from 'vitest';
import { Graph } from '../structures/graph';

describe('Graph', () => {
  it('adds vertices once and auto-creates vertices for edges', () => {
    const graph = new Graph<string>();

    expect(graph.addVertex('A')).toBe(true);
    expect(graph.addVertex('A')).toBe(false);

    graph.addEdge('A', 'B');

    expect(graph.hasVertex('B')).toBe(true);
    expect(graph.hasEdge('A', 'B')).toBe(true);
    expect(graph.hasEdge('B', 'A')).toBe(true);
    expect(graph.vertexCount).toBe(2);
    expect(graph.edgeCount).toBe(1);
  });

  it('ignores duplicate and self-loop edges and keeps counts correct', () => {
    const graph = new Graph<string>();

    graph.addEdge('A', 'B');
    graph.addEdge('A', 'B');
    graph.addEdge('A', 'A');

    expect(graph.edgeCount).toBe(1);
    expect(graph.neighbors('A')).toEqual(['B']);
    expect(graph.removeEdge('A', 'B')).toBe(true);
    expect(graph.removeEdge('A', 'B')).toBe(false);
    expect(graph.edgeCount).toBe(0);
  });

  it('removes vertices with incident edges and traverses reachable vertices', () => {
    const graph = new Graph<string>();

    graph.addEdge('A', 'B');
    graph.addEdge('A', 'C');
    graph.addEdge('B', 'D');
    graph.addVertex('E');

    expect(graph.bfs('A')).toEqual(['A', 'B', 'C', 'D']);
    expect(graph.dfs('A')).toEqual(['A', 'B', 'D', 'C']);
    expect(graph.removeVertex('B')).toBe(true);
    expect(graph.hasEdge('A', 'B')).toBe(false);
    expect(graph.edgeCount).toBe(1);

    graph.clear();
    expect(graph.vertexCount).toBe(0);
    expect(graph.edgeCount).toBe(0);
  });
});
