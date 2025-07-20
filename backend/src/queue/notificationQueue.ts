import { Queue } from 'bullmq';
import { redisConnection } from "../utils/redis";

// Default job options for all notification jobs
const defaultJobOptions = {
  attempts: 3,
  backoff: {
    type: "exponential",
    delay: 10000, // 10 seconds initial delay
  },
  removeOnComplete: false, // Keep completed jobs for history
  removeOnFail: false,     // Keep failed jobs for debugging
};

export const notificationQueue = new Queue('notifications', {
  connection: redisConnection,
  defaultJobOptions,
});
