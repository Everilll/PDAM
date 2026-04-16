"use client"

import { getCookies } from "@/helper/cookies"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast, ToastContainer } from "react-toastify"
import { CustomerResponse, CustomerType } from "../page"
import { ServiceType } from "../add/page"

type Props = {
  customer: CustomerType
  services: ServiceType[]
}

export default function FormCustomer(props: Props) {
  const router = useRouter()

  const [username, setUsername] = useState<string>(props.customer.user.username)
  const [password, setPassword] = useState<string>("")
  const [customer_number, setCustomerNumber] = useState<string>(props.customer.customer_number)
  const [name, setName] = useState<string>(props.customer.name)
  const [phone, setPhone] = useState<string>(props.customer.phone)
  const [address, setAddress] = useState<string>(props.customer.address)
  const [service_id, setServiceId] = useState<number>(props.customer.service_id)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const resetForm = () => {
    setUsername(props.customer.user.username)
    setPassword("")
    setCustomerNumber(props.customer.customer_number)
    setName(props.customer.name)
    setPhone(props.customer.phone)
    setAddress(props.customer.address)
    setServiceId(props.customer.service_id)
  }

  const validateForm = (): boolean => {
    if (!username.trim()) {
      toast.error("Username should not be empty", { containerId: "toastUpdateCustomer" })
      return false
    }
    if (!customer_number.trim()) {
      toast.error("Customer number should not be empty", { containerId: "toastUpdateCustomer" })
      return false
    }
    if (!name.trim()) {
      toast.error("Name should not be empty", { containerId: "toastUpdateCustomer" })
      return false
    }
    if (!phone.trim()) {
      toast.error("Phone should not be empty", { containerId: "toastUpdateCustomer" })
      return false
    }
    if (!address.trim()) {
      toast.error("Address should not be empty", { containerId: "toastUpdateCustomer" })
      return false
    }
    if (!service_id || service_id === 0) {
      toast.error("Please select a service", { containerId: "toastUpdateCustomer" })
      return false
    }
    return true
  }

  const handleUpdateCustomer = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const payload = {
        username,
        customer_number,
        name,
        phone,
        address,
        service_id,
        ...(password.trim() ? { password } : {}),
      }

      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/customers/${props.customer.id}`
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${await getCookies("token")}`,
          "APP-KEY": `${process.env.NEXT_PUBLIC_APP_KEY}`,
        },
        body: JSON.stringify(payload),
      })

      const responseData: CustomerResponse = await response.json()
      if (!response.ok) {
        toast.error(responseData?.message || "Failed to update customer", { containerId: "toastUpdateCustomer" })
        return
      }

      toast.success(responseData?.message || "Customer berhasil diperbarui", { containerId: "toastUpdateCustomer" })
      resetForm()
    } catch (error) {
      console.log("Error updating customer:", error)
      toast.error("Terjadi kesalahan. Silakan coba lagi.", { containerId: "toastUpdateCustomer" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full">
      <ToastContainer containerId={"toastUpdateCustomer"} position="top-right" autoClose={3000} />

      <div className="mb-4">
        <h1 className="text-xl text-sky-700 font-bold">Update customer</h1>
        <p className="text-slate-600 text-sm">edit customer data</p>
      </div>

      <form onSubmit={handleUpdateCustomer} className="space-y-3">
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
            className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all bg-white text-sky-600 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <div className="bg-sky-500 p-3 rounded-lg shadow w-full md:w-1/2 lg:w-2/5">
          <label htmlFor="password" className="text-xs font-semibold text-white block mb-1">
            Password (optional)
          </label>
          <input
            placeholder="Fill only if you want to change password"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all bg-white text-sky-600 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

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
            className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all bg-white text-sky-600 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

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
            className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all bg-white text-sky-600 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

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
            className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all bg-white text-sky-600 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

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
            className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all bg-white text-sky-600 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <div className="bg-sky-500 p-3 rounded-lg shadow w-full md:w-1/2 lg:w-2/5">
          <label htmlFor="service_id" className="text-xs font-semibold text-white block mb-1">
            Service
          </label>
          <select
            id="service_id"
            value={service_id}
            onChange={(e) => setServiceId(Number(e.target.value))}
            disabled={isLoading || props.services.length === 0}
            className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all bg-white text-sky-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value={0} disabled>-- Select a service --</option>
            {props.services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} (Rp {service.price.toLocaleString("id-ID")})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={isLoading}
            className="relative px-4 py-2 text-sm bg-sky-500 text-white font-semibold rounded-md shadow overflow-hidden group focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2 transition-all duration-300 hover:shadow-md hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <span className="relative z-10">{isLoading ? "Saving..." : "Update customer"}</span>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] rounded-full bg-white/40 pointer-events-none transform scale-100 opacity-0 transition-all duration-700 ease-out group-active:scale-0 group-active:opacity-100 group-active:transition-none"></div>
          </button>
          <button
            onClick={() => router.replace("/admin/customer")}
            type="button"
            disabled={isLoading}
            className="ml-3 relative px-4 py-2 text-sm bg-sky-500 text-white font-semibold rounded-md shadow overflow-hidden group focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2 transition-all duration-300 hover:shadow-md hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <span className="relative z-10">{isLoading ? "Returning..." : "Back to customers"}</span>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] rounded-full bg-white/40 pointer-events-none transform scale-100 opacity-0 transition-all duration-700 ease-out group-active:scale-0 group-active:opacity-100 group-active:transition-none"></div>
          </button>
        </div>
      </form>
    </div>
  )
}