import { Router } from "express";

import {
    registerUser,
    loginUser,
    getMe
} from "../controllers/authController.js";

import { authenticateUser } from "../middlewares/authMiddleware.js";

const authRoute = Router();

authRoute.post("/register", (req, res, next) => {
    console.log("REGISTER ROUTE HIT");
    next();
}, registerUser);

authRoute.post("/login", loginUser);

authRoute.get("/me", authenticateUser, getMe);

export default authRoute;