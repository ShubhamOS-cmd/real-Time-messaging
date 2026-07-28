import { Router } from "express";
import {upload} from "../middleware/multer.middleware.js";
import {
    otpRequest,
    otpVerify,
    register,
    login,
    refresh,
    changePassword,
    logout
} from '../controllers/auth.controllers.js'
import {verifyJWT} from "../middleware/auth.middleware.js"
// verify JWT 
const router = Router();


router.route('/otp-request').post(otpRequest);
router.route('/otp-verify').post(otpVerify);
router.route('/register').post(
    upload.single("avatar"),
    register
);
router.route('/login').post(login);
router.route('/refresh').post(refresh);
router.route('/change-password').post(verifyJWT , changePassword);
router.route('/logout').post(verifyJWT , logout);

export default router;