import express from "express";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import { adminOnly } from "../middlewares/adminMiddleware.js";
import {
    createEvent,
    updateEvent,
    deleteEvent
} from "../controllers/eventController.js";import {
    getAllBookings,
    updateBookingStatus
} from "../controllers/adminController.js";const adminroute = express.Router();

adminroute.post(
    "/events",
    authenticateUser,
    adminOnly,
    createEvent
);
adminroute.get(
    "/bookings",
    authenticateUser,
    adminOnly,
    getAllBookings
);
adminroute.patch(
    "/bookings/:id/status",
    authenticateUser,
    adminOnly,
    updateBookingStatus
);
adminroute.put(
    "/events/:id",
    authenticateUser,
    adminOnly,
    updateEvent
);

adminroute.delete(
    "/events/:id",
    authenticateUser,
    adminOnly,
    deleteEvent
);
export default adminroute;