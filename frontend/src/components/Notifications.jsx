import { useDispatch, useSelector } from "react-redux"
import { Bell, Check, X, Loader } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"

import { removeNotification } from "../store/notificationSlice.js"
import { addChatRooms } from "../store/chatSlice.js"
import { acceptChatReq, ignoreChatRequest } from "../services/chat.services.js"

const Notifications = () => {
    const dispatch = useDispatch()
    const requests = useSelector(state => state.notification.notifications)
    const [loadingId, setLoadingId] = useState(null)

    const handleAccept = async (request) => {
        try {
            setLoadingId(request.senderId + "_accept")
            const res = await acceptChatReq({ receiverId: request.senderId })

            // add new chat to chatList
            if(res){
                dispatch(addChatRooms({
                chatId: res.data._id,
                otherMember: {
                    _id: request.senderId,
                    fullName: request.senderName,
                    userName: request.senderUserName,
                    avatar: request.senderAvatar
                },
                lastMessage: null
            }))

            // remove from notifications
            dispatch(removeNotification(request.senderId))
            toast.success(`Accepted ${request.senderName}'s request`)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to accept")
        } finally {
            setLoadingId(null)
        }
    }

    const handleIgnore = async (request) => {
        try {
            setLoadingId(request.senderId + "_ignore")
            await ignoreChatRequest({ receiverId: request.senderId })
            dispatch(removeNotification(request.senderId))
            toast.success("Request ignored")
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to ignore")
        } finally {
            setLoadingId(null)
        }
    }

    return (
        <div className="h-full flex flex-col" style={{ background: "#0A0F1E" }}>

            {/* Header */}
            <div className="px-5 py-4 shrink-0"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <h2 className="text-[#E8EEFF] font-semibold text-lg">Notifications</h2>
                <p className="text-[#8899BB] text-xs mt-0.5">
                    {requests.length} pending {requests.length === 1 ? "request" : "requests"}
                </p>
            </div>

            {/* Request list */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
                {requests.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-3">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                            style={{
                                background: "rgba(79,142,247,0.08)",
                                border: "1px solid rgba(79,142,247,0.12)"
                            }}>
                            <Bell size={22} className="text-[#4F8EF7]" />
                        </div>
                        <p className="text-[#8899BB] text-sm">No pending requests</p>
                        <p className="text-[#8899BB]/60 text-xs">You're all caught up!</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {requests.map((request) => (
                            <div
                                key={request.senderId}
                                className="flex items-center gap-4 p-4 rounded-2xl"
                                style={{
                                    background: "rgba(255,255,255,0.04)",
                                    border: "1px solid rgba(255,255,255,0.08)"
                                }}
                            >
                                {/* Avatar */}
                                <img
                                    src={request.senderAvatar || "https://picsum.photos/id/237/100/100"}
                                    alt={request.senderName}
                                    className="w-12 h-12 rounded-xl object-cover shrink-0"
                                    style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                                />

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-[#E8EEFF] font-medium text-sm">{request.senderName}</p>
                                    <p className="text-[#8899BB] text-xs">@{request.senderUserName}</p>
                                    <p className="text-[#8899BB]/70 text-xs mt-1">Wants to connect with you</p>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 shrink-0">
                                    {/* Accept */}
                                    <button
                                        onClick={() => handleAccept(request)}
                                        disabled={loadingId !== null}
                                        className="w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-50"
                                        style={{
                                            background: "rgba(79,247,142,0.12)",
                                            border: "1px solid rgba(79,247,142,0.2)"
                                        }}
                                    >
                                        {loadingId === request.senderId + "_accept"
                                            ? <Loader size={14} className="text-[#4FFF8F] animate-spin" />
                                            : <Check size={14} className="text-[#4FFF8F]" />
                                        }
                                    </button>

                                    {/* Ignore */}
                                    <button
                                        onClick={() => handleIgnore(request)}
                                        disabled={loadingId !== null}
                                        className="w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-50"
                                        style={{
                                            background: "rgba(255,77,109,0.12)",
                                            border: "1px solid rgba(255,77,109,0.2)"
                                        }}
                                    >
                                        {loadingId === request.senderId + "_ignore"
                                            ? <Loader size={14} className="text-[#FF4D6D] animate-spin" />
                                            : <X size={14} className="text-[#FF4D6D]" />
                                        }
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Notifications
