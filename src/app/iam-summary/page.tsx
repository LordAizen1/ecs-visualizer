"use client"

import { useEffect, useState } from "react"

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
import { Skeleton } from "@/components/ui/skeleton" // Import Skeleton
import { ShieldAlert, AlertTriangle, Info } from "lucide-react" // Import icons

const IamSummaryPage = () => {
  const [sliderValue, setSliderValue] = useState(100)
  const [iamSummaryData, setIamSummaryData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchIamSummary = async () => {
      try {
        const response = await fetch(
          `/api/v1/iam-summary?days_back=${sliderValue}`
        )
        if (!response.ok) {
          throw new Error("Failed to fetch IAM summary")
        }
        const data = await response.json()
        await new Promise(resolve => setTimeout(resolve, 500)); // Artificial delay
        setIamSummaryData(data)
      } catch (err) {
        setError("Failed to load IAM summary.")
        console.error(err)
      }
      finally {
        setLoading(false)
      }
    }

    fetchIamSummary()
  }, [sliderValue]) // Add sliderValue to dependency array


  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[125px] w-[250px] rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return <div className="flex h-full items-center justify-center text-red-500">{error}</div>
  }

  if (!iamSummaryData) {
    return <div className="flex h-full items-center justify-center">No Timeline & Explanation data available.</div>
  }

  const { tableData, insightsData } = iamSummaryData;

  return (
    <div className="flex flex-col h-full w-full p-6 space-y-4">

      {/* Top Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">TIMELINE & EXPLANATION</h2>
          <p className="text-sm text-muted-foreground">Cluster - Service Overview</p>
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
          <Card className="h-full px-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>TASK</TableHead>
                  <TableHead>ROLE</TableHead>
                  <TableHead>RISK</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.map((row: any) => (
                  <TableRow key={row.task}>
                    <TableCell>{row.task}</TableCell>
                    <TableCell>{row.role}</TableCell>
                    <TableCell>
                      <span className={
                        row.risk === "High" ? "text-red-500" :
                          row.risk === "Medium" ? "text-yellow-500" :
                            row.risk === "Low" ? "text-green-500" :
                              ""
                      }>
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
              {insightsData.map((insight: any) => (
                <div
                  key={insight.id}
                  className={`p-3 rounded-md border ${insight.severity === 'High' ? 'bg-red-500/10 border-red-500/20' :
                    insight.severity === 'Medium' ? 'bg-yellow-500/10 border-yellow-500/20' :
                      'bg-blue-500/10 border-blue-500/20'
                    }`}
                >
                  <div className="flex items-start gap-2">
                    {insight.severity === 'High' ? (
                      <ShieldAlert className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                    ) : insight.severity === 'Medium' ? (
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 shrink-0" />
                    ) : (
                      <Info className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                    )}
                    <div>
                      <p className={`text-sm font-medium ${insight.severity === 'High' ? 'text-red-900 dark:text-red-200' :
                        insight.severity === 'Medium' ? 'text-yellow-900 dark:text-yellow-200' :
                          'text-blue-900 dark:text-blue-200'
                        }`}>
                        {insight.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}

export default IamSummaryPage