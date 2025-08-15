import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Providers from './providers'
import Layout from './components/Layout'
import Home from './pages/Home'
import Blogs from './pages/Blogs'
import Music from './pages/Music'
import Create from './pages/Create'
import Profile from './pages/Profile'
import Extra from './pages/Extra'

function App() {
  return (
    <Providers>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="blogs" element={<Blogs />} />
            <Route path="music" element={<Music />} />
            <Route path="create" element={<Create />} />
            <Route path="profile" element={<Profile />} />
            <Route path="extra" element={<Extra />} />
          </Route>
        </Routes>
        <Toaster position="top-right" />
      </Router>
    </Providers>
  )
}

export default App
