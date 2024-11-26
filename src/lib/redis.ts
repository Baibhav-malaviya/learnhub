import Redis from "ioredis";

const redis = new Redis({
	host: process.env.REDIS_PUBLIC_HOST, // Your Redis Cloud host
	port: 14249, // Your Redis Cloud port
	password: process.env.REDIS_PASSWORD, // Your Redis Cloud password
});

export default redis;
