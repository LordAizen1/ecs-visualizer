"use client"

import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import ReactFlow, {
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  StepEdge, // Import StepEdge
} from "reactflow"
import "reactflow/dist/style.css"

import { getRoot } from "@/lib/api" // Your API function
import CustomNode from "./CustomNode"
import NodeDetailsSheet from "./NodeDetailsSheet"
import { Skeleton } from "@/components/ui/skeleton" // Import Skeleton

import ELK from 'elkjs/lib/elk.bundled.js';

const elk = new ELK();

const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
  const graph = {
    id: 'root',
    layoutOptions: { 'elk.algorithm': 'layered', 'elk.direction': 'RIGHT' }, // Reverted to RIGHT
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

const nodeTypes = { custom: CustomNode };
const edgeTypes = { step: StepEdge }; // Reverted to StepEdge

const legendData = {
  Cluster: { label: "Cluster", color: "#38bdf8" },
  Service: { label: "Service", color: "#fbbf24" },
  Task: { label: "Task", color: "#34d399" },
  IAMRole: { label: "IAM Role", color: "#fb7185" },
  Endpoint: { label: "Endpoint", color: "#a78bfa" },
};

const Legend = ({ nodes }: { nodes: Node[] }) => {
  const presentNodeTypes = new Set(nodes.map(node => node.data.type));

  return (
    <div className="absolute top-4 right-4 p-3 bg-white dark:bg-black border rounded-lg shadow-lg z-10">
      <h4 className="text-sm font-semibold mb-2">Legend</h4>
      {Object.entries(legendData).map(([type, { label, color }]) => {
        if (presentNodeTypes.has(type)) {
          return (
            <div className="flex items-center mb-1" key={type}>
              <div
                className="w-4 h-4 rounded-full mr-2 border"
                style={{ backgroundColor: color }}
              ></div>
              <span className="text-xs">{label}</span>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

interface ClusterVisualizationProps {
  showOnlyRisky: boolean;
  showOnlyExternal: boolean;
  searchQuery: string;
  visibleNodeTypes: {
    services: boolean;
    tasks: boolean;
    roles: boolean;
    endpoints: boolean;
  };
}

const ClusterVisualization = ({
  showOnlyRisky,
  showOnlyExternal,
  searchQuery,
  visibleNodeTypes,
}: ClusterVisualizationProps) => {
  const router = useRouter()
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [selectedNode, setSelectedNode] = useState<any>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const [apiData, setApiData] = useState<any>(null)
  const [loading, setLoading] = useState<any>(true)
  const [error, setError] = useState<string | null>(null)

  console.log("ClusterVisualization: loading state:", loading); // Debug log

  const onNodeClick = (event: React.MouseEvent, node: Node) => {
    if (node.data && node.data.overview) {
      setSelectedNode(node.data);
      setIsSheetOpen(true);
    } else if (node.data && node.data.type === 'Task') {
      router.push(`/cluster-map/task-details?nodeId=${encodeURIComponent(node.id)}`)
    }
  }

  useEffect(() => {
    console.log("ClusterVisualization: fetchData useEffect triggered"); // Debug log
    const fetchData = async () => {
      try {
        setLoading(true); // Ensure loading is true at the start of fetch
        const result = await getRoot();
        setApiData(result);
      } catch (err) {
        setError("Failed to connect to the backend.");
      } finally {
        setLoading(false);
        console.log("ClusterVisualization: fetchData completed, loading set to false"); // Debug log
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log("ClusterVisualization: apiData/filters useEffect triggered"); // Debug log
    if (apiData && apiData.nodes) {
      // Base transformation
      let transformedNodes = apiData.nodes.map((node: any) => {
        const nodeType = node.label;
        let color = '#ccc';
        if (nodeType === 'Task') color = '#34d399'; // emerald-400
        else if (nodeType === 'Cluster') color = '#38bdf8'; // sky-400
        else if (nodeType === 'Service') color = '#fbbf24'; // amber-400
        else if (nodeType === 'IAMRole') color = '#fb7185'; // rose-400
        else if (nodeType === 'Endpoint') color = '#a78bfa'; // violet-400

        return {
          id: node.id,
          type: 'custom',
          position: { x: 0, y: 0 },
          data: {
            ...node.properties,
            label: node.properties.name || node.properties.id || node.id,
            type: nodeType, // Pass the original type for filtering
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
        type: 'step', // Set edge type to StepEdge
        isRisky: edge.properties?.isRisky || false,
        style: edge.properties?.isRisky ? { stroke: '#34D399', strokeWidth: 3 } : undefined,
        animated: edge.properties?.isRisky,
        markerEnd: {
          type: 'arrowclosed', // Add arrowhead to the end of the edge
        },
      }));

      // --- FILTERING LOGELSIC ---

      // 1. Filter by node type visibility
      const typeVisibilityMap: { [key: string]: boolean } = {
        Service: visibleNodeTypes.services,
        Task: visibleNodeTypes.tasks,
        IAMRole: visibleNodeTypes.roles,
        Endpoint: visibleNodeTypes.endpoints,
        Cluster: true, // Always show clusters
      };
      transformedNodes = transformedNodes.filter(node => typeVisibilityMap[node.data.type]);

      // 2. Filter by search query
      if (searchQuery) {
        transformedNodes = transformedNodes.filter(node =>
          node.data.label.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      // 3. Filter by risk
      if (showOnlyRisky) {
        transformedEdges = transformedEdges.filter((edge: any) => edge.isRisky);
        const riskyNodeIds = new Set();
        transformedEdges.forEach((edge: any) => {
          riskyNodeIds.add(edge.source);
          riskyNodeIds.add(edge.target);
        });
        transformedNodes = transformedNodes.filter((node: any) => riskyNodeIds.has(node.id));
      }

      // 4. Filter by external
      if (showOnlyExternal) {
        transformedNodes = transformedNodes.filter((node: any) => node.data.isExternal);
      }

      // After all node filtering, filter edges to only include those connecting visible nodes
      const visibleNodeIds = new Set(transformedNodes.map(n => n.id));
      transformedEdges = transformedEdges.filter(
        edge => visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target)
      );

      getLayoutedElements(transformedNodes, transformedEdges).then(({ nodes, edges }) => {
        setNodes(nodes);
        setEdges(edges);
      });
    }
  }, [apiData, showOnlyRisky, showOnlyExternal, searchQuery, visibleNodeTypes, setNodes, setEdges]);

  return (
    <div className="h-full w-full">
      {loading ? (
        <div className="flex h-full w-full items-center justify-center">
          <Skeleton className="h-full w-full" />
        </div>
      ) : (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes} // Pass custom edge types
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
          <Legend nodes={nodes} />
        </ReactFlow>
      )}
      <NodeDetailsSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        nodeData={selectedNode}
      />
    </div>
  )
}

export default ClusterVisualization