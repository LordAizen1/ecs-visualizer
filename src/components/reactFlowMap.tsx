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

// --- MOCK DATA ---
// This is the format React Flow needs.
// Your API data must be transformed into this structure.
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
// --- END MOCK DATA ---

// This is the legend you see in the image
const Legend = () => (
  <div className="absolute bottom-4 left-4 p-3 bg-white dark:bg-gray-800 border rounded-lg shadow-lg z-10">
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

  // State for your API data
  const [apiData, setApiData] = useState<any>(null)
  const [loading, setLoading] = useState<any>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Fetch data from your backend
    const fetchData = async () => {
      try {
        const result = await getRoot()
        setApiData(result)

        //
        // --- !!! YOUR NEXT STEP IS HERE !!! ---
        //
        // You must write a function to convert the 'result'
        // from your API into the 'nodes' and 'edges' format
        
        // PSEUDO-CODE - Your logic will be different
        //
        // FIX: Added (task: any) to solve the TypeScript error
        const newNodes = result.tasks.map((task: any) => ({
          id: task.id,
          position: { x: Math.random() * 400, y: Math.random() * 400 },
          data: { label: task.name } // <--- This will show YOUR task names
        }));
        
        // FIX: Added (conn: any) to solve the TypeScript error
        const newEdges = result.connections.map((conn: any) => ({
          id: `${conn.from}-${conn.to}`,
          source: conn.from,
          target: conn.to
        }));

        setNodes(newNodes);
        setEdges(newEdges);
        //
      } catch (err) {
        setError("Failed to connect to the backend.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, []) // Runs once on mount



  // --- HOOK 1: Fetch data (runs only once) ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getRoot();
        setApiData(result); // 1. Just save the raw data
      } catch (err) {
        setError("Failed to connect to the backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty array means "run only once"


  // --- HOOK 2: Transform and Filter (runs when data or filters change) ---
  useEffect(() => {
    if (apiData && apiData.nodes) { // <-- Check for apiData.nodes
      
      // 1. Transform API data into nodes and edges
      let transformedNodes = apiData.nodes.map((node: any) => ({
        id: node.id, // Use the ID from the backend
        position: { x: Math.random() * 400, y: Math.random() * 400 },
        data: {
          // Use properties.name or properties.id as the label
          label: node.properties.name || node.properties.id || node.id,
          // You can pass all properties for filtering
          isRisky: node.properties.isRisky || false, 
          isExternal: node.properties.isExternal || false
        } 
      }));
      
      let transformedEdges = apiData.edges.map((edge: any) => ({
        id: edge.id,     // Use the edge ID from the backend
        source: edge.source, // Use the source from the backend
        target: edge.target, // Use the target from the backend
        isRisky: edge.properties.isRisky || false // Use properties
      }));

      // 2. Apply filters (this logic is still an example)
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
        transformedEdges = transformedEdges.filter((edge: any) => 
          externalNodeIds.has(edge.source) && externalNodeIds.has(edge.target)
        );
      }

      // 3. Set the final nodes and edges
      setNodes(transformedNodes);
      setEdges(transformedEdges);
    }
  }, [apiData, showOnlyRisky, showOnlyExternal, setNodes, setEdges]);

  if (loading) {
    return <div className="flex h-full items-center justify-center">Loading...</div>
  }

  if (error) {
    return <div className="flex h-full items-center justify-center text-red-500">{error}</div>
  }

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      fitView
    >
      <Background />
      <Controls />
      <MiniMap />
      <Legend />
    </ReactFlow>
  )
}

export default ClusterVisualization