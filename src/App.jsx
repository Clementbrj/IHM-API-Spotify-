import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SubscribeForm from './pages/Subscribe'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';// Import necessary components from react-router-dom for routing

function App() {
  const [count, setCount] = useState(0)

  return (
        <Router>
            <Routes>
            <Route path="/inscription" element={<SubscribeForm />} />{" "}
            </Routes>
        </Router>
  )
}

export default App
