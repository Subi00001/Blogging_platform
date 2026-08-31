import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { IUser, IPost, IComment } from '../types';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import {
  ShieldAlert,
  Users,
  FileText,
  MessageSquare,
  Eye,
  Trash2,
  Shield,
  UserCheck,
  RefreshCw,
  ExternalLink,
  Search,
  Layers,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user: currentUser, showToast } = useAuth();

  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<IUser[]>([]);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [comments, setComments] = useState<IComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'posts' | 'comments'>('overview');

  // Search filters
  const [userSearch, setUserSearch] = useState('');
  const [postSearch, setPostSearch] = useState('');
  const [commentSearch, setCommentSearch] = useState('');

  // Delete modal state
  const [deleteItem, setDeleteItem] = useState<{ type: 'user' | 'post' | 'comment'; id: string; title?: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, postsRes, commentsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/posts'),
        api.get('/admin/comments'),
      ]);

      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (usersRes.data.success) setUsers(usersRes.data.users);
      if (postsRes.data.success) setPosts(postsRes.data.posts);
      if (commentsRes.data.success) setComments(commentsRes.data.comments);
    } catch (err: any) {
      showToast('Error loading admin panel data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Role toggle
  const handleToggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    try {
      const res = await api.put(`/admin/users/${userId}/role`, { role: newRole });
      if (res.data.success) {
        setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role: newRole as any } : u)));
        showToast(`User role updated to ${newRole}`, 'success');
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to update user role', 'error');
    }
  };

  // Delete item handler
  const handleConfirmDelete = async () => {
    if (!deleteItem) return;
    try {
      setIsDeleting(true);
      if (deleteItem.type === 'user') {
        const res = await api.delete(`/admin/users/${deleteItem.id}`);
        if (res.data.success) {
          setUsers((prev) => prev.filter((u) => u._id !== deleteItem.id));
          showToast('User and their data deleted successfully', 'success');
        }
      } else if (deleteItem.type === 'post') {
        const res = await api.delete(`/admin/posts/${deleteItem.id}`);
        if (res.data.success) {
          setPosts((prev) => prev.filter((p) => p._id !== deleteItem.id));
          showToast('Post deleted successfully', 'success');
        }
      } else if (deleteItem.type === 'comment') {
        const res = await api.delete(`/admin/comments/${deleteItem.id}`);
        if (res.data.success) {
          setComments((prev) => prev.filter((c) => c._id !== deleteItem.id));
          showToast('Comment deleted successfully', 'success');
        }
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Deletion failed', 'error');
    } finally {
      setIsDeleting(false);
      setDeleteItem(null);
    }
  };

  // Seed / Reset Database Handler
  const handleSeedDatabase = async () => {
    if (!window.confirm('Reset database with pre-populated college demonstration articles and sample accounts?')) {
      return;
    }
    try {
      setSeeding(true);
      const res = await api.post('/admin/seed');
      if (res.data.success) {
        showToast('Database reset and seeded successfully!', 'success');
        await fetchDashboardData();
      }
    } catch (err: any) {
      showToast('Error seeding database', 'error');
    } finally {
      setSeeding(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.username.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredPosts = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(postSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(postSearch.toLowerCase())
  );

  const filteredComments = comments.filter(
    (c) =>
      c.content.toLowerCase().includes(commentSearch.toLowerCase()) ||
      (typeof c.user === 'object' && (c.user as IUser)?.name.toLowerCase().includes(commentSearch.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm font-semibold text-slate-500">Loading Administrator Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Admin Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              <ShieldAlert className="w-3.5 h-3.5" />
              Administrator Control Center
            </span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            System Administration
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Manage users, moderate publications, supervise discussions, and monitor system metrics.
          </p>
        </div>

        {/* Database reset button */}
        <button
          onClick={handleSeedDatabase}
          disabled={seeding}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-all shadow-xs self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-indigo-500 ${seeding ? 'animate-spin' : ''}`} />
          <span>{seeding ? 'Seeding...' : 'Reset & Seed Demo Data'}</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Registered Users</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-slate-100">{stats?.totalUsers || users.length}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Published Posts</span>
            <FileText className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-slate-100">{stats?.totalPosts || posts.length}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Total Comments</span>
            <MessageSquare className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-slate-100">{stats?.totalComments || comments.length}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Article Views</span>
            <Eye className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-slate-100">{stats?.totalViews || 0}</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'overview'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Layers className="w-4 h-4" /> Overview & Categories
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'users'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Users className="w-4 h-4" /> User Management ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('posts')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'posts'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <FileText className="w-4 h-4" /> Blog Moderation ({posts.length})
        </button>
        <button
          onClick={() => setActiveTab('comments')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'comments'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <MessageSquare className="w-4 h-4" /> Comments ({comments.length})
        </button>
      </div>

      {/* Tab 1: Overview & Category Breakdown */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category Distribution */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Content by Category
            </h3>
            <div className="space-y-3">
              {stats?.categoryCounts &&
                Object.entries(stats.categoryCounts).map(([cat, count]: [string, any]) => (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-700 dark:text-slate-300">{cat}</span>
                      <span className="text-slate-500">{count} posts</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: `${Math.min(100, (count / Math.max(1, posts.length)) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Recent Activity Summary */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              System Architecture & Status
            </h3>
            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 space-y-1">
                <p className="font-bold text-slate-900 dark:text-slate-100">Full-Stack Implementation</p>
                <p>Express REST API backend with JSON-backed persistence, JWT authentication, and bcrypt encryption.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 space-y-1">
                <p className="font-bold text-slate-900 dark:text-slate-100">Role-Based Access Control</p>
                <p>Granular route protection for normal authors vs system administrators.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 space-y-1">
                <p className="font-bold text-slate-900 dark:text-slate-100">Interactive Comments & Views</p>
                <p>Real-time CRUD operations on posts and nested user discussions with time-ago tracking.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Users Management */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Filter users by name or email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">User</th>
                    <th className="py-3.5 px-4">Email</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Registered</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredUsers.map((u) => {
                    const isSelf = currentUser?._id === u._id;
                    return (
                      <tr key={u._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={u.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${u.name}`}
                              alt={u.name}
                              className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                            />
                            <div>
                              <p className="font-bold text-slate-900 dark:text-slate-100">{u.name}</p>
                              <p className="text-slate-400">@{u.username}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 font-mono">{u.email}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                              u.role === 'ADMIN'
                                ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {u.role === 'ADMIN' ? <Shield className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {!isSelf && (
                              <>
                                <button
                                  onClick={() => handleToggleRole(u._id, u.role)}
                                  className="px-2.5 py-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 rounded-lg transition-colors"
                                  title="Change Role"
                                >
                                  {u.role === 'ADMIN' ? 'Make Author' : 'Promote to Admin'}
                                </button>
                                <button
                                  onClick={() => setDeleteItem({ type: 'user', id: u._id, title: u.name })}
                                  className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                                  title="Delete User"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                            {isSelf && <span className="text-[11px] text-slate-400 italic">Current User</span>}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Posts Moderation */}
      {activeTab === 'posts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Filter posts by title or category..."
                value={postSearch}
                onChange={(e) => setPostSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Title</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Author</th>
                    <th className="py-3.5 px-4">Views</th>
                    <th className="py-3.5 px-4">Comments</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredPosts.map((p) => {
                    const author = typeof p.author === 'object' ? (p.author as IUser) : null;
                    return (
                      <tr key={p._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="py-3.5 px-4 max-w-xs truncate font-bold text-slate-900 dark:text-slate-100">
                          {p.title}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                            {p.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                          {author?.name || 'Author'}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">{p.views || 0}</td>
                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">{p.commentsCount || 0}</td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              to={`/posts/${p._id}`}
                              className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-lg transition-colors"
                              title="View Article"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                            <button
                              onClick={() => setDeleteItem({ type: 'post', id: p._id, title: p.title })}
                              className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                              title="Delete Post"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Comments Moderation */}
      {activeTab === 'comments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Filter comments content..."
                value={commentSearch}
                onChange={(e) => setCommentSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Author</th>
                    <th className="py-3.5 px-4">Comment Snippet</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredComments.map((c) => {
                    const cUser = typeof c.user === 'object' ? (c.user as IUser) : null;
                    return (
                      <tr key={c._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">
                          {cUser?.name || 'User'}
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 max-w-md truncate">
                          "{c.content}"
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              to={`/posts/${c.post}`}
                              className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-lg transition-colors"
                              title="Go to Post"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                            <button
                              onClick={() => setDeleteItem({ type: 'comment', id: c._id })}
                              className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                              title="Delete Comment"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteItem}
        title={`Delete ${deleteItem?.type ? deleteItem.type.toUpperCase() : 'Item'}`}
        message={`Are you sure you want to delete this ${deleteItem?.type || 'item'}${
          deleteItem?.title ? ` ("${deleteItem.title}")` : ''
        }? This action is irreversible.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteItem(null)}
        isLoading={isDeleting}
      />
    </div>
  );
};
