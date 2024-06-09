let instance

class SocketManager {
  constructor(messageOnOpen) {
    if (instance) {
      throw new Error('You can only create one instance!')
    }
    instance = this
  }

  getSocket() {
    return this
  }
}

const socketManager = Object.freeze(new SocketManager())
export default socketManager
