import { getCookies } from "@/helper/cookies"
import FormService from "./form"

export interface ServiceResponse {
    success: boolean
    message: string
    data: Service
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

/** create function to grab data service by id from BE */
async function getServiceById(service_id: string): Promise<Service | null> {
    try {
        const url = `${process.env.NEXT_PUBLIC_BASE_URL}/services/${service_id}`;
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

        const responseData: ServiceResponse = await response.json();
        if (!response.ok) {
            return null
        }
        return responseData.data
    } catch (error) {
        console.log("Error fetching service by id:", error);
        return null
    }
}

/** define parameter URL to get service id */
type PageProp = {
    params: Promise<{
        id: string // sesuai dengan nama folder ini
    }>
}
export default async function EditServicePage(props: PageProp) {
    /** get id of service from Params */
    const { id } = await props.params;
    /** call function to get service based on selected id */
    const selectedService = await getServiceById(id)

    if (selectedService == null) {
        return (
            <div className="justify-center items-center flex h-dvh">
                <h1 className="text-center text-sky-600 font-semibold text-xl">Sorry, service does not exists, please check your URL correctly.</h1>
            </div>
        )
    }

    return (
        <div className="w-full p-24">
            {/* show editable form for service data */}
            <FormService service={selectedService} />
        </div>
    )
}