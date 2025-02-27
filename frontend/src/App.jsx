import { useState } from 'react'
import './component/styles/App.css'
import SubscribeForm from './pages/Subscribe'
import Login from './pages/Login'
import Groupe from "./pages/Groupe";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';// Import necessary components from react-router-dom for routing

function App() {
  const [count, setCount] = useState(0)

  return (
        <Router>
            <Routes>
            <Route path="/inscription" element={<SubscribeForm />} />{" "}
            <Route path="/login" element={<Login />} />{" "}
            <Route path="/groupe" element={<Groupe />} />{" "}
            </Routes>
        </Router>
  )
}

export default App
