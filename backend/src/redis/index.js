import Redis from "ioredis"

export const redis = new Redis({
    host : "localhost",
    port : 6379,
})

export const BullMQ_Redis = new Redis({
    host : "localhost",
    port : 6379,
    maxRetriesPerRequest:null
})