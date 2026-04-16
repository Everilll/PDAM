"use client"

import { getCookies } from "@/helper/cookies"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast, ToastContainer } from "react-toastify"

export interface CustomerResponse {
    success: boolean
    message: string
    data: CustomerType
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

export interface ServiceListResponse {
    success: boolean
    message: string
    data: ServiceType[]
    count: number
}

export default function AddCustomerPage() {
    const router = useRouter()

    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [customer_number, setCustomerNumber] = useState<string>("")
    const [address, setAddress] = useState<string>("")
    const [name, setName] = useState<string>("")
    const [phone, setPhone] = useState<string>("")
    const [service_id, setServiceId] = useState<number>(0)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    // Services state
    const [services, setServices] = useState<ServiceType[]>([])
    const [loadingServices, setLoadingServices] = useState<boolean>(true)

    // Fetch services 
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const url = `${process.env.NEXT_PUBLIC_BASE_URL}/services`
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${await getCookies('token')}`,
                        "APP-KEY": `${process.env.NEXT_PUBLIC_APP_KEY}`
                    }
                })
                const responseData: ServiceListResponse = await response.json()
                if (response.ok && responseData.data) {
                    setServices(responseData.data)
                } else {
                    toast.error("Failed to load services", { containerId: 'toastAddCustomer' })
                }
            } catch (error) {
                console.error("Error fetching services:", error)
                toast.error("Failed to load services", { containerId: 'toastAddCustomer' })
            } finally {
                setLoadingServices(false)
            }
        }
        fetchServices()
    }, [])

    const validateForm = (): boolean => {
        if (!username.trim()) {
            toast.error("Username shouldn't be empty", { containerId: 'toastAddCustomer' })
            return false
        }
        if (!password.trim()) {
            toast.error("Password shouldn't be empty", { containerId: 'toastAddCustomer' })
            return false
        }
        if (!customer_number.trim()) {
            toast.error("Customer number shouldn't be empty", { containerId: 'toastAddCustomer' })
            return false
        }
        if (!name.trim()) {
            toast.error("Name shouldn't be empty", { containerId: 'toastAddCustomer' })
            return false
        }
        if (!phone.trim()) {
            toast.error("Phone shouldn't be empty", { containerId: 'toastAddCustomer' })
            return false
        }
        if (!address.trim()) {
            toast.error("Address shouldn't be empty", { containerId: 'toastAddCustomer' })
            return false
        }
        if (!service_id || service_id === 0) {
            toast.error("Please select a service", { containerId: 'toastAddCustomer' })
            return false
        }
        return true
    }

    const resetForm = () => {
        setUsername("")
        setPassword("")
        setCustomerNumber("")
        setAddress("")
        setName("")
        setPhone("")
        setServiceId(0)
    }

    const handleAddCustomer = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setIsLoading(true)

        try {
            const request = JSON.stringify({
                username,
                password,
                customer_number,
                name,
                phone,
                address,
                service_id
            })

            const url = `${process.env.NEXT_PUBLIC_BASE_URL}/customers`
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${await getCookies('token')}`,
                    "APP-KEY": `${process.env.NEXT_PUBLIC_APP_KEY}`
                },
                body: request
            })

            const responseData: CustomerResponse = await response.json()

            if (!response.ok) {
                toast.error(
                    responseData.message || "Failed to add customer",
                    { containerId: 'toastAddCustomer' }
                )
                return
            }

            toast.success(
                responseData.message || "Customer berhasil ditambahkan!",
                { containerId: 'toastAddCustomer' }
            )

            resetForm()

        } catch (error) {
            console.error("Error during adding customer:", error)
            toast.error(
                "Terjadi kesalahan. Silakan coba lagi.",
                { containerId: 'toastAddCustomer' }
            )
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full p-10">
            <ToastContainer containerId={'toastAddCustomer'} position="top-right" autoClose={3000} />

            <div>
                <div className="mb-4">
                    <h1 className="text-xl text-sky-700 font-bold">Add new customer</h1>
                    <p className="text-slate-600 text-sm">add a customer</p>
                </div>

                <form onSubmit={handleAddCustomer} className="space-y-3">

                    {/* Username Input */}
                    <div className="bg-sky-500 p-3 rounded-lg shadow w-full md:w-1/2 lg:w-2/5">
                        <label htmlFor="username" className="text-xs font-semibold text-white block mb-1">
                            Username
                        </label>
                        <input
                            placeholder="Enter username"
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={isLoading}
                            className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all bg-white text-sky-600 dark:focus:ring-sky-400 dark:placeholder-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                    </div>

                    {/* Password Input */}
                    <div className="bg-sky-500 p-3 rounded-lg shadow w-full md:w-1/2 lg:w-2/5">
                        <label htmlFor="password" className="text-xs font-semibold text-white block mb-1">
                            Password
                        </label>
                        <input
                            placeholder="Enter password"
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                            className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all bg-white text-sky-600 dark:focus:ring-sky-400 dark:placeholder-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                    </div>

                    {/* Customer Number Input */}
                    <div className="bg-sky-500 p-3 rounded-lg shadow w-full md:w-1/2 lg:w-2/5">
                        <label htmlFor="customer_number" className="text-xs font-semibold text-white block mb-1">
                            Customer Number
                        </label>
                        <input
                            placeholder="Enter customer number"
                            type="text"
                            id="customer_number"
                            value={customer_number}
                            onChange={(e) => setCustomerNumber(e.target.value)}
                            disabled={isLoading}
                            className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all bg-white text-sky-600 dark:focus:ring-sky-400 dark:placeholder-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                    </div>

                    {/* Name Input */}
                    <div className="bg-sky-500 p-3 rounded-lg shadow w-full md:w-1/2 lg:w-2/5">
                        <label htmlFor="name" className="text-xs font-semibold text-white block mb-1">
                            Name
                        </label>
                        <input
                            placeholder="Enter customer name"
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={isLoading}
                            className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all bg-white text-sky-600 dark:focus:ring-sky-400 dark:placeholder-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                    </div>

                    {/* Phone Input */}
                    <div className="bg-sky-500 p-3 rounded-lg shadow w-full md:w-1/2 lg:w-2/5">
                        <label htmlFor="phone" className="text-xs font-semibold text-white block mb-1">
                            Phone
                        </label>
                        <input
                            placeholder="Enter phone number"
                            type="text"
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            disabled={isLoading}
                            className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all bg-white text-sky-600 dark:focus:ring-sky-400 dark:placeholder-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                    </div>

                    {/* Address Input */}
                    <div className="bg-sky-500 p-3 rounded-lg shadow w-full md:w-1/2 lg:w-2/5">
                        <label htmlFor="address" className="text-xs font-semibold text-white block mb-1">
                            Address
                        </label>
                        <input
                            placeholder="Enter address"
                            type="text"
                            id="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            disabled={isLoading}
                            className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all bg-white text-sky-600 dark:focus:ring-sky-400 dark:placeholder-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                    </div>

                    {/* Service Select */}
                    <div className="bg-sky-500 p-3 rounded-lg shadow w-full md:w-1/2 lg:w-2/5">
                        <label htmlFor="service_id" className="text-xs font-semibold text-white block mb-1">
                            Service
                        </label>
                        {loadingServices ? (
                            <div className="w-full px-3 py-2 rounded-md bg-white text-sky-600 text-sm">
                                Loading services...
                            </div>
                        ) : (
                            <select
                                id="service_id"
                                value={service_id}
                                onChange={(e) => setServiceId(Number(e.target.value))}
                                disabled={isLoading}
                                className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all bg-white text-sky-600 dark:focus:ring-sky-400 dark:placeholder-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <option value={0} disabled>-- Select a service --</option>
                                {services.map((service) => (
                                    <option key={service.id} value={service.id}>
                                        {service.name} (Rp {service.price.toLocaleString('id-ID')})
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="relative px-4 py-2 text-sm bg-sky-500 text-white font-semibold rounded-md shadow overflow-hidden group focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2 transition-all duration-300 hover:shadow-md hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                            <span className="relative z-10">
                                {isLoading ? "Creating..." : "Create customer"}
                            </span>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] rounded-full bg-white/40 pointer-events-none transform scale-100 opacity-0 transition-all duration-700 ease-out group-active:scale-0 group-active:opacity-100 group-active:transition-none"></div>
                        </button>
                        <button
                            onClick={() => router.replace('/admin/customer')}
                            type="button"
                            disabled={isLoading}
                            className="ml-3 relative px-4 py-2 text-sm bg-sky-500 text-white font-semibold rounded-md shadow overflow-hidden group focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2 transition-all duration-300 hover:shadow-md hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                            <span className="relative z-10">
                                {isLoading ? "Returning..." : "Back to customers"}
                            </span>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] rounded-full bg-white/40 pointer-events-none transform scale-100 opacity-0 transition-all duration-700 ease-out group-active:scale-0 group-active:opacity-100 group-active:transition-none"></div>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}