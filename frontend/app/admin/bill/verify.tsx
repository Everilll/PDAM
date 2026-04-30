"use client"
import { BillType } from "./page"
import { FormEvent, useState } from "react"
import { toast } from "react-toastify"
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Vote } from "lucide-react"
import { getCookies } from "@/helper/cookies"

const VerifyBill = ({
    selectedData
}: {
    selectedData: BillType
}) => {
    const router = useRouter()
    const [open, setOpen] = useState<boolean>(false)

    const openModal = () => {
        setOpen(true)
    }

    const handleSubmit = async (e: FormEvent) => {
        try {
            e.preventDefault()
            const url = `${process.env.NEXT_PUBLIC_BASE_URL}/payments/${selectedData.payments.id}`
            const response = await fetch(url, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${await getCookies("token")}`,
                    "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
                    "Content-Type": "application/json"
                }
            })
            const result = await response.json()
            if (result?.success) {
                toast.success(result.message)
                setOpen(false)
                setTimeout(() => router.refresh(), 1000)
            } else {
                toast.warning(result.message)
            }
            
        } catch (error) {
            toast.error(`Something went wrong. ${error}`)
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant={"outline"} className="test-sm px-3 py-1 rounded-md bg-green-600 text-whtie hover:opacity-50"
                onClick={openModal}>
                    <Vote/> Verify
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <form onSubmit={handleSubmit}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure verify this payment?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently verify the payment for {selectedData.customer.name}.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <Button type="submit">Continue</Button>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    )
}
export default VerifyBill