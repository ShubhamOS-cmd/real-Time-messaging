// utils/errorCodes.js
export const ERROR_CODES = {
    // Auth
    INVALID_TOKEN: "INVALID_TOKEN",       // no token or malformed
    TOKEN_EXPIRED: "TOKEN_EXPIRED",       // token exists but expired
    INVALID_REFRESH: "INVALID_REFRESH",   // refresh token invalid
    UNAUTHORIZED: "UNAUTHORIZED",         // wrong credentials

    // User
    USER_NOT_FOUND: "USER_NOT_FOUND",
    USER_ALREADY_EXISTS: "USER_ALREADY_EXISTS",

    // Chat
    CHAT_ROOM_NOT_FOUND: "CHAT_ROOM_NOT_FOUND",
    ALREADY_CONNECTED: "ALREADY_CONNECTED",
    REQUEST_ALREADY_SENT: "REQUEST_ALREADY_SENT",

    // General
    VALIDATION_ERROR: "VALIDATION_ERROR",
    SERVER_ERROR: "SERVER_ERROR",
    NOT_FOUND: "NOT_FOUND",
    FORBIDDEN: "FORBIDDEN"
}