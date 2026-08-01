import { useState } from "react"
import { Search as SearchIcon, UserPlus, MessageSquare, Loader } from "lucide-react"
import toast from "react-hot-toast"

import { searchTheUser } from "../services/user.services.js"
import { chatRequest , cancelChatRequest  } from "../services/chat.services.js"

const Search = () => {
    const [query, setQuery] = useState("");
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(false)
    const [requesting, setRequesting] = useState(false)

    const handleSearch = async () => {
        if (!query.trim()) return
        try {
            setLoading(true);
            setResult(null);
            const res = await searchTheUser({ userName: query.trim() })
            if(res){
                //console.log(res);
                setResult(res.data)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "User not found")
            setResult(null)
        } finally {
            setLoading(false)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleSearch()
    }

    const handleSendRequest = async () => {
        if (!result) return
        try {
            setRequesting(true)
            const res = await chatRequest({ receiverId: result?.user?._id })
            if(res){
                toast.success("Request sent!")
                setResult(prev => ({ ...prev, status: "pending" }))
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send request")
        } finally {
            setRequesting(false)
        }
    }
    const handleCancelRequest = async () => {
    if (!result) return
    try {
        setRequesting(true)
        const res = await cancelChatRequest({ receiverId: result?.user?._id })
        if (res) {
            toast.success("Request cancelled")
            setResult(prev => ({ ...prev, status: "none" }))
        }
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to cancel request")
    } finally {
        setRequesting(false)
    }
    }
    return (
        <div className="h-full flex flex-col" style={{ background: "#0A0F1E" }}>

            {/* Header */}
            <div className="px-5 py-4 shrink-0"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <h2 className="text-[#E8EEFF] font-semibold text-lg">Search</h2>
                <p className="text-[#8899BB] text-xs mt-0.5">Find people by username</p>
            </div>

            <div className="flex-1 px-5 py-6">

                {/* Search input */}
                <div className="flex gap-2">
                    <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl"
                        style={{
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.08)"
                        }}>
                        <SearchIcon size={16} className="text-[#8899BB] shrink-0" />
                        <input
                            type="text"
                            placeholder="Enter username..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="flex-1 bg-transparent text-[#E8EEFF] placeholder-[#8899BB] text-sm focus:outline-none"
                        />
                    </div>
                    <button
                        onClick={handleSearch}
                        disabled={loading || !query.trim()}
                        className="px-5 py-3 rounded-xl text-white text-sm font-medium transition-all disabled:opacity-50"
                        style={{ background: "#4F8EF7" }}
                    >
                        {loading ? <Loader size={16} className="animate-spin" /> : "Search"}
                    </button>
                </div>

                {/* Result */}
                {result && (
                    <div className="mt-6 rounded-2xl p-5"
                        style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.08)"
                        }}>
                        <div className="flex items-center gap-4">
                            <img
                                src={result?.user?.avatar || "https://picsum.photos/id/237/100/100"}
                                alt={result?.user?.fullName}
                                className="w-14 h-14 rounded-2xl object-cover"
                                style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                            />
                            <div className="flex-1">
                                <p className="text-[#E8EEFF] font-semibold">{result?.user?.fullName}</p>
                                <p className="text-[#8899BB] text-sm">@{result?.user?.userName}</p>
                            </div>

                            {/* Action button based on status */}
                            {result.status === "none" && (
                                <button
                                    onClick={handleSendRequest}
                                    disabled={requesting}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium transition-all disabled:opacity-50"
                                    style={{ background: "#4F8EF7" }}
                                >
                                    {requesting
                                        ? <Loader size={14} className="animate-spin" />
                                        : <UserPlus size={14} />
                                    }
                                    {requesting ? "Sending..." : "Send Request"}
                                </button>
                            )}

                            {result.status === "pending" && (
    <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
        style={{
            background: "rgba(79,142,247,0.1)",
            border: "1px solid rgba(79,142,247,0.2)",
            color: "#4F8EF7"
        }}>
        {requesting ? (
            <Loader size={14} className="animate-spin" />
        ) : (
            <>
                Request Sent
                <button
                    onClick={handleCancelRequest}
                    disabled={requesting}
                    className="ml-2 text-xs underline hover:text-white transition-colors disabled:opacity-50"
                >
                    Cancel
                </button>
            </>
        )}
    </div>
)}

                            {result.status === "connected" && (
                                <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
                                    style={{
                                        background: "rgba(79,247,142,0.1)",
                                        border: "1px solid rgba(79,247,142,0.2)",
                                        color: "#4FFF8F"
                                    }}>
                                    <MessageSquare size={14} />
                                    Connected
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Empty state */}
                {!result && !loading && (
                    <div className="flex flex-col items-center justify-center mt-20 gap-3">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                            style={{
                                background: "rgba(79,142,247,0.08)",
                                border: "1px solid rgba(79,142,247,0.12)"
                            }}>
                            <SearchIcon size={22} className="text-[#4F8EF7]" />
                        </div>
                        <p className="text-[#8899BB] text-sm">Search for a username to get started</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Search
