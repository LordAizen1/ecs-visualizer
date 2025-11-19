"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertTriangle, CheckCircle, X } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
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
          `/api/v1/nodes?node_id=${encodeURIComponent(nodeId)}`
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
    return (
      <div className="container mx-auto p-4">
        <div className="mb-4">
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-64" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
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
                          <TableHead>Resources</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {permissions.flatMap((policy: any, policyIndex: number) =>
                          policy.document.Statement.map((statement: any, stmtIndex: number) => {
                            const actions = Array.isArray(statement.Action)
                              ? statement.Action
                              : [statement.Action];
                            const resources = Array.isArray(statement.Resource)
                              ? statement.Resource
                              : [statement.Resource];

                            return (
                              <TableRow key={`${policyIndex}-${stmtIndex}`}>
                                <TableCell>
                                  <div>
                                    <div className="font-semibold text-sm mb-1">{policy.name}</div>
                                    <div className="max-h-32 overflow-y-auto text-xs text-gray-400">
                                      {actions.map((action: string, i: number) => (
                                        <div key={i} className="py-0.5">{action}</div>
                                      ))}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="max-h-32 overflow-y-auto text-xs">
                                    {resources.map((resource: string, i: number) => (
                                      <div key={i} className="py-0.5 truncate" title={resource}>
                                        {resource}
                                      </div>
                                    ))}
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })
                        )}
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
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>AWS Services</TableHead>
                        <TableHead>External Endpoints</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="align-top">
                          {endpoints.filter((ep: any) => ep.type === 'aws_service').length > 0 ? (
                            <div className="space-y-2">
                              {endpoints.filter((ep: any) => ep.type === 'aws_service').map((ep: any, index: number) => (
                                <div key={index} className="border-b pb-2 mb-2 last:border-b-0">
                                  <div className="font-semibold text-sm">{ep.name}</div>
                                  <div className="text-xs text-gray-400 mt-1">
                                    <div><strong>Resource:</strong> {ep.resource || 'N/A'}</div>
                                    {ep.actions && <div><strong>Actions:</strong> {ep.actions.join(', ')}</div>}
                                    {ep.port && <div><strong>Port:</strong> {ep.port}</div>}
                                    {ep.protocol && <div><strong>Protocol:</strong> {ep.protocol}</div>}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-gray-500 text-sm">No AWS services</div>
                          )}
                        </TableCell>
                        <TableCell className="align-top">
                          {endpoints.filter((ep: any) => ep.type !== 'aws_service').length > 0 ? (
                            <div className="space-y-2">
                              {endpoints.filter((ep: any) => ep.type !== 'aws_service').map((ep: any, index: number) => (
                                <div key={index} className="border-b pb-2 mb-2 last:border-b-0">
                                  <div className="font-semibold text-sm">{ep.name}</div>
                                  <div className="text-xs text-gray-400 mt-1">
                                    <div><strong>Target:</strong> {ep.target || 'N/A'}</div>
                                    {ep.methods && <div><strong>Methods:</strong> {ep.methods.join(', ')}</div>}
                                    {ep.port && <div><strong>Port:</strong> {ep.port}</div>}
                                    {ep.protocol && <div><strong>Protocol:</strong> {ep.protocol}</div>}
                                    {ep.security_posture && <div><strong>Security:</strong> {ep.security_posture}</div>}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-gray-500 text-sm">No external endpoints</div>
                          )}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
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
