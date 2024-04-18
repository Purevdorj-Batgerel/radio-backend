import path from 'path'
import * as mm from 'music-metadata'
import { walk } from './fileHelpers.mjs'
import { CWebp } from 'cwebp'
import crypto from 'crypto'

export async function getMusicFiles(dir) {
  const result = []

  for await (const file of walk(dir)) {
    if (file.endsWith('.mp3') || file.endsWith('.flac')) {
      result.push(file)
    }
  }

  return result
}

async function analyzeMusic(file) {
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

  return [formatted, metadata]
}

export async function processMusicFile(file) {
  const [formatted, metadata] = await analyzeMusic(file)

  const imageFile = await createImage(file, metadata)

  return { ...formatted, albumArt: imageFile }
}

async function createImage(file, metadata) {
  if (metadata.common?.picture?.[0]) {
    const fileName =
      crypto.createHash('md5').update(file).digest('hex') + '.webp'
    const imagePath = path.resolve('public', fileName)

    try {
      const encoder = new CWebp(metadata.common.picture[0].data)
      await encoder.write(imagePath)
    } catch (err) {
      console.log(err)
    }

    return fileName
  }
}
