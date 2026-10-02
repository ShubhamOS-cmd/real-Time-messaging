import { useState } from "react";
import {
  Search as SearchIcon,
  UserPlus,
  MessageSquare,
  Loader,
} from "lucide-react";
import toast from "react-hot-toast";

import { searchTheUser } from "../services/user.services.js";
import {
  chatRequest,
  cancelChatRequest,
} from "../services/chat.services.js";

const Search = () => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  // -----------------------------
  // Search
  // -----------------------------

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      setResult(null);
      setErrorMessage("");
      setHasSearched(true);

      const res = await searchTheUser({
        userName: query.trim(),
      });

      if (res) {
        setResult(res.data);
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "User not found";

      setErrorMessage(message);
      toast.error(message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Enter key
  // -----------------------------

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // -----------------------------
  // Send request
  // -----------------------------

  const handleSendRequest = async () => {
    if (!result) return;

    try {
      setRequesting(true);

      const res = await chatRequest({
        receiverId: result?.user?._id,
      });

      if (res) {
        toast.success("Request sent!");

        setResult((prev) => ({
          ...prev,
          status: "pending",
        }));
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to send request"
      );
    } finally {
      setRequesting(false);
    }
  };

  // -----------------------------
  // Cancel request
  // -----------------------------

  const handleCancelRequest = async () => {
    if (!result) return;

    try {
      setRequesting(true);

      const res = await cancelChatRequest({
        receiverId: result?.user?._id,
      });

      if (res) {
        toast.success("Request cancelled");

        setResult((prev) => ({
          ...prev,
          status: "none",
        }));
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to cancel request"
      );
    } finally {
      setRequesting(false);
    }
  };

  return (
    <div className="orbit-page orbit-search-page">
      {/* ================= HEADER ================= */}

      <div className="orbit-page-header">
        <div>
          <h1 className="text-orbit-text">
            Find people
          </h1>

          <p className="text-orbit-muted">
            Search by username to start a conversation
          </p>
        </div>
      </div>

      {/* ================= CONTENT ================= */}

      <div className="orbit-content">
        {/* ================= SEARCH FORM ================= */}

        <div className="orbit-search-form">
          <div
            className="
              orbit-search-field
              border
              border-orbit-line
              bg-orbit-surface
            "
          >
            <SearchIcon
              size={18}
              className="text-orbit-muted"
              aria-hidden="true"
            />

            <input
              type="text"
              placeholder="Search username"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setErrorMessage("");
              }}
              onKeyDown={handleKeyDown}
              aria-label="Search username"
              className="
                orbit-search-input
                bg-transparent
                text-orbit-text
                placeholder:text-orbit-muted
                outline-none
              "
            />
          </div>

          <button
            onClick={handleSearch}
            disabled={
              loading || !query.trim()
            }
            className="orbit-button"
            type="button"
          >
            {loading ? (
              <Loader
                size={16}
                className="animate-spin"
              />
            ) : (
              <>
                <SearchIcon size={16} />
                Search
              </>
            )}
          </button>
        </div>

        {/* ================= RESULT ================= */}

        {result && (
          <div
            className="
              orbit-search-result
              border
              border-orbit-line
              bg-orbit-surface
              shadow-[var(--orbit-shadow-sm)]
            "
          >
            {/* Avatar */}

            {result?.user?.avatar ? (
              <img
                src={result.user.avatar}
                alt=""
                className="
                  orbit-avatar
                  orbit-search-avatar
                  border-2
                  border-orbit-primary
                "
              />
            ) : (
              <div
                className="
                  orbit-avatar
                  orbit-search-avatar
                  bg-orbit-bg
                  text-orbit-primary
                  border-2
                  border-orbit-primary
                "
                aria-hidden="true"
              >
                {result?.user?.fullName?.slice(0, 1) ||
                  "?"}
              </div>
            )}

            {/* User */}

            <div className="orbit-search-user">
              <strong className="text-orbit-text">
                {result?.user?.fullName}
              </strong>

              <span className="text-orbit-muted">
                @{result?.user?.userName}
              </span>
            </div>

            {/* Send request */}

            {result.status === "none" && (
              <button
                onClick={handleSendRequest}
                disabled={requesting}
                className="
                  orbit-button
                  orbit-result-action
                "
                type="button"
              >
                {requesting ? (
                  <Loader
                    size={14}
                    className="animate-spin"
                  />
                ) : (
                  <UserPlus size={14} />
                )}

                {requesting
                  ? "Sending..."
                  : "Send Request"}
              </button>
            )}

            {/* Pending */}

            {result.status === "pending" && (
              <div
                className="
                  orbit-request-pending
                  text-orbit-muted
                "
              >
                {requesting ? (
                  <Loader
                    size={14}
                    className="animate-spin"
                  />
                ) : (
                  <>
                    <span>Request Sent</span>

                    <button
                      onClick={
                        handleCancelRequest
                      }
                      disabled={requesting}
                      className="
                        orbit-link-button
                        text-orbit-primary
                        hover:text-orbit-primary-hover
                      "
                      type="button"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Connected */}

            {result.status === "connected" && (
              <div
                className="
                  orbit-request-connected
                  text-orbit-success
                "
              >
                <MessageSquare size={14} />
                Connected
              </div>
            )}
          </div>
        )}

        {/* ================= EMPTY STATE ================= */}

        {!result && !loading && (
          <div
            className="
              orbit-search-empty
              border
              border-orbit-line
              bg-orbit-surface
              text-orbit-muted
            "
            role={
              errorMessage
                ? "alert"
                : undefined
            }
          >
            <SearchIcon
              size={24}
              aria-hidden="true"
            />

            <p>
              {errorMessage ||
                (hasSearched
                  ? "No matching person found"
                  : "Search for a username to get started")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;