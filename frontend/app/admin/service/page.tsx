import { getCookies } from "@/helper/cookies"
import Link from "next/link"
import Drop from "./drop"
import Search from "@/components/ui/search"

export interface ServiceResponse {
    success: boolean
    message: string
    data: ServiceType[]
    count: number
}

export interface ServiceType {
    id: number
    name: string
    min_usage: number
    max_usage: number
    price: number
    owner_token: string
    createdAt: string
    updatedAt: string
}

/** create function to get service data from BE */
type SearchParams = {
    [key: string]: string | number | boolean | undefined
}
async function getServices(params?: SearchParams): Promise<ServiceResponse> {
    try {
        const queryParams = params ?
            Object.keys(params)
                .filter(p => typeof params[p] !== 'undefined')
                .map(p => `${p}=${params[p]}`)
                .join('&') : ''
        const url = `${process.env.NEXT_PUBLIC_BASE_URL}/services?${queryParams}`
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

        const responseData: ServiceResponse = await response.json()
        if (!response.ok) {
            return {
                success: false,
                message: responseData?.message || 'Failed to fetch services',
                data: [],
                count: 0
            }
        }
        return responseData
    } catch (error) {
        console.error("Error fetching services:", error)
        return {
            success: false,
            message: 'Failed to fetch services. Please try again later.',
            data: [],
            count: 0
        }
    }
}

/** Format rupiah */
function formatRupiah(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount)
}

/** Format date */
function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

type PageProps = {
    searchParams: Promise<{
        search: string
    }>
}
export default async function ServicePage(props: PageProps) {
    const { search } = await props.searchParams
    const { success, message, data, count } = await getServices({ search })

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
            {/* Header Section */}
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-sky-700">Service Management</h1>
                        <p className="text-slate-600 mt-1">
                            Manage and view all available services in the system
                        </p>
                    </div>
                    <Link
                        href="/admin/services/add"
                        className="inline-flex items-center justify-center px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add New Service
                    </Link>
                </div>
            </div>

            {/* Stats Card */}
            <div className="mb-6">
                <div className="bg-linear-to-r from-sky-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sky-100 text-sm font-medium">Total Services</p>
                            <p className="text-4xl font-bold mt-1">{count}</p>
                        </div>
                        <div className="bg-white/20 rounded-full p-4">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search */}
            <Search search={search || ''} />

            {/* Table Section */}
            {count === 0 ? (
                <div className="mt-6 bg-sky-50 border-2 border-dashed border-sky-300 rounded-lg p-12 text-center">
                    <svg className="w-16 h-16 mx-auto text-sky-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="text-xl font-semibold text-sky-800 mb-2">No Services Available</h3>
                    <p className="text-sky-600 mb-4">Get started by adding your first service</p>
                    <Link
                        href="/admin/services/add"
                        className="inline-flex items-center px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow transition-all duration-300 hover:shadow-lg"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Your First Service
                    </Link>
                </div>
            ) : (
                <div className="mt-6 bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-sky-600 text-white">
                                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                                        Service Name
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                                        Usage Range
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                                        Price
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                                        Created At
                                    </th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {data.map((service, index) => (
                                    <tr
                                        key={`keyService-${service.id}`}
                                        className={`hover:bg-sky-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                            }`}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-sky-100 text-sky-800">
                                                #{service.id}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{service.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <span className="font-medium">{service.min_usage}</span>
                                                <svg className="w-4 h-4 mx-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                </svg>
                                                <span className="font-medium">{service.max_usage}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm font-semibold text-green-600">
                                                {formatRupiah(service.price)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {formatDate(service.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="flex items-center justify-center gap-2">

                                                {/** delete button */}
                                                <Drop selectedData={service.id} />

                                                {/** edit button */}
                                                <Link href={`/admin/services/edit/${service.id}`}>
                                                    <button
                                                        className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                                                        title="Edit service"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer dengan info */}
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                            Showing <span className="font-medium">{count}</span> service{count !== 1 ? 's' : ''} in total
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}