import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";
import {
  ArrowLeft,
  Send,
} from "lucide-react";

import { sendMessage } from "../socket/socket.js";

const Chatroom = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();

  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  const currentUser = useSelector(
    (state) => state.auth.user
  );

  const messages = useSelector(
    (state) => state.chat.messages[chatId] || []
  );

  const chatList = useSelector(
    (state) => state.chat.chatRooms
  );

  const activeChat = chatList.find(
    (chat) => chat.chatId === chatId
  );

  // -----------------------------
  // Scroll to latest message
  // -----------------------------

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // -----------------------------
  // Send message
  // -----------------------------

  const handleSend = () => {
    if (!text.trim()) return;

    sendMessage(chatId, text.trim());
    setText("");
  };

  // -----------------------------
  // Enter to send
  // Shift + Enter remains available
  // -----------------------------

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // -----------------------------
  // Format message time
  // -----------------------------

  const formatTime = (timestamp) => {
    if (!timestamp) return "";

    return new Date(timestamp).toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  return (
    <div className="orbit-page orbit-chat-page">
      {/* ================= CHAT HEADER ================= */}

      <header className="orbit-chat-header">
        <button
          onClick={() => navigate("/messages")}
          className="
            orbit-icon-button
            orbit-back-button
            text-orbit-primary
            hover:bg-orbit-primary/10
          "
          type="button"
          aria-label="Back to conversations"
        >
          <ArrowLeft
            size={18}
            aria-hidden="true"
          />
        </button>

        {/* Avatar */}

        {activeChat?.otherMember?.avatar ? (
          <img
            src={activeChat.otherMember.avatar}
            alt=""
            className="orbit-avatar"
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
            {activeChat?.otherMember?.fullName?.slice(
              0,
              1
            ) || "?"}
          </div>
        )}

        {/* User information */}

        <div className="orbit-chat-person">
          <strong className="text-orbit-text">
            {activeChat?.otherMember?.fullName ||
              "Chat"}
          </strong>

          <span className="text-orbit-muted">
            @{activeChat?.otherMember?.userName || ""}
          </span>
        </div>
      </header>

      {/* ================= MESSAGES ================= */}

      <div
        className="orbit-message-list"
        aria-live="polite"
      >
        {/* Empty chat */}

        {messages.length === 0 && (
          <div className="orbit-chat-empty">
            <span
              className="orbit-mark"
              aria-hidden="true"
            />

            <p className="text-orbit-muted">
              No messages yet. Say hello.
            </p>
          </div>
        )}

        {/* Message list */}

        {messages.map((msg, index) => {
          const isMe =
            msg.sender === currentUser?._id ||
            msg.sender?._id === currentUser?._id;

          return (
            <div
              key={msg._id || index}
              className={`
                orbit-message-row
                ${
                  isMe
                    ? "is-outgoing"
                    : "is-incoming"
                }
              `}
            >
              <div className="orbit-message-bubble">
                <p>
                  {msg.message?.content ||
                    msg.message}
                </p>

                <time
                  className={
                    isMe
                      ? "text-[#55715b]"
                      : "text-orbit-muted"
                  }
                >
                  {formatTime(msg.createdAt)}
                </time>
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {/* ================= COMPOSER ================= */}

      <form
        className="orbit-composer"
        onSubmit={(event) => {
          event.preventDefault();
          handleSend();
        }}
      >
        <input
          type="text"
          placeholder="Write a message..."
          value={text}
          onChange={(e) =>
            setText(e.target.value)
          }
          onKeyDown={handleKeyDown}
          className="
            orbit-composer-input
            bg-orbit-surface
            text-orbit-text
            placeholder:text-orbit-muted
          "
          aria-label="Message"
          autoComplete="off"
        />

        <button
          type="submit"
          disabled={!text.trim()}
          className="
            orbit-send-button
            bg-orbit-primary
            text-white
            hover:bg-orbit-primary-hover
          "
          aria-label="Send message"
        >
          <Send
            size={17}
            aria-hidden="true"
          />
        </button>
      </form>
    </div>
  );
};

export default Chatroom;