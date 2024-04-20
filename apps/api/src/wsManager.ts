import { v4 as uuidv4 } from 'uuid'
import { WebSocket } from 'ws'
import { Message } from '@radio/common'

let instance: WSManager

class WSManager {
  private sockets: Map<string, WebSocket>

  constructor() {
    if (instance) {
      throw new Error('You can only create one instance!')
    }

    instance = this

    this.sockets = new Map()
  }

  addSocket(ws: WebSocket) {
    const id = uuidv4()
    this.sockets.set(id, ws)

    return id
  }

  removeSocket(id: string) {
    this.sockets.delete(id)
  }

  broadcast(message: Message) {
    for (const [, ws] of this.sockets) {
      ws.send(JSON.stringify(message))
    }
  }
}

const singletonWSManager = Object.freeze(new WSManager())
export default singletonWSManager
