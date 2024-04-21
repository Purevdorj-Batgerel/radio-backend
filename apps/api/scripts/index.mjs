import * as dotenv from 'dotenv'

import path from 'path'
import { createTables, dropTables, populateSongs } from './db.mjs'
import { getMusicFiles, processMusicFile } from './musicInfo.mjs'
import { emptyDir } from './fileHelpers.mjs'

dotenv.config({ path: '../../.env' })

if (!process.env.AUDIO) {
  process.env.AUDIO = path.resolve(process.cwd(), 'sample_audio')
}

emptyDir(path.join(process.cwd(), 'public'), '.keep')

const result = await getMusicFiles(process.env.AUDIO)

const data = await Promise.all(
  result.map(async (songPath) => await processMusicFile(songPath)),
)

dropTables()
createTables()
populateSongs(data)
