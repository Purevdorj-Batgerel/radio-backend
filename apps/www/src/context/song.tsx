import { Song, actions } from '@radio/common'

import { useSocketDispatch, useSocketState } from './socket'
import { createContext, useState } from 'react'

interface SongProviderProps {
  children: React.ReactElement
}

interface StateContextValue {
  audio: HTMLAudioElement | null
  currentSong: Song | null
  isPlaying: boolean
}

interface DispatchContextValue {
  audioInit: () => void
  setCurrentSong: (song: Song) => void
  setIsPlaying: (value: boolean) => void
  handlePlayNextSong: () => void
  toggleAudio: () => void
}

const initialState: StateContextValue = {
  audio: null,
  currentSong: null,
  isPlaying: false,
}

const StateContext = createContext<StateContextValue>(initialState)
const DispatchContext = createContext<DispatchContextValue>({})

export default function SongProvider(props: SongProviderProps) {
  const [store, setStore] = useState(initialState)

  const { ws } = useSocketState()!
  const { initWS, registerHandler } = useSocketDispatch()!

  function audioInit() {
    const audio = new Audio(
      `http://${import.meta.env.VITE_API_HOST}:${
        import.meta.env.VITE_API_PORT
      }/stream`,
    )

    audio.addEventListener('abort', (event) => {
      console.log('abort', event)
    })
    audio.addEventListener('canplay', () => {
      if (!store.isPlaying) {
        audio.play()
        setStore('isPlaying', true)
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

  const setCurrentSong = (song: Song) => {
    setStore('currentSong', song)
  }

  const setIsPlaying = (value: boolean) => {
    setStore('isPlaying', value)
  }

  const toggleAudio = () => {
    if (store.isPlaying) {
      store.audio?.pause()
    } else {
      store.audio?.play()
    }
    setStore('isPlaying', !store.isPlaying)
  }

  const handlePlayNextSong = () => {
    ws!.send(JSON.stringify(''))
  }

  onMount(() => {
    registerHandler({
      action: actions.GET_SONG_INFO,
      callback: (payload) => {
        console.log('setting store value', payload)
        setStore('currentSong', payload)
      },
    })
    initWS({ action: actions.GET_SONG_INFO })
  })

  return (
    <StateContext.Provider value={store}>
      <DispatchContext.Provider
        value={{
          audioInit,
          setCurrentSong,
          setIsPlaying,
          handlePlayNextSong,
          toggleAudio,
        }}
      >
        {props.children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

export const useSongState = () => useContext(StateContext)
export const useSongDispatch = () => useContext(DispatchContext)
