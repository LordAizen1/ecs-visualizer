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
  <div className="absolute bottom-4 left-4 p-3 bg-white dark:bg-gray-800 border rounded-lg shadow-lg">
    <h4 className="text-sm font-semibold mb-2">Legend</h4>
    <div className="flex items-center mb-1">
      <div className="w-4 h-4 rounded-full bg-purple-500 mr-2"></div>
      <span className="text-xs">External Endpoints</span>
    </div>
    <div className="flex items-center mb-1">
      <div className="w-4 h-4 rounded-full bg-blue-300 mr-2"></div>
      <span className="text-xs">Cluster</span>
    </div>
    <div className="flex items-center">
      <div className="w-4 h-4 rounded-full bg-green-300 mr-2"></div>
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
  const [apiData, setApiData] = useState(null)
  const [loading, setLoading] = useState(true)
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
        // that React Flow needs.
        //
        // const { newNodes, newEdges } = transformApiDataToFlow(result);
        // setNodes(newNodes);
        // setEdges(newEdges);
        //
      } catch (err) {
        setError("Failed to connect to the backend.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, []) // Runs once on mount

  // This useEffect will run when the filter toggles change
  useEffect(() => {
    if (apiData) {
      //
      // TODO: Re-filter your nodes and edges based on the props
      //
      // const { newNodes, newEdges } = transformApiDataToFlow(
      //   apiData,
      //   showOnlyRisky,
      //   showOnlyExternal
      // );
      // setNodes(newNodes);
      // setEdges(newEdges);
    }
  }, [showOnlyRisky, showOnlyExternal, apiData, setNodes, setEdges])

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