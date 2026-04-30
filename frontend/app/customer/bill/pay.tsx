"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { getCookies } from "@/helper/cookies"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"
import { toast } from "react-toastify"

type Prop = {
    bill_id: number
}

export default function Pay(props: Prop) {
    /** this state for handling display of dialog */
    const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false)
    const [file, setFile] = useState<File | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const router = useRouter()

    function openDialog() {
        setIsOpenDialog(true)
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()

        try {
            setIsLoading(true)
            const url = `${process.env.NEXT_PUBLIC_BASE_URL}/payments`
            const requestData = new FormData()
            requestData.append("bill_id", props.bill_id.toString())
            requestData.append("file", file!)

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${await getCookies("token")}`,
                    "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || ""
                },
                body: requestData
            })

            const responseData = await response.json()
            const message: string = responseData?.message || ""
            if (!response.ok) {
                toast.warning(message, {
                    containerId: 'toastPay'
                })
                setIsLoading(false)
                return
            }
            toast.success(message, {
                containerId: 'toastPay'
            })
            
            setIsOpenDialog(false)
            setTimeout(() => router.refresh(), 1000)

        } catch (error) {
            console.log(error);
            toast.error(`Something went wrong. ${error}`, {
                containerId: 'toastPay'
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div>
            <Button type="button" onClick={() => openDialog()}
                className="bg-blue-500 text-white hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2">
                Pay
            </Button>

            <Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Bill Payment</DialogTitle>
                        <DialogDescription>
                            You have to ensure that you upload payment proof
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <Field>
                            <FieldLabel htmlFor="picture">Payment Proof</FieldLabel>
                            <input
                                id="picture"
                                type="file"
                                required
                                accept="image/*"
                                onChange={e => setFile(e.target.files ? e.target.files[0] : null)}
                            />
                            <FieldDescription>Select a payment proof to upload</FieldDescription>
                        </Field>
                        <Button type="submit" className="my-5" disabled={isLoading || !file}>
                            {isLoading ? "Processing..." : "Pay Now"}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}