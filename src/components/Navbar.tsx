
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, MessageSquare, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 py-4 px-6 md:px-12 transition-all duration-300 ${
      scrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-loan to-loan-dark rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">L</span>
          </div>
          <span className="text-xl font-medium">LoanNavigator</span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            Home
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
                Dashboard
              </Link>
              <Link to="/chat" className={`nav-link ${isActive('/chat') ? 'active' : ''}`}>
                Chat
              </Link>
              <button 
                onClick={logout}
                className="button-secondary"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={`nav-link ${isActive('/login') ? 'active' : ''}`}>
                Login
              </Link>
              <Link to="/signup" className="button-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button 
          className="md:hidden text-foreground"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/90 backdrop-blur-lg shadow-lg animate-slide-down">
          <div className="flex flex-col p-6 space-y-4">
            <Link to="/" className="flex items-center space-x-2 p-2 hover:bg-muted rounded-md">
              <Home size={20} />
              <span>Home</span>
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="flex items-center space-x-2 p-2 hover:bg-muted rounded-md">
                  <User size={20} />
                  <span>Dashboard</span>
                </Link>
                <Link to="/chat" className="flex items-center space-x-2 p-2 hover:bg-muted rounded-md">
                  <MessageSquare size={20} />
                  <span>Chat</span>
                </Link>
                <button 
                  onClick={logout}
                  className="flex items-center space-x-2 p-2 hover:bg-muted rounded-md text-left"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="button-secondary w-full text-center">
                  Login
                </Link>
                <Link to="/signup" className="button-primary w-full text-center">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
