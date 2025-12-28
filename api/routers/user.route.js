import express from "express"
import { test } from "../controller/user.controller.js"
import { updateUserProfile, deleteUser, updateUserInfo } from '../controller/user.controller.js';

const router = express.Router();

router.get("/test", test)
router.put('/update-profile', updateUserProfile);
router.put('/update-info', updateUserInfo);
router.delete('/delete', deleteUser);

export default router;



