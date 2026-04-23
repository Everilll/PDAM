"use client"

import { deleteCookies } from "@/helper/cookies"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog"
import { SidebarMenuButton } from "./ui/sidebar"
import { LogOut } from "lucide-react"

export function Logout() {
    const handleLogout = async () => {
        await deleteCookies("token")
        window.location.href = "/sign-in"
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <SidebarMenuButton className="text-red-700 hover:text-red-600 hover:bg-red-50">
                    <LogOut className="text-red-500" />
                    Log Out
                </SidebarMenuButton>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure to logout?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action will log you out from the admin panel
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white">
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}