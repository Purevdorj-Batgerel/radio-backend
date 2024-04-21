import { Message } from '@radio/common'
import { JSX, createContext, useContext } from 'solid-js'
import { createStore } from 'solid-js/store'

interface SocketProviderProps {
  children: JSX.Element
}

interface StateContextValue {
  ws: WebSocket | null
  messageHandlers: MessageHandler[]
}

interface DispatchContextValue {
  initWS: (messageOnOpen: Message) => void
  registerHandler: (handler: MessageHandler) => void
}

export interface MessageHandler {
  action: string
  callback: (payload: any) => void
}

const initialState: StateContextValue = {
  ws: null,
  messageHandlers: [],
}

const StateContext = createContext<StateContextValue>()
const DispatchContext = createContext<DispatchContextValue>()

export default function SocketProvider(props: SocketProviderProps) {
  const [store, setStore] = createStore(initialState)

  const initWS = (messageOnOpen: Message) => {
    const ws = new WebSocket(
      `ws://${import.meta.env.VITE_API_HOST}:${
        import.meta.env.VITE_API_PORT
      }/ws`,
    )

    ws.onerror = (event) => {
      console.log('Websocket error', event)
    }

    ws.onclose = () => {
      console.log('Socket closed')
    }

    if (messageOnOpen) {
      ws.onopen = () => {
        ws.send(JSON.stringify(messageOnOpen))
      }
    }

    ws.onmessage = (event) => {
      const { action, payload } = JSON.parse(event.data)

      console.log('onmessage', action, payload)

      const callback = store.messageHandlers.find((handler) => {
        handler.action === action
      })?.callback

      if (callback) callback(payload)
    }

    setStore('ws', ws)
  }

  const registerHandler = (handler: MessageHandler) => {
    setStore('messageHandlers', (messageHandlers) => [
      ...messageHandlers,
      handler,
    ])
  }

  return (
    <StateContext.Provider value={store}>
      <DispatchContext.Provider value={{ initWS, registerHandler }}>
        {props.children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

export const useSocketState = () => useContext(StateContext)
export const useSocketDispatch = () => useContext(DispatchContext)
