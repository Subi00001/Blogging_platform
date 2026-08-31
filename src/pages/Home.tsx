import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { IPost } from '../types';
import { BlogCard } from '../components/BlogCard';
import {
  PenSquare,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Compass,
  Zap,
  Users,
  MessageCircle,
} from 'lucide-react';

export const Home: React.FC = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [categories, setCategories] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchHomePosts = async () => {
      try {
        setLoading(true);
        const res = await api.get('/posts?limit=7');
        if (res.data.success) {
          setPosts(res.data.posts);
          setCategories(res.data.categories || {});
        }
      } catch (err) {
        console.error('Error fetching home posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomePosts();
  }, []);

  const featuredPost = posts.length > 0 ? posts[0] : null;
  const regularPosts = posts.slice(1);

  const popularCategories = [
    { name: 'Technology', desc: 'AI, Cloud & Computing', icon: Zap },
    { name: 'Programming', desc: 'React, Node & Architecture', icon: PenSquare },
    { name: 'Lifestyle', desc: 'Productivity & Wellness', icon: Sparkles },
    { name: 'Travel', desc: 'Itineraries & Guides', icon: Compass },
    { name: 'Education', desc: 'Learning & Career Advice', icon: TrendingUp },
  ];

  return (
    <div className="space-y-16 lg:space-y-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-12 sm:pb-16 bg-gradient-to-b from-indigo-50/50 via-white to-white dark:from-slate-900/60 dark:via-slate-900 dark:to-slate-900 rounded-3xl border border-indigo-100/50 dark:border-slate-800 p-6 sm:p-10 lg:p-14">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Empowering Authors & Readers Worldwide</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
            Share Your Ideas.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
              Inspire the World.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
            A modern, full-stack blogging platform where developers, creators, and thinkers publish their insights, engage in vibrant discussions, and discover captivating stories.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/create-post"
              id="hero-start-writing-btn"
              className="inline-flex items-center gap-2 px-6 py-3.5 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-lg shadow-indigo-600/25 transition-all hover:-translate-y-0.5"
            >
              <PenSquare className="w-5 h-5" />
              <span>Start Writing</span>
            </Link>

            <Link
              to="/explore"
              className="inline-flex items-center gap-2 px-6 py-3.5 text-base font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xs transition-all"
            >
              <Compass className="w-5 h-5 text-indigo-500" />
              <span>Explore All Posts</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Editorial Post */}
      {featuredPost && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                Featured Editorial
              </h2>
            </div>
            <Link
              to="/explore"
              className="text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>View More</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <BlogCard post={featuredPost} featured={true} />
        </section>
      )}

      {/* Category Pills & Highlights */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Browse by Topic
          </h2>
          <Link
            to="/explore"
            className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600"
          >
            All Categories
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {popularCategories.map((cat) => {
            const Icon = cat.icon;
            const count = categories[cat.name] || 0;
            return (
              <Link
                key={cat.name}
                to={`/explore?category=${encodeURIComponent(cat.name)}`}
                className="group p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all text-left flex flex-col justify-between space-y-3"
              >
                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {cat.desc}
                  </p>
                </div>
                <span className="text-[10px] font-semibold text-slate-400">
                  {count} {count === 1 ? 'article' : 'articles'}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Latest Blog Posts Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Latest Publications
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Fresh insights, tutorials, and stories published by our author community.
            </p>
          </div>
          <Link
            to="/explore"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
          >
            <span>Explore All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 space-y-4 animate-pulse"
              >
                <div className="aspect-16/10 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
                <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : regularPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <p className="text-slate-600 dark:text-slate-400">No blog posts found.</p>
          </div>
        )}

        <div className="text-center pt-6">
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-950/80 rounded-xl transition-colors border border-indigo-200 dark:border-indigo-800/80"
          >
            <span>View All Blog Posts</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Community Engagement Banner */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
            Join the Conversation
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Have a story, tutorial, or opinion to publish?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Create an account today to publish articles, receive real-time feedback in comments, and build your digital footprint.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              to="/register"
              className="px-5 py-2.5 text-sm font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition-colors"
            >
              Create Free Account
            </Link>
            <Link
              to="/create-post"
              className="px-5 py-2.5 text-sm font-bold text-indigo-300 hover:text-white bg-slate-800 hover:bg-slate-700/80 rounded-xl border border-slate-700 transition-colors"
            >
              Write First Post
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
