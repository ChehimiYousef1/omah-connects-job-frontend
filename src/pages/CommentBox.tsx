// src/components/CommentBox.tsx
// npm install emoji-picker-react

import React, { useState, useRef, useEffect, useCallback } from 'react';
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';
import { Smile, Send, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

// ── Types ─────────────────────────────────────────────────────────────────────

interface MentionUser { id: string; name: string; avatar: string | null; headline: string | null; }

export interface Comment {
  id: string; body: string; parent_id: string | null; created_at: string;
  author_id: string; author_name: string; author_avatar: string | null;
  author_headline: string | null; replies: Comment[];
}

interface CommentBoxProps {
  postId: string; parentId?: string; onSubmitted: (c: Comment) => void;
  placeholder?: string; autoFocus?: boolean;
}

export interface CommentSectionProps {
  postId:            string;
  currentUser:       { id: string; name: string; avatar: string | null } | null;
  onCommentAdded?:   () => void;
  onCommentDeleted?: () => void;
  visible:           boolean; // ← controls CSS show/hide; never unmounts
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const API = 'http://localhost:3001';

const resolveUrl = (path?: string | null, seed = 'U') =>
  path ? (path.startsWith('http') ? path : `${API}${path}`)
       : `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;

function mentionColor(name: string): string {
  const C = ['#6366f1','#8b5cf6','#ec4899','#f59e0b','#10b981','#3b82f6','#ef4444','#14b8a6'];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return C[Math.abs(h) % C.length];
}

const timeAgo = (d: string) => {
  const m = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  return h < 24 ? `${h}h` : `${Math.floor(h / 24)}d`;
};

const renderBody = (text: string) =>
  text.split(/(@[a-zA-Z0-9_]+)/g).map((part, i) =>
    /^@[a-zA-Z0-9_]+$/.test(part)
      ? <span key={i} style={{ color: mentionColor(part.slice(1)), fontWeight: 600 }}>{part}</span>
      : part
  );

// ── CommentBox ────────────────────────────────────────────────────────────────

export const CommentBox: React.FC<CommentBoxProps> = ({
  postId, parentId, onSubmitted, placeholder = 'Write a comment...', autoFocus = false,
}) => {
  const [body,         setBody]         = useState('');
  const [showEmoji,    setShowEmoji]    = useState(false);
  const [submitting,   setSubmitting]   = useState(false);
  const [mentions,     setMentions]     = useState<MentionUser[]>([]);
  const [mentionOpen,  setMentionOpen]  = useState(false);
  const [mentionIndex, setMentionIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const emojiRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [body]);

  useEffect(() => {
    if (!showEmoji) return;
    const h = (e: MouseEvent) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target as Node)) setShowEmoji(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [showEmoji]);

  const searchMentions = useCallback(async (q: string) => {
    if (!q) { setMentions([]); setMentionOpen(false); return; }
    try {
      const res  = await fetch(`${API}/api/posts/${postId}/comments/mentions-search?q=${encodeURIComponent(q)}`, { credentials: 'include' });
      const data = await res.json();
      setMentions(data.users ?? []);
      setMentionOpen((data.users ?? []).length > 0);
      setMentionIndex(0);
    } catch { setMentionOpen(false); }
  }, [postId]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val    = e.target.value;
    const cursor = e.target.selectionStart ?? val.length;
    setBody(val);
    const m = val.slice(0, cursor).match(/@([a-zA-Z0-9_]*)$/);
    if (m) searchMentions(m[1]); else setMentionOpen(false);
  };

  const insertMention = (u: MentionUser) => {
    const cursor  = textareaRef.current?.selectionStart ?? body.length;
    const newBody = body.slice(0, cursor).replace(/@([a-zA-Z0-9_]*)$/, `@${u.name} `) + body.slice(cursor);
    setBody(newBody);
    setMentionOpen(false);
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (mentionOpen) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setMentionIndex(i => Math.min(i + 1, mentions.length - 1)); return; }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setMentionIndex(i => Math.max(i - 1, 0)); return; }
      if (e.key === 'Enter' || e.key === 'Tab') { e.preventDefault(); insertMention(mentions[mentionIndex]); return; }
      if (e.key === 'Escape') { setMentionOpen(false); return; }
    }
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSubmit();
  };

  const handleEmoji = (d: EmojiClickData) => {
    const el     = textareaRef.current;
    const cursor = el?.selectionStart ?? body.length;
    setBody(b => b.slice(0, cursor) + d.emoji + b.slice(cursor));
    setShowEmoji(false);
    setTimeout(() => el?.focus(), 0);
  };

  const handleSubmit = async () => {
    if (!body.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res  = await fetch(`${API}/api/posts/${postId}/comments`, {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: body.trim(), parent_id: parentId ?? null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed');
      setBody('');
      onSubmitted(data.comment);
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit = body.trim().length > 0 && !submitting;

  return (
    <div className="relative">
      <div className="flex gap-2 items-end">
        <div className="flex-1 relative bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden
          focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <textarea
            ref={textareaRef} value={body} onChange={handleChange} onKeyDown={handleKeyDown}
            placeholder={placeholder} autoFocus={autoFocus} rows={1}
            className="w-full px-4 pt-3 pb-2 text-sm text-gray-800 bg-transparent resize-none focus:outline-none placeholder-gray-400 leading-relaxed"
            style={{ minHeight: 44, maxHeight: 160 }}
          />
          <div className="flex items-center justify-between px-3 pb-2">
            <div className="relative" ref={emojiRef}>
              <button type="button" onClick={() => setShowEmoji(p => !p)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 transition-colors" title="Add emoji">
                <Smile size={16} />
              </button>
              {showEmoji && (
                <div className="absolute bottom-full left-0 mb-2 z-50 shadow-2xl rounded-xl overflow-hidden">
                  <EmojiPicker onEmojiClick={handleEmoji} theme={Theme.LIGHT} width={320} height={380} searchPlaceholder="Search emoji..." />
                </div>
              )}
            </div>
            <p className="text-[10px] text-gray-300 select-none">Ctrl+Enter to send</p>
          </div>
        </div>
        <button onClick={handleSubmit} disabled={!canSubmit}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shrink-0
            ${canSubmit ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
          {submitting ? <Loader size={15} className="animate-spin" /> : <Send size={15} />}
        </button>
      </div>

      {mentionOpen && mentions.length > 0 && (
        <div className="absolute left-0 bottom-full mb-2 w-72 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="px-3 py-1.5 border-b border-gray-100">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Mention a connection</span>
          </div>
          {mentions.map((u, i) => (
            <button key={u.id} onMouseDown={(e) => { e.preventDefault(); insertMention(u); }}
              className={`flex items-center gap-3 w-full text-left px-3 py-2.5 transition-colors ${i === mentionIndex ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
              <img src={resolveUrl(u.avatar, u.name)} alt={u.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-tight truncate" style={{ color: mentionColor(u.name) }}>@{u.name}</p>
                {u.headline && <p className="text-xs text-gray-400 truncate leading-tight">{u.headline}</p>}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ── CommentItem ───────────────────────────────────────────────────────────────

interface CommentItemProps {
  comment:           Comment;
  postId:            string;
  currentUser:       { id: string; name: string; avatar: string | null } | null;
  onDeleted:         (id: string) => void;
  onTopLevelDelete?: () => void;
}

export const CommentItem: React.FC<CommentItemProps> = ({
  comment, postId, currentUser, onDeleted, onTopLevelDelete,
}) => {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replies,      setReplies]      = useState<Comment[]>(comment.replies ?? []);
  const [deleting,     setDeleting]     = useState(false);
  const isOwn = currentUser?.id === comment.author_id;

  const handleDelete = async () => {
    if (!confirm('Delete this comment?')) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API}/api/posts/${postId}/comments/${comment.id}`, {
        method: 'DELETE', credentials: 'include',
      });
      if (!res.ok) throw new Error();
      onDeleted(comment.id);
      onTopLevelDelete?.();
    } catch { toast.error('Failed to delete comment'); }
    finally { setDeleting(false); }
  };

  return (
    <div className="flex gap-3">
      <img src={resolveUrl(comment.author_avatar, comment.author_name)} alt={comment.author_name}
        className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <div className="bg-gray-100 rounded-2xl px-3.5 py-2.5 inline-block max-w-full">
          <p className="text-xs font-semibold text-gray-900 leading-tight mb-0.5">{comment.author_name}</p>
          <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap break-words">
            {renderBody(comment.body)}
          </p>
        </div>
        <div className="flex items-center gap-3 mt-1 ml-1">
          <span className="text-[11px] text-gray-400">{timeAgo(comment.created_at)}</span>
          <button onClick={() => setShowReplyBox(p => !p)}
            className="text-[11px] font-semibold text-gray-500 hover:text-blue-600 transition-colors">
            {showReplyBox ? 'Cancel' : 'Reply'}
          </button>
          {isOwn && (
            <button onClick={handleDelete} disabled={deleting}
              className="text-[11px] font-semibold text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50">
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          )}
        </div>
        {showReplyBox && (
          <div className="mt-2">
            <CommentBox
              postId={postId} parentId={comment.id}
              placeholder={`Reply to ${comment.author_name}...`} autoFocus
              onSubmitted={(c) => { setReplies(p => [...p, c]); setShowReplyBox(false); }}
            />
          </div>
        )}
        {replies.length > 0 && (
          <div className="mt-3 space-y-3 pl-2 border-l-2 border-gray-100">
            {replies.map(r => (
              <CommentItem key={r.id} comment={r} postId={postId} currentUser={currentUser}
                onDeleted={(id) => setReplies(p => p.filter(x => x.id !== id))} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ── CommentSection ────────────────────────────────────────────────────────────
// KEY CHANGE: never unmounts. Fetches exactly once (on first `visible = true`).
// Hidden via CSS when visible = false — no mount/unmount = no re-fetch loop.

export const CommentSection: React.FC<CommentSectionProps> = ({
  postId, currentUser, onCommentAdded, onCommentDeleted, visible,
}) => {
  const [comments,    setComments]    = useState<Comment[]>([]);
  const [loading,     setLoading]     = useState(false);
  const hasFetchedRef = useRef(false); // ← fetch only once, ever

  useEffect(() => {
    // Only fetch the first time the section becomes visible
    if (!visible || hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    const ctrl = new AbortController();
    setLoading(true);

    (async () => {
      try {
        const res  = await fetch(`${API}/api/posts/${postId}/comments`, {
          credentials: 'include',
          signal: ctrl.signal,
        });
        const data = await res.json();
        setComments(data.comments ?? []);
      } catch (e: any) {
        if (e.name !== 'AbortError') { /* silent */ }
      } finally {
        setLoading(false);
      }
    })();

    return () => ctrl.abort();
  }, [visible, postId]); // postId is stable (a string UUID), so this is safe

  return (
    // Hide with CSS — never unmount — so the fetch never re-runs
    <div style={{ display: visible ? 'block' : 'none' }} className="px-4 pt-3 pb-4">
      {loading ? (
        <div className="space-y-3 mb-4">
          {[1, 2].map(i => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0" />
              <div className="flex-1 space-y-1.5 pt-1">
                <div className="h-3 bg-gray-200 rounded w-1/4" />
                <div className="h-3 bg-gray-200 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4 mb-4">
          {comments.map(c => (
            <CommentItem
              key={c.id} comment={c} postId={postId} currentUser={currentUser}
              onDeleted={(id) => setComments(p => p.filter(x => x.id !== id))}
              onTopLevelDelete={onCommentDeleted}
            />
          ))}
          {comments.length === 0 && (
            <p className="text-xs text-gray-400 text-center py-2">No comments yet. Be the first!</p>
          )}
        </div>
      )}

      <div className="flex gap-2 items-start">
        <img src={resolveUrl(currentUser?.avatar, currentUser?.name ?? 'User')}
          alt="You" className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5" />
        <div className="flex-1">
          <CommentBox
            postId={postId}
            onSubmitted={(c) => { setComments(p => [...p, c]); onCommentAdded?.(); }}
          />
        </div>
      </div>
    </div>
  );
};