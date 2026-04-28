"use client"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState, useTransition } from "react";

export default function CardDemo() {
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

    const [isPending, startTransition] = useTransition();

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
                alert("Failed to register admin");
                return;
            }
            const responseData = await response.json();
            alert(responseData.message);
        } catch (error) {
            console.log("Error during sign up:", error);
        }
    }

    return (
        <div className="w-full h-dvh flex justify-center items-center bg-blue-100">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Sign up for an account</CardTitle>
                    <CardDescription>
                        Enter your details below to create an account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignUp}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="Enter your username"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                </div>
                                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Enter your name"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    type="text"
                                    placeholder="Enter your phone number"
                                    required
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={isPending}>
                                {isPending ? "Loading..." : "Sign Up"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <p className="text-sm text-muted-foreground text-center">
                        Already have an account?{" "}
                        <Link href="/sign-in" className="font-medium text-primary underline-offset-4 hover:underline">
                            Sign In
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
