import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { FILE_CHUNK_SIZE } from "../constants";

const redis = new Redis({
    url: process.env.UPSTASH_URL,
    token: process.env.UPSTASH_TOKEN
})

const UPLOAD_THROUGHPUT_LIMIT_BYTES = 1.5 * 1024 * 1024 * 1024;
export const UPLOAD_CHUNKS_PER_MINUTE = Math.floor(UPLOAD_THROUGHPUT_LIMIT_BYTES / FILE_CHUNK_SIZE); //1.5 GB/min

export const apiRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(300, "1 m"),
    prefix: "ratelimit:api"
});

export const uploadRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(UPLOAD_CHUNKS_PER_MINUTE, "1 m"),
    prefix: "ratelimit:upload"
});
