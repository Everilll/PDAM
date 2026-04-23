import { AdminAppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { getCookies } from "@/helper/cookies"
import { redirect } from "next/navigation"

async function isAuthorized(path: string, token: string): Promise<boolean> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || ""
  const response = await fetch(`${baseUrl}${path}`, {
    method: "GET",
    cache: "no-store",
    headers: {
      "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
      "Authorization": `Bearer ${token}`,
    },
  })

  return response.ok
}

export default async function Layout({ children }: { children: React.ReactNode }) {
  const token = await getCookies("token")

  if (!token) {
    redirect("/sign-in")
  }

  const isAdmin = await isAuthorized("/admins/me", token)
  if (!isAdmin) {
    const isCustomer = await isAuthorized("/customers/me", token)
    if (isCustomer) {
      redirect("/customer/profile")
    }
    redirect("/sign-in")
  }

  return (
    <SidebarProvider>
      <AdminAppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-slate-200 bg-white px-4 md:px-6">
          <SidebarTrigger className="h-8 w-8" />
          <p className="text-sm font-semibold text-slate-700">Admin Dashboard</p>
        </header>
        <main className="min-h-[calc(100svh-56px)] bg-slate-100 px-4 py-6 md:px-6 md:py-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}