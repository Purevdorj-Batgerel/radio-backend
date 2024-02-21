import { FastifyInstance } from 'fastify'

export async function websocketHandler(fastify: FastifyInstance) {
  fastify.get('/ws', { websocket: true }, (connection, req) => {
    connection.socket.on('open', () => {
      connection.socket.send('Socket open')
      console.log('Socket Open')
    })

    connection.socket.on('message', (message) => {
      connection.socket.send('Hello Fastify Websocket')
      console.log('Socket Send message')
    })

    connection.socket.on('close', () => {
      console.log('Socket Closed')
    })
  })
}
