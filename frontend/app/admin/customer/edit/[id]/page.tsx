import { getCookies } from "@/helper/cookies"
import FormCustomer from "../form"

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
  user: UserType
}

export interface UserType {
  id: number
  username: string
  password: string
  role: string
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

async function getCustomerById(customer_id: string): Promise<CustomerType | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BASE_URL || ""
    const url = `${baseUrl}/customers/${customer_id}`
    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
      headers: {
        "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
        "Authorization": `Bearer ${await getCookies("token")}`,
      },
    })

    const responseData: CustomerResponse = await response.json()
    if (!response.ok) {
      return null
    }
    return responseData.data
  } catch (error) {
    console.log("Error fetching customer by id:", error)
    return null
  }
}

async function getServices(): Promise<ServiceType[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BASE_URL || ""
    const url = `${baseUrl}/services`
    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
      headers: {
        "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
        "Authorization": `Bearer ${await getCookies("token")}`,
      },
    })

    const responseData: ServiceListResponse = await response.json()
    if (!response.ok) {
      return []
    }
    return responseData.data ?? []
  } catch (error) {
    console.log("Error fetching services:", error)
    return []
  }
}

type PageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function EditCustomerPage(props: PageProps) {
  const { id } = await props.params
  const [selectedCustomer, services] = await Promise.all([
    getCustomerById(id),
    getServices(),
  ])

  if (selectedCustomer == null) {
    return (
      <div className="justify-center items-center flex h-dvh">
        <h1 className="text-center text-sky-600 font-semibold text-xl">Sorry, customer does not exist. Please check your URL correctly.</h1>
      </div>
    )
  }

  return (
    <div className="w-full p-10">
      <FormCustomer customer={selectedCustomer} services={services} />
    </div>
  )
}
