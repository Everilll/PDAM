"use client"

import Link from "next/link";
import { useState } from "react";

/** use client digunakan untuk menunjukkan halama tersebut 
 * merupakan halaman client side rendering
 * 
 * client side rendering artinya proses rendering
 * dilakukan di sisi client (browser)
 * 
 * waktu yang tepat untuk menggunakan "use client" 
 * adalah ketika halaman tersebut membutuhkan
 * interaktivitas di sisi client */
export default function SignUpPage() {
    /** define state */
    /** define state adalah variabel yang menyimpan informasi
     * yang dapat berubah selama proses rendering komponen
     */
    const [username, setUsername] = useState<string>("");
    /** 
     * username: nama state untuk menyimpan
     * username yang diinputkan user
     * 
     * setUsername: fungsi untuk mengubah nilai
     * dari state "username"
     */
    const [password, setPassword] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [phone, setPhone] = useState<string>("");

    /** function to handle sign up form submission */
    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault(); // mencegah reload halaman saat submit form
        try {
            const request = JSON.stringify({
                username,
                password,
                name,
                phone
            })
            const url = `${process.env.NEXT_PUBLIC_BASE_URL}/admins`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "APP-KEY": `${process.env.NEXT_PUBLIC_APP_KEY}`
                },
                body: request
            });
            if (!response.ok) {
                alert("Gagal melakukan registrasi admin");
                return;
            }
            const responseData = await response.json();
            alert(responseData.message);
        } catch (error) {
            console.log("Error during sign up:", error);
        }
    }
    return (
        <div className="w-full h-dvh bg-blue-200 p-3 flex items-center justify-center">
            <div className="bg-white w-full md:w-1/2 lg:w-1/3 p-10 rounded-lg">
                <h1 className="text-center font-bold text-blue-500 text-2xl">
                    Register Admin
                </h1>

                <form className="my-3" onSubmit={handleSignUp}>
                    <div className="pb-7">
                        <label htmlFor="username" className="text-sm font-semibold text-blue-500">Username</label>
                        <input type="text" id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)} className="w-full p-2 border border-blue-500 text-slate-900 mb-2 rounded-lg" />

                        <label htmlFor="name" className="text-sm font-semibold text-blue-500">Name</label>
                        <input type="text" id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)} className="w-full p-2 border border-blue-500 text-slate-900 mb-2 rounded-lg" />

                        <label htmlFor="password" className="text-sm font-semibold text-blue-500">Password</label>
                        <input type="password" id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border border-blue-500 text-slate-900 mb-2 rounded-lg" />

                        <label htmlFor="phone" className="text-sm font-semibold text-blue-500">Phone</label>
                        <input type="text" id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)} className="w-full p-2 border border-blue-500 text-slate-900 mb-2 rounded-lg" />
                    </div>

                    <button type="submit" className="w-full bg-blue-500 text-white p-2 font-semibold hover:bg-blue-600 rounded-lg">
                        Sign Up
                    </button>

                    <div className="text-center text-semibold pt-5">Already have account? <Link className="font-semibold text-blue-500" href="/sign-in">sign in</Link></div>
                </form>
            </div>
        </div>
    )
}