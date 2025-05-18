import express from "express"
import { createResidency, getAllResidencies, getResidency, getResidencyCount } from "../controllers/residencyController.js"
import jwtCheck from "../config/auth0Config.js"

const router = express.Router()

router.post("/create", jwtCheck, createResidency)
router.get("/count", getResidencyCount)
router.get("/allresd", getAllResidencies)
router.get("/:id", getResidency)

export { router as residencyRoute }