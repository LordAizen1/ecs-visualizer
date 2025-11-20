"use client"

import React from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, CheckCircle } from "lucide-react"
import Link from "next/link"

const NodeDetailsSheet = ({ open, onOpenChange, nodeData }: { open: boolean, onOpenChange: (open: boolean) => void, nodeData: any }) => {
  if (!nodeData) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] px-3">
        <SheetHeader>
          <SheetTitle>{nodeData.name}</SheetTitle>
          <SheetDescription>
            Region: {nodeData.region}
          </SheetDescription>
        </SheetHeader>
        <div className="py-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Overview Stats</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p><strong>Total Tasks:</strong> {nodeData.overview.totalTasks}</p>
              <p><strong>Services:</strong> {nodeData.overview.services}</p>
              <p><strong>CPU Utilization:</strong> {nodeData.overview.cpuUtilization}</p>
              <p><strong>Memory Utilization:</strong> {nodeData.overview.memoryUtilization}</p>
              <p><strong>Active Connections:</strong> {nodeData.overview.activeConnections}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Services in the Cluster</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-4">
              {nodeData.services.map((service: any) => (
                <div key={service.name}>
                  <h4 className="font-semibold flex items-center">
                    <span className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></span>
                    {service.name}
                  </h4>
                  <p><strong>Running:</strong> {service.runningTasks}</p>
                  <p><strong>Launch Type:</strong> {service.launchType}</p>
                  <div>
                    <strong>Tasks:</strong>{" "}
                    {service.tasks.map((taskArn: string, index: number) => {
                      const taskId = taskArn.split('/').pop(); // Extract task ID from ARN for display
                      return (
                        <React.Fragment key={taskArn}>
                          <Link href={`/cluster-map/task-details?nodeId=${encodeURIComponent(taskArn)}`} className="text-blue-500 hover:underline">
                            {taskId}
                          </Link>
                          {index < service.tasks.length - 1 && ", "}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security & Risks Summary</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                <p>{nodeData.risks.unusedPermissions} tasks with unused permissions</p>
              </div>
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                <p>{nodeData.risks.riskyNetworkFlows} tasks with risky network flows</p>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <p>{nodeData.risks.compliantTasks} tasks with risky network flows</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default NodeDetailsSheet
