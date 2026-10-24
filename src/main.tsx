import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/fraunces/600.css'
import '@fontsource/fraunces/700.css'
import '@fontsource/manrope/400.css'
import '@fontsource/manrope/600.css'
import '@fontsource/manrope/700.css'
import { App } from './App'
import './styles/globals.css'

const root = document.getElementById('root')
if (!root) {
  throw new Error('The application root is missing.')
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
