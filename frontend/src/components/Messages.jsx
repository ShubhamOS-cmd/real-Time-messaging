import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import {
  MessageSquare,
  Search,
} from "lucide-react";

import {
  setChatRooms,
  setActiveChat,
} from "../store/chatSlice.js";

import {
  getChatRooms,
  getChatHistory,
} from "../services/chat.services.js";

const Messages = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const chatList = useSelector(
    (state) => state.chat.chatRooms
  );

  const messages = useSelector(
    (state) => state.chat.messages
  );

  // -----------------------------
  // Fetch chat rooms
  // -----------------------------

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await getChatRooms();

        if (res) {
          dispatch(setChatRooms(res.data));
        }
      } catch (error) {
        console.error(
          "Failed to fetch chats",
          error
        );
      }
    };

    fetchChats();
  }, [dispatch]);

  // -----------------------------
  // Open chat
  // -----------------------------

  const handleOpenChat = async (chat) => {
    dispatch(setActiveChat(chat.chatId));

    // Fetch history only if it isn't
    // already available in Redux.
    if (!messages[chat.chatId]) {
      try {
        const res = await getChatHistory({
          chatId: chat.chatId,
        });

        if (res) {
          dispatch({
            type: "chat/setMessages",
            payload: {
              chatId: chat.chatId,
              messages: res.data,
            },
          });
        }
      } catch (error) {
        console.error(
          "Failed to fetch messages",
          error
        );
      }
    }

    navigate(`/messages/${chat.chatId}`);
  };

  // -----------------------------
  // Format timestamp
  // -----------------------------

  const formatTime = (timestamp) => {
    if (!timestamp) return "";

    const date = new Date(timestamp);

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="orbit-page orbit-messages-page">
      {/* ================= HEADER ================= */}

      <div className="orbit-page-header">
        <div>
          <h1 className="text-orbit-text">
            Messages
          </h1>

          <p className="text-orbit-muted">
            {chatList.length}{" "}
            {chatList.length === 1
              ? "conversation"
              : "conversations"}
          </p>
        </div>

        <button
          className="
            orbit-icon-button
            text-orbit-primary
            hover:bg-orbit-primary/10
          "
          type="button"
          onClick={() => navigate("/search")}
          aria-label="Find people"
          title="Find people"
        >
          <Search
            size={18}
            aria-hidden="true"
          />
        </button>
      </div>

      {/* ================= CONVERSATIONS ================= */}

      <div className="orbit-conversation-list">
        {chatList.length === 0 ? (
          <div
            className="
              orbit-empty-state
              border
              border-orbit-line
              bg-orbit-surface
              shadow-[var(--orbit-shadow-sm)]
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
              <MessageSquare
                size={25}
                aria-hidden="true"
              />
            </div>

            <h2 className="text-orbit-text">
              No conversations yet
            </h2>

            <p className="text-orbit-muted">
              Find someone to start a conversation.
            </p>

            <button
              className="orbit-button"
              type="button"
              onClick={() => navigate("/search")}
            >
              <Search size={16} />
              Find people
            </button>
          </div>
        ) : (
          chatList.map((chat) => (
            <button
              key={chat.chatId}
              onClick={() =>
                handleOpenChat(chat)
              }
              className="
                orbit-conversation
                border
                border-orbit-line
                bg-orbit-surface
                hover:border-orbit-primary
                hover:shadow-[var(--orbit-shadow-sm)]
              "
              type="button"
            >
              {/* Avatar */}

              {chat.otherMember?.avatar ? (
                <img
                  src={chat.otherMember.avatar}
                  alt=""
                  className="
                    orbit-avatar
                    orbit-conversation-avatar
                  "
                />
              ) : (
                <div
                  className="
                    orbit-avatar
                    orbit-conversation-avatar
                    bg-orbit-bg
                    text-orbit-primary
                  "
                  aria-hidden="true"
                >
                  {chat.otherMember?.fullName?.slice(
                    0,
                    1
                  ) || "?"}
                </div>
              )}

              {/* Conversation */}

              <div className="orbit-conversation-copy">
                <div className="orbit-conversation-title">
                  <strong className="text-orbit-text">
                    {chat.otherMember?.fullName ||
                      "Conversation"}
                  </strong>

                  <time className="text-orbit-muted">
                    {formatTime(
                      chat.lastMessage?.timestamp
                    )}
                  </time>
                </div>

                <p className="text-orbit-muted">
                  {chat.lastMessage?.content ||
                    "Start a conversation"}
                </p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default Messages;