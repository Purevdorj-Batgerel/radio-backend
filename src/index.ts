import dotenv from 'dotenv'

import Fastify from 'fastify'
import fastifyWebsocket from '@fastify/websocket'

import { websocketHandler } from './routes/websocket'
import streamRouter from './routes/stream'
import Radio from './radio'
import { getAllSongs } from './db'

dotenv.config()

if (!process.env.HOST) {
  throw new Error('PORT not declared in the .env file')
}
if (!process.env.PORT) {
  throw new Error('PORT not declared in the .env file')
}

const fastify = Fastify({ logger: true })
fastify.register(fastifyWebsocket)

fastify.register(websocketHandler)
fastify.register(streamRouter)

fastify.listen(
  { host: process.env.HOST, port: parseInt(process.env.PORT) },
  (err, address) => {
    if (err) {
      console.log(err)
      process.exit(1)
    }

    const songs = getAllSongs()
    Radio.startStreaming(songs)

    console.log(`Server listening at ${address}`)
  },
)
