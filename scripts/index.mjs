import { createTables, dropTables, populateSongs } from './db.mjs'
import { analyzeMusic, getMusicFiles } from './musicInfo.mjs'
import path from 'path'

const result = await getMusicFiles(path.resolve(process.cwd(), 'sample_audio'))

const data = await Promise.all(
  result.map(async (songPath) => {
    return await analyzeMusic(songPath)
  }),
)

// dropTables()
// createTables()
// populateSongs(data)
