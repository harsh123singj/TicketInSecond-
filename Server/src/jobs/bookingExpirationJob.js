import prisma from "../config/prisma.js";

export const expirePendingBookings = async () => {
    try {

        const expiredBookings = await prisma.booking.findMany({
            where: {
                status: "PENDING",
                expiresAt: {
                    lt: new Date()
                }
            }
        });

        for (const booking of expiredBookings) {

            const result = await prisma.$transaction(async (tx) => {

                // 1. Cancel booking only if it is still PENDING
                const updatedBooking = await tx.booking.updateMany({
                    where: {
                        id: booking.id,
                        status: "PENDING"
                    },
                    data: {
                        status: "CANCELLED"
                    }
                });

                // Already processed by another worker/run
                if (updatedBooking.count === 0) {
                    return false;
                }

                // 2. Release seat
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

                // 3. Create cancellation outbox event
                await tx.outboxEvent.create({
                    data: {
                        eventType: "BOOKING_CANCELLED",
                        aggregateId: booking.id,

                        payload: {
                            eventType: "BOOKING_CANCELLED",
                            bookingId: booking.id,
                            userId: booking.userId,
                            eventId: booking.eventId,
                            seatNumber: booking.seatNumber,
                            status: "CANCELLED",
                            createdAt: booking.createdAt.toISOString()
                        }
                    }
                });

                return true;
            });

            if (result) {
                console.log(
                    `Booking ${booking.id} expired. Seat ${booking.seatNumber} released.`
                );
            }
        }

    } catch (error) {

        console.error(
            "Booking expiration error:",
            error
        );
    }
};