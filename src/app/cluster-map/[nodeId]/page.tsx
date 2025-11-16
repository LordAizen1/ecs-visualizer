"use client"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, ShieldAlert } from "lucide-react"

const NodeDetailsPage = ({ params }: { params: { nodeId: string } }) => {
  // In a real application, you would fetch the node details based on params.nodeId
  // For now, we'll use the static data from the description.

  return (
    <div className="flex flex-col h-full w-full p-6 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/cluster-map">Cluster-Prod</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{params.nodeId}: Identity & Permissions</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="text-sm">
          Welcome, Kirmada
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Task Configuration & Runtime Details</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p><strong>Service:</strong> web-service</p>
              <p><strong>Launch Type:</strong> Fargate</p>
              <p><strong>Task Name:</strong> Cluster-Prod</p>
              <p><strong>Task Definition:</strong> web-service:v8</p>
              <p><strong>Role:</strong> ecsTaskRole-web</p>
              <p className="truncate"><strong>Full ARN:</strong> arn:aws:iam::987654321098:role/ecsTaskRole-web</p>
              <p><strong>CPU:</strong> 0.5 vCPU</p>
              <p><strong>Memory:</strong> 1 GB</p>
              <p><strong>Status:</strong> <span className="text-green-500">Running</span></p>
              <p><strong>Started:</strong> 4h 12m ago</p>
              <p><strong>Container:</strong> nginx:1.21-alpine</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Network & Security Group Info</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p><strong>Security Group:</strong> sg-1245</p>
              <div>
                <strong>Inbound:</strong>
                <ul className="list-disc list-inside">
                  <li>TCP 80 (0.0.0.0/0)</li>
                  <li>TCP 443 (0.0.0.0/0)</li>
                </ul>
              </div>
              <div>
                <strong>Outbound:</strong>
                <ul className="list-disc list-inside">
                  <li>All traffic (0.0.0.0/0)</li>
                </ul>
              </div>
              <p><strong>VPC:</strong> vpc-prod-main</p>
              <p><strong>Subnet:</strong> subnet-12345</p>
              <p><strong>AZ:</strong> us-east-1a</p>
              <p><strong>CIDR:</strong> 10.0.1.0/24</p>
              <p><strong>ENI:</strong> eni-0abc123def</p>
              <p><strong>Private IP:</strong> 10.0.1.28</p>
              <p><strong>Public IP:</strong> None (uses NAT Gateway)</p>
            </CardContent>
          </Card>
        </div>

        {/* Center/Right Column */}
        <div className="col-span-2">
          <Card>
            <Tabs defaultValue="permissions" className="w-full">
              <TabsList className="w-full justify-center bg-transparent">
                <TabsTrigger value="permissions" className="text-lg font-semibold">Permissions</TabsTrigger>
                <span className="mx-2 text-lg font-semibold">|</span>
                <TabsTrigger value="endpoints" className="text-lg font-semibold">Endpoints</TabsTrigger>
              </TabsList>
              <TabsContent value="permissions">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Permission</TableHead>
                      <TableHead>Resource</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>s3:GetObject</TableCell>
                      <TableCell><span className="h-2 w-2 rounded-full bg-green-500 inline-block mr-2"></span>my-bucket-1</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>s3:ListBucket</TableCell>
                      <TableCell><span className="h-2 w-2 rounded-full bg-green-500 inline-block mr-2"></span>my-bucket-1</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>dynamodb:Query</TableCell>
                      <TableCell><span className="h-2 w-2 rounded-full bg-red-500 inline-block mr-2"></span>orders-table (unused permission)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>ec2:Describe*</TableCell>
                      <TableCell><span className="h-2 w-2 rounded-full bg-red-500 inline-block mr-2"></span>* (Unused Permission)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>logs:CreateLogStream</TableCell>
                      <TableCell><span className="h-2 w-2 rounded-full bg-green-500 inline-block mr-2"></span>/ecs/web-service</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>logs:PutLogEvents</TableCell>
                      <TableCell><span className="h-2 w-2 rounded-full bg-green-500 inline-block mr-2"></span>/ecs/web-service</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value="endpoints">
                <div className="grid grid-cols-2 gap-4">
                  {/* AWS Services */}
                  <div>
                    <h4 className="font-semibold mb-2">AWS Services</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Service</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>S3</TableCell>
                          <TableCell>GetObject, ListBucket</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>DynamoDB</TableCell>
                          <TableCell>orders-table (0/0) - No traffic detected</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>CloudWatch Logs</TableCell>
                          <TableCell>PutLogEvents</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  {/* External Endpoints */}
                  <div>
                    <h4 className="font-semibold mb-2">External Endpoints</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Endpoint</TableHead>
                          <TableHead>Details</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>api.external.com</TableCell>
                          <TableCell>TCP 443 (TLS 1.3), GET, Query, PUT</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>api.eiktown</TableCell>
                          <TableCell>TCP 80 (Unencrypted), Public Access</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>

          <div className="mt-6 space-y-4">
            <div className="flex items-start p-4 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
              <div>
                <h4 className="font-semibold text-red-800 dark:text-red-300">RISK</h4>
                <p className="text-sm text-red-700 dark:text-red-400">IAM Role 'ecsTaskRole-web' is over-privileged with 2 unused permissions</p>
              </div>
            </div>
            <div className="flex items-start p-4 bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/50 rounded-lg">
              <ShieldAlert className="h-5 w-5 text-yellow-500 mr-3" />
              <div>
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-300">WARNING</h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-400">Security group allows unrestricted inbound HTTP (port 80) from 0.0.0.0/0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NodeDetailsPage