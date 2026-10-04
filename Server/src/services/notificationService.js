export const sendBookingConfirmation = async (booking) => {
    console.log("Sending booking confirmation...");

    console.log(`
        Booking confirmed!
        Booking ID: ${booking.bookingId}
        Event ID: ${booking.eventId}
        Seat: ${booking.seatNumber}
        Status: ${booking.status}
    `);

    return {
        success: true
    };
};