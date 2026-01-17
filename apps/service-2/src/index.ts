import { Queue, Worker } from 'bullmq'
import { Hono } from 'hono'
import IORedis from 'ioredis';

const connection = new IORedis({ maxRetriesPerRequest: null });
const app = new Hono()

const videoTranscodingDlq = new Queue('video-transcoding-dlq', {
  connection: {
    host: "localhost",
    port: 6379
  }
});


app.get('/', (c) => {
  return c.text('Hello Hono!')
})

const worker1 = new Worker("video-transcoding", async (job) => {
  console.log(`W1: Processing ${job.id} video url: ${job.data.videoUrl} for user: ${job.data.username}`);

  await new Promise(resolve => setTimeout(resolve, 2000))
  console.log(`W1: Processed ${job.id}  video url: ${job.data.videoUrl} for user: ${job.data.username}`);
}, { connection: connection })

const errWorker = new Worker("video-transcoding", async (job) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 4000))
      throw new Error(`Falied job: ${job.id}`)
  } catch (err: any) {
    console.log(err.message);
    
    videoTranscodingDlq.add("transcode", job.data)
  }
}, { connection: connection })

const DlqWorker = new Worker("video-transcoding-dlq", async (job) => {
  console.log(`W3: Processing ${job.id} video url: ${job.data.videoUrl} for user: ${job.data.username}`);

  await new Promise(resolve => setTimeout(resolve, 6000))
  console.log(`W3: Processed ${job.id}  video url: ${job.data.videoUrl} for user: ${job.data.username}`);
}, { connection: connection })

export default app
