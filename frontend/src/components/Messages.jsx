import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router"
import { MessageSquare } from "lucide-react"

import { setChatRooms, setActiveChat } from "../store/chatSlice.js"
import { getChatRooms, getChatHistory } from "../services/chat.services.js"

const Messages = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const chatList = useSelector(state => state.chat.chatRooms)
    const messages = useSelector(state => state.chat.messages)

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const res = await getChatRooms();
                if(res){
                    dispatch(setChatRooms(res.data))
                }
            } catch (error) {
                console.error("Failed to fetch chats", error)
            }
        }
        fetchChats();
    }, [])

    const handleOpenChat = async (chat) => {
        dispatch(setActiveChat(chat.chatId))

        if (!messages[chat.chatId]) {
            try {
                const res = await getChatHistory({ chatId: chat.chatId })
                
                if(res){
                    dispatch({ type: "chat/setMessages", payload: { chatId: chat.chatId, messages: res.data } })
                }
            } catch (error) {
                console.error("Failed to fetch messages", error)
            }
        }
        // 
        navigate(`/messages/${chat.chatId}`)
    }

    const formatTime = (timestamp) => {
        if (!timestamp) return ""
        const date = new Date(timestamp)
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }

    return (
        <div className="h-full flex flex-col" style={{ background: "#0A0F1E" }}>

            {/* Header */}
            <div className="px-5 py-4 shrink-0"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <h2 className="text-[#E8EEFF] font-semibold text-lg">Messages</h2>
                <p className="text-[#8899BB] text-xs mt-0.5">{chatList.length} conversations</p>
            </div>

            {/* Chat list */}
            <div className="flex-1 overflow-y-auto">
                {chatList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-3">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                            style={{ background: "rgba(79,142,247,0.1)", border: "1px solid rgba(79,142,247,0.15)" }}>
                            <MessageSquare size={24} className="text-[#4F8EF7]" />
                        </div>
                        <p className="text-[#8899BB] text-sm">No conversations yet</p>
                        <p className="text-[#8899BB]/60 text-xs">Search for someone to start chatting</p>
                    </div>
                ) : (
                    chatList.map((chat) => (
                        <button
                            key={chat.chatId}
                            onClick={() => handleOpenChat(chat)}
                            className="w-full px-4 py-3.5 flex items-center gap-3 transition-all duration-150 text-left"
                            style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                        >
                            {/* Avatar */}
                            <div className="relative shrink-0">
                                <img
                                    src={chat.otherMember?.avatar || "https://picsum.photos/id/237/100/100"}
                                    alt={chat.otherMember?.fullName}
                                    className="w-11 h-11 rounded-xl object-cover"
                                    style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                                />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <p className="text-[#E8EEFF] text-sm font-medium truncate">
                                        {chat.otherMember?.fullName}
                                    </p>
                                    <span className="text-[#8899BB] text-[11px] shrink-0 ml-2">
                                        {formatTime(chat.lastMessage?.timestamp)}
                                    </span>
                                </div>
                                <p className="text-[#8899BB] text-xs truncate mt-0.5">
                                    {chat.lastMessage?.content || "Start a conversation"}
                                </p>
                            </div>
                        </button>
                    ))
                )}
            </div>
        </div>
    )
}

export default Messages