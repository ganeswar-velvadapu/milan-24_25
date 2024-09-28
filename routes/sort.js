import { sortByBranch, sortByClub, sortBydegree, sortByHostel, sortByPlacements, sortByYear, studentsByClub, studentsByCompany, studentsByHostels, studentsList } from "../controllers/sort.js"
import express from "express"
import checkToken from "../middlewares/checkToken.js"

const router = express.Router()

router.get("/degree",checkToken,sortBydegree)
router.get("/degree/:degree/branch",checkToken,sortByBranch)
router.get("/degree/:degree/branch/:branch/year",checkToken,sortByYear)
router.get("/degree/:degree/branch/:branch/year/:year/students",checkToken,studentsList)
router.get("/hostel",checkToken,sortByHostel)
router.get("/hostel/:hostel/students",checkToken,studentsByHostels)
router.get("/placements/companies",checkToken,sortByPlacements)
router.get("/placements/companies/:company",checkToken,studentsByCompany)
router.get("/clubs",checkToken,sortByClub)
router.get("/clubs/:club/students",checkToken,studentsByClub)

export default router