import express from "express"
import {  bookVisit, cancelBooking, createUser, getallBookings, getAllFav, toFav } from "../controllers/userController.js"

const router = express.Router()

router.post("/register", createUser)
router.post("/bookVisit/:id",bookVisit)
router.post("/allBookings", getallBookings)
router.post("/removeBooking/:id",cancelBooking)
router.post("/toFav/:rid", toFav)
router.post("/allFav", getAllFav)

export {router as userRoute}