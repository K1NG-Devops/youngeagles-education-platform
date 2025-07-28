import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Programs from './pages/Programs'
import Donate from './pages/Donate'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="programs" element={<Programs />} />
          <Route path="donate" element={<Donate />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
