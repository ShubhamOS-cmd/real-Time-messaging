import { useNavigate, useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  Bell,
  MessageSquare,
  User,
  LogOut,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle.jsx";
import toast from "react-hot-toast";

import { clearUser } from "../store/authSlice.js";
import { clearChatRooms } from "../store/chatSlice.js";
import { clearNotification } from "../store/notificationSlice.js";
import { logout } from "../services/auth.services.js";
import { disconnectSocket } from "../socket/socket.js";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const notificationCount = useSelector(
    (state) => state.notification.notifications.length
  );

  const user = useSelector((state) => state.auth.user);

  const isActive = (path) =>
    location.pathname.startsWith(path);

  const handleLogout = async () => {
    try {
      await logout();

      disconnectSocket();

      dispatch(clearUser());
      dispatch(clearChatRooms());
      dispatch(clearNotification());

      toast.success("Logged out");

      navigate("/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  const navItems = [
    {
      icon: MessageSquare,
      path: "/messages",
      label: "Messages",
    },
    {
      icon: Search,
      path: "/search",
      label: "Find people",
    },
    {
      icon: Bell,
      path: "/notifications",
      label: "Requests",
      badge: notificationCount,
    },
    {
      icon: User,
      path: "/profile",
      label: "Profile",
    },
  ];

  const NavLink = ({
    icon: Icon,
    path,
    label,
    badge,
  }) => {
    const active = isActive(path);

    return (
      <button
        type="button"
        onClick={() => navigate(path)}
        className={`
          orbit-nav-link
          ${active ? "is-active" : ""}
        `}
        aria-current={active ? "page" : undefined}
        aria-label={label}
        title={label}
      >
        <Icon
          size={19}
          strokeWidth={active ? 2.2 : 1.9}
          aria-hidden="true"
        />

        <span>{label}</span>

        {badge > 0 && (
          <span className="orbit-nav-badge">
            {badge > 9 ? "9+" : badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <aside
      className="orbit-sidebar"
      aria-label="Main navigation"
    >
      {/* ================= BRAND ================= */}

      <button
        type="button"
        className="
          orbit-brand
          border-0
          bg-transparent
          cursor-pointer
        "
        onClick={() => navigate("/messages")}
        aria-label="Orbit home"
      >
        <span
          className="orbit-mark"
          aria-hidden="true"
        />

        <span>ORBIT</span>
      </button>

      {/* ================= NAVIGATION ================= */}

      <nav
        className="orbit-nav"
        aria-label="Primary"
      >
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            {...item}
          />
        ))}

        <ThemeToggle className="orbit-nav-link" />

        {/* Mobile logout */}

        <button
          className="
            orbit-nav-link
            orbit-mobile-logout
          "
          type="button"
          onClick={handleLogout}
          aria-label="Log out"
          title="Log out"
        >
          <LogOut
            size={19}
            aria-hidden="true"
          />

          <span>Log out</span>
        </button>
      </nav>

      {/* ================= SPACER ================= */}

      <div className="orbit-sidebar-spacer" />

      {/* ================= USER ================= */}

      <div className="orbit-user">
        {user?.avatar ? (
          <img
            className="orbit-avatar"
            src={user.avatar}
            alt=""
          />
        ) : (
          <div
            className="
              orbit-avatar
              bg-orbit-surface
              text-orbit-primary
            "
            aria-hidden="true"
          >
            {user?.fullName?.slice(0, 1) || "O"}
          </div>
        )}

        <div className="orbit-user-info">
          <strong className="text-orbit-text">
            {user?.fullName || "Your account"}
          </strong>

          <span className="text-orbit-muted">
            @{user?.userName || "profile"}
          </span>
        </div>

        <button
          className="orbit-icon-button"
          type="button"
          onClick={handleLogout}
          aria-label="Log out"
          title="Log out"
        >
          <LogOut
            size={17}
            aria-hidden="true"
          />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;