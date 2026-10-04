import express from "express";
import dotenv from "dotenv";
import redisClient from "./config/redis.js";
import eventRoute from "./routes/eventRoutes.js";
import seatRoute from "./routes/seatRoutes.js";
import authRoute from "./routes/authRoutes.js";
import bookingRoute from "./routes/bookingRoutes.js";
import adminroute from "./routes/adminRoutes.js";
import {producer} from "./config/kafka.js";
import { startBookingConsumer } from "./kafka/bookingConsumer.js";
import { processOutboxEvents } from "./jobs/outboxWorker.js";
import { expirePendingBookings } from "./jobs/bookingExpirationJob.js";
import cors from "cors";
dotenv.config();


const app = express();
const PORT = process.env.PORT|| 3001;


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());
await redisClient.connect();
app.use("/api/events", eventRoute);
app.use("/api", seatRoute);
app.use("/api/auth", authRoute);
app.use("/api/booking" , bookingRoute);
app.use("/api/admin" , adminroute);

app.get("/health", async (req, res) => {
    try {
        // Check Redis
        const redisStatus = redisClient.isReady;

        res.status(200).json({
            status: "OK",
            server: "UP",
            redis: redisStatus ? "UP" : "DOWN",
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        res.status(503).json({
            status: "DOWN",
            message: "Service unavailable"
        });
    }
});
// Global error handler
app.use((err, req, res, next) => {
    console.error("Global error:", err);

    res.status(err.status || 500).json({
        message: err.message || "Internal server error"
    });
});

await producer.connect();

console.log("Kafka producer connected successfully");
await processOutboxEvents();

setInterval(
    processOutboxEvents,
    5000
);
await startBookingConsumer();

await expirePendingBookings();

setInterval(
    expirePendingBookings,
    60 * 1000
);
app.get("/", (req , res) =>{
    res.send("Backend working");
});


const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const shutdown = async (signal) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);

    try {
        // Stop accepting new HTTP requests
        server.close();

        // Disconnect Kafka producer
        await producer.disconnect();

        // Disconnect Redis
        await redisClient.quit();

        // Disconnect Prisma
        // If your prisma config exports the client as default
        const prisma = (await import("./config/prisma.js")).default;
        await prisma.$disconnect();

        console.log("All connections closed successfully.");
        process.exit(0);

    } catch (error) {
        console.error("Shutdown error:", error);
        process.exit(1);
    }
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));