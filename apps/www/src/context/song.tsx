import { Song, actions } from '@radio/common'
import { JSX, createContext, onMount, useContext } from 'solid-js'
import { createStore } from 'solid-js/store'

import { useSocketDispatch, useSocketState } from './socket'

const StateContext = createContext()
const DispatchContext = createContext()

interface SongProviderProps {
  children: JSX.Element
}

interface StoreState {
  currentSong: Song | null
  isPlaying: boolean
}

const initialState: StoreState = {
  currentSong: null,
  isPlaying: false,
}

export default function SongProvider(props: SongProviderProps) {
  const [store, setStore] = createStore(initialState)

  const { ws } = useSocketState()!
  const { initWS, registerHandler } = useSocketDispatch()!

  const setCurrentSong = (song: Song) => {
    setStore('currentSong', song)
  }

  const setIsPlaying = (value: boolean) => {
    setStore('isPlaying', value)
  }

  const handlePlayNextSong = () => {
    ws!.send(JSON.stringify(''))
  }

  onMount(() => {
    registerHandler({
      action: actions.GET_SONG_INFO,
      callback: (payload) => {
        setStore('currentSong', payload)
      },
    })
    initWS({ action: actions.GET_SONG_INFO })
  })

  return (
    <StateContext.Provider value={store}>
      <DispatchContext.Provider
        value={{ setCurrentSong, setIsPlaying, handlePlayNextSong }}
      >
        {props.children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

export const useSongDispatch = () => useContext(DispatchContext)
