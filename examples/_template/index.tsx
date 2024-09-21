import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './src/App'
import 'bulma/css/bulma.css'
ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
