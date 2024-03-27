import Fastify from 'fastify'
import fastifyWebsocket from '@fastify/websocket'

import { websocketHandler } from './routes/websocket'
import streamRouter from './routes/stream'
import Radio from './radio'

const fastify = Fastify({ logger: true })
fastify.register(fastifyWebsocket)

fastify.register(websocketHandler)
fastify.register(streamRouter)

fastify.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.log(err)
    process.exit(1)
  }

  Radio.startStreaming()

  console.log(`Server listening at ${address}`)
})
