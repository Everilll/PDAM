import { getCookies } from "@/helper/cookies"
import Link from "next/link"
import Drop from "./drop"
import Search from "@/components/ui/search"

export interface CustomerResponse {
    success: boolean
    message: string
    data: CustomerType[]
    count: number
}

export interface CustomerType {
    id: number
    user_id: number
    customer_number: string
    name: string
    phone: string
    address: string
    service_id: number
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

type SearchParams = {
    [key: string]: string | number | boolean | undefined
}

async function getCustomers(params?: SearchParams): Promise<CustomerResponse> {
    try {
        const queryParams = params ?
            Object.keys(params)
                .filter(p => typeof params[p] !== 'undefined')
                .map(p => `${p}=${params[p]}`)
                .join('&') : ''
        const url = `${process.env.NEXT_PUBLIC_BASE_URL}/customers?${queryParams}`;
        const response = await fetch(
            url,
            {
                method: "GET",
                cache: "no-store",
                headers: {
                    "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
                    "Authorization": `Bearer ${await getCookies('token')}`,
                }
            });

        const responseData: CustomerResponse = await response.json();
        if (!response.ok) {
            return {
                success: false,
                message: responseData.message || "Failed to fetch customers",
                data: [],
                count: 0
            }
        }
        return responseData;
    } catch (error) {
        console.log("Error fetching customers:", error);
        return {
            success: false,
            message: "Failed to fetch customers",
            data: [],
            count: 0
        }
    }
}

type PageProps = {
    searchParams: Promise<{
        search: string
    }>
}

export default async function CustomerPage(props: PageProps) {
    const { search } = await props.searchParams
    const { success, message, data, count } = await getCustomers({ search });

    if (!success) {
        return (
            <div className="p-5 w-full max-w-7xl mx-auto">
                <div className="w-full bg-yellow-50 border border-yellow-200 text-yellow-800 p-5 rounded-lg shadow">
                    <div className="flex items-start">
                        <svg className="w-6 h-6 mr-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <div>
                            <h1 className="font-bold text-xl mb-1">Warning</h1>
                            <p>{message}</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full p-5 max-w-7xl mx-auto">
                <div className="mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-sky-700">Customer Management</h1>
                            <p className="text-slate-600 mt-1">
                                Manage and view all registered customers in the system
                            </p>
                        </div>
                        <Link
                            href="/admin/customer/add"
                            className="inline-flex items-center justify-center px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add New Customer
                        </Link>
                    </div>
                </div>

                <div className="mb-6">
                    <div className="bg-linear-to-r from-sky-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sky-100 text-sm font-medium">Total Customers</p>
                                <p className="text-4xl font-bold mt-1">{count}</p>
                            </div>
                            <div className="bg-white/20 rounded-full p-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <Search search={search || ''} />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.map((customer) => (
                        <div
                            key={customer.id}
                            className="p-6 bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-semibold text-sky-700 bg-sky-100 px-3 py-1 rounded-full">
                                    {customer.customer_number}
                                </span>
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-sky-100 transition-colors">
                                    <svg className="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-sky-600 transition-colors">
                                {customer.name}
                            </h3>

                            <div className="space-y-2 bg-gray-50 rounded-lg p-3 mb-3">
                                <div className="flex items-center text-gray-600">
                                    <svg className="w-4 h-4 mr-2 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <span className="text-sm">{customer.phone}</span>
                                </div>

                                <div className="flex items-start text-gray-600">
                                    <svg className="w-4 h-4 mr-2 mt-0.5 shrink-0 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span className="text-sm line-clamp-2">{customer.address}</span>
                                </div>

                                <div className="flex items-center text-gray-600">
                                    <svg className="w-4 h-4 mr-2 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <span className="text-sm">Service ID: <span className="font-semibold text-sky-600">{customer.service_id}</span></span>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 mb-3">
                                <Drop selectedData={customer.id} />
                                <Link
                                    href={`/admin/customer/edit/${customer.id}`}
                                    className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                    title="Edit customer"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </Link>
                            </div>

                            <div className="pt-3 border-t border-gray-200">
                                <p className="text-xs text-gray-500">
                                    Created by: <span className="font-medium text-sky-600">{customer.user.username}</span>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {data.length === 0 && (
                    <div className="text-center py-12">
                        <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No Customers Yet</h3>
                        <p className="text-gray-500 dark:text-gray-400">Start by adding your first customer</p>
                    </div>
                )}
        </div>
    )
}