import { FastifyInstance } from 'fastify'

export async function websocketHandler(fastify: FastifyInstance) {
  fastify.get('/ws', { websocket: true }, (ws, req) => {
    console.log('ON CONNECTION')
    ws.on('error', console.error)
    ws.on('ping', console.log)
    ws.on('pong', console.log)

    ws.on('open', () => {
      console.log('SOCKET ON OPEN')
      ws.send('Socket open')
    })

    ws.on('message', (message) => {
      console.log('SOCKET ON MESSAGE Socket Send message')
      ws.send('Hello Fastify Websocket')
    })

    ws.on('close', () => {
      console.log('SOCKET ON CLOSE')
    })
  })
}
