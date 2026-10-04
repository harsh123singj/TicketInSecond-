import prisma from "../config/prisma.js";

export const getAllBookings = async (req, res) => {
    try {
        const bookings = await prisma.booking.findMany({
            orderBy: {
                createdAt: "desc"
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true
                    }
                },
                event: true
            }
        });

        res.status(200).json({
            message: "Bookings fetched successfully",
            count: bookings.length,
            bookings
        });

    } catch (error) {
        console.error("Get all bookings error:", error);

        res.status(500).json({
            message: "Failed to fetch bookings",
            error: error.message
        });
    }
};

export const updateBookingStatus = async (req, res) => {
    try {
        const bookingId = Number(req.params.id);
        const { status } = req.body;

        const validStatuses = [
            "PENDING",
            "CONFIRMED",
            "CANCELLED"
        ];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid booking status"
            });
        }

        const existingBooking = await prisma.booking.findUnique({
            where: {
                id: bookingId
            }
        });

        if (!existingBooking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        const updatedBooking = await prisma.$transaction(async (tx) => {

            // If booking is being cancelled,
            // make its seat available again.
            if (
                status === "CANCELLED" &&
                existingBooking.status !== "CANCELLED"
            ) {
                await tx.seat.update({
                    where: {
                        eventId_seatNumber: {
                            eventId: existingBooking.eventId,
                            seatNumber: existingBooking.seatNumber
                        }
                    },
                    data: {
                        status: "AVAILABLE"
                    }
                });
            }

            return await tx.booking.update({
                where: {
                    id: bookingId
                },
                data: {
                    status
                }
            });
        });

        res.status(200).json({
            message: "Booking status updated successfully",
            booking: updatedBooking
        });

    } catch (error) {
        console.error("Update booking status error:", error);

        res.status(500).json({
            message: "Failed to update booking status",
            error: error.message
        });
    }
};