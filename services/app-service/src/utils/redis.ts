import { randomUUID } from "crypto";
import { Redis } from "ioredis";

const redis = new Redis({
  port: parseInt(process.env.REDIS_PORT || "6379"),
  host: process.env.REDIS_HOST,
});

redis.on("connect", () => {
  console.info("app-service connected to redis");
});

redis.on("error", (error: Error) => {
  console.error(`app-service connection error: ${error.message}`);
});

export const createQuestionCountEntry = ({ userId }: { userId: string }) => {
  // Expire at midnight
  const now = new Date();
  const midnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0,
    0,
    0
  );
  const millisecondsToMidnight = midnight.getTime() - now.getTime();
  return redis.set(`questionCount:${userId}`, 0, "EX", millisecondsToMidnight);
};

export const incrementQuestionCountEntry = async ({
  userId,
}: {
  userId: string;
}) => {
  const questionCount = await redis.incr(`questionCount:${userId}`);
  return questionCount;
};

export const getQuestionCountEntry = async ({ userId }: { userId: string }) => {
  const questionCount = await redis.get(`questionCount:${userId}`);
  return questionCount ? parseInt(questionCount) : 0;
};

export const createForgotPasswordToken = async ({
  userId,
}: {
  userId: string;
}) => {
  const token = randomUUID();
  // Expire in 24hr
  await redis.set(`forgotPassword:${token}`, userId, "EX", 60 * 60 * 24);
  return token;
};
export const getForgotPasswordToken = async ({ token }: { token: string }) => {
  const id = await redis.get(`forgotPassword:${token}`);
  return id;
};
export const deleteForgotPasswordToken = async ({
  token,
}: {
  token: string;
}) => {
  await redis.del(`forgotPassword:${token}`);
  return token;
};

export { redis };
