"use client"

import { useState } from "react"
import { Service, ServiceResponse } from "./page"
import { useRouter } from "next/navigation"
import { toast, ToastContainer } from "react-toastify"
import { getCookies } from "@/helper/cookies"

/** we create a custom component that name "FormService" */
/** define a property of "FormService" component */
type Props = {
    service: Service
}
export default function FormService(props: Props) {
    const [name, setName] = useState<string>(props.service.name)
    const [min_usage, setMinUsage] = useState<number>(props.service.min_usage)
    const [max_usage, setMaxUsage] = useState<number>(props.service.max_usage)
    const [price, setPrice] = useState<number>(props.service.price)
    const router = useRouter();

    const resetForm = () => {
        setName(props.service.name)
        setMinUsage(props.service.min_usage)
        setMaxUsage(props.service.max_usage)
        setPrice(props.service.price)
    }

    const handleUpdateService = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const request = JSON.stringify({
                name,
                min_usage,
                max_usage,
                price
            })

            const url = `${process.env.NEXT_PUBLIC_BASE_URL}/services/${props.service.id}`
            const response = await fetch(url, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${await getCookies('token')}`,
                    "APP-KEY": `${process.env.NEXT_PUBLIC_APP_KEY}`
                },
                body: request
            })

            const responseData: ServiceResponse = await response.json()

            if (!response.ok) {
                toast.error(
                    responseData.message || "Failed to update service",
                    { containerId: 'toastUpdateService' }
                )
                return
            }

            toast.success(
                responseData.message || "Service updated successfully!",
                { containerId: 'toastUpdateService' }
            )

            resetForm()

        } catch (error) {
            console.error("Error during updating service:", error)
            toast.error(
                "An error occurred. Please try again.",
                { containerId: 'toastUpdateService' }
            )
        }
    }
    return (
        <div className="">
            <ToastContainer containerId={'toastUpdateService'} position="top-right" autoClose={3000} />

            <div>
                <div className="mb-6">
                    <h1 className="text-2xl text-sky-700 font-bold">Update service</h1>
                    <p className="text-slate-700">update the service details</p>
                </div>

                <form onSubmit={handleUpdateService} className="space-y-4">

                    {/* Name Input */}
                    <div className="bg-sky-500 p-5 rounded-lg shadow-lg w-full md:w-1/2 lg:w-3/7">
                        <label htmlFor="name" className="text-sm font-semibold text-white block mb-2">
                            Name
                        </label>
                        <input
                            placeholder="Enter service name"
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all bg-white text-sky-600 dark:focus:ring-sky-400 dark:placeholder-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                    </div>

                    {/* Min Usage Input */}
                    <div className="bg-sky-500 p-5 rounded-lg shadow-lg w-full md:w-1/2 lg:w-3/7">
                        <label htmlFor="minusage" className="text-sm font-semibold text-white block mb-2">
                            Min Usage
                        </label>
                        <input
                            placeholder="Set min usage"
                            type="number"
                            id="minusage"
                            value={min_usage}
                            onChange={(e) => setMinUsage(Number(e.target.value))}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all bg-white text-sky-600 dark:focus:ring-sky-400 dark:placeholder-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                    </div>

                    {/* Max Usage Input */}
                    <div className="bg-sky-500 p-5 rounded-lg shadow-lg w-full md:w-1/2 lg:w-3/7">
                        <label htmlFor="maxusage" className="text-sm font-semibold text-white block mb-2">
                            Max Usage
                        </label>
                        <input
                            placeholder="Set max usage"
                            type="number"
                            id="maxusage"
                            value={max_usage}
                            onChange={(e) => setMaxUsage(Number(e.target.value))}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all bg-white text-sky-600 dark:focus:ring-sky-400 dark:placeholder-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                    </div>

                    {/* Price Input */}
                    <div className="bg-sky-500 p-5 rounded-lg shadow-lg w-full md:w-1/2 lg:w-3/7">
                        <label htmlFor="price" className="text-sm font-semibold text-white block mb-2">
                            Price
                        </label>
                        <input
                            placeholder="Set price"
                            type="number"
                            id="price"
                            value={price}
                            onChange={(e) => setPrice(Number(e.target.value))}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all bg-white text-sky-600 dark:focus:ring-sky-400 dark:placeholder-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                    </div>

                    <button
                        type="submit"
                        className="relative px-6 py-3 bg-sky-500 text-white font-semibold rounded-lg shadow-lg overflow-hidden group focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2 transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                        <span className="relative z-10">Update service
                        </span>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] rounded-full bg-white/40 pointer-events-none transform scale-100 opacity-0 transition-all duration-700 ease-out group-active:scale-0 group-active:opacity-100 group-active:transition-none"></div>
                    </button>
                    <button
                        onClick={() => router.replace('/admin/services')}
                        type="button"
                        className="ml-5 relative px-6 py-3 bg-sky-500 text-white font-semibold rounded-lg shadow-lg overflow-hidden group focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2 transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                        <span className="relative z-10">Back to services
                        </span>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] rounded-full bg-white/40 pointer-events-none transform scale-100 opacity-0 transition-all duration-700 ease-out group-active:scale-0 group-active:opacity-100 group-active:transition-none"></div>
                    </button>
                </form>
            </div>
        </div>
    )
}