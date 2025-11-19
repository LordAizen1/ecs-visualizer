"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertTriangle, CheckCircle, X } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link" // Import Link for navigation

const NodeDetailsPage = () => {
  const searchParams = useSearchParams()
  const nodeId = searchParams.get('nodeId') as string
  const router = useRouter()
  const [nodeData, setNodeData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNodeDetails = async () => {
      if (!nodeId) return
      try {
        const response = await fetch(
          `http://localhost:8001/api/v1/nodes?node_id=${encodeURIComponent(nodeId)}`
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
        {/* Dynamic Header with Breadcrumb */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="text-lg font-semibold">
              <Link href="/" className="text-blue-600 hover:text-blue-800">Home</Link>
              <span className="mx-2">&gt;</span>
              <Link href="/cluster-map" className="text-blue-600 hover:text-blue-800">Cluster Map</Link>
              <span className="mx-2">&gt;</span>
              <span>{task_configuration.task_name}</span>
            </div>
          </div>
          {/* The X icon is removed as per instruction */}
        </div>
  
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-4">
            {/* Task Configuration & Runtime Details */}
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
  
            {/* Network & Security Group Info */}
            <Card>
              <CardHeader>
                <CardTitle>Network & Security Group Info</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p><strong>Security Group:</strong> {network_info.security_group}</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>
                    <strong>Inbound:</strong>
                    <ul className="list-disc list-inside ml-4">
                      {network_info.inbound.map((rule: string, index: number) => (
                        <li key={index}>{rule}</li>
                      ))}
                    </ul>
                  </li>
                  <li>
                    <strong>Outbound:</strong>
                    <ul className="list-disc list-inside ml-4">
                      {network_info.outbound.map((rule: string, index: number) => (
                        <li key={index}>{rule}</li>
                      ))}
                    </ul>
                  </li>
                </ul>
                <p><strong>VPC:</strong> {network_info.vpc}</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><strong>AZ:</strong> {network_info.az}</li>
                  <li><strong>CIDR:</strong> {network_info.cidr}</li>
                </ul>
                <p><strong>Subnet:</strong> {network_info.subnet}</p>
                <p><strong>ENI:</strong> {network_info.eni}</p>
                <p><strong>Private IP:</strong> {network_info.private_ip}</p>
                <p><strong>Public IP:</strong> {network_info.public_ip}</p>
              </CardContent>
            </Card>
          </div>
  
          {/* Center/Right Column - Permissions and Endpoints */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Permissions and Endpoints</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="permissions" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="permissions">Permissions</TabsTrigger>
                    <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
                  </TabsList>
                  <TabsContent value="permissions">
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
                              <TableCell>
                                <div className="flex items-center">
                                  {perm.status === 'used' && <CheckCircle className="h-4 w-4 text-green-500 mr-2" />}
                                  {perm.status === 'unused' && <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />}
                                  {perm.resource}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center p-4">No permissions found.</div>
                    )}
      
                    {/* Risk & Warning Indicators */}
                    <div className="space-y-2 mt-4">
                      {risks.length > 0 ? (
                        risks.map((risk: any, index: number) => (
                          <div key={index} className="flex items-center text-sm">
                            {risk.level === 'RISK' && <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />}
                            {risk.level === 'WARNING' && <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />}
                            <p>{risk.message}</p>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <p>No risks found.</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="endpoints">
                    {endpoints.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Target/Resource</TableHead>
                            <TableHead>Port</TableHead>
                            <TableHead>Protocol</TableHead>
                            <TableHead>Actions/Methods</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Security Posture</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {endpoints.map((ep: any, index: number) => (
                            <TableRow key={index}>
                              <TableCell>{ep.type === 'aws_service' ? 'AWS Service' : 'External'}</TableCell>
                              <TableCell>{ep.name}</TableCell>
                              <TableCell>{ep.type === 'aws_service' ? ep.resource : ep.target || 'N/A'}</TableCell>
                              <TableCell>{ep.port || 'N/A'}</TableCell>
                              <TableCell>{ep.protocol || 'N/A'}</TableCell>
                              <TableCell>{ep.actions ? ep.actions.join(', ') : ep.methods ? ep.methods.join(', ') : 'N/A'}</TableCell>
                              <TableCell>{ep.status || 'N/A'}</TableCell>
                              <TableCell>{ep.security_posture || 'N/A'}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center p-4">No endpoints found.</div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }
export default NodeDetailsPage
