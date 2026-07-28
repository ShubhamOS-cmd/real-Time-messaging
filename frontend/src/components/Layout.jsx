import { Outlet } from "react-router"
import Sidebar from "./Sidebar.jsx"

const Layout = () => {
    return (
        <div className="flex h-screen bg-[#0A0F1E] overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-hidden">
                <Outlet />
            </main>
        </div>
    )
}

export default Layout