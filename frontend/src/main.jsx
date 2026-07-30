import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { createBrowserRouter , RouterProvider } from 'react-router'
import { Navigate } from 'react-router'

import AuthLayout from "./components/AuthLayout.jsx"
import {store} from "./store/store.js"
import './index.css'
import App from './App.jsx'
import Login from "./pages/Login.jsx"
import Register from "./pages/Register.jsx"
import Welcome from "./pages/Welcome.jsx"
import Profile from "./pages/Profile.jsx"
import Messages from "./components/Messages.jsx"
import Chatroom from "./components/Chatroom.jsx"
import Notifications from "./components/Notifications.jsx"
import Search from "./components/Search.jsx"
import Layout from "./components/Layout.jsx"
import ForgotPassword from './pages/ForgotPassword .jsx'
const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <Navigate to="/welcome" />
            },
            {
                path: "welcome",
                element: (
                    <AuthLayout authentication={false}>
                        <Welcome />
                    </AuthLayout>
                )
            },
            {
                path: "login",
                element: (
                    <AuthLayout authentication={false}>
                        <Login />
                    </AuthLayout>
                )
            },
            {
                path: "forgot-password",
                element: (
                    <AuthLayout authentication={false}>
                        <ForgotPassword />
                    </AuthLayout>
                )
            },
            {
                path: "register",
                element: (
                    <AuthLayout authentication={false}>
                        <Register />
                    </AuthLayout>
                )
            },

            // AuthLayout routes — inside Layout
            {
                path: "/",
                element: (
                    <AuthLayout authentication={true}>
                        <Layout />
                    </AuthLayout>
                ),
                children: [
                    {
                        path: "messages",
                        element: <Messages />
                    },
                    {
                        path: "messages/:chatId",
                        element: <Chatroom />
                    },
                    {
                        path: "search",
                        element: <Search />
                    },
                    {
                        path: "notifications",
                        element: <Notifications />
                    },
                    {
                        path: "profile",
                        element: <Profile />
                    }
                ]
            },

            // Fallback
            {
                path: "*",
                element: <Navigate to="/messages" />
            }
        ]
    }
])
createRoot(document.getElementById('root')).render(
    <StrictMode>
    <Provider store = {store}>
      <RouterProvider router={router} />
    </Provider>
    </StrictMode>
)
/**
App          ← auth check, loading state
└── Outlet
    ├── Welcome      (URL: /welcome)
    ├── Login        (URL: /login)
    ├── Register     (URL: /register)
    └── Layout       (URL: /)
        ├── Sidebar  ← always visible
        └── Outlet
            ├── Messages     (URL: /messages)
            ├── ChatRoom     (URL: /messages/:chatId)
            ├── Search       (URL: /search)
            ├── Notifications (URL: /notifications)
            └── Profile      (URL: /profile)
 */