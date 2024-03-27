import Database from 'better-sqlite3'
import { Song } from './types'

export function getAllSongs(): Song[] {
  const db = new Database('radio.db')
  db.pragma('journal_mode = WAL')

  const query = 'SELECT * FROM songs'

  const songs = db.prepare(query).all()

  db.close()

  return songs as Song[]
}
