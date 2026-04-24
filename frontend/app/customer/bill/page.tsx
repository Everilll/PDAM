import { getCookies } from "@/helper/cookies"
import Pay from "./pay"

export interface BillResponse {
  success: boolean
  message: string
  data: Bill[]
  count: number
}

export interface Bill {
  id: number
  customer_id: number
  admin_id: number
  month: number
  year: number
  measurement_number: string
  usage_value: number
  price: number
  service_id: number
  paid: boolean
  owner_token: string
  createdAt: string
  updatedAt: string
  service: Service
  admin: Admin
  customer: Customer
  payments: any
  amount: number
  verified_payment: boolean
}

export interface Service {
  id: number
  name: string
  min_usage: number
  max_usage: number
  price: number
  owner_token: string
  createdAt: string
  updatedAt: string
}

export interface Admin {
  id: number
  user_id: number
  name: string
  phone: string
  owner_token: string
  createdAt: string
  updatedAt: string
}

export interface Customer {
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
}

type SearchParams = {
    [key: string]: string | number | boolean | undefined
}

async function getBills(params?: SearchParams): Promise<BillResponse> {
    try {
        const queryParams = params ?
            Object.keys(params)
                .filter(p => typeof params[p] !== 'undefined')
                .map(p => `${p}=${params[p]}`)
                .join('&') : ''
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || ""
        const url = `${baseUrl}/bills/me?${queryParams}`
        const response = await fetch(
            url,
            {
                method: "GET",
                cache: "no-store",
                headers: {
                    "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
                    "Authorization": `Bearer ${await getCookies('token')}`
                }
            })

        const responseData: BillResponse = await response.json();
        if (!response.ok) {
            return {
                success: false,
                message: responseData.message || "Failed to fetch bills",
                data: [],
                count: 0
            }
        }
        return responseData
    } catch (error) {
        console.error("Error fetching bills:", error)
        return {
            success: false,
            message: "Failed to fetch bills",
            data: [],
            count: 0
        }
    }
}

function formatRupiah(amount: number): string {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
    }).format(amount)
}

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    })
}

function formatPeriod(month: number, year: number): string {
    const date = new Date(year, Math.max(0, month - 1), 1)
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
}

type PageProps = {
    searchParams: Promise<{
        search: string
    }>
}

export default async function BillPage(props: PageProps) {
    const { search } = await props.searchParams
    const { success, message, data, count } = await getBills({ search })

    const totalAmount = data.reduce((sum, bill) => sum + bill.amount, 0)
    const paidBills = data.filter((bill) => bill.paid)
    const unpaidBills = data.filter((bill) => !bill.paid)
    const paidAmount = paidBills.reduce((sum, bill) => sum + bill.amount, 0)
    const unpaidAmount = unpaidBills.reduce((sum, bill) => sum + bill.amount, 0)

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
                <h1 className="text-3xl font-bold text-sky-700">Bill Management</h1>
                <p className="text-slate-600 mt-1">Track invoices, usage, and payment status.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="rounded-xl p-5 bg-linear-to-r from-sky-500 to-blue-600 text-white shadow-lg">
                    <p className="text-sky-100 text-sm">Total Bill</p>
                    <p className="text-3xl font-bold mt-1">{count}</p>
                </div>
                <div className="rounded-xl p-5 bg-emerald-50 border border-emerald-200 shadow-sm">
                    <p className="text-emerald-700 text-sm">Already Paid</p>
                    <p className="text-2xl font-bold text-emerald-800 mt-1">{paidBills.length}</p>
                    <p className="text-xs text-emerald-700 mt-1">{formatRupiah(paidAmount)}</p>
                </div>
                <div className="rounded-xl p-5 bg-rose-50 border border-rose-200 shadow-sm">
                    <p className="text-rose-700 text-sm">Unpaid</p>
                    <p className="text-2xl font-bold text-rose-800 mt-1">{unpaidBills.length}</p>
                    <p className="text-xs text-rose-700 mt-1">{formatRupiah(unpaidAmount)}</p>
                </div>
                <div className="rounded-xl p-5 bg-white border border-slate-200 shadow-sm">
                    <p className="text-slate-600 text-sm">Total Amount</p>
                    <p className="text-xl font-bold text-slate-900 mt-2">{formatRupiah(totalAmount)}</p>
                </div>
            </div>

            <form className="mb-6" method="GET">
                <input
                    type="text"
                    name="search"
                    id="search"
                    placeholder="Search by invoice number or customer name..."
                    defaultValue={search || ""}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                />
                <p className="text-xs text-slate-500 mt-2">Press Enter to search.</p>
            </form>

            {count === 0 ? (
                <div className="mt-6 bg-white border-2 border-dashed border-sky-300 rounded-lg p-12 text-center shadow-sm">
                    <svg className="w-16 h-16 mx-auto text-sky-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="text-xl font-semibold text-sky-800 mb-2">No Bill Data Yet</h3>
                    <p className="text-sky-600">Bill data will appear after meter input and calculation are completed.</p>
                </div>
            ) : (
                <div className="mt-6 bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-230">
                            <thead>
                                <tr className="bg-sky-600 text-white">
                                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Invoice</th>
                                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Period</th>
                                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Usage</th>
                                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Service</th>
                                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Total</th>
                                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Admin</th>
                                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Admin</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {data.map((bill, index) => (
                                    <tr key={`keyBill-${bill.id}`} className={`${index % 2 === 0 ? "bg-white" : "bg-slate-50"} hover:bg-sky-50 transition-colors`}>
                                        <td className="px-4 py-4 align-top">
                                            <div className="text-sm font-semibold text-slate-800">#{bill.id}</div>
                                            <div className="text-xs text-slate-500 mt-1">Created {formatDate(bill.createdAt)}</div>
                                        </td>
                                        <td className="px-4 py-4 align-top text-sm text-slate-700">{formatPeriod(bill.month, bill.year)}</td>
                                        <td className="px-4 py-4 align-top">
                                            <div className="text-sm font-semibold text-slate-800">{bill.usage_value} m3</div>
                                            <div className="text-xs text-slate-500 mt-1">Unit price: {formatRupiah(bill.price)}</div>
                                        </td>
                                        <td className="px-4 py-4 align-top">
                                            <div className="text-sm font-medium text-slate-800">{bill.service.name}</div>
                                            <div className="text-xs text-slate-500 mt-1">{bill.service.min_usage} - {bill.service.max_usage} m3</div>
                                        </td>
                                        <td className="px-4 py-4 align-top text-sm font-bold text-slate-900">{formatRupiah(bill.amount)}</td>
                                        <td className="px-4 py-4 align-top">
                                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${bill.paid ? (bill.verified_payment ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700") : "bg-rose-100 text-rose-700"}`}>
                                                {bill.paid ? bill.verified_payment ? <span>Payment has verified</span> : <span>Payment need verification</span> : "UNPAID"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 align-top text-sm text-slate-700">{bill.admin.name}</td>
                                        <td>
                                            <Pay/>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 text-sm text-slate-600">
                        Showing <span className="font-semibold">{count}</span> bill records.
                    </div>
                </div>
            )}
        </div>
    )
}