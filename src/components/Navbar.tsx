import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  PenSquare,
  BookOpen,
  User,
  ShieldCheck,
  LogOut,
  LogIn,
  UserPlus,
  Menu,
  X,
  Compass,
  FileText,
  Sparkles,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav id="app-navbar" className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group"
            id="nav-logo"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                BlogSpace
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  Full-Stack
                </span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/40'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Home
            </Link>
            <Link
              to="/explore"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/explore')
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/40'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Compass className="w-4 h-4" />
              Explore
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/create-post"
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/create-post')
                      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/40'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <PenSquare className="w-4 h-4 text-indigo-500" />
                  Create Post
                </Link>
                <Link
                  to="/my-posts"
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/my-posts')
                      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/40'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  My Posts
                </Link>
              </>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive('/admin')
                    ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60'
                    : 'text-amber-700 dark:text-amber-300 hover:bg-amber-50/60 dark:hover:bg-amber-950/30'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                Admin Dashboard
              </Link>
            )}
          </div>

          {/* Desktop Right Action Area */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  id="user-menu-button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200/80 dark:border-slate-700"
                >
                  <img
                    src={user?.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`}
                    alt={user?.name}
                    className="w-8 h-8 rounded-full object-cover border border-indigo-200 dark:border-indigo-800"
                  />
                  <div className="text-left hidden lg:block">
                    <span className="block text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                      {user?.name}
                    </span>
                    <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                      @{user?.username}
                    </span>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-20"
                      onClick={() => setUserDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-30 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                        <p className="text-xs text-slate-500 dark:text-slate-400">Signed in as</p>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                          {user?.email}
                        </p>
                        {user?.role === 'ADMIN' && (
                          <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                            ADMINISTRATOR
                          </span>
                        )}
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors"
                      >
                        <User className="w-4 h-4 text-slate-500" />
                        View Profile
                      </Link>

                      <Link
                        to="/create-post"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors"
                      >
                        <PenSquare className="w-4 h-4 text-indigo-500" />
                        Write an Article
                      </Link>

                      <Link
                        to="/my-posts"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors"
                      >
                        <FileText className="w-4 h-4 text-slate-500" />
                        My Publications
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          Admin Console
                        </Link>
                      )}

                      <div className="border-t border-slate-100 dark:border-slate-800 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-all shadow-indigo-600/20"
                >
                  <UserPlus className="w-4 h-4" />
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-6 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2.5 rounded-xl text-base font-medium ${
              isActive('/')
                ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-slate-700 dark:text-slate-200'
            }`}
          >
            Home
          </Link>
          <Link
            to="/explore"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2.5 rounded-xl text-base font-medium ${
              isActive('/explore')
                ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-slate-700 dark:text-slate-200'
            }`}
          >
            Explore Articles
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/create-post"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-xl text-base font-medium ${
                  isActive('/create-post')
                    ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'text-slate-700 dark:text-slate-200'
                }`}
              >
                Create New Post
              </Link>
              <Link
                to="/my-posts"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-xl text-base font-medium ${
                  isActive('/my-posts')
                    ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'text-slate-700 dark:text-slate-200'
                }`}
              >
                My Posts
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-xl text-base font-medium ${
                  isActive('/profile')
                    ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'text-slate-700 dark:text-slate-200'
                }`}
              >
                Profile ({user?.name})
              </Link>

              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-xl text-base font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40"
                >
                  Admin Dashboard
                </Link>
              )}

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-base font-semibold text-rose-600 dark:text-rose-400"
                >
                  Log Out
                </button>
              </div>
            </>
          ) : (
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-slate-700 dark:text-slate-200 font-medium rounded-xl border border-slate-200 dark:border-slate-700"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-white bg-indigo-600 font-semibold rounded-xl"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
