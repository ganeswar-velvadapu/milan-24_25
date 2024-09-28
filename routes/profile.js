import express from 'express'
import checkToken from '../middlewares/checkToken.js'
import { getProfile } from '../controllers/profile.js'

const router = express.Router()

router.get("/view",checkToken,getProfile)


export default router