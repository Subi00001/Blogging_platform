import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Github, Heart, MessageSquare, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer id="app-footer" className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & Mission */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                BlogSpace
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Share Your Ideas. Inspire the World. A full-stack publishing platform with real-time comments, role-based controls, and modern content discovery.
            </p>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home Feed
                </Link>
              </li>
              <li>
                <Link to="/explore" className="hover:text-white transition-colors">
                  All Articles
                </Link>
              </li>
              <li>
                <Link to="/explore?category=Technology" className="hover:text-white transition-colors">
                  Technology & AI
                </Link>
              </li>
              <li>
                <Link to="/explore?category=Programming" className="hover:text-white transition-colors">
                  Software Engineering
                </Link>
              </li>
              <li>
                <Link to="/explore?category=Lifestyle" className="hover:text-white transition-colors">
                  Lifestyle & Wellness
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Account */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Authors
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/create-post" className="hover:text-white transition-colors">
                  Write a Post
                </Link>
              </li>
              <li>
                <Link to="/my-posts" className="hover:text-white transition-colors">
                  Author Dashboard
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-white transition-colors">
                  User Profile
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition-colors">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Tech Stack Info for Academic Project */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Stack & Architecture
            </h4>
            <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700/60 space-y-2.5 text-xs text-slate-400">
              <div className="flex items-center justify-between">
                <span>Frontend:</span>
                <span className="font-semibold text-slate-200">React 19 + Tailwind</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Backend:</span>
                <span className="font-semibold text-slate-200">Node.js + Express</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Database:</span>
                <span className="font-semibold text-slate-200">MongoDB / Mongoose</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Auth:</span>
                <span className="font-semibold text-slate-200">JWT + bcrypt</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} BlogSpace. Full-Stack Web Development Project.</p>
          <div className="flex items-center gap-2">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for Full-Stack Learning</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
