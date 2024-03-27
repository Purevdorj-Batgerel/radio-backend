import { PassThrough } from 'stream'
import Throttle from 'throttle'
import { createReadStream } from 'fs'
import { v4 as uuidv4 } from 'uuid'

import { getAllSongs } from './db'

import { Song } from './types'

const sinks = new Map()
let songs: Song[] = []
let currentSong: Song
let currentIndex = 0

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

  addToSongs(song: Song) {
    songs.push(song)
  }
  removeFromSongs(): Song {
    return songs.splice(0, 1)[0]
  }

  async playLoop() {
    currentSong = songs[currentIndex]
    currentIndex++

    if (currentIndex >= songs.length) {
      currentIndex = 0
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

  startStreaming() {
    songs = getAllSongs()

    console.log(songs.length)

    this.playLoop()
  }
}

const singletonRadio = Object.freeze(new Radio())
export default singletonRadio
