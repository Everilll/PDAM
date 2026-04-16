"use client"
import { storeCookies } from "@/helper/cookies";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export interface LoginResponse {
  success?: boolean
  message: string
  token?: string
  role?: string
  error?: string
  statusCode?: number
}

export default function CardDemo() {
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
    <div className="w-full h-dvh flex justify-center items-center bg-blue-100">
      <Card className="w-full max-w-md">
        <ToastContainer containerId={`toastLogin`} />
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your username below to login to your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSignIn}>
          <CardContent>
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
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Loading..." : "Login"}
              </Button>
            </div>
          </CardContent>
        </form>
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground text-center">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="font-medium text-primary underline-offset-4 hover:underline">
              Sign Up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
