import dotenv from 'dotenv'
dotenv.config({
    path : './.env'
});
import Redis from "ioredis";

export const redis = new Redis(process.env.REDIS_URL);

export const BullMQ_Redis = new Redis(process.env.REDIS_URL ,{maxRetriesPerRequest:null});