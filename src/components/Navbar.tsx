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


const Navbar = () => {
    const {theme, setTheme} = useTheme();
    const { toggleSidebar } = useSidebar();
  return (
    <nav className="flex p-4 items-center justify-between sticky top-0 bg-background z-10">
    {/* LEFT SIDE */}
        <SidebarTrigger />
        {/* <Button variant="outline" onClick={toggleSidebar}>
            Custom Toggle
        </Button> */}
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
                    <DropdownMenuItem onClick={() => setTheme("purple")}>
                      Purple
                    </DropdownMenuItem>
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