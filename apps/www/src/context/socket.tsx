import { Message } from '@radio/common'
import { createContext, useContext, useReducer, useState } from 'react'

interface SocketProviderProps {
  children: React.ReactElement
}

interface StateContextValue {
  ws: WebSocket | null
  messageHandlers: MessageHandler[]
}

export interface MessageHandler {
  action: string
  callback: (payload: any) => void
}

const initialState: StateContextValue = {
  ws: null,
  messageHandlers: [],
}

const initWS = (messageOnOpen: Message) => {
  const ws = new WebSocket(
    `ws://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/ws`,
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

    const callback = store.messageHandlers.find(
      (handler) => handler.action === action,
    )?.callback

    if (callback) callback(payload)
  }

  return ws
}

const SocketContext = createContext<StateContextValue>({ ws: null })

function socketReducer(state, action) {
  switch (action.type) {
    case 'init': {
      return { ws: initWS(action.payload) }
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

function SocketProvider({ children }: SocketProviderProps) {
  const [state, dispatch] = useReducer(socketReducer, { ws: null })
  const value = { state, dispatch }
  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  )
}

function useSocket() {
  const context = useContext(SocketContext)

  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}

export { SocketProvider, useSocket }
