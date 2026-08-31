import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IPost, IUser } from '../types';
import { MessageSquare, Eye, Calendar, ArrowRight, User } from 'lucide-react';

interface BlogCardProps {
  post: IPost;
  featured?: boolean;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post, featured = false }) => {
  const [imgError, setImgError] = useState(false);

  const author = typeof post.author === 'object' ? (post.author as IUser) : null;
  const authorName = author?.name || 'BlogSpace Author';
  const authorUsername = author?.username || 'author';
  const authorAvatar = author?.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${authorName}`;

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Calculate estimated reading time
  const wordCount = (post.content || '').split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  const categoryColors: { [key: string]: string } = {
    Technology: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
    Programming: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
    Education: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800',
    Travel: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
    Lifestyle: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800',
    Health: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800',
    Entertainment: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800',
    Other: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  };

  const badgeStyle = categoryColors[post.category] || categoryColors['Other'];

  const fallbackImage = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80';

  if (featured) {
    return (
      <div className="relative group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-xl hover:shadow-2xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-0">
        <div className="lg:col-span-7 relative overflow-hidden min-h-[280px] lg:min-h-[420px]">
          <img
            src={imgError || !post.image ? fallbackImage : post.image}
            alt={post.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-4 left-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${badgeStyle}`}>
              {post.category}
            </span>
          </div>
        </div>

        <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {formattedDate}
              </span>
              <span>•</span>
              <span>{readTime} min read</span>
            </div>

            <Link to={`/posts/${post._id}`} className="block group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
                {post.title}
              </h2>
            </Link>

            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed line-clamp-3">
              {post.description}
            </p>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {post.tags.slice(0, 3).map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-medium px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={authorAvatar}
                alt={authorName}
                className="w-10 h-10 rounded-full object-cover border border-indigo-200 dark:border-indigo-800"
              />
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">
                  {authorName}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">@{authorUsername}</p>
              </div>
            </div>

            <Link
              to={`/posts/${post._id}`}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors group/btn"
            >
              <span>Read Article</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <article className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200/90 dark:border-slate-800/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
      {/* Featured Image */}
      <div className="relative overflow-hidden aspect-16/10 bg-slate-100 dark:bg-slate-800">
        <img
          src={imgError || !post.image ? fallbackImage : post.image}
          alt={post.title}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border backdrop-blur-md shadow-xs ${badgeStyle}`}>
            {post.category}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formattedDate}
            </span>
            <span>{readTime} min read</span>
          </div>

          <Link to={`/posts/${post._id}`} className="block group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 leading-snug line-clamp-2">
              {post.title}
            </h3>
          </Link>

          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-2">
            {post.description}
          </p>
        </div>

        {/* Author and Engagement Meta */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={authorAvatar}
              alt={authorName}
              className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
            />
            <div className="truncate">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block truncate">
                {authorName}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-400 shrink-0">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {post.views || 0}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5" />
              {post.commentsCount !== undefined ? post.commentsCount : 0}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};
