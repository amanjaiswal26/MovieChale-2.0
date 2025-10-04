import express from "express";
import { 
    isAdmin, 
    getDashboardData, 
    getAllShows, 
    getAllBookings, 
    makeUserAdmin, 
    getAllUsers,
    createTheater,
    getAllTheaters,
    getTheaterById,
    updateTheater,
    deleteTheater,
    toggleTheaterStatus
} from "../controllers/adminController.js";
import { requireAuth } from "@clerk/express";
import { protectAdmin } from "../middleware/auth.js";

const router = express.Router();

console.log('🔧 Admin routes loaded successfully');

router.get("/is-admin", requireAuth(), isAdmin);
router.get("/dashboard", requireAuth(), protectAdmin, getDashboardData);
router.get("/shows", requireAuth(), protectAdmin, getAllShows);
router.get("/bookings", requireAuth(), protectAdmin, getAllBookings);
router.post("/make-admin", makeUserAdmin); // No auth required for development purposes
router.get("/users", getAllUsers); // No auth required for development purposes

// Theater routes
router.post("/theaters", requireAuth(), protectAdmin, createTheater);
router.get("/theaters", requireAuth(), protectAdmin, getAllTheaters);
router.get("/theaters/:id", requireAuth(), protectAdmin, getTheaterById);
router.put("/theaters/:id", requireAuth(), protectAdmin, updateTheater);
router.delete("/theaters/:id", requireAuth(), protectAdmin, deleteTheater);
router.patch("/theaters/:id/toggle", requireAuth(), protectAdmin, toggleTheaterStatus);

export default router;
