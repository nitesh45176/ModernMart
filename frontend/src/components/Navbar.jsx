import { Lock, LogIn, LogOut, ShoppingCart, UserPlus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUserStore } from '../stores/useUserStore';
import { useCartStore } from '../stores/useCartStore';
import ModernMartLogo from './ModernMartLogo';
import AboutPage from './About';

const Navbar = () => {
  const { user, logout } = useUserStore();
  const { cart } = useCartStore();
  const isAdmin = user?.role === "admin";
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  
useEffect(() => {
  setMenuOpen(false);
}, [location.pathname]);

  return (
    <header className='fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-md z-50 border-b border-emerald-800'>
      <div className='max-w-7xl mx-auto px-4 py-0 flex justify-between items-center'>
        
        {/* Logo */}
        <Link to='/' className='flex items-center gap-2 text-2xl font-bold text-emerald-400'>
          <ModernMartLogo width={250} height={80} />
        </Link>

        {/* Hamburger for mobile */}
        <div className='md:hidden'>
          <button onClick={() => setMenuOpen(!menuOpen)} className='text-emerald-400'>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <nav
          className={`${
            menuOpen ? 'block' : 'hidden'
          } md:flex absolute md:static top-full left-0 w-full md:w-auto bg-gray-900 md:bg-transparent py-4 md:py-0 px-4 md:px-0 transition-all duration-300`}
        >
          <div className='flex flex-col md:flex-row gap-4 md:items-center md:gap-6'>
           <Link to="/" onClick={() => setMenuOpen(false)} className='text-gray-300 hover:text-emerald-400 transition'>Home</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)} className='text-gray-300 hover:text-emerald-400 transition'>About</Link>
           <Link to="/contact" onClick={() => setMenuOpen(false)} className='text-gray-300 hover:text-emerald-400 transition'>Contact</Link>

            {user && (
              <Link to="/cart" onClick={() => setMenuOpen(false)} className='relative group text-gray-300 hover:text-emerald-400'>
                <div className="flex items-center">
                  <ShoppingCart className='mr-1' size={20} />
                  <span>Cart</span>
                </div>
                {cart.length > 0 && (
                  <span className='absolute -top-2 -left-2 bg-emerald-500 text-white rounded-full px-2 py-0.5 text-xs'>
                    {cart.length}
                  </span>
                )}
              </Link>
            )}

            {isAdmin && (
              <Link
              onClick={() => setMenuOpen(false)} 
                to="/secret-dashboard"
                className='bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md font-medium transition flex items-center'
              >
                <Lock size={18} className="mr-1" />
                <span>Dashboard</span>
              </Link>
            )}

            {user ? (
             <button
                  onClick={() => {
                      logout();
                       setMenuOpen(false);
                     }}
                className='bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md flex items-center'>

  <LogOut size={18} />
  <span className='ml-2'>Log Out</span>
</button>

            ) : (
              <>
                <Link
                onClick={() => setMenuOpen(false)} 
                  to="/signup"
                  className='bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-md flex items-center'
                >
                  <UserPlus size={18} className='mr-2' />
                  Sign Up
                </Link>
                <Link
                onClick={() => setMenuOpen(false)} 
                  to="/login"
                  className='bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md flex items-center'
                >
                  <LogIn size={18} className='mr-2' />
                  Login
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
