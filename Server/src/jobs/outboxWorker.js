import prisma from "../config/prisma.js";
import { producer } from "../config/kafka.js";

export const processOutboxEvents = async () => {
    try {
        const events = await prisma.outboxEvent.findMany({
            where: {
                published: false
            },
            orderBy: {
                createdAt: "asc"
            },
            take: 10
        });

        for (const event of events) {

            try {
                await producer.send({
                    topic: "booking-events",
                    messages: [
                        {
                            key: String(event.aggregateId),
                            value: JSON.stringify(event.payload)
                        }
                    ]
                });

                await prisma.outboxEvent.update({
                    where: {
                        id: event.id
                    },
                    data: {
                        published: true
                    }
                });

                console.log(
                    `Outbox event ${event.id} published successfully`
                );

            } catch (error) {

                console.error(
                    `Failed to publish outbox event ${event.id}:`,
                    error.message
                );
            }
        }

    } catch (error) {
        console.error(
            "Outbox worker error:",
            error.message
        );
    }
};