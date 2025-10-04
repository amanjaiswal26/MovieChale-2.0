import express from "express";
import { createBooking, getOccupiedSeats } from "../controllers/bookingController.js";

const bookingRouter = express.Router();

// Create a new booking
bookingRouter.post("/create", createBooking);

// Get occupied seats for a specific show
bookingRouter.get("/seats/:showId", getOccupiedSeats);

export default bookingRouter;
