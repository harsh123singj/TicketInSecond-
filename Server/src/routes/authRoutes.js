import { Router } from "express";

import {
    registerUser,
    loginUser,
    getMe
} from "../controllers/authController.js";

import { authenticateUser } from "../middlewares/authMiddleware.js";

const authRoute = Router();

authRoute.post("/register", registerUser);

authRoute.post("/login", loginUser);

authRoute.get("/me", authenticateUser, getMe);

export default authRoute;