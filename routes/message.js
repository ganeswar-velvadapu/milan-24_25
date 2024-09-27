import express from "express"
import { getChatPage } from "../controllers/message.js"
import checkToken from "../middlewares/checkToken.js"

const router = express.Router()

router.get("/:userId",checkToken,getChatPage)

export default router