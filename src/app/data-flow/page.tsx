"use client"

import { useState } from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible"
import { FunnelIcon, XIcon, ChevronDown } from "lucide-react"
import DataFlowGraph from "@/components/DataFlowGraph"

const DataFlowPage = () => {
  const [selectedTasks, setSelectedTasks] = useState(["task-01"])
  const [showUnusedPerms, setShowUnusedPerms] = useState(false)
  const [showHighRiskPerms, setShowHighRiskPerms] = useState(false)
  const [riskLevel, setRiskLevel] = useState("high")

  const handleTaskChange = (taskId: string) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    )
  }

  return (
    <div className="flex flex-col h-screen w-full">
      {/* Top Header Section */}
      <header className="flex items-center h-16 px-6 border-b">
        <div>
          <h2 className="text-2xl font-bold">DATA FLOW</h2>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/cluster-map">Cluster</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Service Overview</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="ml-auto">
          <span className="text-sm">Welcome, Kirmada</span>
        </div>
      </header>

      {/* Info Cards */}
      <div className="grid grid-cols-3 gap-4 p-6">
        <Card>
          <CardHeader>
            <CardTitle>RISK RATE</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">+4.8</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>RESOURCE WEIGHT</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">3</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>PERMISSION AVAILED</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">5</p>
          </CardContent>
        </Card>
      </div>

      <main className="flex flex-1 overflow-hidden p-6 pt-0">
        {/* Main Data Flow Diagram (Left Side) */}
        <div className="flex-1 h-full relative">
          <Card className="h-full">
            <CardContent className="p-6 h-full">
              <DataFlowGraph />
            </CardContent>
          </Card>
        </div>

        {/* Filter Sidebar (Right Side) */}
        <aside className="w-80 h-full border-l p-4 overflow-y-auto">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <FunnelIcon className="h-5 w-5" />
                <CardTitle>Filter</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Task Selection Collapsible */}
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    Task Selection <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="p-2 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="task-01" checked={selectedTasks.includes("task-01")} onCheckedChange={() => handleTaskChange("task-01")} />
                    <label htmlFor="task-01">Task-01</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="task-02" checked={selectedTasks.includes("task-02")} onCheckedChange={() => handleTaskChange("task-02")} />
                    <label htmlFor="task-02">Task-02</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="task-03" checked={selectedTasks.includes("task-03")} onCheckedChange={() => handleTaskChange("task-03")} />
                    <label htmlFor="task-03">Task-03</label>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Permission Filter Collapsible */}
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    Permission Filter <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="p-2 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="unused-perms" checked={showUnusedPerms} onCheckedChange={(checked: boolean) => setShowUnusedPerms(checked)} />
                    <label htmlFor="unused-perms">Show only unused permissions</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="high-risk-perms" checked={showHighRiskPerms} onCheckedChange={(checked: boolean) => setShowHighRiskPerms(checked)} />
                    <label htmlFor="high-risk-perms">Show only high-risk permissions</label>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Risk Level Filter Collapsible */}
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    Risk Level Filter <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="p-2 space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="h-2 w-2 rounded-full bg-red-500"></span>
                    <label>High (2)</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                    <label>Medium (1)</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                    <label>Low (0)</label>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>
        </aside>
      </main>
    </div>
  )
}

export default DataFlowPage