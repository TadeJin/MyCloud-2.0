import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
    url: process.env.UPSTASH_URL,
    token: process.env.UPSTASH_TOKEN
})

export const baseApiRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, "1 m"),
    prefix: "ratelimit:api"
});

export const uploadRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(2000, "1 m"),
    prefix: "ratelimit:upload"
});

export const fileOpRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(300, "1 m"),
    prefix: "ratelimit:file-op"
});

export const fileFetchRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(700, "1 m"),
    prefix: "ratelimit:file-fetch"
});
