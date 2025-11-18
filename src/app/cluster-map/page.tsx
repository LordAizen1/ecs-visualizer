"use client"

import { useState } from "react"
import {
  Search,
  Eye,
  SlidersHorizontal,
} from "lucide-react"

// Shadcn UI components
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"

// This is the new component that will contain the React Flow map
import ClusterVisualization from "@/components/reactFlowMap"

const ClusterMapPage = () => {
  const [showOnlyRisky, setShowOnlyRisky] = useState(false);
  const [showOnlyExternal, setShowOnlyExternal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // New: Node type visibility
  const [visibleNodeTypes, setVisibleNodeTypes] = useState({
    services: true,
    tasks: true,
    roles: true,
    endpoints: true,
  });

  const handleResetFilters = () => {
    setShowOnlyRisky(false);
    setShowOnlyExternal(false);
    setSearchQuery("");
    setVisibleNodeTypes({
      services: true,
      tasks: true,
      roles: true,
      endpoints: true,
    });
  };

  return (
    <div className="flex h-screen">
      {/* Filter Sidebar */}
      <div className="w-80 border-r bg-background p-6 space-y-6 overflow-y-auto">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Cluster Map</h2>
          <p className="text-sm text-muted-foreground">
            Visualize your ECS infrastructure
          </p>
        </div>

        <Separator />

        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search" className="text-sm font-medium">
            Search
          </Label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search nodes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <Separator />

        {/* Node Type Visibility */}
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Show/Hide Nodes
          </Label>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Services</span>
              <Switch
                checked={visibleNodeTypes.services}
                onCheckedChange={(checked) =>
                  setVisibleNodeTypes((prev) => ({ ...prev, services: checked }))
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Tasks</span>
              <Switch
                checked={visibleNodeTypes.tasks}
                onCheckedChange={(checked) =>
                  setVisibleNodeTypes((prev) => ({ ...prev, tasks: checked }))
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">IAM Roles</span>
              <Switch
                checked={visibleNodeTypes.roles}
                onCheckedChange={(checked) =>
                  setVisibleNodeTypes((prev) => ({ ...prev, roles: checked }))
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">External Endpoints</span>
              <Switch
                checked={visibleNodeTypes.endpoints}
                onCheckedChange={(checked) =>
                  setVisibleNodeTypes((prev) => ({ ...prev, endpoints: checked }))
                }
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Risk Filters (Your existing ones) */}
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Label>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">Show only risky flows</span>
            <Switch
              checked={showOnlyRisky}
              onCheckedChange={setShowOnlyRisky}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">Show only external endpoints</span>
            <Switch
              checked={showOnlyExternal}
              onCheckedChange={setShowOnlyExternal}
            />
          </div>
        </div>

        <Separator />

        {/* Quick Actions */}
        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handleResetFilters}
          >
            Clear All Filters
          </Button>
        </div>

        {/* Info Card */}
        <Card>
          <CardHeader className="">
            <CardTitle className="text-sm">Tips</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Click nodes to see details</li>
              <li>• Use filters to declutter</li>
              <li>• Search to highlight nodes</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Main Visualization Area */}
      <div className="flex-1">
        <ClusterVisualization
          searchQuery={searchQuery}
          visibleNodeTypes={visibleNodeTypes}
          showOnlyRisky={showOnlyRisky}
          showOnlyExternal={showOnlyExternal}
        />
      </div>
    </div>
  );
};

export default ClusterMapPage;
