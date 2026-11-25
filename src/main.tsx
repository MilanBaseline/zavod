import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import Home from './Home'
import HomeMobile from './HomeMobile'
import './index.css'

// Below 768px the mobile layout (Figma "Home — Mobile 390") is used.
const MQ = '(max-width: 767px)'

function App() {
  const [mobile, setMobile] = useState(() => window.matchMedia(MQ).matches)
  useEffect(() => {
    const mq = window.matchMedia(MQ)
    const on = () => setMobile(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  // key forces a clean remount so the scroll/reveal effects re-initialise
  return mobile ? <HomeMobile key="m" /> : <Home key="d" />
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
