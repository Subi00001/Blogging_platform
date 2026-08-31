import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Edit3,
  Image as ImageIcon,
  Tag,
  FolderTree,
  FileText,
  Save,
  ArrowLeft,
} from 'lucide-react';

const CATEGORIES = [
  'Technology',
  'Programming',
  'Education',
  'Travel',
  'Lifestyle',
  'Health',
  'Entertainment',
  'Other',
];

export const EditPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAdmin, showToast } = useAuth();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Technology');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/posts/${id}`);
        if (res.data.success) {
          const post = res.data.post;

          // Check authorization: must be author or admin
          const authorId = typeof post.author === 'object' ? post.author._id : post.author;
          if (user && authorId !== user._id && !isAdmin) {
            showToast('You are not authorized to edit this post', 'error');
            navigate(`/posts/${id}`);
            return;
          }

          setTitle(post.title || '');
          setCategory(post.category || 'Technology');
          setImageUrl(post.image || '');
          setDescription(post.description || '');
          setContent(post.content || '');
          setTags(Array.isArray(post.tags) ? post.tags.join(', ') : '');
        }
      } catch (err: any) {
        showToast('Error loading post for editing', 'error');
        navigate('/explore');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id, user, isAdmin]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !category || !description.trim() || !content.trim()) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.put(`/posts/${id}`, {
        title: title.trim(),
        category,
        image: imageUrl.trim(),
        description: description.trim(),
        content: content.trim(),
        tags: tags.trim(),
      });

      if (res.data.success) {
        showToast('Post updated successfully!', 'success');
        navigate(`/posts/${id}`);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to update post';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center space-y-4">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm text-slate-500">Loading post data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Edit3 className="w-7 h-7 text-indigo-600" />
            Edit Blog Post
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Update your article details, imagery, or body content.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate(`/posts/${id}`)}
          className="text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Cancel & Return
        </button>
      </div>

      <form onSubmit={handleUpdate} className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <label htmlFor="edit-title" className="block text-sm font-bold text-slate-800 dark:text-slate-200">
            Article Title <span className="text-rose-500">*</span>
          </label>
          <input
            id="edit-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-base font-semibold text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Category & Tags Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="edit-category" className="block text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <FolderTree className="w-4 h-4 text-indigo-500" />
              Category <span className="text-rose-500">*</span>
            </label>
            <select
              id="edit-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="edit-tags" className="block text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-indigo-500" />
              Tags (comma separated)
            </label>
            <input
              id="edit-tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. AI, React, Design"
              className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Featured Image */}
        <div className="space-y-2">
          <label htmlFor="edit-image" className="block text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-indigo-500" />
            Featured Image URL
          </label>
          <input
            id="edit-image"
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {imageUrl && (
            <div className="mt-3 rounded-2xl overflow-hidden aspect-16/9 max-h-56 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <img
                src={imageUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Short Description */}
        <div className="space-y-2">
          <label htmlFor="edit-desc" className="block text-sm font-bold text-slate-800 dark:text-slate-200">
            Short Description / Abstract <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="edit-desc"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <label htmlFor="edit-content" className="block text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-indigo-500" />
            Full Blog Content <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="edit-content"
            rows={12}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm leading-relaxed text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => navigate(`/posts/${id}`)}
            disabled={submitting}
            className="px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-md shadow-indigo-600/25 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Update Post</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
