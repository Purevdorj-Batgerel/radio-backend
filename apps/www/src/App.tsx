import './App.css'
import { Song } from '@radio/common'

let isPlaying = false
let currentSong: Song = {
  id: 1,
  lossless: 0,
  sampleRate: 0,
  bitrate: 0,
  duration: 0,
  year: 0,
  album: '',
  genre: '',
  albumArtist: '',
  title: '',
  artists: '',
  albumArt: '',
  fileLocation: '',
}

let ws: WebSocket
let audio: HTMLAudioElement

let albumArtEl: HTMLImageElement
let artistEl: HTMLDivElement
let albumEl: HTMLDivElement
let titleEl: HTMLDivElement

function init(event: MouseEvent) {
  let coverElement = event.target as HTMLElement

  while (coverElement.id !== 'cover') {
    coverElement = coverElement.parentElement!
  }

  coverElement.style.display = 'none'

  audioInit()
  socketInit()
}

function audioInit() {
  audio = new Audio(
    `http://${import.meta.env.VITE_API_HOST}:${
      import.meta.env.VITE_API_PORT
    }/stream`,
  )

  audio.addEventListener('abort', (event) => {
    console.log('abort', event)
  })
  audio.addEventListener('canplay', () => {
    if (!isPlaying) {
      audio.play()
      isPlaying = true
    }
  })
  audio.addEventListener('canplaythrough', (event) => {
    console.log('canplaythrough', event)
  })
  audio.addEventListener('durationchange', (event) => {
    console.log('durationchange', event)
  })
  audio.addEventListener('emptied', (event) => {
    console.log('emptied', event)
  })
  audio.addEventListener('ended', (event) => {
    console.log('ended', event)
  })
  audio.addEventListener('error', (event) => {
    console.log('error', event)
    audio.load()
  })
  audio.addEventListener('loadeddata', (event) => {
    console.log('loadeddata', event)
  })
  audio.addEventListener('loadedmetadata', (event) => {
    console.log('loadedmetadata', event)
  })
  audio.addEventListener('loadstart', (event) => {
    console.log('loadstart', event)
  })
  audio.addEventListener('pause', (event) => {
    console.log('pause', event)
  })
  audio.addEventListener('play', (event) => {
    console.log('play', event)
  })
  audio.addEventListener('playing', (event) => {
    console.log('playing', event)
  })
  audio.addEventListener('ratechange', (event) => {
    console.log('ratechange', event)
  })
  audio.addEventListener('seeked', (event) => {
    console.log('seeked', event)
  })
  audio.addEventListener('seeking', (event) => {
    console.log('seeking', event)
  })
  audio.addEventListener('stalled', (event) => {
    console.log('stalled', event)
  })
  audio.addEventListener('suspend', (event) => {
    console.log('suspend', event)
  })
  audio.addEventListener('volumechange', (event) => {
    console.log('timeupdate', event)
  })
  audio.addEventListener('waiting', (event) => {
    console.log('waiting', event)
  })
}

function socketInit() {}

function updateSong(song: Song) {
  if (titleEl) {
    titleEl.textContent = song.title
  }

  if (albumEl) {
    albumEl.textContent = song.album
  }

  if (artistEl) {
    artistEl.textContent = song.artists
  }

  if (albumArtEl && song.albumArt) {
    albumArtEl.setAttribute(
      'src',
      `http://${import.meta.env.VITE_API_HOST}:${
        import.meta.env.VITE_API_PORT
      }/public/${song.albumArt}`,
    )
  }
}

function playNext() {
  ws.send(JSON.stringify({ action: 'play_next' }))
}

function playPrev() {
  ws.send(JSON.stringify({ action: 'play_prev' }))
}

function App() {
  return (
    <>
      <div class='header'>Now Playing</div>
      <img ref={albumArtEl} src='' alt='Album art' width='300' height='300' />
      <div ref={artistEl}></div>
      <div ref={albumEl}></div>
      <div ref={titleEl}></div>

      <div id='controllers'>
        <button onClick={playPrev}>Prev</button>
        <button id='playPause'>Play/Pause</button>
        <button onClick={playNext}>Next</button>
      </div>
      <div>
        {/* <google-cast-launcher id="castbutton"></google-cast-launcher> */}
      </div>

      <div id='cover' onClick={init}>
        <div class='pauseButton'></div>
      </div>
    </>
  )
}

export default App
