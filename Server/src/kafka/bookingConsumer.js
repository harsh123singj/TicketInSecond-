import kafkaClient from "../config/kafka.js";
import { sendBookingConfirmation } from "../services/notificationService.js";
const consumer = kafkaClient.consumer({
    groupId: "booking-service"
});

export const startBookingConsumer = async () => {

    await consumer.connect();

    await consumer.subscribe({
        topic: "booking-events",
        fromBeginning: true
    });

    console.log("Kafka booking consumer connected");

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {

            const bookingEvent = JSON.parse(
                message.value.toString()
            );

            console.log("Received booking event:");
            console.log(bookingEvent);

            // notification sent here

            await sendBookingConfirmation(bookingEvent);
        }
    });
};