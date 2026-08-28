import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Leaf, Wifi, Battery, Menu, X } from 'lucide-react';
import { useBhoomiData } from '../contexts/MockDataProvider';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/irrigation', label: 'Irrigation' },
  { path: '/crop-recommendation', label: 'Crops' },
  { path: '/disease-detection', label: 'Disease' },
  { path: '/devices', label: 'Devices' },
  { path: '/analytics', label: 'Analytics' },
  { path: '/voice', label: 'Voice Assistant' },
];

export default function Layout() {
  const location = useLocation();
  const { latestData } = useBhoomiData();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isOnline = latestData && (new Date().getTime() - new Date(latestData.created_at).getTime()) < 60000;

  return (
    <div className="min-h-screen bg-earth-50 dark:bg-bhoomi-950 flex flex-col font-sans selection:bg-bhoomi-200">
      
      {/* Sticky Top Navbar */}
      <header className="sticky top-0 z-50 glass border-b-0 shadow-sm px-4 sm:px-6 lg:px-12 py-3 lg:py-4 flex items-center justify-between transition-all">
        <div className="flex items-center gap-4 lg:gap-8">
          {/* Hamburger Menu Button */}
          <button 
            className="xl:hidden p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>

          <Link to="/" className="flex items-center gap-2 lg:gap-3 group">
            <div className="bg-gradient-to-tr from-bhoomi-600 to-bhoomi-400 p-1.5 lg:p-2 rounded-xl text-white shadow-lg shadow-bhoomi-500/30 group-hover:scale-105 transition-transform">
              <Leaf size={20} className="lg:w-6 lg:h-6" />
            </div>
            <span className="text-lg lg:text-xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
              Bhoomi <span className="text-bhoomi-600 dark:text-bhoomi-400">AI</span>
            </span>
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-1 bg-white/40 dark:bg-slate-900/40 p-1 rounded-full border border-white/40 dark:border-slate-700/50">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    isActive 
                      ? 'bg-white dark:bg-slate-800 text-bhoomi-700 dark:text-bhoomi-300 shadow-sm' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/20'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <a href="/#contact" className="px-5 py-2 rounded-full text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/20 transition-all">Contact</a>
          </nav>
        </div>

        <div className="flex items-center gap-3 lg:gap-5">
          {/* Live Device Status Indicator */}
          <div className="hidden md:flex items-center gap-3 bg-white/50 dark:bg-slate-800/50 px-3 lg:px-4 py-1.5 lg:py-2 rounded-full border border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isOnline ? 'bg-bhoomi-400' : 'bg-red-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isOnline ? 'bg-bhoomi-500' : 'bg-red-500'}`}></span>
              </span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{isOnline ? 'Active' : 'Offline'}</span>
            </div>
            {isOnline && latestData && (
              <>
                <div className="hidden lg:block w-px h-4 bg-slate-300 dark:bg-slate-600"></div>
                <div className="hidden lg:flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <Wifi size={12} className={latestData.signal_strength > -70 ? 'text-bhoomi-500' : 'text-amber-500'} /> 
                  {latestData.signal_strength}dBm
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <Battery size={12} className={latestData.battery_level > 20 ? 'text-bhoomi-500' : 'text-red-500'} />
                  {Math.round(latestData.battery_level)}%
                </div>
              </>
            )}
          </div>
          
          <Link to="/dashboard" className="px-4 py-2 lg:px-6 lg:py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-medium hover:scale-105 hover:shadow-lg transition-all text-xs lg:text-sm whitespace-nowrap">
            Get Started
          </Link>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] xl:hidden"
            />
            
            {/* Drawer */}
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] sm:w-[320px] bg-white dark:bg-slate-900 z-[70] shadow-2xl flex flex-col xl:hidden"
            >
              <div className="p-4 sm:p-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 group">
                  <div className="bg-gradient-to-tr from-bhoomi-600 to-bhoomi-400 p-1.5 rounded-xl text-white shadow-lg">
                    <Leaf size={20} />
                  </div>
                  <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white font-display">
                    Bhoomi <span className="text-bhoomi-600 dark:text-bhoomi-400">AI</span>
                  </span>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`px-4 py-3.5 rounded-2xl text-base font-bold transition-all flex items-center ${
                        isActive 
                          ? 'bg-bhoomi-50 dark:bg-bhoomi-900/20 text-bhoomi-700 dark:text-bhoomi-400' 
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
                <a 
                  href="/#contact" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3.5 rounded-2xl text-base font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all flex items-center"
                >
                  Contact
                </a>
              </div>
              
              <div className="p-6 border-t border-slate-100 dark:border-slate-800">
                <Link to="/dashboard" className="flex items-center justify-center w-full min-h-[48px] bg-bhoomi-600 hover:bg-bhoomi-700 text-white rounded-xl font-bold transition-colors">
                  Go to Dashboard
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 relative flex flex-col">
        {/* Dynamic Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-bhoomi-300/10 dark:bg-bhoomi-900/20 blur-[100px] animate-blob"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-earth-300/20 dark:bg-earth-800/10 blur-[120px] animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative z-10 flex-1 flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="flex-1 w-full max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8 flex flex-col"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
