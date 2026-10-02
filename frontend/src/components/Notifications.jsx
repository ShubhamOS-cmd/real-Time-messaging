import { useDispatch, useSelector } from "react-redux";
import {
  Bell,
  Check,
  X,
  Loader,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import { removeNotification } from "../store/notificationSlice.js";
import { addChatRooms } from "../store/chatSlice.js";
import {
  acceptChatReq,
  ignoreChatRequest,
} from "../services/chat.services.js";

const Notifications = () => {
  const dispatch = useDispatch();

  const requests = useSelector(
    (state) => state.notification.notifications
  );

  const [loadingId, setLoadingId] = useState(null);

  // -----------------------------
  // Accept request
  // -----------------------------

  const handleAccept = async (request) => {
    try {
      setLoadingId(
        request.senderId + "_accept"
      );

      const res = await acceptChatReq({
        receiverId: request.senderId,
      });

      if (res) {
        // Add newly created chat room
        // to the Redux chat list.
        dispatch(
          addChatRooms({
            chatId: res.data._id,
            otherMember: {
              _id: request.senderId,
              fullName: request.senderName,
              userName: request.senderUserName,
              avatar: request.senderAvatar,
            },
            lastMessage: null,
          })
        );

        // Remove request notification.
        dispatch(
          removeNotification(request.senderId)
        );

        toast.success(
          `Accepted ${request.senderName}'s request`
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to accept"
      );
    } finally {
      setLoadingId(null);
    }
  };

  // -----------------------------
  // Ignore request
  // -----------------------------

  const handleIgnore = async (request) => {
    try {
      setLoadingId(
        request.senderId + "_ignore"
      );

      await ignoreChatRequest({
        receiverId: request.senderId,
      });

      dispatch(
        removeNotification(request.senderId)
      );

      toast.success("Request ignored");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to ignore"
      );
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="orbit-page">
      {/* ================= HEADER ================= */}

      <div className="orbit-page-header">
        <div>
          <h1 className="text-orbit-text">
            Requests
          </h1>

          <p className="text-orbit-muted">
            {requests.length} pending{" "}
            {requests.length === 1
              ? "request"
              : "requests"}
          </p>
        </div>
      </div>

      {/* ================= CONTENT ================= */}

      <div className="orbit-content">
        {/* ================= EMPTY ================= */}

        {requests.length === 0 ? (
          <div
            className="
              orbit-empty-state
              border
              border-orbit-line
              bg-orbit-surface
            "
          >
            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-full
                bg-orbit-bg
                text-orbit-primary
              "
            >
              <Bell
                size={23}
                aria-hidden="true"
              />
            </div>

            <h2 className="text-orbit-text">
              No pending requests
            </h2>

            <p className="text-orbit-muted">
              You're all caught up.
            </p>
          </div>
        ) : (
          /* ================= REQUEST LIST ================= */

          <div className="orbit-notification-list">
            {requests.map((request) => (
              <div
                key={request.senderId}
                className="
                  orbit-notification-card
                  border
                  border-orbit-line
                  bg-orbit-surface
                  shadow-[var(--orbit-shadow-sm)]
                "
              >
                {/* Avatar */}

                {request.senderAvatar ? (
                  <img
                    src={request.senderAvatar}
                    alt=""
                    className="
                      orbit-avatar
                      border-2
                      border-orbit-primary
                    "
                  />
                ) : (
                  <div
                    className="
                      orbit-avatar
                      bg-orbit-bg
                      text-orbit-primary
                      border-2
                      border-orbit-primary
                    "
                    aria-hidden="true"
                  >
                    {request.senderName?.slice(0, 1) ||
                      "?"}
                  </div>
                )}

                {/* User information */}

                <div className="orbit-notification-copy">
                  <strong className="text-orbit-text">
                    {request.senderName}
                  </strong>

                  <span className="text-orbit-muted">
                    @{request.senderUserName} wants to
                    connect
                  </span>
                </div>

                {/* Actions */}

                <div className="orbit-notification-actions">
                  {/* Accept */}

                  <button
                    onClick={() =>
                      handleAccept(request)
                    }
                    disabled={loadingId !== null}
                    className="
                      orbit-icon-button
                      text-orbit-success
                      hover:bg-orbit-success/10
                    "
                    type="button"
                    aria-label={`Accept ${request.senderName}'s request`}
                  >
                    {loadingId ===
                    request.senderId + "_accept" ? (
                      <Loader
                        size={16}
                        className="animate-spin"
                      />
                    ) : (
                      <Check size={16} />
                    )}
                  </button>

                  {/* Ignore */}

                  <button
                    onClick={() =>
                      handleIgnore(request)
                    }
                    disabled={loadingId !== null}
                    className="
                      orbit-icon-button
                      text-orbit-danger
                      hover:bg-orbit-danger/10
                    "
                    type="button"
                    aria-label={`Ignore ${request.senderName}'s request`}
                  >
                    {loadingId ===
                    request.senderId + "_ignore" ? (
                      <Loader
                        size={16}
                        className="animate-spin"
                      />
                    ) : (
                      <X size={16} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;