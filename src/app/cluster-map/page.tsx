"use client"

import { useState } from "react"
import {
  Search,
  Eye,
  EyeOff,
  SlidersHorizontal,
} from "lucide-react"

// Shadcn UI components
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

// This is the new component that will contain the React Flow map
import ClusterVisualization from "@/components/reactFlowMap"

const ClusterMapPage = () => {
  // You will use these states to control the map
  const [showOnlyRisky, setShowOnlyRisky] = useState(false)
  const [showOnlyExternal, setShowOnlyExternal] = useState(false)

  return (
    <div className="flex flex-col h-screen w-full ">
      {/* Top Search Header */}
      <header className="flex items-center h-16 px-6 border-b ">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          <Input
            type="search"
            placeholder="Search tasks, services, endpoints...."
            className="pl-10 w-full"
          />
        </div>
        <div className="ml-auto">
          <span className="text-sm">Welcome, Kirmada</span>
          {/* You can add a user menu here */}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex flex-1 overflow-hidden">
        {/* The Interactive Map */}
        <div className="flex-1 h-full relative">
          <ClusterVisualization
            showOnlyRisky={showOnlyRisky}
            showOnlyExternal={showOnlyExternal}
          />
        </div>

        {/* Right Sidebar */}
        <aside className="w-80 h-full border-l p-4 overflow-y-auto">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Filter</CardTitle>
              <Button variant="ghost" size="icon">
                <SlidersHorizontal className="h-5 w-5" />
              </Button>
            </CardHeader>
            <CardContent>
              {/* Cluster Selector */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-2">Cluster selector</h3>
                <div className="p-3 rounded-md border bg-gray-50 dark:bg-gray-700">
                  <p className="font-medium">Cluster-Prod (Selected)</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    CPU: 65%
                  </p>
                  {/* This data should come from your API */}
                  <div className="text-xs mt-2 space-y-1">
                    <p># Tasks: 12</p>
                    <p># Services: 8</p>
                    <p># Endpoints: 35</p>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Filter Toggles */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Filter Toggles</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="risky-flows"
                      className="text-sm"
                    >
                      Show only risky flows
                    </label>
                    <Switch
                      id="risky-flows"
                      checked={showOnlyRisky}
                      onCheckedChange={setShowOnlyRisky}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="external-endpoints"
                      className="text-sm"
                    >
                      Show only external endpoints
                    </label>
                    <Switch
                      id="external-endpoints"
                      checked={showOnlyExternal}
                      onCheckedChange={setShowOnlyExternal}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </main>
    </div>
  )
}

export default ClusterMapPage