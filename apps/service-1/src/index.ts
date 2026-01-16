import { Hono } from 'hono'
import { Queue } from 'bullmq';

const app = new Hono()

const videoTranscodingQueue = new Queue('video-transcoding', {
  connection: {
    host: "localhost",
    port: 6379
  }
});

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.post("/video-upload", async (c) => {
  const { videoUrl, username } = await c.req.json()

  if (!videoUrl || !username) {
    return c.json({
      success: false,
      message: "videoUrl and username are required"
    }, 400)
  }

  videoTranscodingQueue.add("transcode", {
    videoUrl, username
  })

  return c.json({
      success: true,
      message: "job accepted"
    }, 200)
})

export default app
