import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCompare } from '../../context/CompareContext';

export default function Navbar() {
  const { user, signOut, isAdmin } = useAuth();
  const { selected } = useCompare();
  const navigate = useNavigate();
  const location = useLocation();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      navigate('/auth');
    } catch (e) {
      console.error(e);
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm2 0v14h14V5H5zm2 2h10v2H7V7zm0 4h10v2H7v-2zm0 4h6v2H7v-2z"/>
            </svg>
          </div>
          <span className="font-display text-xl font-bold tracking-tight group-hover:text-brand-400 transition-colors">
            Hotelier
          </span>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-2">
          {user && (
            <>
              {/* Compare badge */}
              {selected.length > 0 && (
                <Link
                  to="/compare"
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
                    ${location.pathname === '/compare'
                      ? 'bg-brand-500 text-white'
                      : 'bg-brand-500/20 text-brand-400 hover:bg-brand-500/30'}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Compare ({selected.length})
                </Link>
              )}

              {isAdmin && (
                <span className="px-3 py-1 rounded-lg bg-purple-500/20 text-purple-400 text-xs font-medium border border-purple-500/30">
                  Admin
                </span>
              )}

              <div className="flex items-center gap-3 ml-2 pl-3 border-l border-white/10">
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-slate-400">Signed in as</p>
                  <p className="text-sm font-medium text-white truncate max-w-[140px]">
                    {user.user_metadata?.full_name || user.email}
                  </p>
                </div>
                <button
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="btn-secondary !px-4 !py-2 text-sm"
                >
                  {signingOut ? 'Signing out…' : 'Sign out'}
                </button>
              </div>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
