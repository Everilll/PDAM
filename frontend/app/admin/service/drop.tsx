"use client"
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { getCookies } from "@/helper/cookies";
import { toast } from "react-toastify";

export default function DropServiceButton({
  selectedData,
}: {
  selectedData: number;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleDelete = async (e: FormEvent) => {
    if (!confirm(`Are you sure want to delete this service?`)) {
      return;
    }

    setIsLoading(true);
    try {
      e.preventDefault();
      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/services/${selectedData}`;
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${await getCookies("token")}`,
          "APP-KEY": `${process.env.NEXT_PUBLIC_APP_KEY}`,
        },
      });
      const responseData = await response.json();
      if (!response.ok) {
        console.log(responseData.message);
      }
      toast.warning(responseData.message);
      setIsLoading(false);
      router.refresh();
    } catch (error) {
      console.log('Error deleting service:', error);
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isLoading}
      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
      title="Delete service"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
  )
}
