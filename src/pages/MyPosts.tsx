import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { IPost } from '../types';
import { useAuth } from '../context/AuthContext';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import {
  FileText,
  PenSquare,
  Eye,
  MessageSquare,
  Calendar,
  Edit2,
  Trash2,
  ExternalLink,
  Plus,
} from 'lucide-react';

export const MyPosts: React.FC = () => {
  const { user, showToast } = useAuth();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [postToDelete, setPostToDelete] = useState<IPost | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const fetchMyPosts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/posts/user/my-posts');
      if (res.data.success) {
        setPosts(res.data.posts);
      }
    } catch (err: any) {
      showToast('Error loading your publications', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const handleDelete = async () => {
    if (!postToDelete) return;
    try {
      setIsDeleting(true);
      const res = await api.delete(`/posts/${postToDelete._id}`);
      if (res.data.success) {
        setPosts((prev) => prev.filter((p) => p._id !== postToDelete._id));
        showToast('Post deleted successfully.', 'success');
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to delete post', 'error');
    } finally {
      setIsDeleting(false);
      setPostToDelete(null);
    }
  };

  const totalViews = posts.reduce((acc, p) => acc + (p.views || 0), 0);
  const totalComments = posts.reduce((acc, p) => acc + (p.commentsCount || 0), 0);

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <FileText className="w-7 h-7 text-indigo-600" />
            My Publications
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your articles, review engagement stats, and create new posts.
          </p>
        </div>
        <Link
          to="/create-post"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-md shadow-indigo-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Post</span>
        </Link>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-1">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Articles</p>
          <p className="text-2xl font-black text-slate-900 dark:text-slate-100">{posts.length}</p>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-1">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Lifetime Views</p>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{totalViews}</p>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-1">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Comments Received</p>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{totalComments}</p>
        </div>
      </div>

      {/* Posts List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-pulse space-y-3">
              <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-4">
          <PenSquare className="w-12 h-12 mx-auto text-slate-400" />
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              You haven't written any posts yet
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Share your insights, code tutorials, or personal stories with the community.
            </p>
          </div>
          <Link
            to="/create-post"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Create Your First Post
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post._id}
              className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4 min-w-0 flex-1">
                {post.image ? (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-20 h-20 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0 hidden sm:block"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0 hidden sm:flex">
                    <FileText className="w-6 h-6" />
                  </div>
                )}

                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                      {post.category}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <Link
                    to={`/posts/${post._id}`}
                    className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors block truncate"
                  >
                    {post.title}
                  </Link>

                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {post.views} views
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      {post.commentsCount || 0} comments
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end md:self-auto shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800 w-full md:w-auto justify-end">
                <Link
                  to={`/posts/${post._id}`}
                  className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-xl transition-colors"
                  title="View Article"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
                <Link
                  to={`/edit-post/${post._id}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Edit</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setPostToDelete(post)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 rounded-xl transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!postToDelete}
        title="Delete Blog Post"
        message={`Are you sure you want to delete "${postToDelete?.title}"? All comments will also be permanently removed.`}
        onConfirm={handleDelete}
        onCancel={() => setPostToDelete(null)}
        isLoading={isDeleting}
      />
    </div>
  );
};
