import { createClient } from "redis";

const redisClient = createClient({
   url: process.env.REDIS_URL || "redis://localhost:6379"
})

redisClient.on("error" , (error) =>{
    console.error("Redis Client Error:", error);
})

redisClient.on("connect" ,()=>{
    console.log("Connecting to Redis server...");
})

redisClient.on("ready" ,()=>{
    console.log("Redis connected Successfully")
});

export default redisClient;