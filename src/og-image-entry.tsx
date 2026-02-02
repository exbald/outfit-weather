import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import { OgImage } from './pages/OgImage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <OgImage />
  </StrictMode>,
)
