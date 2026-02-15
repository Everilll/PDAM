import { getCookies } from "@/helper/cookies"

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

export default async function ProfilePage() {
    const adminProfile =  await getAdminProfile()
    if(adminProfile == null){
        return (
            <div className="w-full h-dvh p-3 bg-slate-50 flex justify-center items-center">
                <h1 className="font-semibold text-xl text-blue-700">Sorry, admin profile does not exists.</h1>
            </div>
        )
    }
    return (
        <div className="w-full p-5">
            <div className="w-full rounded bg-blue-50 p-3">
                <h1 className="font-bold text-blue-500 text-xl">
                    Admin Profile
                </h1>
                <table>
                    <tbody>
                        <tr>
                            <td className="p-1">Name</td>
                            <td className="p-1">{adminProfile.name}</td>
                        </tr>
                        <tr>
                            <td className="p-1">Phone</td>
                            <td className="p-1">{adminProfile.phone}</td>
                        </tr>
                        <tr>
                            <td className="p-1">Username</td>
                            <td className="p-1">{adminProfile.user.username}</td>
                        </tr>
                        <tr>
                            <td className="p-1">Role</td>
                            <td className="p-1">{adminProfile.user.role}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}