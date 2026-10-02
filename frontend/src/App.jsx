import { useState, useEffect } from "react";
import "./App.css";

import { useDispatch } from "react-redux";
import { getCurrentUser } from "./services/user.services.js";
import {
    setUser,
    clearUser,
} from "./store/authSlice.js";

import { connectSocket } from "./socket/socket.js";
import { Outlet } from "react-router";
import { Toaster } from "react-hot-toast";

function App() {
    const [loading, setLoading] = useState(true);

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const res = await getCurrentUser();

                dispatch(setUser(res.data));

                // Connect Socket.IO after
                // successful authentication.
                connectSocket();
            } catch {
                dispatch(clearUser());
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentUser();
    }, [dispatch]);

    if (loading) {
        return (
            <div
                className="orbit-loading"
                role="status"
            >
                Loading Orbit...
            </div>
        );
    }

    return (
        <>
            <Toaster />
            <Outlet />
        </>
    );
}

export default App;