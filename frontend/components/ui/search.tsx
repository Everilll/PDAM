"use client"

import { useRouter } from "next/navigation"
import { KeyboardEvent, useState } from "react"

type Props = {
    search: string
}

export default function Search(props: Props) {
    const [keyword, setKeyword] = useState<string>(props.search)
    const router = useRouter()

    function handleSearch(e: KeyboardEvent<HTMLInputElement>) {
        e.preventDefault()
        if (e.key === 'Enter') {
            const params = new URLSearchParams(window.location.search)

            if (keyword === "") {
                params.delete("search")
            } else {
                params.set("search", keyword)
            }

            router.push(`?${params.toString()}`)
        }
    }

    return (
        <div className="mb-6">
            <input
                type="text"
                name="search"
                id="search"
                placeholder="Search customers..."
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                onKeyUp={handleSearch}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
            />
        </div>
    )
}