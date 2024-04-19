export interface Song {
  id: number
  lossless: number
  sampleRate: number
  bitrate: number
  duration: number
  year: number
  album: string
  genre: string
  albumArtist: string
  title: string
  artists: string
  albumArt: string
  fileLocation: string
}

export interface Message {
  action: string
  payload: any
}
