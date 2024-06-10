import { FastifyInstance } from 'fastify'
import { RawData, WebSocket } from 'ws'
import { Message, actions } from '@radio/common'
import Radio from '../radio'
import wsManager from '../wsManager'

function toJSON(data: RawData): Message {
  return JSON.parse(data.toString()) as Message
}

function messageHandler(ws: WebSocket, message: Message) {
  const { action, payload } = message

  switch (action) {
    case actions.GET_SONG_INFO: {
      const { album, albumArtist, artists, genre, title, year, albumArt } =
        Radio.getCurrentSong()

      ws.send(
        JSON.stringify({
          action,
          payload: {
            album,
            albumArtist,
            artists,
            genre,
            title,
            year,
            albumArt,
          },
        }),
      )
      break
    }
    case actions.PLAY_NEXT: {
      Radio.playNext()
      break
    }
    case actions.PLAY_PREV: {
      break
    }
    default: {
      console.log(`Unknown action: ${action}`)
    }
  }

  if (action === actions.GET_SONG_INFO) {
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
