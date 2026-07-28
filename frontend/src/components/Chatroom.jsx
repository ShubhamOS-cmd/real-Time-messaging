import { useState, useEffect, useRef } from "react"
import { useNavigate, useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux"
import { ArrowLeft, Send } from "lucide-react"

import { getSocket, sendMessage } from "../socket/socket.js"

const Chatroom = () => {
    const { chatId } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [text, setText] = useState("")
    const bottomRef = useRef(null)

    const currentUser = useSelector(state => state.auth.user)
    const messages = useSelector(state => state.chat.messages[chatId] || [])
    const chatList = useSelector(state => state.chat.chatRooms)
    const activeChat = chatList.find(c => c.chatId === chatId)

    // scroll to bottom on new message
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const handleSend = () => {
        if (!text.trim()) return
        sendMessage(chatId, text.trim())
        setText("")
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const formatTime = (timestamp) => {
        if (!timestamp) return ""
        return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
    return (
        <div className="h-full flex flex-col" style={{ background: "#0A0F1E" }}>

            {/* Header */}
            <div className="px-4 py-3 flex items-center gap-3 shrink-0"
                style={{
                    background: "rgba(255,255,255,0.02)",
                    borderBottom: "1px solid rgba(255,255,255,0.06)"
                }}>
                <button
                    onClick={() => navigate("/messages")}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[#8899BB] hover:text-[#E8EEFF] hover:bg-white/5 transition-all"
                >
                    <ArrowLeft size={18} />
                </button>

                <img
                    src={activeChat?.otherMember?.avatar || "https://picsum.photos/id/237/100/100"}
                    alt={activeChat?.otherMember?.fullName}
                    className="w-8 h-8 rounded-lg object-cover"
                    style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                />

                <div>
                    <p className="text-[#E8EEFF] text-sm font-medium">
                        {activeChat?.otherMember?.fullName || "Chat"}
                    </p>
                    <p className="text-[#8899BB] text-xs">
                        @{activeChat?.otherMember?.userName}
                    </p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2">
                {messages.length === 0 && (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-[#8899BB] text-sm">No messages yet. Say hello!</p>
                    </div>
                )}

                {messages.map((msg, index) => {
                    const isMe = msg.sender === currentUser?._id ||
                        msg.sender?._id === currentUser?._id
                        
                    return (
                        <div
                            key={msg._id || index}
                            className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className="max-w-[70%] px-3.5 py-2.5 rounded-2xl"
                                style={isMe ? {
                                    background: "rgba(79,142,247,0.25)",
                                    border: "1px solid rgba(79,142,247,0.3)",
                                    borderBottomRightRadius: "6px"
                                } : {
                                    background: "rgba(255,255,255,0.06)",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                    borderBottomLeftRadius: "6px"
                                }}
                            >
                                <p className="text-[#E8EEFF] text-sm leading-relaxed">
                                    {msg.message?.content || msg.message}
                                </p>
                                <p className={`text-[10px] mt-1 ${isMe ? "text-[#4F8EF7]/70 text-right" : "text-[#8899BB]"}`}>
                                    {formatTime(msg.createdAt)}
                                </p>
                            </div>
                        </div>
                    )
                })}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 shrink-0"
                style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center gap-2"
                    style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "14px",
                        padding: "8px 8px 8px 16px"
                    }}>
                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 bg-transparent text-[#E8EEFF] placeholder-[#8899BB] text-sm focus:outline-none"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!text.trim()}
                        className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 disabled:opacity-40"
                        style={{ background: text.trim() ? "#4F8EF7" : "rgba(79,142,247,0.2)" }}
                    >
                        <Send size={14} className="text-white" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Chatroom