import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { IPost } from '../types';
import { BlogCard } from '../components/BlogCard';
import {
  User,
  Mail,
  Shield,
  Calendar,
  FileText,
  MessageSquare,
  Save,
  Sparkles,
  Camera,
} from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, updateUserProfile, showToast } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [userPosts, setUserPosts] = useState<IPost[]>([]);
  const [stats, setStats] = useState({ totalPosts: 0, totalComments: 0, totalViews: 0 });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'articles'>('profile');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setProfileImage(user.profileImage || '');
      setBio(user.bio || '');
    }

    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const [profRes, postRes] = await Promise.all([
          api.get('/auth/profile'),
          api.get('/posts/user/my-posts'),
        ]);

        if (profRes.data.success) {
          setStats(profRes.data.stats || { totalPosts: 0, totalComments: 0, totalViews: 0 });
        }
        if (postRes.data.success) {
          setUserPosts(postRes.data.posts);
        }
      } catch (err) {
        console.error('Error fetching profile data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Name cannot be empty', 'error');
      return;
    }

    try {
      setUpdating(true);
      await updateUserProfile({
        name: name.trim(),
        profileImage: profileImage.trim(),
        bio: bio.trim(),
      });
    } finally {
      setUpdating(false);
    }
  };

  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : 'Recently';

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header Profile Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative group">
            <img
              src={profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${name}`}
              alt={name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-indigo-100 dark:border-indigo-900/60 shadow-md"
            />
          </div>

          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {user?.name}
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  @{user?.username}
                </p>
              </div>

              <div className="flex items-center justify-center sm:justify-end gap-2">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                  user?.role === 'ADMIN'
                    ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                    : 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                }`}>
                  <Shield className="w-3.5 h-3.5" />
                  {user?.role === 'ADMIN' ? 'Administrator' : 'Author'}
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
              {user?.bio || 'No biography written yet.'}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-400 dark:text-slate-500 pt-2">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                {user?.email}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Joined {formattedDate}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 text-center">
          <div className="space-y-0.5">
            <p className="text-xs text-slate-400 uppercase font-semibold">Articles</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{stats.totalPosts}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-slate-400 uppercase font-semibold">Comments</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{stats.totalComments}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-slate-400 uppercase font-semibold">Total Views</p>
            <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{stats.totalViews}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'profile'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Edit Profile
        </button>
        <button
          onClick={() => setActiveTab('articles')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'articles'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Published Articles ({userPosts.length})
        </button>
      </div>

      {/* Tab 1: Edit Profile Form */}
      {activeTab === 'profile' && (
        <form onSubmit={handleUpdate} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Account Details
          </h2>

          <div className="space-y-2">
            <label htmlFor="profile-name" className="block text-sm font-bold text-slate-800 dark:text-slate-200">
              Display Name
            </label>
            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="profile-avatar" className="block text-sm font-bold text-slate-800 dark:text-slate-200">
              Avatar Image URL
            </label>
            <input
              id="profile-avatar"
              type="url"
              value={profileImage}
              onChange={(e) => setProfileImage(e.target.value)}
              placeholder="https://images.unsplash.com/... or DiceBear URL"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="profile-bio" className="block text-sm font-bold text-slate-800 dark:text-slate-200">
              Bio / About Me
            </label>
            <textarea
              id="profile-bio"
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell readers about yourself, your tech stack, or interests..."
              className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="submit"
              disabled={updating}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-md shadow-indigo-600/25 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{updating ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: User Published Articles */}
      {activeTab === 'articles' && (
        <div className="space-y-6">
          {userPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userPosts.map((post) => (
                <BlogCard key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <FileText className="w-10 h-10 mx-auto text-slate-400 mb-2" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                You haven't written any articles yet.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
