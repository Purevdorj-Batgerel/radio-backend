import path from 'path'
import dotenv from 'dotenv'

import Fastify from 'fastify'
import fastifyStatic from '@fastify/static'
import fastifyWebsocket from '@fastify/websocket'

import Radio from './radio'
import streamRouter from './routes/stream'
import { websocketHandler } from './routes/websocket'
import { getAllSongs } from './db'

dotenv.config()

if (!process.env.API_HOST) {
  throw new Error('API_HOST not declared in the .env file')
}
if (!process.env.API_PORT) {
  throw new Error('API_PORT not declared in the .env file')
}

const fastify = Fastify({ logger: true })

fastify.register(fastifyStatic, {
  root: path.join(__dirname, '../', 'public'),
  prefix: '/public/',
})
fastify.register(fastifyWebsocket)

fastify.register(websocketHandler)
fastify.register(streamRouter)

fastify.listen(
  { host: process.env.API_HOST, port: parseInt(process.env.API_PORT) },
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
