import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IComment } from '../types';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { CommentItem } from './Comment';
import { MessageSquare, Send, LogIn } from 'lucide-react';

interface CommentSectionProps {
  postId: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const { user, isAuthenticated, showToast } = useAuth();
  const [comments, setComments] = useState<IComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/posts/${postId}/comments`);
      if (res.data.success) {
        setComments(res.data.comments);
      }
    } catch (err: any) {
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) {
      showToast('Comment cannot be empty', 'error');
      return;
    }

    if (commentText.trim().length > 1000) {
      showToast('Comment cannot exceed 1000 characters', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post(`/posts/${postId}/comments`, { content: commentText.trim() });
      if (res.data.success) {
        setComments([res.data.comment, ...comments]);
        setCommentText('');
        showToast('Comment posted successfully!', 'success');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to post comment';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateComment = async (id: string, content: string): Promise<boolean> => {
    try {
      const res = await api.put(`/comments/${id}`, { content });
      if (res.data.success) {
        setComments((prev) =>
          prev.map((c) => (c._id === id ? { ...c, content, updatedAt: new Date().toISOString() } : c))
        );
        showToast('Comment updated', 'success');
        return true;
      }
      return false;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to update comment';
      showToast(msg, 'error');
      return false;
    }
  };

  const handleDeleteComment = async (id: string): Promise<boolean> => {
    try {
      const res = await api.delete(`/comments/${id}`);
      if (res.data.success) {
        setComments((prev) => prev.filter((c) => c._id !== id));
        showToast('Comment deleted', 'info');
        return true;
      }
      return false;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to delete comment';
      showToast(msg, 'error');
      return false;
    }
  };

  return (
    <section id="comments-section" className="mt-12 pt-10 border-t border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
          <MessageSquare className="w-5 h-5" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
          Discussion ({comments.length})
        </h3>
      </div>

      {/* Add Comment Input Form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all">
            <div className="flex items-center gap-2.5 mb-3">
              <img
                src={user?.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`}
                alt={user?.name}
                className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700"
              />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Commenting as <strong className="text-indigo-600 dark:text-indigo-400">{user?.name}</strong>
              </span>
            </div>

            <textarea
              id="comment-input"
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="What are your thoughts on this article? Be respectful and constructive..."
              className="w-full bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none resize-none leading-relaxed"
              maxLength={1000}
            />

            <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100 dark:border-slate-800">
              <span className={`text-xs ${commentText.length > 900 ? 'text-amber-500' : 'text-slate-400'}`}>
                {commentText.length} / 1000 characters
              </span>
              <button
                type="submit"
                disabled={submitting || !commentText.trim()}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Posting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Post Comment</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-6 rounded-2xl bg-indigo-50/50 dark:bg-slate-900 border border-indigo-100 dark:border-slate-800 text-center space-y-3">
          <p className="text-sm text-slate-700 dark:text-slate-300">
            Join the conversation! Please log in or create an account to leave a comment.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm"
            >
              <LogIn className="w-3.5 h-3.5" /> Sign In to Comment
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      )}

      {/* Comments Listing */}
      {loading ? (
        <div className="space-y-4 py-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
              </div>
              <div className="h-3 w-3/4 bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="py-12 text-center p-8 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <MessageSquare className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            No comments yet.
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Be the first to share your thoughts on this story!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((c) => (
            <CommentItem
              key={c._id}
              comment={c}
              onUpdate={handleUpdateComment}
              onDelete={handleDeleteComment}
            />
          ))}
        </div>
      )}
    </section>
  );
};
