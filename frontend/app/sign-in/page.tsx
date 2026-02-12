"use client"

import { storeCookies } from "@/helper/cookies";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, startTransition, useState, useTransition } from "react";
import { toast, ToastContainer } from "react-toastify";

export interface LoginResponse {
    success?: boolean
    message: string
    token?: string
    role?: string
    error?: string
    statusCode?: number
}

export default function SignInPage() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    async function handleSignIn(event: FormEvent) {
        try {
            event.preventDefault();
            const url = `${process.env.NEXT_PUBLIC_BASE_URL}/auth`;
            const requestData = { username, password }
            const response = await fetch(
                url,
                {
                    method: "POST",
                    body: JSON.stringify(requestData),
                    headers: {
                        "Content-Type": "application/json",
                        "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || ""
                    },

                }
            )

            const responseData: LoginResponse = await response.json();
            const message = responseData.message
            if (!response.ok) {
                // if statusCode not 200, 201, 204, etc
                toast.error(
                    message,
                    { containerId: 'toastLogin' }
                )
                return;
            }

            if (responseData?.success == true) {
                // assume that login success
                toast.success(
                    message,
                    { containerId: 'toastLogin' }
                )
                startTransition(async function () {
                    storeCookies('token', responseData?.token || "");
                    setTimeout(() => {
                        if (responseData?.role === 'ADMIN') {
                            setTimeout(() => 
                                router.replace('/admin/profile'), 1000);
                        }
                        if (responseData?.role === 'CUSTOMER') {
                            setTimeout(() => 
                                router.replace('/customer/profile'), 1000);
                        }
                    })
                })
            } else {
                // assume that login failed
                toast.warning(
                    message,
                    { containerId: 'toastLogin' }
                )
                return;
            }

        } catch (error) {
            console.log(error);
            alert('Something were wrong')
        }
    }

    return (
        <div className="w-full h-dvh flex justify-center items-center bg-blue-200">
            <ToastContainer containerId={'toastLogin'} />
            <div className="bg-white w-full md:w-1/2 lg:w-1/3 p-10 rounded-lg flex flex-col items-center">
                <h1 className="font-bold text-blue-500 text-2xl text-center">Sign In</h1>
                <small className="mt-3 text-sm text-slate-500 text-center">Use your credential to login</small>
                <form className="w-full my-3" onSubmit={handleSignIn}>
                    <label htmlFor="username" className="text-blue-500 font-semibold">Username</label>
                    <input type="text" id="username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        className="border border-blue-500 rounded-md p-2 mb-2 w-full" />

                    <label htmlFor="password" className="text-blue-500 font-semibold">Password</label>
                    <input type="password" id="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="border border-blue-500 rounded-md p-2 mb-2 w-full " />

                    <button type="submit" className="w-full text-white mt-3.5 p-2 font-semibold bg-blue-500 hover:bg-blue-600 rounded-lg">
                        Sign In
                    </button>
                </form>

                <div className="text-center text-semibold mt-2">If you don't have account, please <Link className="font-semibold text-blue-500" href="/sign-up">sign up</Link></div>
            </div>
        </div>
    )
}