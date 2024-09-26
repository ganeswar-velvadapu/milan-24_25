import { sortByBranch, sortBydegree, sortByHostel, sortByYear, studentsByHostels, studentsList } from "../controllers/sort.js"
import express from "express"

const router = express.Router()

router.get("/degree",sortBydegree)
router.get("/degree/:degree/branch",sortByBranch)
router.get("/degree/:degree/branch/:branch/year",sortByYear)
router.get("/degree/:degree/branch/:branch/year/:year/students",studentsList)
router.get("/hostel",sortByHostel)
router.get("/hostel/:hostel/students",studentsByHostels)

export default router