import { useSelector } from "react-redux"
import { User, Mail, Calendar, AtSign } from "lucide-react"

const Profile = () => {
    const user = useSelector(state => state.auth.user)

    const formatDOB = (dob) => {
        if (!dob) return "Not set"
        return new Date(dob).toLocaleDateString([], {
            year: "numeric",
            month: "long",
            day: "numeric"
        })
    }

    const fields = [
        { icon: User, label: "Full Name", value: user?.fullName },
        { icon: AtSign, label: "Username", value: `@${user?.userName}` },
        { icon: Mail, label: "Email", value: user?.email },
        { icon: Calendar, label: "Date of Birth", value: formatDOB(user?.DOB) },
    ]

    return (
        <div className="h-full flex flex-col" style={{ background: "#0A0F1E" }}>

            {/* Header */}
            <div className="px-5 py-4 shrink-0"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <h2 className="text-[#E8EEFF] font-semibold text-lg">Profile</h2>
                <p className="text-[#8899BB] text-xs mt-0.5">Your account details</p>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-6">

                {/* Avatar section */}
                <div className="flex flex-col items-center mb-8">
                    <div className="relative">
                        <img
                            src={user?.avatar || "https://picsum.photos/id/237/100/100"}
                            alt={user?.fullName}
                            className="w-24 h-24 rounded-2xl object-cover"
                            style={{ border: "2px solid rgba(79,142,247,0.3)" }}
                        />
                        {/* Online indicator */}
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#4FFF8F]"
                            style={{ border: "2px solid #0A0F1E" }} />
                    </div>
                    <h3 className="text-[#E8EEFF] font-semibold text-lg mt-4">{user?.fullName}</h3>
                    <p className="text-[#8899BB] text-sm">@{user?.userName}</p>
                </div>

                {/* Info fields */}
                <div className="rounded-2xl overflow-hidden"
                    style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)"
                    }}>
                    {fields.map((field, index) => (
                        <div
                            key={field.label}
                            className="flex items-center gap-4 px-5 py-4"
                            style={{
                                borderBottom: index < fields.length - 1
                                    ? "1px solid rgba(255,255,255,0.05)"
                                    : "none"
                            }}
                        >
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                style={{ background: "rgba(79,142,247,0.1)" }}>
                                <field.icon size={15} className="text-[#4F8EF7]" />
                            </div>
                            <div>
                                <p className="text-[#8899BB] text-xs">{field.label}</p>
                                <p className="text-[#E8EEFF] text-sm font-medium mt-0.5">
                                    {field.value || "Not set"}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Profile
