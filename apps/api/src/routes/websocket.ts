import { FastifyInstance } from 'fastify'
import { RawData, WebSocket } from 'ws'
import { Message } from '@radio/common'
import { GET_SONG_INFO } from '../actions'
import Radio from '../radio'
import wsManager from '../wsManager'

function toJSON(data: RawData): Message {
  return JSON.parse(data.toString()) as Message
}

function messageHandler(ws: WebSocket, message: Message) {
  const { action, payload } = message

  if (action === GET_SONG_INFO) {
    const { album, albumArtist, artists, genre, title, year, albumArt } =
      Radio.getCurrentSong()

    ws.send(
      JSON.stringify({
        action,
        payload: { album, albumArtist, artists, genre, title, year, albumArt },
      }),
    )
  }
}

export async function websocketHandler(fastify: FastifyInstance) {
  fastify.get('/ws', { websocket: true }, (ws, req) => {
    const id = wsManager.addSocket(ws)

    ws.on('error', console.error)
    ws.on('ping', console.log)
    ws.on('pong', console.log)

    ws.on('open', () => {
      console.log('SOCKET ON OPEN')
      ws.send('Socket open')
    })

    ws.on('message', (message) => messageHandler(ws, toJSON(message)))

    ws.on('close', () => {
      wsManager.removeSocket(id)
    })
  })
}
