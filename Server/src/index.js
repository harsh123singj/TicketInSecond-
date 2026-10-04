import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import redisClient from "./config/redis.js";
import { producer } from "./config/kafka.js";

import eventRoute from "./routes/eventRoutes.js";
import seatRoute from "./routes/seatRoutes.js";
import authRoute from "./routes/authRoutes.js";
import bookingRoute from "./routes/bookingRoutes.js";
import adminRoute from "./routes/adminRoutes.js";

import { startBookingConsumer } from "./kafka/bookingConsumer.js";
import { processOutboxEvents } from "./jobs/outboxWorker.js";
import { expirePendingBookings } from "./jobs/bookingExpirationJob.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true
    })
);

app.use(express.json());

// ==========================================
// ROUTES
// ==========================================

app.use("/api/events", eventRoute);
app.use("/api", seatRoute);
app.use("/api/auth", authRoute);
app.use("/api/booking", bookingRoute);
app.use("/api/admin", adminRoute);

// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/health", async (req, res) => {
    try {
        const redisStatus = redisClient.isReady;

        res.status(200).json({
            status: "OK",
            server: "UP",
            redis: redisStatus ? "UP" : "DOWN",
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error("Health check error:", error);

        res.status(503).json({
            status: "DOWN",
            message: "Service unavailable"
        });
    }
});

// ==========================================
// ROOT ROUTE
// ==========================================

app.get("/", (req, res) => {
    res.send("TicketsInSeconds Backend Working");
});

// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use((err, req, res, next) => {
    console.error("Global error:", err);

    res.status(err.status || 500).json({
        message: err.message || "Internal server error"
    });
});

// ==========================================
// START SERVER
// ==========================================

const startServer = async () => {
    try {
        // --------------------------------------
        // Connect Redis
        // --------------------------------------

        await redisClient.connect();

        console.log("Redis connected successfully");

        // --------------------------------------
        // Connect Kafka Producer
        // --------------------------------------

        await producer.connect();

        console.log("Kafka producer connected successfully");

        // --------------------------------------
        // Start Kafka Consumer
        // --------------------------------------

        await startBookingConsumer();

        console.log("Kafka booking consumer started successfully");

        // --------------------------------------
        // Process existing outbox events
        // --------------------------------------

        await processOutboxEvents();

        // Process outbox every 5 seconds
        setInterval(
            processOutboxEvents,
            5000
        );

        // --------------------------------------
        // Expire pending bookings
        // --------------------------------------

        await expirePendingBookings();

        // Check expired bookings every minute
        setInterval(
            expirePendingBookings,
            60 * 1000
        );

        // --------------------------------------
        // Start Express server
        // --------------------------------------

        const server = app.listen(
            PORT,
            "0.0.0.0",
            () => {
                console.log(
                    `Server is running on port ${PORT}`
                );
            }
        );

        // ======================================
        // GRACEFUL SHUTDOWN
        // ======================================

        const shutdown = async (signal) => {
            console.log(
                `\n${signal} received. Shutting down gracefully...`
            );

            try {
                // Stop accepting new HTTP requests
                server.close();

                // Disconnect Kafka producer
                await producer.disconnect();

                // Disconnect Redis
                if (redisClient.isOpen) {
                    await redisClient.quit();
                }

                // Disconnect Prisma
                const prisma =
                    (await import("./config/prisma.js")).default;

                await prisma.$disconnect();

                console.log(
                    "All connections closed successfully."
                );

                process.exit(0);

            } catch (error) {
                console.error(
                    "Shutdown error:",
                    error
                );

                process.exit(1);
            }
        };

        process.on(
            "SIGINT",
            () => shutdown("SIGINT")
        );

        process.on(
            "SIGTERM",
            () => shutdown("SIGTERM")
        );

    } catch (error) {
        console.error(
            "Failed to start server:",
            error
        );

        // If Redis/Kafka/another required
        // service fails, don't run a broken API.
        process.exit(1);
    }
};

startServer();