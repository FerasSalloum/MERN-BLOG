import expres from "express"
import { singnin, singnup, sync_user_data } from "../controller/auth.controller.js";

const router = expres.Router();

router.post("/sign-up", singnup)
router.post("/sign-in", singnin)
router.post("/sync-user-data", sync_user_data)

export default router