import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { IPost } from '../types';
import { BlogCard } from '../components/BlogCard';
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X,
  FileQuestion,
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Technology',
  'Programming',
  'Education',
  'Travel',
  'Lifestyle',
  'Health',
  'Entertainment',
  'Other',
];

export const Explore: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);

  // Filter States
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || 'All';
  const sort = searchParams.get('sort') || 'latest';
  const tag = searchParams.get('tag') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value && value !== 'All') {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    // reset to page 1 on filter changes except for page
    if (key !== 'page') {
      next.set('page', '1');
    }
    setSearchParams(next);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParam('search', searchInput.trim());
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  useEffect(() => {
    const fetchFilteredPosts = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams();
        if (search) queryParams.set('search', search);
        if (category && category !== 'All') queryParams.set('category', category);
        if (tag) queryParams.set('tag', tag);
        if (sort) queryParams.set('sort', sort);
        queryParams.set('page', page.toString());
        queryParams.set('limit', '9');

        const res = await api.get(`/posts?${queryParams.toString()}`);
        if (res.data.success) {
          setPosts(res.data.posts);
          setTotalPages(res.data.totalPages || 1);
          setTotalCount(res.data.totalPosts || 0);
        }
      } catch (err) {
        console.error('Error fetching explore posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredPosts();
  }, [search, category, sort, tag, page]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Explore Articles
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1">
          Search across all categories, authors, and topics to find your next great read.
        </p>
      </div>

      {/* Search & Sort Controls Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="md:col-span-8 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              id="search-input"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by title, author name, or content keyword..."
              className="w-full pl-10 pr-24 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput('');
                  updateParam('search', '');
                }}
                className="absolute right-14 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
            >
              Search
            </button>
          </form>

          {/* Sort Dropdown */}
          <div className="md:col-span-4 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0" />
            <label htmlFor="sort-select" className="text-xs font-semibold text-slate-500 shrink-0">
              Sort:
            </label>
            <select
              id="sort-select"
              value={sort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="w-full py-2.5 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            >
              <option value="latest">Latest Published</option>
              <option value="oldest">Oldest First</option>
              <option value="comments">Most Commented</option>
              <option value="views">Most Viewed</option>
            </select>
          </div>
        </div>

        {/* Category Pills Slider */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {CATEGORIES.map((cat) => {
            const isSelected = category === cat || (cat === 'All' && !searchParams.get('category'));
            return (
              <button
                key={cat}
                type="button"
                onClick={() => updateParam('category', cat)}
                className={`px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Active Filters Display */}
        {(search || (category && category !== 'All') || tag) && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <span className="text-slate-500 font-medium">Active filters:</span>
            {search && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-medium">
                Keyword: "{search}"
                <button onClick={() => updateParam('search', '')} className="hover:text-indigo-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {category && category !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-medium">
                Category: {category}
                <button onClick={() => updateParam('category', 'All')} className="hover:text-indigo-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {tag && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-medium">
                Tag: #{tag}
                <button onClick={() => updateParam('tag', '')} className="hover:text-indigo-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={handleClearFilters}
              className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline ml-auto"
            >
              Reset All
            </button>
          </div>
        )}
      </div>

      {/* Posts Count Summary */}
      <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
        <span>Showing {posts.length} of {totalCount} articles</span>
        <span>Page {page} of {totalPages}</span>
      </div>

      {/* Grid of Posts */}
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
            </div>
          ))}
        </div>
      ) : posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-4">
          <FileQuestion className="w-12 h-12 mx-auto text-slate-400" />
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              No matching articles found
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              We couldn't find any blog posts matching your search query or filters. Try adjusting your keywords or clearing the category filter.
            </p>
          </div>
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <button
            onClick={() => updateParam('page', (page - 1).toString())}
            disabled={page <= 1}
            className="flex items-center gap-1 px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => updateParam('page', p.toString())}
                className={`w-8 h-8 rounded-xl text-xs font-bold transition-colors ${
                  page === p
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            onClick={() => updateParam('page', (page + 1).toString())}
            disabled={page >= totalPages}
            className="flex items-center gap-1 px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
