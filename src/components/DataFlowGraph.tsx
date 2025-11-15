"use client"

import { useEffect, useState } from "react"
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
} from "reactflow"
import "reactflow/dist/style.css"
import ELK from 'elkjs/lib/elk.bundled.js';
import DataFlowNode from "./DataFlowNode";

const nodeTypes = { custom: DataFlowNode };

const elk = new ELK();

const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
  const graph = {
    id: 'root',
    layoutOptions: { 'elk.algorithm': 'layered', 'elk.direction': 'RIGHT' },
    children: nodes.map((node) => ({
      ...node,
      width: node.data.type === 'dependency' ? 80 : 150,
      height: node.data.type === 'dependency' ? 40 : 50,
    })),
    edges: edges,
  };

  return elk
    .layout(graph)
    .then((layoutedGraph) => ({
      nodes: layoutedGraph.children.map((node) => ({
        ...node,
        position: { x: node.x, y: node.y },
      })),
      edges: layoutedGraph.edges,
    }))
    .catch(console.error);
};

const initialNodes: Node[] = [
  { id: 'task-01', type: 'custom', data: { label: 'TASK-01', type: 'task' }, position: { x: 0, y: 0 } },
  { id: 'd0', type: 'custom', data: { label: 'D0', type: 'dependency' }, position: { x: 0, y: 0 } },
  { id: 'd1', type: 'custom', data: { label: 'D1', type: 'dependency' }, position: { x: 0, y: 0 } },
  { id: 'd2', type: 'custom', data: { label: 'D2', type: 'dependency' }, position: { x: 0, y: 0 } },
  { id: 'd3', type: 'custom', data: { label: 'D3', type: 'dependency' }, position: { x: 0, y: 0 } },
  { id: 'd4', type: 'custom', data: { label: 'D4', type: 'dependency' }, position: { x: 0, y: 0 } },
  { id: 'res-1', type: 'custom', data: { label: 'RESOURCE 1', type: 'resource' }, position: { x: 0, y: 0 } },
  { id: 'res-2', type: 'custom', data: { label: 'RESOURCE 2', type: 'resource' }, position: { x: 0, y: 0 } },
  { id: 'res-3', type: 'custom', data: { label: 'RESOURCE 3', type: 'resource' }, position: { x: 0, y: 0 } },
];

const initialEdges: Edge[] = [
  { id: 'e-task-d0', source: 'task-01', target: 'd0', label: 'PERMISSION O' },
  { id: 'e-task-d1', source: 'task-01', target: 'd1', label: 'PERMISSION Y' },
  { id: 'e-task-d2', source: 'task-01', target: 'd2', label: 'PERMISSION Z' },
  { id: 'e-task-d3', source: 'task-01', target: 'd3', label: 'PERMISSION X' },
  { id: 'e-task-d4', source: 'task-01', target: 'd4', label: 'PERMISSION V' },
  { id: 'e-d0-res1', source: 'd0', target: 'res-1', label: 'PERMISSION M' },
  { id: 'e-d1-res1', source: 'd1', target: 'res-1', label: 'PERMISSION N' },
  { id: 'e-d2-res2', source: 'd2', target: 'res-2', label: 'PERMISSION Y' },
  { id: 'e-d3-res3', source: 'd3', target: 'res-3', label: 'PERMISSION P' },
  { id: 'e-d4-res3', source: 'd4', target: 'res-3', label: 'PERMISSION K' },
];

const DataFlowGraph = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    getLayoutedElements(initialNodes, initialEdges).then(({ nodes, edges }) => {
      setNodes(nodes);
      setEdges(edges);
    });
  }, []);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      fitView
      className="h-full"
    >
      <Background />
      <Controls />
    </ReactFlow>
  );
};

export default DataFlowGraph;