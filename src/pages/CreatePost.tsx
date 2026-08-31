import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  PenSquare,
  Image as ImageIcon,
  Tag,
  FolderTree,
  FileText,
  Sparkles,
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

const PRESET_IMAGES = [
  { label: 'Technology', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Coding', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Education', url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Travel', url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Lifestyle', url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80' },
];

export const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useAuth();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Technology');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!title.trim() || !category || !description.trim() || !content.trim()) {
      showToast('Please fill in all required fields (Title, Category, Description, Content)', 'error');
      return;
    }

    if (title.trim().length < 5) {
      showToast('Title must be at least 5 characters', 'error');
      return;
    }

    if (content.trim().length < 20) {
      showToast('Content must be at least 20 characters', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post('/posts', {
        title: title.trim(),
        category,
        image: imageUrl.trim(),
        description: description.trim(),
        content: content.trim(),
        tags: tags.trim(),
      });

      if (res.data.success) {
        showToast('Blog post published successfully!', 'success');
        navigate(`/posts/${res.data.post._id}`);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to publish post';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <PenSquare className="w-7 h-7 text-indigo-600" />
            Create New Blog Post
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Write your insights and publish them for the global reader community.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <label htmlFor="post-title" className="block text-sm font-bold text-slate-800 dark:text-slate-200">
            Article Title <span className="text-rose-500">*</span>
          </label>
          <input
            id="post-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. How Artificial Intelligence is Changing Education"
            required
            className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-base font-semibold text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Category & Tags Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category Selector */}
          <div className="space-y-2">
            <label htmlFor="post-category" className="block text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <FolderTree className="w-4 h-4 text-indigo-500" />
              Category <span className="text-rose-500">*</span>
            </label>
            <select
              id="post-category"
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

          {/* Tags */}
          <div className="space-y-2">
            <label htmlFor="post-tags" className="block text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-indigo-500" />
              Tags (comma separated)
            </label>
            <input
              id="post-tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. AI, Education, Technology, EdTech"
              className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Featured Image URL */}
        <div className="space-y-2">
          <label htmlFor="post-image" className="block text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-indigo-500" />
            Featured Image URL
          </label>
          <div className="flex gap-2">
            <input
              id="post-image"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/... (optional)"
              className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Preset image suggestions */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-slate-400 font-medium">Quick sample images:</span>
            {PRESET_IMAGES.map((img) => (
              <button
                key={img.label}
                type="button"
                onClick={() => setImageUrl(img.url)}
                className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
              >
                {img.label}
              </button>
            ))}
          </div>

          {/* Live Image Preview */}
          {imageUrl && (
            <div className="mt-3 rounded-2xl overflow-hidden aspect-16/9 max-h-56 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <img
                src={imageUrl}
                alt="Preview"
                onError={() => showToast('Invalid image URL', 'error')}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Short Description */}
        <div className="space-y-2">
          <label htmlFor="post-desc" className="block text-sm font-bold text-slate-800 dark:text-slate-200">
            Short Description / Abstract <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="post-desc"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief summary that appears on blog cards and search results..."
            required
            className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>

        {/* Full Blog Content */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="post-content" className="block text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-indigo-500" />
              Full Blog Content <span className="text-rose-500">*</span>
            </label>
            <span className="text-xs text-slate-400">
              Markdown supported (### Section Title, ```code blocks)
            </span>
          </div>
          <textarea
            id="post-content"
            rows={12}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your complete article content here. You can use markdown headers like ### Heading, lists, and code blocks..."
            required
            className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm leading-relaxed text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
          />
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => navigate(-1)}
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
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Publish Blog Post</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
