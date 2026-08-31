import React, { useState } from 'react';
import { IComment, IUser } from '../types';
import { useAuth } from '../context/AuthContext';
import { Edit2, Trash2, Check, X, Shield, Clock } from 'lucide-react';
import { DeleteConfirmModal } from './DeleteConfirmModal';

interface CommentItemProps {
  comment: IComment;
  onUpdate: (id: string, content: string) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
}

export const CommentItem: React.FC<CommentItemProps> = ({ comment, onUpdate, onDelete }) => {
  const { user: currentUser, isAdmin } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const commentUser = comment.user as IUser;
  const isOwner = currentUser && (currentUser._id === commentUser?._id || currentUser._id === (comment.user as any));
  const canModify = isOwner || isAdmin;

  const authorName = commentUser?.name || 'BlogSpace User';
  const authorUsername = commentUser?.username || 'user';
  const authorAvatar = commentUser?.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${authorName}`;
  const isAuthorAdmin = commentUser?.role === 'ADMIN';

  const timeAgo = (dateStr: string) => {
    const diff = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleSaveEdit = async () => {
    if (!editContent.trim() || editContent.trim() === comment.content) {
      setIsEditing(false);
      return;
    }
    setIsUpdating(true);
    const success = await onUpdate(comment._id, editContent.trim());
    setIsUpdating(false);
    if (success) {
      setIsEditing(false);
    }
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    const success = await onDelete(comment._id);
    setIsDeleting(false);
    if (success) {
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="flex items-start justify-between gap-3">
          {/* User Info Header */}
          <div className="flex items-center gap-3">
            <img
              src={authorAvatar}
              alt={authorName}
              className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {authorName}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  @{authorUsername}
                </span>
                {isAuthorAdmin && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                    <Shield className="w-3 h-3" /> Admin
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                <Clock className="w-3 h-3" />
                <span>{timeAgo(comment.createdAt)}</span>
                {comment.updatedAt !== comment.createdAt && (
                  <span className="italic text-[11px]">(edited)</span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons for Owner / Admin */}
          {canModify && !isEditing && (
            <div className="flex items-center gap-1">
              {isOwner && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  title="Edit Comment"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => setShowDeleteModal(true)}
                className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                title="Delete Comment"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Comment Content / Edit Form */}
        <div className="mt-3 text-sm text-slate-700 dark:text-slate-300 pl-12">
          {isEditing ? (
            <div className="space-y-3">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={3}
                className="w-full p-3 text-sm rounded-xl border border-indigo-300 dark:border-indigo-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditContent(comment.content);
                    setIsEditing(false);
                  }}
                  disabled={isUpdating}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 rounded-lg transition-colors"
                >
                  <X className="w-3.5 h-3.5" /> Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  disabled={isUpdating || !editContent.trim()}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Check className="w-3.5 h-3.5" /> {isUpdating ? 'Saving...' : 'Update'}
                </button>
              </div>
            </div>
          ) : (
            <p className="whitespace-pre-line leading-relaxed">{comment.content}</p>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        title="Delete Comment"
        message="Are you sure you want to delete this comment? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteModal(false)}
        isLoading={isDeleting}
      />
    </>
  );
};
