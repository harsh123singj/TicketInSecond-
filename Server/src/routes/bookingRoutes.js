import express from "express";

import {
    createBooking,
    getMyBookings,
    getBookingById,
    cancelBooking,
    getAllBookings
} from "../controllers/bookingController.js";

import { authenticateUser } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import { createBookingSchema } from "../validators/bookingValidator.js";

const router = express.Router();


// =====================================================
// CREATE BOOKING
// POST /api/booking
// =====================================================

router.post(
    "/",
    authenticateUser,
    validate(createBookingSchema),
    createBooking
);


// =====================================================
// GET MY BOOKINGS
// GET /api/booking/my
// =====================================================

router.get(
    "/my",
    authenticateUser,
    getMyBookings
);


// =====================================================
// GET ALL BOOKINGS - ADMIN
// GET /api/booking/admin
// =====================================================

router.get(
    "/admin",
    authenticateUser,
    getAllBookings
);


// =====================================================
// GET BOOKING BY ID
// GET /api/booking/:id
// =====================================================

router.get(
    "/:id",
    authenticateUser,
    getBookingById
);


// =====================================================
// CANCEL BOOKING
// PATCH /api/booking/:id/cancel
// =====================================================

router.patch(
    "/:id/cancel",
    authenticateUser,
    cancelBooking
);


export default router;