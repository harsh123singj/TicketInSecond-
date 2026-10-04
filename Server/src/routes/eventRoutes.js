import express from "express";

import {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent
} from "../controllers/eventController.js";

import { authenticateUser } from "../middlewares/authMiddleware.js";
import { adminOnly } from "../middlewares/adminMiddleware.js";

const router = express.Router();


// Public
router.get("/", getAllEvents);
router.get("/:id", getEventById);


// Admin
router.post(
    "/",
    authenticateUser,
    adminOnly,
    createEvent
);

router.put(
    "/:id",
    authenticateUser,
    adminOnly,
    updateEvent
);

router.delete(
    "/:id",
    authenticateUser,
    adminOnly,
    deleteEvent
);

export default router;