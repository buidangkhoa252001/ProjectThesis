import express from "express";
import authCtrl from "../controllers/authCtrl";
import { authAdmin } from "../middleware/authAdmin";
import { auth } from "../middleware/auth";

const authRoute = express.Router();

authRoute.post("/register", authCtrl.register);
authRoute.post("/registerAdmin",auth,authAdmin, authCtrl.registerAdmin);
authRoute.post("/login", authCtrl.login);
authRoute.post("/logout", authCtrl.logout);
authRoute.post("/forgot-password", authCtrl.forgotPassword);
authRoute.post("/reset-password/:token", authCtrl.resetPassword);
authRoute.post("/refresh_token", authCtrl.refreshToken);


     
export default authRoute;
