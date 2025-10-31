import expres from "express"
import { singnup } from "../controller/auth.controller.js";

const router = expres.Router();

router.post("/sign-up",singnup)
export default router