'use client'

import { Moon, Sun } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "./ui/button"
import { useTheme } from "next-themes"
import { SidebarTrigger, useSidebar } from "./ui/sidebar"
import { usePathname } from "next/navigation"


const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const { toggleSidebar } = useSidebar();
  const pathname = usePathname();

  // Map routes to titles and descriptions
  const getPageInfo = () => {
    switch (pathname) {
      case '/home':
        return { title: 'Home', subtitle: 'Your AWS ECS Infrastructure Dashboard' };
      case '/cluster-map':
        return { title: 'Cluster Map', subtitle: 'Visualize your ECS clusters and tasks' };
      case '/iam-summary':
        return { title: 'Timeline & Explanation', subtitle: 'Review IAM permissions timeline and insights' };
      case '/data-flow':
        return { title: 'Data Flow', subtitle: 'Analyze data flow between tasks and resources' };
      case '/cluster-map/task-details':
        return { title: 'Task Details', subtitle: 'View detailed task configuration and permissions' };
      default:
        return { title: 'ECS Visualizer', subtitle: 'AWS Infrastructure Visualization Tool' };
    }
  };

  const { title, subtitle } = getPageInfo();

  return (
    <nav className="flex p-4 items-center justify-between sticky top-0 bg-background z-10">
      {/* LEFT SIDE */}
      <SidebarTrigger />
      <div className="w-full pl-4">
        <h2 className="text-left text-2xl font-bold tracking-tight">{title}</h2>
        <p className="text-left text-sm text-muted-foreground">
          {subtitle}
        </p>
      </div>
      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4">
        {/* THEME MENUE */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent sideOffset={10} align="end">
            <DropdownMenuLabel>Default</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}

export default Navbar