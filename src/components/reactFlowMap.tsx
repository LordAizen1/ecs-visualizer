"use client"

import { useEffect, useState } from "react"
import ReactFlow, {
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
} from "reactflow"
import "reactflow/dist/style.css"

import { getRoot } from "@/lib/api" // Your API function
import CustomNode from "./CustomNode"
import NodeDetailsSheet from "./NodeDetailsSheet"

const nodeTypes = { custom: CustomNode };

const initialNodes: Node[] = [
  {
    id: "1",
    position: { x: 0, y: 0 },
    data: { label: "Task-01" },
    type: "input",
  },
  {
    id: "2",
    position: { x: 0, y: 100 },
    data: { label: "Task-02" },
  },
  {
    id: "3",
    position: { x: 200, y: 50 },
    data: { label: "Cluster-Dev" },
    style: { backgroundColor: "#c1e7ff" },
  },
  {
    id: "4",
    position: { x: 400, y: 50 },
    data: { label: "Cluster-Prod" },
    style: { backgroundColor: "#c1e7ff" },
  },
]

const initialEdges: Edge[] = [
  { id: "e1-3", source: "1", target: "3" },
  { id: "e1-4", source: "1", target: "4" },
  { id: "e2-3", source: "2", target: "3" },
]

import ELK from 'elkjs/lib/elk.bundled.js';

const elk = new ELK();

const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
  const graph = {
    id: 'root',
    layoutOptions: { 'elk.algorithm': 'layered', 'elk.direction': 'RIGHT' },
    children: nodes.map((node) => ({
      ...node,
      width: 80,
      height: 80,
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

const Legend = () => (
  <div className="absolute top-4 right-4 p-3 bg-white dark:bg-black border rounded-lg shadow-lg z-10">
    <h4 className="text-sm font-semibold mb-2">Legend</h4>
    <div className="flex items-center mb-1">
      <div
        className="w-4 h-4 rounded-full mr-2 border"
        style={{ backgroundColor: "#a855f7" }} // Purple
      ></div>
      <span className="text-xs">External Endpoints</span>
    </div>
    <div className="flex items-center mb-1">
      <div
        className="w-4 h-4 rounded-full mr-2 border"
        style={{ backgroundColor: "#93c5fd" }} // Blue
      ></div>
      <span className="text-xs">Cluster</span>
    </div>
    <div className="flex items-center">
      <div
        className="w-4 h-4 rounded-full mr-2 border"
        style={{ backgroundColor: "#86efac" }} // Green
      ></div>
      <span className="text-xs">Task</span>
    </div>
  </div>
)

const clusterProdData = {
  name: "Cluster-Prod",
  region: "us-east-1",
  overview: {
    totalTasks: "8 Running, 1 Pending",
    services: "2",
    cpuUtilization: "65%",
    memoryUtilization: "48%",
    activeConnections: "24",
  },
  services: [
    {
      name: "web-service",
      runningTasks: "2 tasks",
      launchType: "Fargate",
      tasks: ["task-01", "task-02"],
    },
    {
      name: "api-gateway-service",
      runningTasks: "1 task",
      launchType: "EC2",
      tasks: ["task-03"],
    },
  ],
  risks: {
    unusedPermissions: 3,
    riskyNetworkFlows: 2,
    compliantTasks: 2,
  },
};

interface ClusterVisualizationProps {
  showOnlyRisky: boolean
  showOnlyExternal: boolean
}

const ClusterVisualization = ({
  showOnlyRisky,
  showOnlyExternal,
}: ClusterVisualizationProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNode, setSelectedNode] = useState<any>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const [apiData, setApiData] = useState<any>(null)
  const [loading, setLoading] = useState<any>(true)
  const [error, setError] = useState<string | null>(null)

  const onNodeClick = (event: React.MouseEvent, node: Node) => {
    if (node.data.label === "Cluster-Prod") {
      setSelectedNode(clusterProdData);
      setIsSheetOpen(true);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getRoot();
        setApiData(result);
      } catch (err) {
        setError("Failed to connect to the backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (apiData && apiData.nodes) {
      let transformedNodes = apiData.nodes.map((node: any) => {
        const nodeType = node.label;
        let color = '#ccc';
        if (nodeType === 'Task') {
          color = '#86efac';
        } else if (nodeType === 'Cluster') {
          color = '#93c5fd';
        } else if (nodeType === 'External Endpoint') {
          color = '#a855f7';
        }

        return {
          id: node.id,
          type: 'custom',
          position: { x: 0, y: 0 },
          data: {
            label: node.properties.name || node.properties.id || node.id,
            isRisky: node.properties.isRisky || false,
            isExternal: node.properties.isExternal || false,
            backgroundColor: color,
          },
        };
      });

      let transformedEdges = apiData.edges.map((edge: any) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        isRisky: edge.properties.isRisky || false,
        style: edge.properties.isRisky ? { stroke: '#34D399', strokeWidth: 3 } : undefined,
        animated: edge.properties.isRisky,
      }));

      if (showOnlyRisky) {
        transformedEdges = transformedEdges.filter((edge: any) => edge.isRisky);
        const riskyNodeIds = new Set();
        transformedEdges.forEach((edge: any) => {
          riskyNodeIds.add(edge.source);
          riskyNodeIds.add(edge.target);
        });
        transformedNodes = transformedNodes.filter((node: any) => riskyNodeIds.has(node.id));
      }

      if (showOnlyExternal) {
        transformedNodes = transformedNodes.filter((node: any) => node.data.isExternal);
        const externalNodeIds = new Set(transformedNodes.map((node: any) => node.id));
        transformedEdges = transformedEdges.filter(
          (edge: any) => externalNodeIds.has(edge.source) && externalNodeIds.has(edge.target)
        );
      }

      getLayoutedElements(transformedNodes, transformedEdges).then(({ nodes, edges }) => {
        setNodes(nodes);
        setEdges(edges);
      });
    }
  }, [apiData, showOnlyRisky, showOnlyExternal, setNodes, setEdges]);

  if (loading) {
    return <div className="flex h-full items-center justify-center">Loading...</div>
  }

  if (error) {
    return <div className="flex h-full items-center justify-center text-red-500">{error}</div>
  }

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
        <Legend />
      </ReactFlow>
      <NodeDetailsSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        nodeData={selectedNode}
      />
    </div>
  )
}

export default ClusterVisualization