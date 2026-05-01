import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { signOut } from './auth'

export default function Navbar({ user }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const isLanding = location.pathname === '/'

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-dark-900/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center group-hover:bg-violet-500 transition-colors">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 4h7M2 8h12M7 12h7" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-display font-bold text-white text-lg">Crosstalk</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {user ? (
            <>
              <Link to="/dashboard" className="text-white/60 hover:text-white text-sm transition-colors">Dashboard</Link>
              <Link to="/history" className="text-white/60 hover:text-white text-sm transition-colors">History</Link>
              <Link to="/pricing" className="text-white/60 hover:text-white text-sm transition-colors">Billing</Link>
              {user.email === 'bundepunemmanuel@gmail.com' && (
                <Link to="/admin" className="text-violet-400 hover:text-violet-300 text-sm transition-colors">Admin</Link>
              )}
              <button onClick={handleSignOut} className="text-white/40 hover:text-white/70 text-sm transition-colors">Sign out</button>
            </>
          ) : (
            <>
              {isLanding && (
                <a href="#how-it-works" className="text-white/60 hover:text-white text-sm transition-colors">How it works</a>
              )}
              <Link to="/login" className="text-white/60 hover:text-white text-sm transition-colors">Login</Link>
              <Link to="/signup" className="btn-primary text-sm py-2 px-4">Get Started</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/5 bg-dark-900/95 backdrop-blur-xl px-4 py-4 flex flex-col gap-3 animate-fade-in">
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="text-white/70 hover:text-white py-2 text-sm">Dashboard</Link>
              <Link to="/history" onClick={() => setMenuOpen(false)} className="text-white/70 hover:text-white py-2 text-sm">History</Link>
              <Link to="/pricing" onClick={() => setMenuOpen(false)} className="text-white/70 hover:text-white py-2 text-sm">Billing</Link>
              {user.email === 'bundepunemmanuel@gmail.com' && (
                <Link to="/admin" onClick={() => setMenuOpen(false)} className="text-violet-400 py-2 text-sm">Admin</Link>
              )}
              <button onClick={handleSignOut} className="text-white/40 hover:text-white/70 py-2 text-sm text-left">Sign out</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="text-white/70 hover:text-white py-2 text-sm">Login</Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)} className="btn-primary text-sm text-center py-2.5">Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
