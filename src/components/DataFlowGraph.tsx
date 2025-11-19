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

const DataFlowGraph = ({ initialNodes, initialEdges }: { initialNodes: Node[], initialEdges: Edge[] }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [hoveredEdge, setHoveredEdge] = useState<string | null>(null);
  const [tooltipData, setTooltipData] = useState<{ x: number; y: number; action: string } | null>(null);
  const [isTooltipHovered, setIsTooltipHovered] = useState(false);

  useEffect(() => {
    getLayoutedElements(initialNodes, initialEdges).then(({ nodes, edges }) => {
      setNodes(nodes);
      // Modify edges to add colors and prepare for hover
      const modifiedEdges = (edges || []).map((edge: any) => {
        const risk = edge.data?.risk || edge.risk || 'low';
        const edgeColor = risk === 'high' ? '#ef4444' : risk === 'medium' ? '#eab308' : '#3b82f6';

        return {
          ...edge,
          type: 'smoothstep',
          style: {
            stroke: edgeColor,
            strokeWidth: hoveredEdge === edge.id ? 3 : 2
          },
          // Only show label on hover
          label: hoveredEdge === edge.id ? edge.label : undefined,
          labelStyle: { fontSize: 11, fontWeight: 600, fill: '#fff' },
          labelBgStyle: { fill: '#000', fillOpacity: 0.9 },
          labelBgPadding: [6, 8],
          animated: hoveredEdge === edge.id,
        };
      });
      setEdges(modifiedEdges);
    });
  }, [initialNodes, initialEdges, hoveredEdge]); // Re-run when hover state changes

  const onEdgeMouseEnter = (event: any, edge: Edge) => {
    setHoveredEdge(edge.id);

    // Find all edges between the same source and target
    const relatedEdges = edges.filter(
      (e: any) => e.source === edge.source && e.target === edge.target
    );

    // Collect all actions/permissions from these edges
    const allActions = relatedEdges.map((e: any) =>
      e.data?.fullAction || e.label || 'Unknown permission'
    );

    setTooltipData({
      x: event.clientX,
      y: event.clientY,
      action: allActions.join('\n') // Join with newlines for multiline display
    });
  };

  const onEdgeMouseLeave = () => {
    // Only hide if not hovering over tooltip
    setTimeout(() => {
      if (!isTooltipHovered) {
        setHoveredEdge(null);
        setTooltipData(null);
      }
    }, 100);
  };

  const onEdgeMouseMove = (event: any) => {
    if (tooltipData) {
      setTooltipData(prev => prev ? { ...prev, x: event.clientX, y: event.clientY } : null);
    }
  };

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onEdgeMouseEnter={onEdgeMouseEnter}
      onEdgeMouseLeave={onEdgeMouseLeave}
      onEdgeMouseMove={onEdgeMouseMove}
      nodeTypes={nodeTypes}
      fitView
      className="h-full"
    >
      <Background />
      <Controls />
      {/* Tooltip for edge permissions */}
      {tooltipData && (
        <div
          style={{
            position: 'fixed',
            left: tooltipData.x + 10,
            top: tooltipData.y + 10,
            zIndex: 1000,
          }}
          className="bg-black/90 text-white text-xs px-3 py-2 rounded shadow-lg max-w-sm max-h-64 overflow-y-auto"
          onMouseEnter={() => setIsTooltipHovered(true)}
          onMouseLeave={() => {
            setIsTooltipHovered(false);
            setTooltipData(null);
            setHoveredEdge(null);
          }}
        >
          <div className="font-semibold mb-2">Permissions ({tooltipData.action.split('\n').length}):</div>
          <div className="space-y-1">
            {tooltipData.action.split('\n').map((action, i) => (
              <div key={i} className="pl-2 border-l-2 border-white/30 py-0.5">
                {action}
              </div>
            ))}
          </div>
        </div>
      )}
    </ReactFlow>
  );
};

export default DataFlowGraph;