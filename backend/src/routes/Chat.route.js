import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {sendChatRequest ,
    acceptChatRequest,
    ignoreChatRequest,
    getMyChatRooms,
    getAllMessages,
    cancelChatRequest
} from "../controllers/Chat.controllers.js"
const router = Router();
router.route("/chatReq/:receiverId").post(verifyJWT , sendChatRequest);
router.route("/acceptChatReq/:receiverId").post(verifyJWT , acceptChatRequest);
router.route("/ignoreReq/:receiverId").post(verifyJWT , ignoreChatRequest);
router.route("/getChatRooms").get(verifyJWT , getMyChatRooms);
router.route("/getChatHistory/:chatId").get(verifyJWT , getAllMessages);
router.route("/cancelChatRequest/:receiverId").delete(verifyJWT , cancelChatRequest);
export default router;