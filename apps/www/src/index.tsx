/* @refresh reload */
import { render } from 'solid-js/web'

import './index.css'
import App from './App'
import SocketProvider from './context/socket'
import SongProvider from './context/song'

const root = document.getElementById('root')

render(
  () => (
    <SocketProvider>
      <SongProvider>
        <App />
      </SongProvider>
    </SocketProvider>
  ),
  root!,
)
