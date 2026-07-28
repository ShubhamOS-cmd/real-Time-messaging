import { useNavigate, useLocation } from "react-router"
import { useDispatch, useSelector } from "react-redux"
import { Search, Bell, MessageSquare, User, LogOut } from "lucide-react"
import toast from "react-hot-toast"

import { clearUser } from "../store/authSlice.js"
import { clearChatRooms } from "../store/chatSlice.js"
import { clearNotification } from "../store/notificationSlice.js"
import { logout } from "../services/auth.services.js"
import { disconnectSocket } from "../socket/socket.js"

const Sidebar = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()

    const notificationCount = useSelector(state => state.notification.notifications.length)
    const user = useSelector(state => state.auth.user)

    const isActive = (path) => location.pathname.startsWith(path)

    const handleLogout = async () => {
        try {
            await logout()
            disconnectSocket()
            dispatch(clearUser())
            dispatch(clearChatRooms())
            dispatch(clearNotification())
            toast.success("Logged out")
            navigate("/welcome")
        } catch (error) {
            toast.error("Logout failed")
        }
    }

    const topNavItems = [
        { icon: MessageSquare, path: "/messages", label: "Messages" },
        { icon: Search, path: "/search", label: "Search" },
        { icon: Bell, path: "/notifications", label: "Notifications", badge: notificationCount },
    ]

    const bottomNavItems = [
        { icon: User, path: "/profile", label: "Profile" },
    ]

    const IconButton = ({ icon: Icon, path, label, badge }) => {
        const active = isActive(path)
        return (
            <div className="relative group">
                <button
                    onClick={() => navigate(path)}
                    className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 relative"
                    style={{
                        background: active ? "rgba(79,142,247,0.15)" : "transparent",
                        border: active ? "1px solid rgba(79,142,247,0.2)" : "1px solid transparent"
                    }}
                >
                    <Icon
                        size={20}
                        className="transition-colors duration-200"
                        style={{ color: active ? "#4F8EF7" : "#8899BB" }}
                        fill={active ? "rgba(79,142,247,0.3)" : "none"}
                    />
                    {/* Badge */}
                    {badge > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#4F8EF7] rounded-full text-white text-[9px] flex items-center justify-center font-bold">
                            {badge > 9 ? "9+" : badge}
                        </span>
                    )}
                </button>

                {/* Tooltip */}
                <div className="absolute left-14 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg text-xs text-[#E8EEFF] font-medium opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50"
                    style={{ background: "rgba(13,21,38,0.95)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    {label}
                </div>
            </div>
        )
    }

    return (
        <aside
            className="w-16 h-screen flex flex-col items-center py-4 gap-1 shrink-0"
            style={{
                background: "rgba(255,255,255,0.02)",
                borderRight: "1px solid rgba(255,255,255,0.06)"
            }}
        >
            {/* Logo */}
            <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: "rgba(79,142,247,0.12)", border: "1px solid rgba(79,142,247,0.2)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="#4F8EF7" strokeWidth="1.5" />
                    <circle cx="12" cy="12" r="3.5" fill="#4F8EF7" />
                    <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#4F8EF7" strokeWidth="1.5" opacity="0.4" />
                </svg>
            </div>

            {/* Divider */}
            <div className="w-6 h-px bg-white/10 mb-2" />

            {/* Top nav */}
            <div className="flex flex-col items-center gap-1.5 flex-1">
                {topNavItems.map((item) => (
                    <IconButton key={item.path} {...item} />
                ))}
            </div>

            {/* Bottom nav */}
            <div className="flex flex-col items-center gap-1.5">
                {/* Avatar */}
                <button onClick={() => navigate("/profile")} className="relative group">
                    <img
                        src={user?.avatar || "https://picsum.photos/id/237/100/100"}
                        alt={user?.fullName}
                        className="w-9 h-9 rounded-xl object-cover"
                        style={{ border: isActive("/profile") ? "1.5px solid #4F8EF7" : "1.5px solid rgba(255,255,255,0.1)" }}
                    />
                </button>

                {/* Logout */}
                <div className="relative group">
                    <button
                        onClick={handleLogout}
                        className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 hover:bg-[#FF4D6D]/10"
                        style={{ border: "1px solid transparent" }}
                    >
                        <LogOut size={18} className="text-[#8899BB] group-hover:text-[#FF4D6D] transition-colors" />
                    </button>
                    <div className="absolute left-14 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg text-xs text-[#E8EEFF] font-medium opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50"
                        style={{ background: "rgba(13,21,38,0.95)", border: "1px solid rgba(255,255,255,0.08)" }}>
                        Logout
                    </div>
                </div>
            </div>
        </aside>
    )
}

export default Sidebar