import express from "express"
import { test } from "../controller/user.controller.js"
import { updateUserProfile } from '../controller/user.controller.js'; // الدالة الجديدة
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get("/test", test)
router.put('/update-profile', updateUserProfile);

export default router;



