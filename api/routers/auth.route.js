import expres from "express"
import { singnin, singnup, google } from "../controller/auth.controller.js";

const router = expres.Router();

router.post("/sign-up", singnup)
router.post("/sign-in", singnin)
router.post("/google", google)

export default router