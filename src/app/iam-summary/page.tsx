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

const IamSummaryPage = () => {
  const [sliderValue, setSliderValue] = useState(100)
  const [iamSummaryData, setIamSummaryData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchIamSummary = async () => {
      try {
        const response = await fetch(
          `http://localhost:8001/api/v1/iam-summary?days_back=${sliderValue}`
        )
        if (!response.ok) {
          throw new Error("Failed to fetch IAM summary")
        }
        const data = await response.json()
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
    return <div className="flex h-full items-center justify-center">Loading IAM Summary...</div>
  }

  if (error) {
    return <div className="flex h-full items-center justify-center text-red-500">{error}</div>
  }

  if (!iamSummaryData) {
    return <div className="flex h-full items-center justify-center">No IAM summary data available.</div>
  }

  const { tableData, insightsData } = iamSummaryData;

  return (
    <div className="flex flex-col h-full w-full p-6 space-y-4">
      
      {/* Top Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">IAM SUMMARY</h2>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/cluster-map">Cluster</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>IAM Summary</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
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
              <p className="text-sm text-gray-500">DATE - 31/02/2024</p>
              {insightsData.map((insight: any) => (
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

export default IamSummaryPage