import express from "express"
import { test } from "../controller/user.controller.js"
import { updateUserProfile } from '../controller/user.controller.js'; 
import { updateUserInfo } from '../controller/user.controller.js'; 

const router = express.Router();

router.get("/test", test)
router.put('/update-profile', updateUserProfile);
router.put('/update-info', updateUserInfo);

export default router;



