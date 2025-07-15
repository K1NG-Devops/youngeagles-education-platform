// src/main.jsx
import React from 'react'                         // optional with new JSX transform
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Missing <div id="root"> in index.html')


createRoot(rootElement).render(
  <StrictMode>
      <App />
  </StrictMode>
)
