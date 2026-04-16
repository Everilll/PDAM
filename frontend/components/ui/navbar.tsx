"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

type NavbarItem = {
    label: string
    href: string
    match?: "exact" | "prefix"
}

type NavbarProps = {
    brand?: string
    items?: NavbarItem[]
}

const defaultItems: NavbarItem[] = [
    { label: "Home", href: "/" },
    { label: "Customers", href: "/admin/customer"},
    { label: "Services", href: "/admin/service"},
    { label: "Bills", href: "/admin/bill"},
    { label: "Admin Profile", href: "/admin/profile" },
]

function normalizePath(path: string): string {
    if (path === "/") return "/"
    return path.replace(/\/+$/, "")
}

function isItemActive(pathname: string, item: NavbarItem): boolean {
    const currentPath = normalizePath(pathname)
    const itemPath = normalizePath(item.href)

    const matchMode = item.match ?? (itemPath === "/" ? "exact" : "prefix")
    if (matchMode === "exact") {
        return currentPath === itemPath
    }

    return currentPath === itemPath || currentPath.startsWith(`${itemPath}/`)
}

export default function Navbar({
    brand = "PDAM",
    items = defaultItems,
}: NavbarProps) {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)

    return (
        <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 md:px-8">
                <Link href="/" className="text-lg font-bold tracking-tight text-slate-900">
                    {brand}
                </Link>

                <button
                    type="button"
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 md:hidden"
                    onClick={() => setIsOpen((prev) => !prev)}
                    aria-expanded={isOpen}
                    aria-label="Toggle navigation menu"
                >
                    Menu
                </button>

                <div className="hidden items-center gap-2 md:flex">
                    {items.map((item) => {
                        const isActive = isItemActive(pathname, item)
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={[
                                    "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-blue-100 text-blue-700"
                                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
                                ].join(" ")}
                            >
                                {item.label}
                            </Link>
                        )
                    })}
                </div>
            </div>

            {isOpen ? (
                <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
                    <div className="flex flex-col gap-2">
                        {items.map((item) => {
                            const isActive = isItemActive(pathname, item)
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={[
                                        "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-blue-100 text-blue-700"
                                            : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
                                    ].join(" ")}
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item.label}
                                </Link>
                            )
                        })}
                    </div>
                </div>
            ) : null}
        </nav>
    )
}