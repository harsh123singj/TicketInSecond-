import "dotenv/config";
import fs from "fs";
import { Kafka } from "kafkajs";

console.log("Kafka broker:", process.env.KAFKA_BROKER);
console.log("Kafka username:", process.env.KAFKA_USERNAME);
console.log("Kafka password exists:", !!process.env.KAFKA_PASSWORD);
const kafkaClient = new Kafka({
    clientId: "tickets-in-seconds",

    brokers: [process.env.KAFKA_BROKER],

    ssl: {
        ca: [fs.readFileSync("./certs/ca.pem", "utf-8")],
        rejectUnauthorized: true,
    },

    sasl: {
        mechanism: "scram-sha-256",
        username: process.env.KAFKA_USERNAME,
        password: process.env.KAFKA_PASSWORD,
    },
});

export const producer = kafkaClient.producer();

export default kafkaClient;