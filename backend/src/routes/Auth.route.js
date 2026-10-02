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
router.route('/login').post((req , res , next) => {
    req.startTime = Date.now();
    res.on('finish' , () => {
        console.log(`Login took ${Date.now() - req.startTime}ms`);
    });
    next();
} , login);
router.route('/refresh').post(refresh);
router.route('/change-password').post(changePassword);
router.route('/logout').post(verifyJWT , logout);

export default router;