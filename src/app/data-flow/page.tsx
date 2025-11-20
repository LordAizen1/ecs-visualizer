"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible"
import { ChevronDown, Filter } from "lucide-react"
import DataFlowGraph from "@/components/DataFlowGraph"
import { Skeleton } from "@/components/ui/skeleton"

const DataFlowPage = () => {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])
  const [showUnusedPerms, setShowUnusedPerms] = useState(false)
  const [showHighRiskPerms, setShowHighRiskPerms] = useState(false)
  const [selectedRiskLevels, setSelectedRiskLevels] = useState<string[]>([]) // Changed to array for multiple selection

  const [dataFlowData, setDataFlowData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleTaskChange = (taskId: string) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    )
  }

  const handleRiskLevelChange = (level: string) => {
    setSelectedRiskLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    )
  }

  useEffect(() => {
    const fetchDataFlow = async () => {
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams()
        selectedTasks.forEach(task => params.append('selected_tasks', task))
        params.append('show_unused_perms', String(showUnusedPerms))
        params.append('show_high_risk_perms', String(showHighRiskPerms))
        // Send risk_level as comma-separated if multiple selected, or "all" if none
        const riskLevelParam = selectedRiskLevels.length > 0 ? selectedRiskLevels.join(',') : 'all'
        params.append('risk_level', riskLevelParam)

        const response = await fetch(
          `/api/v1/data-flow?${params.toString()}`
        )
        if (!response.ok) {
          throw new Error("Failed to fetch data flow data")
        }
        const data = await response.json()
        setDataFlowData(data)
      } catch (err) {
        setError("Failed to load data flow data.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchDataFlow()
  }, [selectedTasks, showUnusedPerms, showHighRiskPerms, selectedRiskLevels]) // Dependencies for refetching

  // Show error in place if there's an issue
  const showError = error && !loading;

  // Extract data even if loading to keep cards visible
  const { nodes = [], edges = [], infoCards = { riskRate: "...", resourceWeight: "...", permissionAvailed: "..." }, availableTasks = [], riskCounts = { high: 0, medium: 0, low: 0 } } = dataFlowData || {};

  return (
    <div className="flex flex-col h-screen w-full">
      {/* Info Cards */}
      <div className="grid grid-cols-3 gap-4 p-6">
        <Card>
          <CardHeader>
            <CardTitle>RISK RATE</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{infoCards.riskRate}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>RESOURCE WEIGHT</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{infoCards.resourceWeight}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>PERMISSION AVAILED</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{infoCards.permissionAvailed}</p>
          </CardContent>
        </Card>
      </div>

      <main className="flex flex-1 overflow-hidden p-6 pt-0">
        {/* Main Data Flow Diagram (Left Side) */}
        <div className="flex-1 h-full relative">
          <Card className="h-full">
            <CardContent className="p-6 h-full">
              {loading ? (
                <div className="flex h-full items-center justify-center">
                  <div className="flex flex-col space-y-3">
                    <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                </div>
              ) : showError ? (
                <div className="flex h-full items-center justify-center text-red-500">{error}</div>
              ) : (
                <DataFlowGraph initialNodes={nodes} initialEdges={edges} />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Filter Sidebar (Right Side) */}
        <aside className="w-80 h-full border-l p-4 overflow-y-auto">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
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
                  {availableTasks.map((task: any) => (
                    <div key={task.id} className="flex items-center space-x-2 flex-nowrap">
                      <Checkbox
                        id={task.id}
                        checked={selectedTasks.includes(task.id)}
                        onCheckedChange={() => handleTaskChange(task.id)}
                      />
                      <label htmlFor={task.id} className="truncate overflow-hidden whitespace-nowrap">{task.name}</label>
                    </div>
                  ))}
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
                  {/* Dynamic risk level filter with counts and checkboxes */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="risk-high"
                      checked={selectedRiskLevels.includes("high")}
                      onCheckedChange={() => handleRiskLevelChange("high")}
                    />
                    <span className="h-2 w-2 rounded-full bg-red-500"></span>
                    <label htmlFor="risk-high" className="cursor-pointer">High ({riskCounts.high})</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="risk-medium"
                      checked={selectedRiskLevels.includes("medium")}
                      onCheckedChange={() => handleRiskLevelChange("medium")}
                    />
                    <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                    <label htmlFor="risk-medium" className="cursor-pointer">Medium ({riskCounts.medium})</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="risk-low"
                      checked={selectedRiskLevels.includes("low")}
                      onCheckedChange={() => handleRiskLevelChange("low")}
                    />
                    <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                    <label htmlFor="risk-low" className="cursor-pointer">Low ({riskCounts.low})</label>
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
