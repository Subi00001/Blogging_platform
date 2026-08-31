import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';

import { Home } from './pages/Home';
import { Explore } from './pages/Explore';
import { PostDetails } from './pages/PostDetails';
import { CreatePost } from './pages/CreatePost';
import { EditPost } from './pages/EditPost';
import { MyPosts } from './pages/MyPosts';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { AdminDashboard } from './pages/AdminDashboard';
import { Compass } from 'lucide-react';

const NotFound: React.FC = () => (
  <div className="py-20 text-center space-y-4 max-w-md mx-auto">
    <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
      <Compass className="w-8 h-8" />
    </div>
    <h1 className="text-3xl font-black text-slate-900 dark:text-white">Page Not Found</h1>
    <p className="text-sm text-slate-500 dark:text-slate-400">
      The page or article you are looking for might have been removed, had its name changed, or is temporarily unavailable.
    </p>
    <Link
      to="/"
      className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm"
    >
      Return to Home
    </Link>
  </div>
);

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased transition-colors duration-200">
          <Navbar />
          <ToastContainer />
          
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/posts/:id" element={<PostDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Author Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/create-post" element={<CreatePost />} />
                <Route path="/edit-post/:id" element={<EditPost />} />
                <Route path="/my-posts" element={<MyPosts />} />
                <Route path="/profile" element={<Profile />} />
              </Route>

              {/* Protected Admin Routes */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminDashboard />} />
              </Route>

              {/* Fallback */}
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}
