"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertTriangle, CheckCircle } from "lucide-react"

const NodeDetailsPage = () => {
  const params = useParams()
  const nodeId = params.nodeId as string
  const [nodeData, setNodeData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNodeDetails = async () => {
      if (!nodeId) return
      try {
        const response = await fetch(
          `http://localhost:8001/api/v1/nodes/${nodeId}`
        )
        if (!response.ok) {
          throw new Error("Failed to fetch node details")
        }
        const data = await response.json()
        setNodeData(data.details)
      } catch (err) {
        setError("Failed to load node details.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchNodeDetails()
  }, [nodeId])

  if (loading) {
    return <div className="flex h-full items-center justify-center">Loading...</div>
  }

  if (error) {
    return <div className="flex h-full items-center justify-center text-red-500">{error}</div>
  }

  if (!nodeData) {
    return <div className="flex h-full items-center justify-center">No data available.</div>
  }

  const { task_configuration, network_info, permissions, endpoints, risks } = nodeData;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{task_configuration.task_name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Task Configuration & Runtime Details</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p><strong>Service:</strong> {task_configuration.service}</p>
            <p><strong>Launch Type:</strong> {task_configuration.launch_type}</p>
            <p><strong>Task Name:</strong> {task_configuration.task_name}</p>
            <p><strong>Task Definition:</strong> {task_configuration.task_definition}</p>
            <p><strong>Role:</strong> {task_configuration.role}</p>
            <p className="truncate"><strong>Full ARN:</strong> {task_configuration.full_arn}</p>
            <p><strong>CPU:</strong> {task_configuration.cpu}</p>
            <p><strong>Memory:</strong> {task_configuration.memory}</p>
            <p><strong>Status:</strong> <span className="text-green-500">{task_configuration.status}</span></p>
            <p><strong>Started:</strong> {task_configuration.started}</p>
            <p><strong>Container:</strong> {task_configuration.container}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Network & Security Group Info</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p><strong>Security Group:</strong> {network_info.security_group}</p>
            <div>
              <strong>Inbound:</strong>
              <ul className="list-disc list-inside">
                {network_info.inbound.map((rule: string, index: number) => (
                  <li key={index}>{rule}</li>
                ))}
              </ul>
            </div>
            <div>
              <strong>Outbound:</strong>
              <ul className="list-disc list-inside">
                {network_info.outbound.map((rule: string, index: number) => (
                  <li key={index}>{rule}</li>
                ))}
              </ul>
            </div>
            <p><strong>VPC:</strong> {network_info.vpc}</p>
            <p><strong>Subnet:</strong> {network_info.subnet}</p>
            <p><strong>AZ:</strong> {network_info.az}</p>
            <p><strong>CIDR:</strong> {network_info.cidr}</p>
            <p><strong>ENI:</strong> {network_info.eni}</p>
            <p><strong>Private IP:</strong> {network_info.private_ip}</p>
            <p><strong>Public IP:</strong> {network_info.public_ip}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            {permissions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Permission</TableHead>
                    <TableHead>Resource</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {permissions.map((perm: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{perm.permission}</TableCell>
                      <TableCell>{perm.resource}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center p-4">No permissions found.</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Endpoints</CardTitle>
          </CardHeader>
          <CardContent>
            {endpoints.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {/* This will be populated with real data later */}
              </div>
            ) : (
              <div className="text-center p-4">No endpoints found.</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security & Risks Summary</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            {risks.length > 0 ? (
              risks.map((risk: any, index: number) => (
                <div key={index} className="flex items-center">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                  <p>{risk.message}</p>
                </div>
              ))
            ) : (
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <p>No risks found.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default NodeDetailsPage
