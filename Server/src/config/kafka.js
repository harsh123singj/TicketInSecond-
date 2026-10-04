import "dotenv/config";
import { Kafka } from "kafkajs";

console.log("Kafka broker:", process.env.KAFKA_BROKER);
console.log("Kafka username:", process.env.KAFKA_USERNAME);
console.log("Kafka password exists:", !!process.env.KAFKA_PASSWORD);

const kafkaClient = new Kafka({
    clientId: "tickets-in-seconds",

    brokers: [process.env.KAFKA_BROKER],

    ssl: {
        rejectUnauthorized: false,
    },

    sasl: {
        mechanism: "scram-sha-256",
        username: process.env.KAFKA_USERNAME,
        password: process.env.KAFKA_PASSWORD,
    },

    connectionTimeout: 30000,
    authenticationTimeout: 30000,
    requestTimeout: 30000,

    retry: {
        initialRetryTime: 1000,
        retries: 8,
    },
});

export const producer = kafkaClient.producer();

export default kafkaClient;