import { getCookies } from "@/helper/cookies"
import Link from "next/link"

export interface ResponseAdminProfile {
    success: boolean
    message: string
    data: Admin
}

export interface Admin {
    id: number
    user_id: number
    name: string
    phone: string
    owner_token: string
    createdAt: string
    updatedAt: string
    user: User
}

export interface User {
    id: number
    username: string
    password: string
    role: string
    owner_token: string
    createdAt: string
    updatedAt: string
}

/** create a function to grab
 * data admin profile from BE 
 */

async function getAdminProfile(): Promise<Admin | null> {
    try {
        const url = `${process.env.NEXT_PUBLIC_BASE_URL}/admins/me`
        const response = await fetch(
            url,
            {
                method: 'GET',
                cache: 'no-store',
                headers: {
                    "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || '',
                    "Authorization": `Bearer ${await getCookies('token')}`
                }
            }
        )
        const responseData: ResponseAdminProfile = await response.json()
        if (!response.ok) {
            return null
        }
        return responseData.data

    } catch (error) {
        console.log(error)
        return null
    }
}

function formatDate(value?: string): string {
    if (!value) return '-'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return '-'

    return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(date)
}

function getInitials(name: string): string {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('')
}

export default async function ProfilePage() {
    const adminProfile = await getAdminProfile()
    if (adminProfile == null) {
        return (
            <div className="w-full min-h-dvh bg-slate-100">
                <div className="p-6 flex items-center justify-center">
                    <div className="w-full max-w-lg rounded-2xl border border-red-100 bg-white p-6 shadow-sm text-center">
                        <h1 className="font-semibold text-2xl text-slate-900">Profile tidak tersedia</h1>
                        <p className="mt-2 text-slate-600">
                            Data admin belum bisa dimuat. Coba login ulang dan akses halaman ini lagi.
                        </p>
                        <Link
                            href="/sign-in"
                            className="inline-flex mt-5 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
                        >
                            Kembali ke Sign In
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    const safeName = adminProfile.name?.trim() || 'Admin'
    const safePhone = adminProfile.phone?.trim() || '-'
    const safeUsername = adminProfile.user?.username?.trim() || '-'
    const safeRole = adminProfile.user?.role?.trim() || '-'

    return (
        <div className="w-full min-h-full bg-slate-100">
            <div className="mx-auto w-full max-w-4xl px-2 md:px-4">
                    <div className="rounded-2xl bg-linear-to-r from-blue-700 via-blue-600 to-cyan-600 p-6 text-white shadow-lg">
                        <p className="text-sm uppercase tracking-widest text-blue-100">Dashboard</p>
                        <h1 className="mt-1 text-3xl font-bold">Admin Profile</h1>
                        <p className="mt-2 text-blue-100">Ringkasan informasi akun admin yang sedang login.</p>
                    </div>

                    <div className="mt-6 grid gap-6 lg:grid-cols-3">
                        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 lg:col-span-1">
                            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-700">
                                {getInitials(safeName)}
                            </div>
                            <h2 className="mt-4 text-center text-xl font-semibold text-slate-900">{safeName}</h2>
                            <p className="text-center text-sm text-slate-500">{safeRole}</p>

                            <div className="mt-5 space-y-3">
                                <div className="rounded-lg bg-slate-50 p-3">
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Admin ID</p>
                                    <p className="mt-1 font-semibold text-slate-800">#{adminProfile.id}</p>
                                </div>
                                <div className="rounded-lg bg-slate-50 p-3">
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">User ID</p>
                                    <p className="mt-1 font-semibold text-slate-800">#{adminProfile.user_id}</p>
                                </div>
                            </div>
                        </section>

                        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 lg:col-span-2">
                            <h3 className="text-lg font-semibold text-slate-900">Detail Akun</h3>
                            <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                <div className="rounded-lg border border-slate-200 p-4">
                                    <p className="text-xs uppercase tracking-wide text-slate-500">Name</p>
                                    <p className="mt-1 text-slate-900 font-semibold">{safeName}</p>
                                </div>
                                <div className="rounded-lg border border-slate-200 p-4">
                                    <p className="text-xs uppercase tracking-wide text-slate-500">Phone</p>
                                    <p className="mt-1 text-slate-900 font-semibold">{safePhone}</p>
                                </div>
                                <div className="rounded-lg border border-slate-200 p-4">
                                    <p className="text-xs uppercase tracking-wide text-slate-500">Username</p>
                                    <p className="mt-1 text-slate-900 font-semibold">{safeUsername}</p>
                                </div>
                                <div className="rounded-lg border border-slate-200 p-4">
                                    <p className="text-xs uppercase tracking-wide text-slate-500">Role</p>
                                    <p className="mt-1 text-slate-900 font-semibold">{safeRole}</p>
                                </div>
                                <div className="rounded-lg border border-slate-200 p-4 sm:col-span-2">
                                    <p className="text-xs uppercase tracking-wide text-slate-500">Dibuat</p>
                                    <p className="mt-1 text-slate-900 font-semibold">{formatDate(adminProfile.createdAt)}</p>
                                </div>
                                <div className="rounded-lg border border-slate-200 p-4 sm:col-span-2">
                                    <p className="text-xs uppercase tracking-wide text-slate-500">Terakhir Diupdate</p>
                                    <p className="mt-1 text-slate-900 font-semibold">{formatDate(adminProfile.updatedAt)}</p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
        </div>
    )
}