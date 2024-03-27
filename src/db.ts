import DatabaseConstructor, { Database } from 'better-sqlite3'
import { Song } from './types'

export function getAllSongs(): Song[] {
  const db = getDB()

  const query = 'SELECT * FROM songs'

  const songs = db.prepare(query).all()

  db.close()

  return songs as Song[]
}

function getDB(): Database {
  if (!process.env.DB) {
    throw new Error('DB not declared in the .env file')
  }

  const db = new DatabaseConstructor(`${process.env.DB.trim()}.db`)
  db.pragma('journal_mode = WAL')

  return db
}
