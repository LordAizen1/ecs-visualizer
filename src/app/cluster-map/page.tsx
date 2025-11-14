"use client"

import { useEffect, useState } from "react"
import { getRoot } from "@/lib/api"

const ClusterMapPage = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getRoot()
        setData(result)
      } catch (err) {
        setError("Failed to connect to the backend. Please ensure it's running.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div>
      <h1>ECS Cluster Map</h1>
      <p>This page will display the interactive cluster map visualization.</p>
      <div className="mt-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Backend Connection Test</h2>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {data && (
          <div>
            <p>Successfully connected to the backend!</p>
            <pre className="bg-gray-100 p-2 rounded mt-2">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}

export default ClusterMapPage
