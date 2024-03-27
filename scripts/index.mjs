import 'dotenv/config'

import path from 'path'
import { createTables, dropTables, populateSongs } from './db.mjs'
import { analyzeMusic, getMusicFiles } from './musicInfo.mjs'

if (!process.env.AUDIO) {
  process.env.AUDIO = path.resolve(process.cwd(), 'sample_audio')
}

const result = await getMusicFiles(process.env.AUDIO)

const data = await Promise.all(
  result.map(async (songPath) => {
    return await analyzeMusic(songPath)
  }),
)

dropTables()
createTables()
populateSongs(data)
