import express from "express";
import userCtrl from "../controllers/userCtrl";
import { auth } from "../middleware/auth";
const userRoute = express.Router();

userRoute.get("/user/search", userCtrl.searchUser);
userRoute.get("/user/searchAll", userCtrl.searchAllUser);
userRoute.post("/user/edit-profile",auth, userCtrl.editProfileUser);
userRoute.get("/user/getMonthlyUser", userCtrl.getMonthlyUser);
/* userRoute.post("/resetpassword", userCtrl.resetPassword); */
userRoute.post('/update-user'/* , auth */, userCtrl.updateUser)
userRoute.post('/update-ta'/* , auth */, userCtrl.updateTa)
userRoute.delete('/delete-user/:id'/* , auth */, userCtrl.deleteUser)
userRoute.get("/user/:id", userCtrl.getUser);
userRoute.post('/user/:id/follow', auth, userCtrl.follow)
userRoute.post('/user/:id/unfollow', auth, userCtrl.unfollow)
userRoute.get('/suggestionsUser', auth, userCtrl.suggestionsUser)

export default userRoute;
