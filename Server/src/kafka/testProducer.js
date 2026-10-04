import { producer } from "../config/kafka.js";

const run = async () => {
    try {
        await producer.connect();

        console.log("✅ Kafka producer connected");

        await producer.send({
            topic: "booking-created",
            messages: [
                {
                    key: "test",
                    value: JSON.stringify({
                        message: "Kafka is working!",
                        timestamp: new Date().toISOString(),
                    }),
                },
            ],
        });

        console.log("✅ Test message sent");

        await producer.disconnect();
    } catch (error) {
        console.error("❌ Kafka test failed:", error);
    }
};

run();