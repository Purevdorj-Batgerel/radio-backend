import { PassThrough } from 'stream'
import Throttle from 'throttle'
import * as mm from 'music-metadata'
import { createReadStream } from 'fs'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'

const sinks = new Map()
const songs: string[] = []
let currentSong: string = path.resolve(process.cwd(), 'songs', '1.mp3')

let instance: Radio

class Radio {
  constructor() {
    if (instance) {
      throw new Error('You can only create one instance!')
    }

    instance = this
  }
  getInstance() {
    return this
  }

  makeResponseSink() {
    const id = uuidv4()
    const responseSink = new PassThrough()
    sinks.set(id, responseSink)
    console.log('Sink Created. Total Sinks: ', sinks.size)
    return { id, responseSink }
  }

  removeResponseSink(id: string) {
    sinks.delete(id)
    console.log('Sink Deleted. Total Sinks: ', sinks.size)
  }

  broadcastToEverySink(chunk: any) {
    for (const [, sink] of sinks) {
      sink.write(chunk)
    }
  }

  removeFromSongs(): string {
    return songs.splice(0, 1)[0]
  }

  async playLoop() {
    currentSong = songs.length ? this.removeFromSongs() : currentSong
    const bitRate = await this.getBitrate(currentSong!)

    const songReadable = createReadStream(currentSong)
    const throttleTransformable = new Throttle(bitRate! / 8)

    throttleTransformable
      .on('data', (chunk) => this.broadcastToEverySink(chunk))
      .on('end', () => this.playLoop())

    songReadable.pipe(throttleTransformable)
  }

  async getBitrate(song: string) {
    const metadata = await mm.parseFile(song)
    return metadata.format.bitrate
  }

  startStreaming() {
    this.playLoop()
  }
}

const singletonRadio = Object.freeze(new Radio())
export default singletonRadio
