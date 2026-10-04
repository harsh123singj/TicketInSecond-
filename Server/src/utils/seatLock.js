import redisClient from "../config/redis.js";
import crypto from "crypto";

const LOCK_EXPIRY = 30; 

export const acquireSeatLock = async(eventId , seatNumber) =>{
    const lockKey = `seat-lock:${eventId}:${seatNumber}`;
    const lockValue = crypto.randomUUID();


    const result = await redisClient.set(
        lockKey,
        lockValue,
        {
            NX: true,
            EX: LOCK_EXPIRY
        }
    );

    if(result != "OK"){
        return null;
    }

    return {
        lockKey,
        lockValue
    }
}

// release the lock

export const releaseSeatLock = async(lockKey , lockValue)=>{
const script =`
if redis.call("GET" , KEYS[1]) == ARGV[1] then
return redis.call("DEL" , KEYS[1])
else
    return 0
end `;


await redisClient.eval(script ,{
    keys:[lockKey],
    arguments:[lockValue]
});
}