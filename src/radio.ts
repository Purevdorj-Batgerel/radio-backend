import { PassThrough } from 'stream'
import Throttle from 'throttle'
import { createReadStream } from 'fs'
import { v4 as uuidv4 } from 'uuid'
import { Song } from './types'

let instance: Radio
class Radio {
  private sinks
  private songs: Song[]
  private currentIndex: number

  constructor() {
    if (instance) {
      throw new Error('You can only create one instance!')
    }

    instance = this

    this.sinks = new Map()
    this.songs = []
    this.currentIndex = 0
  }
  getInstance() {
    return this
  }

  makeResponseSink() {
    const id = uuidv4()
    const responseSink = new PassThrough()
    this.sinks.set(id, responseSink)

    return { id, responseSink }
  }

  removeResponseSink(id: string) {
    this.sinks.delete(id)
  }

  broadcastToEverySink(chunk: any) {
    for (const [, sink] of this.sinks) {
      sink.write(chunk)
    }
  }

  addToSongs(song: Song) {
    this.songs.push(song)
  }
  removeFromSongs(): Song {
    return this.songs.splice(0, 1)[0]
  }

  async playLoop() {
    if (this.songs.length === 0) {
      return
    }

    const currentSong = this.songs[this.currentIndex]
    this.currentIndex++

    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0
    }

    const bitRate = currentSong.bitrate

    const songReadable = createReadStream(currentSong.file_location)
    const throttleTransformable = new Throttle(bitRate! / 8)

    throttleTransformable
      .on('data', (chunk) => this.broadcastToEverySink(chunk))
      .on('end', () => {
        this.playLoop()
      })

    songReadable.pipe(throttleTransformable)
  }

  startStreaming(songs: Song[] = []) {
    this.songs = songs
    this.playLoop()
  }
}

const singletonRadio = Object.freeze(new Radio())
export default singletonRadio
