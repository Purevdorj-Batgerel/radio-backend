import Database from 'better-sqlite3'

export function createTables() {
  execQueries(getCreateTableQueries())
}

export function dropTables() {
  execQueries(getDropTableQueries())
}

export function populateSongs(data) {
  const db = getDB()

  const insertSong = db.prepare(
    `INSERT INTO songs (
      lossless, sampleRate, bitrate, duration, year, album, genre,
      albumArtist, title, artists, albumArt, fileLocation
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
  )

  data.forEach((song) => {
    let {
      lossless = 0,
      sampleRate,
      bitrate,
      duration,
      year = 0,
      album = '',
      genre = '',
      albumArtist = '',
      title = '',
      artists = '',
      albumArt = '',
      fileLocation,
    } = song

    if (typeof lossless !== 'number') {
      lossless = lossless ? 1 : 0
    }

    if (Array.isArray(genre)) {
      genre = genre.join(',')
    }

    if (Array.isArray(albumArtist)) {
      albumArtist = albumArtist.join(',')
    }

    if (Array.isArray(artists)) {
      artists = artists.join(',')
    }

    try {
      insertSong.run(
        lossless,
        sampleRate,
        bitrate,
        duration,
        year,
        album,
        genre,
        albumArtist,
        title,
        artists,
        albumArt,
        fileLocation,
      )
    } catch (err) {
      console.log(err)
      console.log(
        lossless ? 1 : 0,
        sampleRate,
        bitrate,
        duration,
        year,
        album,
        genre,
        albumArtist,
        title,
        artists,
        albumArt,
        fileLocation,
      )
    }
  })

  db.close()
}

function getDB() {
  if (!process.env.DB) {
    throw new Error('DB not declared in the .env file')
  }

  const db = new Database(`${process.env.DB.trim()}.db`, {
    verbose: console.log,
  })
  db.pragma('journal_mode = WAL')

  return db
}

function execQueries(queries) {
  const db = getDB()

  queries.forEach((query) => {
    db.exec(query)
  })

  db.close()
}

function getDropTableQueries() {
  const artists = `
  DROP TABLE IF EXISTS artists
  `
  const albums = `
  DROP TABLE IF EXISTS albums
  `
  const songs = `
  DROP TABLE IF EXISTS songs
  `

  return [artists, albums, songs]
}

function getCreateTableQueries() {
  const artists = `
  CREATE TABLE IF NOT EXISTS artists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL
  );`

  const albums = `
  CREATE TABLE IF NOT EXISTS albums (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(255) NOT NULL,
    artistId INTEGER NOT NULL,
    releaseYear INTEGER,

    FOREIGN KEY (artist_id) REFERENCES artists(id)
  );`

  const songs = `
  CREATE TABLE IF NOT EXISTS songs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lossless BOOLEAN,
    sampleRate NUMERIC,
    bitrate NUMERIC,
    duration INTEGER,
    year INTEGER,
    album VARCHAR(255),
    genre VARCHAR(255),
    albumArtist VARCHAR(255),
    title VARCHAR(255),
    artists VARCHAR(255),
    albumArt VARCHAR(255),
    fileLocation VARCHAR(255)
  );
  `

  return [songs]
}
