import expres from "express"
import { singnin, singnup } from "../controller/auth.controller.js";

const router = expres.Router();

router.post("/sign-up",singnup)
router.post("/sign-in",singnin)

export default router