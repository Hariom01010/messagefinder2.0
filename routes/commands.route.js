import express from "express"
import dotenv  from "dotenv"
import ping from "../controllers/ping.controller.js"
import findmessage from "../controllers/findmessage.controller.js"
import { verifyHeader } from "../utils.js"

const router = express.Router()

dotenv.config()

router.post("/",verifyHeader, ping)
router.post("/findmessage", findmessage)


export default router