import {Home, Network, ShieldCheck, GitCompareArrows, LogOut} from "lucide-react"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarSeparator } from "./ui/sidebar"
import Link from "next/link"
import Image from "next/image"

const items = [
    {
        title: "Home",
        url: "/home",
        icon: Home,
    },
    {
        title: "Cluster Map",
        url: "/cluster-map",
        icon: Network,
    },
    {
        title: "IAM Summary",
        url: "/iam-summary",
        icon: ShieldCheck,
    },
    {
        title: "Data Flow",
        url: "/data-flow",
        icon: GitCompareArrows,
    },
]

function AppSidebar() {
  return (
    <Sidebar collapsible="icon" className="will-change-transform transform-gpu">
      <SidebarHeader className="py-4 px-2">
        <SidebarMenu>
            <SidebarMenuItem className="mx-auto font-bold">
                <SidebarMenuButton asChild>
                    <Link href="/">
                    <Image src="/logo.svg" alt="logo" width={30} height={30}/>
                    <span>ECS Visualizer</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
    <SidebarSeparator className="mx-0"/>
      <SidebarContent>
        <SidebarGroup>
            <SidebarGroupLabel>Visualizations</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map(item => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild>
                                <Link href={item.url}>
                                    <item.icon />
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton asChild>
                    <Link href="/">
                        <LogOut />
                        <span>Logout</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar
