import { Router } from "express";
import { User } from "../model/User.model.js";
import {verifyJWT} from "../middleware/auth.middleware.js"
import { getCurrentUser , findTheUser } from "../controllers/User.controllers.js";
const router = Router();

router.route("/getCurrentUser").get(verifyJWT , getCurrentUser);
router.route("/:userName").get(verifyJWT , findTheUser); // http://localhost:8000/api/v1/user/shubham_engine
export default router;