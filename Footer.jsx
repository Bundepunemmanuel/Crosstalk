import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-dark-900 py-10 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-violet-600 flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M2 4h7M2 8h12M7 12h7" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-display font-bold text-white text-sm">Crosstalk</span>
        </div>

        <p className="text-white/30 text-sm">© {new Date().getFullYear()} Crosstalk. All rights reserved.</p>

        <div className="flex items-center gap-6">
          <Link to="/pricing" className="text-white/30 hover:text-white/60 text-sm transition-colors">Pricing</Link>
          <a href="mailto:support@crosstalk.app" className="text-white/30 hover:text-white/60 text-sm transition-colors">Support</a>
        </div>
      </div>
    </footer>
  )
}
