import React, { useState, useEffect, useRef } from 'react';
import {
  Image, Calendar, FileText, Globe, MoreHorizontal,
  ThumbsUp, MessageCircle, Repeat2, Send, Plus, TrendingUp, ChevronDown, Camera,
  VideoIcon, Users, Lock, Users2, CalendarDays, Building2, Layers, CalendarCheck, User,
  CheckCircle, AlertCircle, Loader, X, MapPin, Clock, Link, File, Trash2, Pencil,
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { EditPostModal } from './EditPostModal';
import { CommentSection } from './CommentBox.tsx';

const BASE = 'http://localhost:3001';

// ─── SVG helper ──────────────────────────────────────────────────────────────
const SvgIcon = ({ d, size = 16, stroke = 'currentColor', fill = 'none' }: {
  d: string; size?: number; stroke?: string; fill?: string;
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
    strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

// ─── Types ────────────────────────────────────────────────────────────────────
type PostType = 'text' | 'image' | 'video' | 'document' | 'event';

interface CurrentUser {
  user_id: string; user_name: string; user_email: string; user_about: string;
  user_avatar: string; user_cover: string; user_headline: string; user_role: string;
}

interface Attachment {
  type: 'image' | 'video' | 'document' | 'event';
  url?: string; originalName?: string; mimeType?: string; size?: number;
  name?: string; date?: string; time?: string; location?: string; eventUrl?: string;
}

interface Post {
  id: string; userId: string; title: string | null; description: string | null;
  attachments: Attachment[]; postType: PostType; visibility: string; created_at: string;
  author_name: string; author_headline: string | null; author_role: string | null;
  author_avatar: string | null; author_bio: string | null;
  likeCount?: number; commentCount?: number; repostCount?: number;
  liked?: boolean; reposted?: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const resolveUrl = (path?: string | null, seed = 'User'): string => {
  if (!path) return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;
  if (path.startsWith('http')) return path;
  return `${BASE}${path}`;
};

const timeAgo = (dateStr: string): string => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1) return 'just now'; if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return d < 7 ? `${d}d` : new Date(dateStr).toLocaleDateString();
};

const parseAttachments = (raw: unknown): Attachment[] => {
  if (Array.isArray(raw)) return raw as Attachment[];
  if (typeof raw === 'string') { try { return JSON.parse(raw) as Attachment[]; } catch { return []; } }
  return [];
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getDocIcon = (mime?: string): string => {
  if (!mime) return '📄';
  if (mime.includes('pdf')) return '📕';
  if (mime.includes('word')) return '📘';
  if (mime.includes('excel') || mime.includes('sheet')) return '📗';
  if (mime.includes('powerpoint') || mime.includes('presentation')) return '📙';
  return '📄';
};

// ─── API helpers ──────────────────────────────────────────────────────────────
const api = {
  savePost:    (id: string) => fetch(`${BASE}/api/post-interactions/saved-posts`,      { method: 'POST',   credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ post_id: id }) }),
  unsavePost:  (id: string) => fetch(`${BASE}/api/post-interactions/saved-posts/${id}`, { method: 'DELETE', credentials: 'include' }),
  followUser:  (id: string) => fetch(`${BASE}/api/post-interactions/followers`,         { method: 'POST',   credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ following_id: id }) }),
  unfollowUser:(id: string) => fetch(`${BASE}/api/post-interactions/followers/${id}`,   { method: 'DELETE', credentials: 'include' }),
  blockUser:   (id: string) => fetch(`${BASE}/api/post-interactions/blocked-users`,     { method: 'POST',   credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ blocked_id: id }) }),
  reportPost:  (id: string) => fetch(`${BASE}/api/post-interactions/posts/${id}/report`,{ method: 'POST',   credentials: 'include' }),
  // repost lives ONLY here — PostInteractions no longer calls the API directly
  repostPost:  (id: string) => fetch(`${BASE}/api/post-interactions/posts/${id}/repost`,{ method: 'POST',   credentials: 'include' }),
  deletePost:  (id: string) => fetch(`${BASE}/api/posts/${id}`,                          { method: 'DELETE', credentials: 'include' }),
  // send / share a post to a connection via DM
  sendPost: (postId: string, recipientId: string) =>
    fetch(`${BASE}/api/messages`, {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipient_id: recipientId, post_id: postId, type: 'post_share' }),
    }),
};

// ─── ConfirmModal ─────────────────────────────────────────────────────────────
interface ConfirmModalProps {
  title: string; description: string; confirmLabel: string;
  danger: boolean; loading: boolean;
  onConfirm: () => void; onCancel: () => void;
}
const ConfirmModal = ({ title, description, confirmLabel, danger, loading, onConfirm, onCancel }: ConfirmModalProps) => (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[9999] p-4" onClick={onCancel}>
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${danger ? 'bg-red-100' : 'bg-yellow-100'}`}>
          {danger ? <Trash2 size={18} className="text-red-600" /> : <AlertCircle size={18} className="text-yellow-600" />}
        </div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      <p className="text-sm text-gray-500 mb-5">{description}</p>
      <div className="flex gap-3 justify-end">
        <button onClick={onCancel} disabled={loading} className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors">Cancel</button>
        <button onClick={onConfirm} disabled={loading}
          className={`px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors flex items-center gap-2 ${danger ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-900 hover:bg-gray-800'} disabled:opacity-60`}>
          {loading && <Loader size={13} className="animate-spin" />}
          {loading ? 'Please wait...' : confirmLabel}
        </button>
      </div>
    </div>
  </div>
);

// ─── PostOptionsMenu ──────────────────────────────────────────────────────────
interface PostOptionsMenuProps {
  post: Post; isOwner: boolean; isSaved: boolean; isFollowing: boolean;
  onEdit: () => void; onDelete: () => void; onHide: () => void;
  onSaveToggle: (next: boolean) => void; onFollowToggle: (next: boolean) => void;
  // ↓ lifted up so PostInteractions can reflect the repost state
  onReposted: () => void;
}
const PostOptionsMenu = ({
  post, isOwner, isSaved, isFollowing,
  onEdit, onDelete, onHide, onSaveToggle, onFollowToggle, onReposted,
}: PostOptionsMenuProps) => {
  const [open, setOpen]       = useState(false);
  const [busy, setBusy]       = useState<string | null>(null);
  const [confirm, setConfirm] = useState<{ key: string; title: string; description: string; confirmLabel: string; danger: boolean } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);

  const run = async (key: string, apiFn: () => Promise<Response>, onSuccess: () => void) => {
    setBusy(key); setOpen(false);
    try {
      const res = await apiFn();
      if (!res.ok) { const b = await res.json().catch(() => ({})); throw new Error(b.error || `HTTP ${res.status}`); }
      onSuccess();
    } catch (e: any) { toast.error(e.message || 'Something went wrong.'); }
    finally { setBusy(null); setConfirm(null); }
  };

  const handleSave    = () => run('save',   () => isSaved      ? api.unsavePost(post.id)   : api.savePost(post.id),
    () => { onSaveToggle(!isSaved);       toast.success(isSaved    ? 'Removed from saved.'              : 'Post saved.');                   });
  const handleFollow  = () => run('follow', () => isFollowing  ? api.unfollowUser(post.userId) : api.followUser(post.userId),
    () => { onFollowToggle(!isFollowing); toast.success(isFollowing ? `Unfollowed ${post.author_name}.`  : `Following ${post.author_name}.`); });

  const executeConfirm = () => {
    if (!confirm) return;
    if (confirm.key === 'delete') run('delete', () => api.deletePost(post.id),  () => { onDelete();  toast.success('Post deleted.');            });
    if (confirm.key === 'repost') run('repost', () => api.repostPost(post.id),  () => { onReposted(); toast.success('Reposted to your profile.'); });
    if (confirm.key === 'report') run('report', () => api.reportPost(post.id),  () =>                  toast.success('Report submitted.')        );
    if (confirm.key === 'block')  run('block',  () => api.blockUser(post.userId),() => { onHide();    toast.success(`${post.author_name} blocked.`); });
  };

  type MenuItem =
    | { divider: true }
    | { divider?: false; key: string; label: string; sub: string; icon: React.ReactNode; iconBg: string; iconColor: string; danger: boolean; loading: boolean; onClick: () => void };

  const ownerItems: MenuItem[] = [
    { key: 'edit',   label: 'Edit post',   sub: 'Change content or visibility', icon: <Pencil size={15} />, iconBg: 'bg-gray-100', iconColor: 'text-gray-600', danger: false, loading: false,          onClick: () => { setOpen(false); onEdit(); } },
    { key: 'delete', label: 'Delete post', sub: 'Permanently remove this post', icon: <Trash2 size={15} />, iconBg: 'bg-red-100',  iconColor: 'text-red-600',  danger: true,  loading: busy === 'delete', onClick: () => { setOpen(false); setConfirm({ key: 'delete', title: 'Delete post?', description: 'This action cannot be undone.', confirmLabel: 'Delete', danger: true }); } },
  ];

  const otherItems: MenuItem[] = [
    { key: 'save',   label: isSaved ? 'Unsave post' : 'Save post', sub: isSaved ? 'Remove from saved' : 'Add to saved',
      icon: <SvgIcon d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" fill={isSaved ? '#6366f1' : 'none'} stroke={isSaved ? '#6366f1' : 'currentColor'} />,
      iconBg: isSaved ? 'bg-indigo-50' : 'bg-gray-100', iconColor: isSaved ? 'text-indigo-600' : 'text-gray-600', danger: false, loading: busy === 'save', onClick: handleSave },
    { key: 'hide',   label: 'Hide post', sub: "Won't appear in your feed",
      icon: <SvgIcon d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" />,
      iconBg: 'bg-gray-100', iconColor: 'text-gray-600', danger: false, loading: false, onClick: () => { setOpen(false); onHide(); toast.success('Post hidden.'); } },
    { key: 'follow', label: isFollowing ? `Unfollow ${post.author_name}` : `Follow ${post.author_name}`, sub: isFollowing ? 'Stop seeing their posts' : 'See more from this person',
      icon: isFollowing
        ? <SvgIcon d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM22 11h-6" />
        : <SvgIcon d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM19 8v6M22 11h-6" />,
      iconBg: 'bg-gray-100', iconColor: 'text-gray-600', danger: false, loading: busy === 'follow', onClick: handleFollow },
    // ↓ repost lives ONLY in this menu — NOT in PostInteractions action bar
    { key: 'repost', label: 'Repost', sub: 'Share with your followers',
      icon: <SvgIcon d="M17 1l4 4-4 4M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 01-4 4H3" />,
      iconBg: 'bg-gray-100', iconColor: 'text-gray-600', danger: false, loading: busy === 'repost',
      onClick: () => { setOpen(false); setConfirm({ key: 'repost', title: 'Repost this post?', description: 'This will share the post to your profile.', confirmLabel: 'Repost', danger: false }); } },
    { divider: true },
    { key: 'report', label: 'Report post', sub: 'Flag as inappropriate or spam',
      icon: <SvgIcon d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" />,
      iconBg: 'bg-red-50', iconColor: 'text-red-500', danger: true, loading: busy === 'report',
      onClick: () => { setOpen(false); setConfirm({ key: 'report', title: 'Report this post?', description: "We'll review it.", confirmLabel: 'Submit Report', danger: false }); } },
    { key: 'block',  label: `Block ${post.author_name}`, sub: "They won't see your profile",
      icon: <SvgIcon d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />,
      iconBg: 'bg-red-50', iconColor: 'text-red-500', danger: true, loading: busy === 'block',
      onClick: () => { setOpen(false); setConfirm({ key: 'block', title: `Block ${post.author_name}?`, description: "They won't see your profile or posts.", confirmLabel: 'Block User', danger: true }); } },
  ];

  const items: MenuItem[] = isOwner ? ownerItems : otherItems;

  return (
    <>
      <div ref={menuRef} className="relative">
        <button onClick={() => setOpen(p => !p)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <MoreHorizontal size={18} className="text-gray-500" />
        </button>
        {open && (
          <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
            <style>{`@keyframes fadeDown{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}`}</style>
            <div className="px-4 py-2.5 border-b border-gray-100">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">{isOwner ? 'Your post' : 'Post options'}</span>
            </div>
            <div className="py-1.5">
              {items.map((item, i) => {
                if (item.divider) return <div key={`div-${i}`} className="h-px bg-gray-100 my-1 mx-3" />;
                return (
                  <button key={item.key} onClick={item.onClick} disabled={item.loading}
                    className={`flex items-center gap-3 w-full text-left px-3 py-2 text-sm transition-colors ${item.danger ? 'hover:bg-red-50' : 'hover:bg-gray-50'} disabled:opacity-60`}>
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.iconBg} ${item.iconColor}`}>
                      {item.loading ? <Loader size={13} className="animate-spin" /> : item.icon}
                    </span>
                    <span>
                      <span className={`block font-medium leading-tight ${item.danger ? 'text-red-600' : 'text-gray-800'}`}>{item.label}</span>
                      <span className="block text-xs text-gray-400 mt-0.5">{item.sub}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
      {confirm && (
        <ConfirmModal title={confirm.title} description={confirm.description} confirmLabel={confirm.confirmLabel}
          danger={confirm.danger} loading={busy === confirm.key} onConfirm={executeConfirm} onCancel={() => setConfirm(null)} />
      )}
    </>
  );
};

// ─── SendModal ────────────────────────────────────────────────────────────────
// A lightweight modal to pick a connection and send the post as a DM.
interface Connection { id: string; name: string; avatar: string | null; headline: string | null; }

interface SendModalProps { postId: string; onClose: () => void; }
const SendModal = ({ postId, onClose }: SendModalProps) => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [sending,     setSending]     = useState<string | null>(null);
  const [sent,        setSent]        = useState<Set<string>>(new Set());
  const [query,       setQuery]       = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch(`${BASE}/api/connections`, { credentials: 'include' });
        const data = await res.json();
        setConnections(data.connections ?? data ?? []);
      } catch { toast.error('Could not load connections.'); }
      finally { setLoading(false); }
    })();
  }, []);

  const filtered = connections.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSend = async (recipientId: string) => {
    if (sending || sent.has(recipientId)) return;
    setSending(recipientId);
    try {
      const res = await api.sendPost(postId, recipientId);
      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        throw new Error(b.error ?? `HTTP ${res.status}`);
      }
      setSent(prev => new Set(prev).add(recipientId));
      toast.success('Post sent!');
    } catch (e: any) {
      toast.error(e.message ?? 'Failed to send post.');
    } finally {
      setSending(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm flex flex-col max-h-[70vh]" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 shrink-0">
          <h2 className="font-semibold text-gray-900">Send post</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500"><X size={16} /></button>
        </div>
        <div className="px-4 py-3 border-b border-gray-100 shrink-0">
          <input
            value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search connections…"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
        <div className="overflow-y-auto flex-1 py-2">
          {loading && (
            <div className="space-y-3 px-4 py-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
                  <div className="flex-1 space-y-1.5"><div className="h-3 bg-gray-200 rounded w-1/2" /><div className="h-2.5 bg-gray-200 rounded w-3/4" /></div>
                </div>
              ))}
            </div>
          )}
          {!loading && filtered.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-6">No connections found.</p>
          )}
          {!loading && filtered.map(c => {
            const isSent    = sent.has(c.id);
            const isSending = sending === c.id;
            return (
              <div key={c.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors">
                <img src={resolveUrl(c.avatar, c.name)} alt={c.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{c.name}</p>
                  {c.headline && <p className="text-xs text-gray-400 truncate">{c.headline}</p>}
                </div>
                <button
                  onClick={() => handleSend(c.id)}
                  disabled={isSent || isSending}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors shrink-0
                    ${isSent
                      ? 'bg-green-100 text-green-700 cursor-default'
                      : 'bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-60'}`}>
                  {isSending
                    ? <Loader size={12} className="animate-spin" />
                    : isSent
                      ? <><CheckCircle size={12} /> Sent</>
                      : <><Send size={12} /> Send</>}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ─── PostInteractions ─────────────────────────────────────────────────────────
interface PostInteractionsProps {
  postId: string; currentUser: CurrentUser | null;
  initLiked?: boolean; initReposted?: boolean;
  initLikes?: number; initComments?: number; initReposts?: number;
  // ↓ called by PostOptionsMenu when a repost succeeds, so counts stay in sync
  onExternalRepost?: (cb: () => void) => void;
}

const PostInteractions = ({
  postId, currentUser,
  initLiked = false, initReposted = false,
  initLikes = 0, initComments = 0, initReposts = 0,
  onExternalRepost,
}: PostInteractionsProps) => {
  const [liked,        setLiked]        = useState(initLiked);
  const [reposted,     setReposted]     = useState(initReposted);
  const [likeCount,    setLikeCount]    = useState(initLikes);
  const [commentCount, setCommentCount] = useState(initComments);
  const [repostCount,  setRepostCount]  = useState(initReposts);
  const [busyKey,      setBusyKey]      = useState<string | null>(null);
  const [showComments, setShowComments] = useState(false);
  const [showSend,     setShowSend]     = useState(false);

  // Allow the parent (via PostOptionsMenu callback) to increment repost count
  // without triggering a second API call.
  useEffect(() => {
    onExternalRepost?.(() => {
      setReposted(true);
      setRepostCount(c => c + 1);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLike = async () => {
    if (busyKey) return;
    const prev = liked; const prevCount = likeCount;
    setLiked(!prev); setLikeCount(prev ? likeCount - 1 : likeCount + 1);
    setBusyKey('like');
    try {
      const res = await fetch(`${BASE}/api/post-interactions/posts/${postId}/like`, {
        method: prev ? 'DELETE' : 'POST', credentials: 'include',
      });
      if (!res.ok) throw new Error();
    } catch { setLiked(prev); setLikeCount(prevCount); toast.error('Could not update like.'); }
    finally { setBusyKey(null); }
  };

  const commentUser = currentUser
    ? { id: currentUser.user_id, name: currentUser.user_name, avatar: currentUser.user_avatar || null }
    : null;

  const actions = [
    { key: 'like',    Icon: ThumbsUp,      label: liked ? 'Liked' : 'Like',
      active: liked,        busy: busyKey === 'like', onClick: handleLike },
    { key: 'comment', Icon: MessageCircle,
      label: commentCount > 0 ? `Comment (${commentCount})` : 'Comment',
      active: showComments, busy: false, onClick: () => setShowComments(p => !p) },
    // ↓ Repost action bar button removed — repost is now only in the ••• menu
    //   to prevent the double-API-call bug. The count is still displayed above.
    { key: 'send', Icon: Send, label: 'Send',
      active: false, busy: false, onClick: () => setShowSend(true) },
  ];

  const hasStats = likeCount > 0 || commentCount > 0 || repostCount > 0;

  return (
    <>
      {hasStats && (
        <div className="px-4 py-2 flex items-center justify-between text-xs text-gray-500 border-b border-gray-100">
          {likeCount > 0 ? (
            <div className="flex items-center gap-1.5 cursor-pointer hover:underline" onClick={handleLike}>
              <span className="flex -space-x-1">
                <span className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-[10px] border border-white">👍</span>
                <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-[10px] border border-white">🎉</span>
              </span>
              <span>{likeCount.toLocaleString()}</span>
            </div>
          ) : <span />}
          <div className="flex items-center gap-2">
            {commentCount > 0 && (
              <button onClick={() => setShowComments(p => !p)} className="hover:underline hover:text-blue-600 transition-colors">
                {commentCount.toLocaleString()} comment{commentCount !== 1 ? 's' : ''}
              </button>
            )}
            {commentCount > 0 && repostCount > 0 && <span>·</span>}
            {repostCount > 0 && <span>{repostCount.toLocaleString()} repost{repostCount !== 1 ? 's' : ''}</span>}
          </div>
        </div>
      )}

      <div className="flex p-1 border-b border-gray-100">
        {actions.map(({ key, Icon, label, active, busy, onClick }) => (
          <button key={key} onClick={onClick} disabled={busy}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg transition-colors disabled:opacity-60
              ${active ? 'text-blue-600 hover:bg-blue-50' : 'text-gray-600 hover:bg-gray-100'}`}>
            {busy
              ? <Loader size={18} className="animate-spin" />
              : <Icon size={18} strokeWidth={active ? 2.5 : 1.8} fill={active && key === 'like' ? 'currentColor' : 'none'} />}
            <span className={`text-sm font-semibold ${active ? 'text-blue-600' : ''}`}>{label}</span>
          </button>
        ))}
      </div>

      {/* Always mounted, shown/hidden via CSS — eliminates the re-fetch loop */}
      <CommentSection
        postId={postId}
        currentUser={commentUser}
        visible={showComments}
        onCommentAdded={()  => setCommentCount(c => c + 1)}
        onCommentDeleted={() => setCommentCount(c => Math.max(0, c - 1))}
      />

      {/* Send modal */}
      {showSend && <SendModal postId={postId} onClose={() => setShowSend(false)} />}
    </>
  );
};

// ─── Visibility options ───────────────────────────────────────────────────────
const VISIBILITY_OPTIONS = [
  { label: 'Anyone',              icon: Globe         },
  { label: 'My Connections Only', icon: Users         },
  { label: 'Private',             icon: Lock          },
  { label: 'Group Members',       icon: Users2        },
  { label: 'Event Attendees',     icon: CalendarDays  },
  { label: 'Company',             icon: Building2     },
  { label: 'Group',               icon: Layers        },
  { label: 'Event',               icon: CalendarCheck },
  { label: 'Only Me',             icon: User          },
];

// ─── PostModal ────────────────────────────────────────────────────────────────
interface PostModalProps {
  onClose: () => void; currentUser: CurrentUser | null;
  onPostCreated: (post: Post) => void; initialTab?: PostType;
}
const PostModal = ({ onClose, currentUser, onPostCreated, initialTab = 'text' }: PostModalProps) => {
  const [activeTab, setActiveTab]         = useState<PostType>(initialTab);
  const [visDropdown, setVisDropdown]     = useState(false);
  const [visibility, setVisibility]       = useState('Anyone');
  const [title, setTitle]                 = useState('');
  const [description, setDescription]     = useState('');
  const [submitting, setSubmitting]       = useState(false);
  const [status, setStatus]               = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMsg, setStatusMsg]         = useState('');
  const fileInputRef                      = useRef<HTMLInputElement>(null);
  const [attachedFile, setAttachedFile]   = useState<File | null>(null);
  const [previewUrl, setPreviewUrl]       = useState<string | null>(null);
  const [eventName, setEventName]         = useState('');
  const [eventDate, setEventDate]         = useState('');
  const [eventTime, setEventTime]         = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventUrl, setEventUrl]           = useState('');

  const VisibilityIcon = VISIBILITY_OPTIONS.find(o => o.label === visibility)?.icon ?? Globe;
  const acceptMap: Record<PostType, string> = {
    text: '', image: 'image/*',
    video: 'video/mp4,video/webm,video/ogg,video/quicktime',
    document: '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt', event: '',
  };

  const switchTab = (tab: PostType) => { setActiveTab(tab); setAttachedFile(null); setPreviewUrl(null); setStatus('idle'); };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setAttachedFile(file); setPreviewUrl(activeTab === 'image' ? URL.createObjectURL(file) : null); e.target.value = '';
  };
  const removeFile = () => { setAttachedFile(null); setPreviewUrl(null); };

  const validate = (): string | null => {
    if (activeTab === 'event') { if (!eventName.trim()) return 'Event name is required.'; if (!eventDate.trim()) return 'Event date is required.'; return null; }
    if (!description.trim() && !attachedFile) return 'Please write something or attach a file.';
    if (attachedFile && !title.trim()) return 'A title is required when attaching a file.';
    return null;
  };

  const handleSubmit = async () => {
    const err = validate(); if (err) { setStatus('error'); setStatusMsg(err); return; }
    setSubmitting(true); setStatus('idle');
    const form = new FormData();
    form.append('title', title.trim()); form.append('description', description.trim());
    form.append('visibility', visibility); form.append('postType', activeTab);
    if (attachedFile) form.append('file', attachedFile);
    if (activeTab === 'event') {
      form.append('eventName', eventName.trim()); form.append('eventDate', eventDate.trim());
      form.append('eventTime', eventTime.trim()); form.append('eventLocation', eventLocation.trim());
      form.append('eventUrl', eventUrl.trim());
    }
    try {
      const res  = await fetch(`${BASE}/api/posts`, { method: 'POST', body: form, credentials: 'include' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setStatus('error'); setStatusMsg(data.error ?? `Failed (${res.status})`); return; }
      if (data.post) onPostCreated({ ...data.post, attachments: parseAttachments(data.post.attachments) });
      setStatus('success'); setStatusMsg('Post shared!');
      setTimeout(() => onClose(), 1200);
    } catch { setStatus('error'); setStatusMsg('Network error — please try again.'); }
    finally { setSubmitting(false); }
  };

  const canPost = !submitting && (activeTab === 'event' ? eventName.trim() !== '' && eventDate.trim() !== '' : description.trim() !== '' || attachedFile !== null);
  const tabs: { type: PostType; icon: React.ReactNode; label: string; color: string }[] = [
    { type: 'image',    icon: <Image size={18} />,     label: 'Photo',    color: 'text-blue-600'  },
    { type: 'video',    icon: <VideoIcon size={18} />, label: 'Video',    color: 'text-amber-600' },
    { type: 'document', icon: <FileText size={18} />,  label: 'Document', color: 'text-red-500'   },
    { type: 'event',    icon: <Calendar size={18} />,  label: 'Event',    color: 'text-green-600' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 shrink-0">
          <h2 className="text-xl font-semibold text-gray-900">Create a post</h2>
          <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
          <div className="flex items-start gap-3">
            <img src={resolveUrl(currentUser?.user_avatar, currentUser?.user_name)} alt="You" className="w-11 h-11 rounded-full object-cover shrink-0" />
            <div className="relative">
              <p className="font-semibold text-gray-900 text-sm">{currentUser?.user_name || 'Your Name'}</p>
              <button type="button" onClick={() => setVisDropdown(p => !p)}
                className="flex items-center gap-1.5 text-xs text-gray-600 border border-gray-300 rounded-full px-2.5 py-0.5 mt-1 hover:bg-gray-50">
                <VisibilityIcon size={11} /><span>{visibility}</span><ChevronDown size={11} />
              </button>
              {visDropdown && (
                <div className="absolute left-0 top-full mt-1 w-52 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-1">
                  {VISIBILITY_OPTIONS.map(opt => { const OptIcon = opt.icon; return (
                    <button key={opt.label} type="button" onClick={() => { setVisibility(opt.label); setVisDropdown(false); }}
                      className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <OptIcon size={14} className="text-gray-500" />{opt.label}
                    </button>
                  ); })}
                </div>
              )}
            </div>
          </div>
          {activeTab !== 'event' && (
            <input type="text" value={title} onChange={e => setTitle(e.target.value)}
              placeholder={activeTab === 'image' ? 'Add a title for your photo (required)' : activeTab === 'video' ? 'Add a title for your video (required)' : activeTab === 'document' ? 'Add a title for your document (required)' : 'Title (optional)'}
              className="w-full text-lg font-semibold text-gray-900 placeholder-gray-400 focus:outline-none border-b border-gray-200 pb-2" />
          )}
          <textarea value={description} onChange={e => setDescription(e.target.value)}
            placeholder={activeTab === 'event' ? 'Describe your event (optional)...' : 'What do you want to say?'}
            className="w-full min-h-[100px] text-base text-gray-800 resize-none focus:outline-none placeholder-gray-400" />
          {activeTab === 'image' && previewUrl && (
            <div className="relative rounded-xl overflow-hidden border border-gray-200">
              <img src={previewUrl} alt="Preview" className="w-full max-h-80 object-cover" />
              <button type="button" onClick={removeFile} className="absolute top-2 right-2 w-7 h-7 bg-black bg-opacity-60 text-white rounded-full flex items-center justify-center"><X size={14} /></button>
            </div>
          )}
          {activeTab === 'image' && !previewUrl && (
            <button type="button" onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-xl py-8 flex flex-col items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors">
              <Image size={32} className="opacity-60" /><span className="font-medium text-sm">Click to select a photo</span>
            </button>
          )}
          {activeTab === 'video' && !attachedFile && (
            <button type="button" onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-gray-300 hover:border-amber-400 rounded-xl py-8 flex flex-col items-center gap-2 text-gray-500 hover:text-amber-500 transition-colors">
              <VideoIcon size={32} className="opacity-60" /><span className="font-medium text-sm">Click to select a video</span>
            </button>
          )}
          {activeTab === 'video' && attachedFile && (
            <div className="rounded-xl border border-gray-200 overflow-hidden bg-gray-900 relative">
              <video src={URL.createObjectURL(attachedFile)} controls className="w-full max-h-72 object-contain" />
              <button type="button" onClick={removeFile} className="absolute top-2 right-2 w-7 h-7 bg-black bg-opacity-60 text-white rounded-full flex items-center justify-center"><X size={14} /></button>
            </div>
          )}
          {activeTab === 'document' && !attachedFile && (
            <button type="button" onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-gray-300 hover:border-red-400 rounded-xl py-8 flex flex-col items-center gap-2 text-gray-500 hover:text-red-500 transition-colors">
              <FileText size={32} className="opacity-60" /><span className="font-medium text-sm">Click to select a document</span>
            </button>
          )}
          {activeTab === 'document' && attachedFile && (
            <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
              <span className="text-3xl">{getDocIcon(attachedFile.type)}</span>
              <div className="flex-1 min-w-0"><p className="text-sm font-medium text-gray-900 truncate">{attachedFile.name}</p><p className="text-xs text-gray-500">{formatFileSize(attachedFile.size)}</p></div>
              <button type="button" onClick={removeFile} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-500"><X size={14} /></button>
            </div>
          )}
          {activeTab === 'event' && (
            <div className="space-y-3 bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">Event Details</p>
              <div><label className="block text-xs font-medium text-gray-700 mb-1">Event Name <span className="text-red-500">*</span></label>
                <input type="text" value={eventName} onChange={e => setEventName(e.target.value)} placeholder="e.g. Product Launch Webinar"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-medium text-gray-700 mb-1">Date <span className="text-red-500">*</span></label>
                  <div className="relative"><CalendarDays size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} className="w-full border border-gray-300 rounded-lg pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white" /></div></div>
                <div><label className="block text-xs font-medium text-gray-700 mb-1">Time</label>
                  <div className="relative"><Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="time" value={eventTime} onChange={e => setEventTime(e.target.value)} className="w-full border border-gray-300 rounded-lg pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white" /></div></div>
              </div>
              <div><label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
                <div className="relative"><MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" value={eventLocation} onChange={e => setEventLocation(e.target.value)} placeholder="Online or physical address"
                    className="w-full border border-gray-300 rounded-lg pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white" /></div></div>
              <div><label className="block text-xs font-medium text-gray-700 mb-1">Event Link</label>
                <div className="relative"><Link size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="url" value={eventUrl} onChange={e => setEventUrl(e.target.value)} placeholder="https://zoom.us/..."
                    className="w-full border border-gray-300 rounded-lg pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white" /></div></div>
            </div>
          )}
          {status !== 'idle' && (
            <div className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg ${status === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {status === 'success' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}{statusMsg}
            </div>
          )}
        </div>
        <div className="border-t border-gray-200 px-5 py-3 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {tabs.map(tab => (
                <button key={tab.type} type="button"
                  onClick={() => { switchTab(tab.type); if (tab.type !== 'event') setTimeout(() => fileInputRef.current?.click(), 50); }}
                  className={`p-2 rounded-lg transition-colors ${activeTab === tab.type ? 'bg-gray-100' : 'hover:bg-gray-100'} ${tab.color}`}>
                  {tab.icon}
                </button>
              ))}
              <input key={activeTab} type="file" accept={acceptMap[activeTab]} ref={fileInputRef} className="hidden" onChange={handleFileChange} />
            </div>
            <button onClick={handleSubmit} disabled={!canPost}
              className={`flex items-center gap-2 px-6 py-2 rounded-full font-semibold text-sm transition-colors ${canPost ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
              {submitting && <Loader size={14} className="animate-spin" />}
              {submitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── PostCard ─────────────────────────────────────────────────────────────────
interface PostCardProps {
  post: Post; currentUser: CurrentUser | null;
  onDelete: (id: string) => void; onUpdate: (updated: Post) => void;
}
const PostCard = ({ post, currentUser, onDelete, onUpdate }: PostCardProps) => {
  const [showEdit,    setShowEdit]    = useState(false);
  const [isSaved,     setIsSaved]     = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  // Callback ref: PostOptionsMenu calls this when a repost API call succeeds,
  // so PostInteractions can increment its local repost count without a second fetch.
  const notifyRepostedRef = useRef<(() => void) | null>(null);

  const avatar   = resolveUrl(post.author_avatar, post.author_name || 'User');
  const imageAtt = post.attachments.find(a => a.type === 'image');
  const videoAtt = post.attachments.find(a => a.type === 'video');
  const docAtt   = post.attachments.find(a => a.type === 'document');
  const eventAtt = post.attachments.find(a => a.type === 'event');
  const isOwner  = currentUser
    ? post.userId === currentUser.user_id || post.author_name === currentUser.user_name
    : false;

  return (
    <>
      {showEdit && (
        <EditPostModal post={post} onClose={() => setShowEdit(false)}
          onPostUpdated={updated => { if (!updated) onDelete(post.id); else onUpdate(updated); setShowEdit(false); }} />
      )}
      <article className="bg-white rounded-lg shadow mb-4">
        <div className="flex items-start justify-between p-4">
          <div className="flex items-start gap-3">
            <img src={avatar} alt={post.author_name} className="w-12 h-12 rounded-full object-cover" />
            <div>
              <h4 className="font-semibold text-gray-900 hover:text-blue-600 hover:underline cursor-pointer text-sm">{post.author_name || 'Unknown User'}</h4>
              {(post.author_headline || post.author_role) && <p className="text-xs text-gray-500 leading-tight mt-0.5">{post.author_headline || post.author_role}</p>}
              <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                <span>{timeAgo(post.created_at)}</span><span>·</span><Globe size={10} />
              </div>
            </div>
          </div>
          <PostOptionsMenu
            post={post} isOwner={isOwner} isSaved={isSaved} isFollowing={isFollowing}
            onEdit={() => setShowEdit(true)}
            onDelete={() => onDelete(post.id)}
            onHide={() => onDelete(post.id)}
            onSaveToggle={setIsSaved}
            onFollowToggle={setIsFollowing}
            // When repost succeeds in the menu, fire the ref so PostInteractions updates its count
            onReposted={() => notifyRepostedRef.current?.()}
          />
        </div>

        <div className="px-4 pb-3">
          {post.title       && <p className="font-semibold text-gray-900 mb-1">{post.title}</p>}
          {post.description && <p className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">{post.description}</p>}
          {imageAtt?.url && <img src={resolveUrl(imageAtt.url)} alt="Post image" className="w-full mt-3 rounded-xl object-cover max-h-[500px] cursor-pointer" />}
          {videoAtt?.url && (
            <div className="mt-3 rounded-xl overflow-hidden bg-black">
              <video src={resolveUrl(videoAtt.url)} controls className="w-full max-h-[400px] object-contain" />
            </div>
          )}
          {docAtt?.url && (
            <a href={resolveUrl(docAtt.url)} target="_blank" rel="noopener noreferrer"
              className="mt-3 flex items-center gap-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 transition-colors group">
              <span className="text-3xl">{getDocIcon(docAtt.mimeType)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600">{docAtt.originalName || 'Document'}</p>
                {docAtt.size && <p className="text-xs text-gray-500">{formatFileSize(docAtt.size)}</p>}
              </div>
              <File size={16} className="text-gray-400 group-hover:text-blue-500 shrink-0" />
            </a>
          )}
          {eventAtt?.name && (
            <div className="mt-3 border border-green-200 bg-green-50 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center shrink-0"><Calendar size={20} className="text-white" /></div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">{eventAtt.name}</p>
                  <div className="mt-1.5 space-y-1">
                    {(eventAtt.date || eventAtt.time) && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <Clock size={12} />
                        <span>{eventAtt.date ? new Date(eventAtt.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : ''}{eventAtt.time ? ` · ${eventAtt.time}` : ''}</span>
                      </div>
                    )}
                    {eventAtt.location && <div className="flex items-center gap-1.5 text-xs text-gray-600"><MapPin size={12} /><span>{eventAtt.location}</span></div>}
                    {eventAtt.eventUrl && <a href={eventAtt.eventUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-blue-600 hover:underline"><Link size={12} /><span>View event</span></a>}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <PostInteractions
          postId={post.id}
          currentUser={currentUser}
          initLiked={post.liked ?? false}
          initReposted={post.reposted ?? false}
          initLikes={post.likeCount ?? 0}
          initComments={post.commentCount ?? 0}
          initReposts={post.repostCount ?? 0}
          // Register the notify callback so the menu can trigger a count update
          onExternalRepost={cb => { notifyRepostedRef.current = cb; }}
        />
      </article>
    </>
  );
};

// ─── Feed ─────────────────────────────────────────────────────────────────────
const Feed = () => {
  const [showModal, setShowModal]       = useState(false);
  const [modalTab, setModalTab]         = useState<PostType>('text');
  const [currentUser, setCurrentUser]   = useState<CurrentUser | null>(null);
  const [userLoading, setUserLoading]   = useState(true);
  const [posts, setPosts]               = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsError, setPostsError]     = useState<string | null>(null);
  const avatarInputRef                  = useRef<HTMLInputElement>(null);

  const openModal = (tab: PostType = 'text') => { setModalTab(tab); setShowModal(true); };

  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch(`${BASE}/api/auth/me`, { credentials: 'include' });
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (!data.success || !data.user) throw new Error();
        const u = data.user;
        setCurrentUser({
          user_id: u.id ?? '', user_name: u.name ?? '', user_email: u.email ?? '',
          user_about: u.bio ?? '', user_avatar: u.avatar ?? '', user_cover: u.coverPage ?? '',
          user_headline: u.headline ?? '', user_role: u.role ?? '',
        });
      } catch { /* not logged in */ }
      finally { setUserLoading(false); }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch(`${BASE}/api/posts`, { credentials: 'include' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const raw  = Array.isArray(data.posts) ? data.posts : Array.isArray(data) ? data : [];
        setPosts(raw.map((p: Post) => ({ ...p, attachments: parseAttachments(p.attachments) })));
      } catch { setPostsError('Could not load posts. Please try refreshing.'); }
      finally { setPostsLoading(false); }
    })();
  }, []);

  const handlePostCreated = (newPost: Post) => {
    setPosts(prev => [{
      ...newPost, attachments: parseAttachments(newPost.attachments),
      author_name:     newPost.author_name     || currentUser?.user_name     || 'You',
      author_headline: newPost.author_headline ?? currentUser?.user_headline ?? null,
      author_role:     newPost.author_role     ?? currentUser?.user_role     ?? null,
      author_avatar:   newPost.author_avatar   ?? currentUser?.user_avatar   ?? null,
      author_bio:      newPost.author_bio      ?? null,
      likeCount: 0, commentCount: 0, repostCount: 0, liked: false, reposted: false,
    }, ...prev]);
  };

  const handleEditAvatar = async (file: File) => {
    const form = new FormData(); form.append('avatar', file);
    try {
      const res  = await fetch(`${BASE}/api/auth/update-avatar`, { method: 'POST', body: form, credentials: 'include' });
      const data = await res.json();
      if (res.ok && data.success && data.user)
        setCurrentUser(prev => prev ? { ...prev, user_avatar: data.user.avatar ?? prev.user_avatar } : prev);
    } catch { /* non-critical */ }
  };

  const handleEditCover = async (file: File) => {
    const form = new FormData(); form.append('cover', file);
    try {
      const res  = await fetch(`${BASE}/api/auth/update-cover`, { method: 'POST', body: form, credentials: 'include' });
      const data = await res.json();
      if (res.ok && data.success && data.user?.coverPage)
        setCurrentUser(prev => prev ? { ...prev, user_cover: data.user.coverPage } : prev);
    } catch { /* non-critical */ }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-center" toastOptions={{ style: { maxWidth: 420 } }} />
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-12">
        <div className="grid grid-cols-12 gap-6">

          {/* Left sidebar */}
          <aside className="col-span-12 lg:col-span-3">
            <div className="sticky top-20 space-y-4">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="relative h-36 w-full overflow-hidden">
                  {currentUser?.user_cover
                    ? <img src={resolveUrl(currentUser.user_cover)} alt="Cover" className="w-full h-full object-cover" />
                    : <div className="w-full h-full bg-gradient-to-r from-blue-500 to-blue-600" />}
                  <input type="file" accept="image/*" className="hidden" id="coverUpload"
                    onChange={e => { if (e.target.files?.[0]) handleEditCover(e.target.files[0]); e.target.value = ''; }} />
                  <button type="button" onClick={() => document.getElementById('coverUpload')?.click()}
                    className="absolute top-2 right-2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-1.5 rounded-full">
                    <Camera size={16} />
                  </button>
                </div>
                <div className="px-4 pb-4">
                  <div className="relative w-20 h-20 -mt-10 mb-2 group">
                    <img src={resolveUrl(currentUser?.user_avatar, currentUser?.user_name)} alt="Avatar"
                      className="w-20 h-20 rounded-full object-cover border-4 border-white" />
                    <input type="file" accept="image/*" className="hidden" ref={avatarInputRef}
                      onChange={e => { const f = e.target.files?.[0]; if (f) handleEditAvatar(f); e.target.value = ''; }} />
                    <button onClick={() => avatarInputRef.current?.click()}
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera size={16} />
                    </button>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg leading-tight">
                    {userLoading ? <span className="block h-5 w-32 bg-gray-200 rounded animate-pulse" /> : currentUser?.user_name || 'Your Name'}
                  </h3>
                  <p className="font-semibold text-blue-800 text-sm">
                    {userLoading ? <span className="block h-4 w-28 bg-blue-100 rounded animate-pulse mt-1" /> : currentUser?.user_role || ''}
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5 mb-3">
                    {userLoading ? <span className="block h-3 w-44 bg-gray-200 rounded animate-pulse mt-1" /> : currentUser?.user_headline || ''}
                  </p>
                  <div className="border-t border-gray-200 pt-3 space-y-0.5">
                    {[{ label: 'Profile viewers', value: '127' }, { label: 'Post impressions', value: '1,849' }].map(s => (
                      <div key={s.label} className="flex justify-between items-center py-1.5 hover:bg-gray-50 -mx-4 px-4 cursor-pointer rounded">
                        <span className="text-xs text-gray-600">{s.label}</span>
                        <span className="text-xs font-semibold text-blue-600">{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow divide-y divide-gray-100">
                {[{ emoji: '🔖', label: 'My Post' }, { emoji: '👥', label: 'My Groups' }, { emoji: '📅', label: 'My Events' }].map(item => (
                  <button key={item.label} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left">
                    <span className="text-lg">{item.emoji}</span>
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main feed */}
          <main className="col-span-12 lg:col-span-6">
            <div className="bg-white rounded-lg shadow p-4 mb-6 sticky top-20 z-10">
              <div className="flex items-center gap-3 mb-3 cursor-pointer" onClick={() => openModal('text')}>
                <img src={resolveUrl(currentUser?.user_avatar, currentUser?.user_name)} alt="You" className="w-11 h-11 rounded-full object-cover" />
                <div className="flex-1 border border-gray-300 rounded-full px-4 py-2.5 text-gray-500 text-sm hover:bg-gray-50">Start a post</div>
              </div>
              <div className="flex">
                {([
                  { tab: 'image'    as PostType, icon: <Image size={20} className="text-blue-600" />,      label: 'Photo'    },
                  { tab: 'video'    as PostType, icon: <VideoIcon size={20} className="text-amber-600" />, label: 'Video'    },
                  { tab: 'event'    as PostType, icon: <Calendar size={20} className="text-green-600" />,  label: 'Event'    },
                  { tab: 'document' as PostType, icon: <FileText size={20} className="text-red-500" />,    label: 'Document' },
                ]).map(({ tab, icon, label }) => (
                  <button key={tab} onClick={() => openModal(tab)}
                    className="flex items-center justify-center gap-2 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex-1">
                    {icon}<span className="text-sm font-semibold">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3 px-1">
              <div className="flex-1 border-t border-gray-300" />
              <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 whitespace-nowrap">
                Sort by: <strong className="ml-1">Top</strong><ChevronDown size={14} className="ml-0.5" />
              </button>
            </div>

            {postsLoading && (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white rounded-lg shadow p-4 animate-pulse">
                    <div className="flex gap-3 mb-4"><div className="w-12 h-12 rounded-full bg-gray-200 shrink-0" /><div className="flex-1 space-y-2 pt-1"><div className="h-4 bg-gray-200 rounded w-1/3" /><div className="h-3 bg-gray-200 rounded w-1/2" /></div></div>
                    <div className="space-y-2"><div className="h-3 bg-gray-200 rounded w-full" /><div className="h-3 bg-gray-200 rounded w-4/5" /></div>
                  </div>
                ))}
              </div>
            )}
            {!postsLoading && postsError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg flex items-center gap-2 mb-4">
                <AlertCircle size={16} className="shrink-0" />{postsError}
              </div>
            )}
            {!postsLoading && !postsError && posts.length === 0 && (
              <div className="bg-white rounded-lg shadow p-10 text-center">
                <p className="text-gray-500 font-medium">No posts yet</p>
                <p className="text-gray-400 text-sm mt-1">Be the first to share something!</p>
              </div>
            )}
            {!postsLoading && posts.map(post => (
              <PostCard key={post.id} post={post} currentUser={currentUser}
                onDelete={id => setPosts(prev => prev.filter(p => p.id !== id))}
                onUpdate={updated => setPosts(prev => prev.map(p => p.id === updated.id ? updated : p))} />
            ))}
          </main>

          {/* Right sidebar */}
          <aside className="col-span-12 lg:col-span-3">
            <div className="sticky top-20 space-y-4">
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Add to your feed</h3>
                <div className="space-y-4">
                  {[{ seed: 'John', name: 'John Doe', role: 'Product Designer at StartupCo' }, { seed: 'Jane', name: 'Jane Smith', role: 'Marketing Director at BigTech' }].map(p => (
                    <div key={p.seed} className="flex items-start gap-3">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${p.seed}`} alt={p.name} className="w-11 h-11 rounded-full" />
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-gray-900">{p.name}</p>
                        <p className="text-xs text-gray-500 mb-2">{p.role}</p>
                        <button className="flex items-center gap-1 text-gray-600 border border-gray-400 rounded-full px-3 py-0.5 text-sm font-semibold hover:border-gray-600 hover:bg-gray-50">
                          <Plus size={14} />Follow
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center gap-2 mb-4"><TrendingUp size={15} className="text-gray-700" /><h3 className="font-semibold text-gray-900">OMAH News</h3></div>
                <div className="space-y-3">
                  {[{ title: 'Tech layoffs continue', time: '1d ago', readers: '12,847' }, { title: 'AI transforms workplace', time: '2h ago', readers: '8,234' }, { title: 'Remote work trends 2024', time: '5h ago', readers: '15,932' }, { title: 'Startup funding rebounds', time: '1d ago', readers: '6,421' }].map(item => (
                    <div key={item.title} className="cursor-pointer hover:bg-gray-50 -mx-4 px-4 py-1.5 rounded transition-colors">
                      <p className="font-semibold text-sm text-gray-900">{item.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.time} · {item.readers} readers</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

        </div>
      </div>
      {showModal && <PostModal onClose={() => setShowModal(false)} currentUser={currentUser} onPostCreated={handlePostCreated} initialTab={modalTab} />}
    </div>
  );
};

export default Feed;