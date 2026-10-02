import { Outlet } from "react-router"
import Sidebar from "./Sidebar.jsx"

const Layout = () => {
    return (
        <div className="orbit-shell">
            <Sidebar />
            <main className="orbit-main">
                <Outlet />
            </main>
        </div>
    )
}

export default Layout