import { producer } from "../config/kafka.js";

export const publishBookingCreated = async (booking) => {
    try {
        const bookingEvent = {
            eventType: "BOOKING_CREATED",
            bookingId: booking.id,
            userId: booking.userId,
            eventId: booking.eventId,
            seatNumber: booking.seatNumber,
            status: booking.status,
            createdAt: new Date().toISOString()
        };

        await producer.send({
            topic: "booking-events",
            messages: [
                {
                    key: String(booking.id),
                    value: JSON.stringify(bookingEvent)
                }
            ]
        });

        console.log(
            `Booking event published: ${booking.id}`
        );

    } catch (error) {
        console.error(
            "Failed to publish booking event:",
            error
        );

        throw error;
    }
};

export const publishBookingCancelled = async (booking) => {
    try {
        const bookingEvent = {
            eventType: "BOOKING_CANCELLED",
            bookingId: booking.id,
            userId: booking.userId,
            eventId: booking.eventId,
            seatNumber: booking.seatNumber,
            status: booking.status,
            cancelledAt: new Date().toISOString()
        };

        await producer.send({
            topic: "booking-events",
            messages: [
                {
                    key: String(booking.id),
                    value: JSON.stringify(bookingEvent)
                }
            ]
        });

        console.log(
            `Booking cancellation event published: ${booking.id}`
        );

    } catch (error) {
        console.error(
            "Failed to publish cancellation event:",
            error
        );

        throw error;
    }
};