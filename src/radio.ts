import { createReadStream } from 'fs'
import { PassThrough } from 'stream'
import { v4 as uuidv4 } from 'uuid'
import Throttle from 'throttle'
import { Song } from './types'
import wsManager from './wsManager'

import { GET_SONG_INFO } from './actions'

let songs: Song[] = []
let currentIndex: number = 0

let instance: Radio
class Radio {
  private sinks: Map<string, PassThrough>

  constructor() {
    if (instance) {
      throw new Error('You can only create one instance!')
    }

    instance = this

    this.sinks = new Map()
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
    songs.push(song)
  }
  removeFromSongs(): Song {
    return songs.splice(0, 1)[0]
  }
  getCurrentSong(): Song {
    return songs[currentIndex]
  }

  async playLoop() {
    if (songs.length === 0) {
      return
    }

    currentIndex = Math.floor(Math.random() * songs.length)
    const currentSong = this.getCurrentSong()

    const {
      album,
      albumArtist,
      artists,
      genre,
      title,
      year,
      albumArt,
      fileLocation,
      bitrate,
    } = currentSong

    // currentIndex++

    // if (currentIndex >= songs.length) {
    //   currentIndex = 0
    // }

    // console.log(fileLocation)

    const songReadable = createReadStream(fileLocation)
    const throttleTransformable = new Throttle(bitrate! / 8)

    throttleTransformable
      .on('data', (chunk) => this.broadcastToEverySink(chunk))
      .on('end', () => {
        this.playLoop()
      })

    songReadable.pipe(throttleTransformable)

    wsManager.broadcast({
      action: GET_SONG_INFO,
      payload: { album, albumArtist, artists, genre, title, year, albumArt },
    })
  }

  startStreaming(_songs: Song[] = []) {
    songs = _songs
    this.playLoop()
  }
}

const singletonRadio = Object.freeze(new Radio())
export default singletonRadio
