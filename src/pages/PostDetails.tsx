import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { IPost, IUser } from '../types';
import { useAuth } from '../context/AuthContext';
import { CommentSection } from '../components/CommentSection';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import {
  Calendar,
  Clock,
  Eye,
  MessageSquare,
  Edit2,
  Trash2,
  Share2,
  Check,
  ArrowLeft,
  Tag,
  Shield,
  Linkedin,
  Twitter,
} from 'lucide-react';

export const PostDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser, isAdmin, showToast } = useAuth();

  const [post, setPost] = useState<IPost | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [relatedPosts, setRelatedPosts] = useState<IPost[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/posts/${id}`);
        if (res.data.success) {
          setPost(res.data.post);

          // Fetch related posts in the same category
          if (res.data.post.category) {
            const relRes = await api.get(`/posts?category=${encodeURIComponent(res.data.post.category)}&limit=4`);
            if (relRes.data.success) {
              setRelatedPosts(relRes.data.posts.filter((p: IPost) => p._id !== id).slice(0, 3));
            }
          }
        }
      } catch (err: any) {
        console.error('Error loading post:', err);
        showToast('Blog post not found or removed', 'error');
        navigate('/explore');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPostData();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-16 space-y-6">
        <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
        <div className="h-10 w-3/4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
        <div className="aspect-16/9 bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse"></div>
        <div className="space-y-3 pt-6">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-4/6"></div>
        </div>
      </div>
    );
  }

  if (!post) return null;

  const author = typeof post.author === 'object' ? (post.author as IUser) : null;
  const authorId = author?._id || (post.author as string);
  const authorName = author?.name || 'BlogSpace Author';
  const authorUsername = author?.username || 'author';
  const authorAvatar = author?.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${authorName}`;
  const authorBio = author?.bio || 'Prolific writer and thinker contributing to BlogSpace.';

  const isOwner = currentUser && currentUser._id === authorId;
  const canModify = isOwner || isAdmin;

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const wordCount = (post.content || '').split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    showToast('Article link copied to clipboard!', 'info');
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleShareTwitter = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out "${post.title}" on BlogSpace!`);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
  };

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

  const handleDeletePost = async () => {
    try {
      setIsDeleting(true);
      const res = await api.delete(`/posts/${post._id}`);
      if (res.data.success) {
        showToast('Post deleted successfully.', 'success');
        navigate('/explore');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to delete post';
      showToast(msg, 'error');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16">
      {/* Back Button */}
      <div>
        <Link
          to="/explore"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Articles</span>
        </Link>
      </div>

      {/* Header Meta */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            {post.category}
          </span>
          <span className="text-xs text-slate-400">•</span>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {readTime} min read
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          {post.title}
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          {post.description}
        </p>

        {/* Author Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-y border-slate-200 dark:border-slate-800 py-4">
          <div className="flex items-center gap-3">
            <img
              src={authorAvatar}
              alt={authorName}
              className="w-11 h-11 rounded-full object-cover border border-indigo-200 dark:border-indigo-800"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {authorName}
                </span>
                {author?.role === 'ADMIN' && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                    <Shield className="w-3 h-3" /> Admin
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {formattedDate}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {post.views} views
                </span>
              </div>
            </div>
          </div>

          {/* Action Bar (Edit/Delete or Share) */}
          <div className="flex items-center gap-2">
            {canModify && (
              <div className="flex items-center gap-2 mr-2 pr-2 border-r border-slate-200 dark:border-slate-800">
                <Link
                  to={`/edit-post/${post._id}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
                  title="Edit Post"
                >
                  <Edit2 className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Edit</span>
                </Link>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-950/80 rounded-xl transition-colors"
                  title="Delete Post"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            )}

            {/* Social Sharing Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCopyLink}
                className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                title="Copy Article Link"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
              </button>
              <button
                onClick={handleShareTwitter}
                className="p-2 text-slate-500 hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-950/40 rounded-xl transition-colors"
                title="Share to Twitter / X"
              >
                <Twitter className="w-4 h-4" />
              </button>
              <button
                onClick={handleShareLinkedIn}
                className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-xl transition-colors"
                title="Share to LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Banner Image */}
      {post.image && (
        <div className="relative rounded-3xl overflow-hidden aspect-16/9 bg-slate-100 dark:bg-slate-800 shadow-md">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Main Blog Article Content */}
      <div className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 leading-relaxed space-y-6 text-base sm:text-lg">
        {post.content.split('\n\n').map((paragraph, idx) => {
          if (paragraph.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 pt-4">
                {paragraph.replace('### ', '')}
              </h3>
            );
          }
          if (paragraph.startsWith('## ')) {
            return (
              <h2 key={idx} className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 pt-6">
                {paragraph.replace('## ', '')}
              </h2>
            );
          }
          if (paragraph.startsWith('```')) {
            const cleanCode = paragraph.replace(/```[a-z]*\n?/g, '').replace(/```/g, '');
            return (
              <pre key={idx} className="p-4 bg-slate-900 text-slate-100 rounded-2xl overflow-x-auto text-xs sm:text-sm font-mono border border-slate-800">
                <code>{cleanCode}</code>
              </pre>
            );
          }
          return (
            <p key={idx} className="whitespace-pre-line leading-relaxed">
              {paragraph}
            </p>
          );
        })}
      </div>

      {/* Tags Section */}
      {post.tags && post.tags.length > 0 && (
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Tag className="w-3 h-3" /> Tags:
            </span>
            {post.tags.map((tag, i) => (
              <Link
                key={i}
                to={`/explore?tag=${encodeURIComponent(tag)}`}
                className="text-xs font-semibold px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Author Bio Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
        <img
          src={authorAvatar}
          alt={authorName}
          className="w-16 h-16 rounded-full object-cover border-2 border-indigo-300 dark:border-indigo-700 shadow-sm shrink-0"
        />
        <div className="space-y-2 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Written by {authorName}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">@{authorUsername}</p>
            </div>
            <Link
              to={`/explore?search=${encodeURIComponent(authorName)}`}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              View all posts by {authorName} →
            </Link>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {authorBio}
          </p>
        </div>
      </div>

      {/* Interactive Comments Section */}
      <CommentSection postId={post._id} />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        title="Delete Blog Post"
        message="Are you sure you want to delete this post? All comments associated with this post will also be deleted. This action cannot be undone."
        onConfirm={handleDeletePost}
        onCancel={() => setShowDeleteModal(false)}
        isLoading={isDeleting}
      />
    </div>
  );
};
