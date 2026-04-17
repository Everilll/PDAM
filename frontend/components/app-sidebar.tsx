"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, FileText, Users, Receipt } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

type SidebarItem = {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const sidebarItems: SidebarItem[] = [
  { label: "Profile", href: "/admin/profile", icon: User },
  { label: "Customers", href: "/admin/customer", icon: Users },
  { label: "Services", href: "/admin/service", icon: FileText },
  { label: "Bills", href: "/admin/bill", icon: Receipt },
]

function isActivePath(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="offcanvas" className="border-r border-slate-200 bg-white">
      <SidebarHeader className="border-b border-slate-200 p-4">
        <Link href="/admin/profile" className="text-lg font-bold tracking-tight text-slate-900">
          PDAM Admin
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => {
                const isActive = isActivePath(pathname, item.href)

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-slate-200 p-3 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span>Admin Panel</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}