import './App.css'

import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from "./contexts/AuthContext";

import Navbar from './components/Navbar';

import Listings from './pages/listings';
import SignUp from './pages/signup';
import SignIn from './pages/signin';

function App() {

  return (
    <AuthProvider>
      <Navbar/>
      <div className="pt-16">
        <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/cars" element={<Listings />} />
        {/* <Route path="/about" element={<About />} />
        <Route path="/profile/saved" element={<Saved />} />
        <Route path="/profile/monitoring" element={<Monitoring />} />
        <Route path="/profile/history" element={<History />} /> */}
        <Route path="/profile/signin" element={<SignIn />} />
        <Route path="/profile/signup" element={<SignUp />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
