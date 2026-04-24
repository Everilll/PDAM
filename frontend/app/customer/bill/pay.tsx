"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState } from "react"

export default function Pay() {
    /** this state for handling display of dialog */
    const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false)

    function openDialog() {
        setIsOpenDialog(true)
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
                    <form>

                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}