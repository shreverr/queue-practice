import { Worker } from 'bullmq'
import { Hono } from 'hono'
import IORedis from 'ioredis';

const connection = new IORedis({ maxRetriesPerRequest: null });
const app = new Hono()


app.get('/', (c) => {
  return c.text('Hello Hono!')
})

const worker1 = new Worker("video-transcoding", async (job) => {
  console.log(`W1: Processing ${job.id} video url: ${job.data.videoUrl} for user: ${job.data.username}`);

  await new Promise(resolve => setTimeout(resolve, 2000))
  console.log(`W1: Processed ${job.id}  video url: ${job.data.videoUrl} for user: ${job.data.username}`);
}, { connection: connection })

const worker2 = new Worker("video-transcoding", async (job) => {
  console.log(`W2: Processing ${job.id} video url: ${job.data.videoUrl} for user: ${job.data.username}`);

  await new Promise(resolve => setTimeout(resolve, 4000))
  console.log(`W2: Processed ${job.id}  video url: ${job.data.videoUrl} for user: ${job.data.username}`);
}, { connection: connection })

const worker3 = new Worker("video-transcoding", async (job) => {
  console.log(`W3: Processing ${job.id} video url: ${job.data.videoUrl} for user: ${job.data.username}`);

  await new Promise(resolve => setTimeout(resolve, 6000))
  console.log(`W3: Processed ${job.id}  video url: ${job.data.videoUrl} for user: ${job.data.username}`);
}, { connection: connection })

export default app
