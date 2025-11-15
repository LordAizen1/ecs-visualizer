"use client"

import { useState } from "react"

// Shadcn UI Components
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"

// --- Mock Data (Replace this with API data later) ---
const tableData = [
  {
    task: "Task-01",
    role: "ecs-admin-role",
    risk: "High",
  },
  {
    task: "Task-02",
    role: "ecs-exec-role",
    risk: "Medium",
  },
  {
    task: "Task-03",
    role: "ecs-readonly-role",
    risk: "Low",
  },
]

const insightsData = [
  {
    id: "1",
    text: "Task X wrote to S3 bucket Y",
  },
  {
    id:"2",
    text: "Role Z is unused",
  },
  {
    id: "3",
    text: "Risky permission 's3:*' detected",
  },
]
// --- End of Mock Data ---

const TimelinePage = () => {
  const [sliderValue, setSliderValue] = useState(100)

  return (
    <div className="flex flex-col h-full w-full p-6 space-y-4">
      
      {/* Top Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">TIMELINE & EXPLANATION</h2>
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
        <div className="text-sm">
          Welcome, Kirmada
        </div>
      </div>

      {/* Timeline Slider Section */}
      <Card>
        <CardContent className="">
          <div className="flex items-center space-x-4">
            <span className="font-semibold">TIMELINE</span>
            <Slider
              defaultValue={[sliderValue]}
              max={365}
              step={1}
              onValueChange={(value) => setSliderValue(value[0])}
            />
            <span className="text-sm text-gray-600 w-28 text-center tabular-nums">
              {sliderValue} days back
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Area (Table & Insights) */}
      <div className="grid grid-cols-3 gap-6 flex-1">
        
        {/* Left Side: Table */}
        <div className="col-span-2">
          <Card className="h-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>TASK</TableHead>
                  <TableHead>ROLE</TableHead>
                  <TableHead>RISK</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.map((row) => (
                  <TableRow key={row.task}>
                    <TableCell>{row.task}</TableCell>
                    <TableCell>{row.role}</TableCell>
                    <TableCell>
                      <span className={row.risk === "High" ? "text-red-500" : ""}>
                        {row.risk}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>

        {/* Right Side: Insights */}
        <div className="col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>INSIGHTS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-500">DATE - 31/02/2024</p>
              {insightsData.map((insight) => (
                <div key={insight.id}>
                  <p className="text-sm">* {insight.text}</p>
                  <Button variant="outline" size="sm" className="mt-1 w-full">
                    Explain
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}

export default TimelinePage