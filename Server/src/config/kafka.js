import { Kafka } from "kafkajs";

const kafkaClient = new Kafka({
    clientId: "tickets-in-seconds",
    brokers: ["localhost:9092"]
});

export const producer = kafkaClient.producer();

export default kafkaClient;