import prisma from "../config/prisma.js";
import { processPayment } from "../services/paymentService.js";
import {
    acquireSeatLock,
    releaseSeatLock
} from "../utils/seatLock.js";


// =====================================================
// CREATE BOOKING
// =====================================================

export const createBooking = async (req, res) => {

    let lock = null;

    try {

        const userId = req.user.userId;

        const {
            eventId,
            seatNumber,
            paymentMethod
        } = req.body;

        const parsedEventId = parseInt(eventId);

        // 1. Acquire Redis seat lock
        lock = await acquireSeatLock(
            parsedEventId,
            seatNumber
        );

        if (!lock) {
            return res.status(409).json({
                message: "Seat is currently being booked by another user"
            });
        }


        // 2. Check event
        const event = await prisma.event.findUnique({
            where: {
                id: parsedEventId
            }
        });

        if (!event) {
            await releaseSeatLock(
                lock.lockKey,
                lock.lockValue
            );

            lock = null;

            return res.status(404).json({
                message: "Event not found"
            });
        }


        // 3. Check seat
        const seat = await prisma.seat.findUnique({
            where: {
                eventId_seatNumber: {
                    eventId: parsedEventId,
                    seatNumber
                }
            }
        });

        if (!seat) {
            await releaseSeatLock(
                lock.lockKey,
                lock.lockValue
            );

            lock = null;

            return res.status(404).json({
                message: "Seat not found"
            });
        }


        // 4. Check database seat status
        if (seat.status !== "AVAILABLE") {

            await releaseSeatLock(
                lock.lockKey,
                lock.lockValue
            );

            lock = null;

            return res.status(409).json({
                message: "Seat is already booked"
            });
        }


        // 5. Create pending booking
        const expiresAt = new Date(
            Date.now() + 5 * 60 * 1000
        );

        const booking = await prisma.booking.create({
            data: {
                userId,
                eventId: parsedEventId,
                seatNumber,
                paymentMethod,
                ticketCount: 1,
                status: "PENDING",
                expiresAt
            }
        });


        // 6. Process payment
        const payment = await processPayment(
            event.ticketPrice,
            paymentMethod
        );


        // 7. Payment failed
        if (!payment.success) {

            await prisma.booking.update({
                where: {
                    id: booking.id
                },
                data: {
                    status: "CANCELLED"
                }
            });

            await releaseSeatLock(
                lock.lockKey,
                lock.lockValue
            );

            lock = null;

            return res.status(400).json({
                message: "Payment failed",
                bookingId: booking.id
            });
        }


        const confirmedBooking = await prisma.$transaction(
            async (tx) => {

                // Mark seat as booked
                await tx.seat.update({
                    where: {
                        id: seat.id
                    },
                    data: {
                        status: "BOOKED"
                    }
                });


                // Confirm booking
                const updatedBooking =
                    await tx.booking.update({
                        where: {
                            id: booking.id
                        },
                        data: {
                            status: "CONFIRMED"
                        }
                    });


                // Create Outbox Event
                await tx.outboxEvent.create({
                    data: {
                        eventType: "BOOKING_CREATED",

                        aggregateId: updatedBooking.id,

                        payload: {
                            eventType: "BOOKING_CREATED",
                            bookingId: updatedBooking.id,
                            userId: updatedBooking.userId,
                            eventId: updatedBooking.eventId,
                            seatNumber: updatedBooking.seatNumber,
                            status: updatedBooking.status,
                            createdAt:
                                updatedBooking.createdAt.toISOString()
                        }
                    }
                });


                return updatedBooking;
            }
        );


        // 9. Release Redis lock
        await releaseSeatLock(
            lock.lockKey,
            lock.lockValue
        );

        lock = null;


        // 10. Send response
        res.status(201).json({
            message: "Booking confirmed successfully",

            booking: confirmedBooking,

            payment: {
                transactionId: payment.transactionId,
                amount: payment.amount,
                paymentMethod: payment.paymentMethod
            }
        });

    } catch (error) {

        // Release lock if something failed
        if (lock) {
            await releaseSeatLock(
                lock.lockKey,
                lock.lockValue
            );
        }

        console.error("Booking error:", error);

        res.status(500).json({
            message: "Failed to create booking",
            error: error.message
        });
    }
};



// =====================================================
// GET MY BOOKINGS
// =====================================================

export const getMyBookings = async (req, res) => {

    try {

        const userId = req.user.userId;

        const bookings = await prisma.booking.findMany({
            where: {
                userId
            },

            include: {
                event: true
            },

            orderBy: {
                createdAt: "desc"
            }
        });


        res.status(200).json({
            message: "Bookings fetched successfully",
            bookings
        });

    } catch (error) {

        console.error("Get bookings error:", error);

        res.status(500).json({
            message: "Failed to fetch bookings",
            error: error.message
        });
    }
};

// =====================================================
// GET ALL BOOKINGS - ADMIN
// =====================================================

export const getAllBookings = async (req, res) => {
    try {
        const bookings = await prisma.booking.findMany({
            include: {
                event: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        res.status(200).json({
            message: "All bookings fetched successfully",
            bookings
        });

    } catch (error) {
        console.error("Get all bookings error:", error);

        res.status(500).json({
            message: "Failed to fetch all bookings",
            error: error.message
        });
    }
};



// =====================================================
// GET BOOKING BY ID
// =====================================================

export const getBookingById = async (req, res) => {

    try {

        const userId = req.user.userId;

        const bookingId = parseInt(req.params.id);


        const booking = await prisma.booking.findFirst({
            where: {
                id: bookingId,
                userId
            },

            include: {
                event: true
            }
        });


        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }


        res.status(200).json({
            message: "Booking fetched successfully",
            booking
        });

    } catch (error) {

        console.error("Get booking error:", error);

        res.status(500).json({
            message: "Failed to fetch booking",
            error: error.message
        });
    }
};



// =====================================================
// CANCEL BOOKING
// =====================================================

export const cancelBooking = async (req, res) => {

    try {

        const userId = req.user.userId;

        const bookingId = parseInt(req.params.id);


        // 1. Find booking
        const booking = await prisma.booking.findFirst({
            where: {
                id: bookingId,
                userId
            }
        });


        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }


        // 2. Check current status
        if (booking.status === "CANCELLED") {
            return res.status(400).json({
                message: "Booking is already cancelled"
            });
        }


        // =================================================
        // 3. Cancel booking + release seat + outbox event
        // =================================================

        const cancelledBooking = await prisma.$transaction(
            async (tx) => {

                // Make seat available again
                await tx.seat.update({
                    where: {
                        eventId_seatNumber: {
                            eventId: booking.eventId,
                            seatNumber: booking.seatNumber
                        }
                    },

                    data: {
                        status: "AVAILABLE"
                    }
                });


                // Cancel booking
                const updatedBooking =
                    await tx.booking.update({
                        where: {
                            id: bookingId
                        },

                        data: {
                            status: "CANCELLED"
                        }
                    });


                // Create cancellation outbox event
                await tx.outboxEvent.create({
                    data: {
                        eventType: "BOOKING_CANCELLED",

                        aggregateId: updatedBooking.id,

                        payload: {
                            eventType: "BOOKING_CANCELLED",
                            bookingId: updatedBooking.id,
                            userId: updatedBooking.userId,
                            eventId: updatedBooking.eventId,
                            seatNumber: updatedBooking.seatNumber,
                            status: updatedBooking.status,
                            createdAt:
                                updatedBooking.createdAt.toISOString()
                        }
                    }
                });


                return updatedBooking;
            }
        );


        // 4. Send response
        res.status(200).json({
            message: "Booking cancelled successfully",
            booking: cancelledBooking
        });

    } catch (error) {

        console.error("Cancel booking error:", error);

        res.status(500).json({
            message: "Failed to cancel booking",
            error: error.message
        });
    }
};