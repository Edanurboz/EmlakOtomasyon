import express from "express";
import { bookVisit, cancelBooking, createUser, getallBookings, getAllFav, toFav, getUserCount } from "../controllers/userController.js";
import jwtCheck from "../config/auth0Config.js";

const router = express.Router();

router.post("/register", jwtCheck, createUser);
router.post("/bookVisit/:id", bookVisit)
router.get("/count", getUserCount);

router.post("/allBookings", getallBookings);
router.post("/removeBooking/:id", jwtCheck, cancelBooking);
router.post("/toFav/:rid", jwtCheck, toFav);
router.post("/allFav", jwtCheck, getAllFav);

export { router as userRoute };
