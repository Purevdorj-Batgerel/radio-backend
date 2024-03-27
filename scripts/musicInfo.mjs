import walk from './fileWalker.mjs'
import * as mm from 'music-metadata'
import path from 'path'

export async function getMusicFiles(dir) {
  const result = []

  for await (const file of walk(dir)) {
    if (file.endsWith('.mp3') || file.endsWith('.flac')) {
      result.push(file)
    }
  }

  return result
}

export async function analyzeMusic(file) {
  const metadata = await mm.parseFile(file)

  const formatted = {
    lossless: metadata.format.lossless,
    sampleRate: metadata.format.sampleRate,
    bitrate: metadata.format.bitrate,
    duration: metadata.format.duration,
    year: metadata.common.year,
    album: metadata.common.album,
    genre: metadata.common.genre,
    albumartist: metadata.common.albumartist,
    title: metadata.common.title,
    artists: metadata.common.artists,
    file_location: file,
  }

  if (formatted.title === '' || !formatted.title) {
    formatted.title = path.basename(file, '.mp3')
  }

  return formatted
}
