import React, { useState, useRef } from 'react';
import {
  X, Loader, CheckCircle, AlertCircle, Image, Video as VideoIcon,
  FileText, Calendar, Globe, Users, Lock, Users2, CalendarDays,
  Building2, Layers, CalendarCheck, User, ChevronDown, MapPin,
  Clock, Link as LinkIcon, Pencil, Trash2, Eye as VisibilityIcon
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Types & Interfaces
// ─────────────────────────────────────────────────────────────────────────────

type PostType = 'text' | 'image' | 'video' | 'document' | 'event';

interface Attachment {
  type: 'image' | 'video' | 'document' | 'event';
  url?: string;
  originalName?: string;
  mimeType?: string;
  size?: number;
  name?: string;
  date?: string;
  time?: string;
  location?: string;
}

interface Post {
  id: string;
  userId: string;
  title: string | null;
  description: string | null;
  attachments: Attachment[];
  postType: PostType;
  visibility: string;
  created_at: string;
  author_name: string;
  author_headline: string | null;
  author_role: string | null;
  author_avatar: string | null;
  author_bio: string | null;
}

interface EditPostModalProps {
  post: Post | null; // Allow null to prevent crash during parent state updates
  onClose: () => void;
  onPostUpdated: (updatedPost: Post | null) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants & Helpers
// ─────────────────────────────────────────────────────────────────────────────

const VISIBILITY_OPTIONS = [
  { label: 'Anyone', icon: Globe },
  { label: 'Connections', icon: Users },
  { label: 'Group Members', icon: Users2 },
  { label: 'Private', icon: Lock },
];

const acceptMap: Record<string, string> = {
  image: 'image/*',
  video: 'video/*',
  document: '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt',
};

const resolveUrl = (path?: string) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `http://localhost:3001${path.startsWith('/') ? '' : '/'}${path}`;
};

const getDocIcon = (mime?: string) => {
  if (mime?.includes('pdf')) return '📕';
  if (mime?.includes('word')) return '📘';
  if (mime?.includes('excel') || mime?.includes('sheet')) return '📗';
  return '📄';
};

const parseAttachments = (raw: any): Attachment[] => {
  if (Array.isArray(raw)) return raw;
  try {
    return typeof raw === 'string' ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// EditPostModal Component
// ─────────────────────────────────────────────────────────────────────────────

export const EditPostModal = ({ post, onClose, onPostUpdated }: EditPostModalProps) => {
  // Guard Clause: If parent sets post to null, unmount immediately
  if (!post) return null;

  // ── State ──────────────────────────────────────────────────────────────────
  const [title, setTitle] = useState(post.title ?? '');
  const [description, setDesc] = useState(post.description ?? '');
  const [visibility, setVisibility] = useState(post.visibility ?? 'Anyone');
  const [visDropdown, setVisDrop] = useState(false);
  const [activeTab, setActiveTab] = useState<PostType>(post.postType);

  const fileRef = useRef<HTMLInputElement>(null);
  const [newFile, setNewFile] = useState<File | null>(null);
  const [newPreview, setNewPreview] = useState<string | null>(null);
  const [removeAtt, setRemoveAtt] = useState(false);

  const eventAtt = post.attachments.find(a => a.type === 'event');
  const [eventName, setEventName] = useState(eventAtt?.name ?? '');
  const [eventDate, setEventDate] = useState(eventAtt?.date ?? '');
  const [eventTime, setEventTime] = useState(eventAtt?.time ?? '');
  const [eventLocation, setEventLocation] = useState(eventAtt?.location ?? '');
  const [eventUrl, setEventUrl] = useState(eventAtt?.url ?? '');

  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMsg, setStatusMsg] = useState('');

  const imageAtt = post.attachments.find(a => a.type === 'image');
  const videoAtt = post.attachments.find(a => a.type === 'video');
  const docAtt = post.attachments.find(a => a.type === 'document');

  // ── Logic ──────────────────────────────────────────────────────────────────
  const validate = (): string | null => {
    if (activeTab === 'event') {
      if (!eventName.trim()) return 'Event name is required.';
      if (!eventDate.trim()) return 'Event date is required.';
      return null;
    }
    const willHaveAttachment = newFile || (!removeAtt && (!!imageAtt?.url || !!videoAtt?.url || !!docAtt?.url));
    if (!description.trim() && !willHaveAttachment) return 'Please write something or keep an attachment.';
    return null;
  };

  const shouldDeletePost = (): boolean => {
    if (activeTab === 'event') return false;
    const noText = !title.trim() && !description.trim();
    const hasExistingFile = !removeAtt && (!!imageAtt?.url || !!videoAtt?.url || !!docAtt?.url);
    const hasNewFile = !!newFile;
    return noText && !hasExistingFile && !hasNewFile;
  };

  const switchTab = (type: PostType) => {
    setActiveTab(type);
    setRemoveAtt(false);
    setNewFile(null);
    setNewPreview(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setNewFile(file);
    if (file && activeTab === 'image') setNewPreview(URL.createObjectURL(file));
    else setNewPreview(null);
  };

  const handleSubmit = async () => {
    // 1️⃣ AUTO-DELETE LOGIC
    if (shouldDeletePost()) {
      if (!window.confirm("This post will be empty. Delete permanently?")) return;

      try {
        setSubmitting(true);
        setStatus('idle');
        const res = await fetch(`http://localhost:3001/api/posts/${post.id}`, {
          method: 'DELETE',
          credentials: 'include' 
        });
        const data = await res.json();

        if (res.ok && data.success) {
          setStatus('success');
          setStatusMsg(data.message || 'Post deleted');
          
          // Sequence is critical: Hide modal first, then notify parent
          setTimeout(() => {
            onClose(); 
            onPostUpdated(null); 
          }, 800);
        } else {
          throw new Error(data.error || 'Delete failed');
        }
      } catch (err: any) {
        setStatus('error');
        setStatusMsg(err.message || 'Error deleting post');
      } finally {
        setSubmitting(false);
      }
      return;
    }

    // 2️⃣ UPDATE LOGIC
    const err = validate();
    if (err) { setStatus('error'); setStatusMsg(err); return; }

    setSubmitting(true);
    setStatus('idle');

    const form = new FormData();
    form.append('title', title.trim());
    form.append('description', description.trim());
    form.append('visibility', visibility);
    form.append('postType', activeTab);

    if (newFile) form.append('file', newFile);
    else if (removeAtt) form.append('removeAttachment', 'true');

    if (activeTab === 'event') {
      form.append('eventName', eventName);
      form.append('eventDate', eventDate);
      form.append('eventTime', eventTime);
      form.append('eventLocation', eventLocation);
      form.append('eventUrl', eventUrl);
    }

    try {
      const res = await fetch(`http://localhost:3001/api/posts/${post.id}`, {
        method: 'PUT',
        body: form,
        credentials: 'include',
      });
      const data = await res.json();

      if (res.ok) {
        const updated: Post = { 
          ...post, 
          ...data.post, 
          attachments: parseAttachments(data.post?.attachments ?? post.attachments) 
        };
        setStatus('success');
        setStatusMsg('Post updated successfully');
        setTimeout(() => {
          onPostUpdated(updated);
          onClose();
        }, 800);
      } else {
        setStatus('error');
        setStatusMsg(data.error || 'Update failed');
      }
    } catch {
      setStatus('error');
      setStatusMsg('Network error');
    } finally {
      setSubmitting(false);
    }
  };

  const RemovedPlaceholder = ({ label, onUndo, onReplace }: any) => (
    <div className="border-2 border-dashed border-red-200 bg-red-50 rounded-xl py-5 px-4 flex flex-col items-center gap-2">
      <p className="text-sm text-red-500 font-medium">{label} will be removed</p>
      <div className="flex gap-3">
        <button onClick={onUndo} className="text-xs text-gray-500 underline">Undo</button>
        <button onClick={onReplace} className="text-xs text-blue-600 underline">Replace</button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[92vh]" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b shrink-0">
          <div className="flex items-center gap-2">
            <Pencil size={18} className="text-blue-600" />
            <h2 className="text-xl font-semibold">Edit post</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        {/* Tabs */}
        <div className="flex border-b px-4 bg-gray-50 overflow-x-auto">
          {(['text', 'image', 'video', 'document', 'event'] as PostType[]).map(type => (
            <button
              key={type}
              onClick={() => switchTab(type)}
              className={`px-4 py-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === type ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400'}`}
            >
              {type.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
          <div className="relative">
            <button onClick={() => setVisDrop(!visDropdown)} className="flex items-center gap-1 text-xs border rounded-full px-3 py-1 hover:bg-gray-50">
              <VisibilityIcon size={12} /> {visibility} <ChevronDown size={12} />
            </button>
            {visDropdown && (
              <div className="absolute left-0 mt-1 w-48 bg-white border rounded-xl shadow-lg z-50">
                {VISIBILITY_OPTIONS.map(opt => (
                  <button key={opt.label} onClick={() => { setVisibility(opt.label); setVisDrop(false); }} className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 text-left">
                    <opt.icon size={14} /> {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title (optional)" className="w-full text-lg font-bold focus:outline-none border-b py-1" />
          <textarea value={description} onChange={e => setDesc(e.target.value)} placeholder="What's on your mind?" className="w-full min-h-[120px] focus:outline-none resize-none text-gray-700" />

          {/* Attachments Section */}
          {activeTab === 'image' && (
            <div className="space-y-3">
              {newPreview ? (
                <div className="relative group"><img src={newPreview} className="rounded-xl w-full max-h-80 object-cover" /><button onClick={() => {setNewFile(null); setNewPreview(null);}} className="absolute top-2 right-2 bg-black/70 text-white p-1.5 rounded-full"><X size={16}/></button></div>
              ) : removeAtt ? (
                <RemovedPlaceholder label="Image" onUndo={() => setRemoveAtt(false)} onReplace={() => fileRef.current?.click()} />
              ) : imageAtt?.url ? (
                <div className="relative group"><img src={resolveUrl(imageAtt.url)} className="rounded-xl w-full max-h-80 object-cover" /><button onClick={() => setRemoveAtt(true)} className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full shadow-lg"><Trash2 size={16}/></button></div>
              ) : (
                <button onClick={() => fileRef.current?.click()} className="w-full border-2 border-dashed p-10 rounded-xl text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-all flex flex-col items-center gap-2"><Image size={32}/><span className="text-sm font-medium">Add Photo</span></button>
              )}
            </div>
          )}

          {activeTab === 'video' && (
            <div className="space-y-3">
              {newFile ? (
                <div className="relative"><video src={URL.createObjectURL(newFile)} controls className="rounded-xl w-full max-h-80" /><button onClick={() => setNewFile(null)} className="absolute top-2 right-2 bg-black/70 text-white p-1.5 rounded-full"><X size={16}/></button></div>
              ) : removeAtt ? (
                <RemovedPlaceholder label="Video" onUndo={() => setRemoveAtt(false)} onReplace={() => fileRef.current?.click()} />
              ) : videoAtt?.url ? (
                <div className="relative"><video src={resolveUrl(videoAtt.url)} controls className="rounded-xl w-full max-h-80" /><button onClick={() => setRemoveAtt(true)} className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full shadow-lg"><Trash2 size={16}/></button></div>
              ) : (
                <button onClick={() => fileRef.current?.click()} className="w-full border-2 border-dashed p-10 rounded-xl text-gray-400 hover:text-amber-500 hover:bg-amber-50 transition-all flex flex-col items-center gap-2"><VideoIcon size={32}/><span className="text-sm font-medium">Add Video</span></button>
              )}
            </div>
          )}

          {activeTab === 'document' && (
            <div className="space-y-3">
              {newFile ? (
                <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-xl border border-blue-100"><span className="text-2xl">{getDocIcon(newFile.type)}</span> <span className="flex-1 truncate font-medium text-blue-700">{newFile.name}</span> <button onClick={() => setNewFile(null)} className="text-blue-400 hover:text-blue-600"><X size={18}/></button></div>
              ) : removeAtt ? (
                <RemovedPlaceholder label="Document" onUndo={() => setRemoveAtt(false)} onReplace={() => fileRef.current?.click()} />
              ) : docAtt?.url ? (
                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200"><span>{getDocIcon(docAtt.mimeType)}</span> <span className="flex-1 truncate font-medium text-gray-700">{docAtt.originalName}</span> <button onClick={() => setRemoveAtt(true)} className="text-red-400 hover:text-red-600"><Trash2 size={18}/></button></div>
              ) : (
                <button onClick={() => fileRef.current?.click()} className="w-full border-2 border-dashed p-10 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all flex flex-col items-center gap-2"><FileText size={32}/><span className="text-sm font-medium">Add Document</span></button>
              )}
            </div>
          )}

          {activeTab === 'event' && (
            <div className="p-5 bg-green-50 rounded-xl space-y-4 border border-green-100">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-green-700 uppercase ml-1">Event Name</label>
                <input value={eventName} onChange={e => setEventName(e.target.value)} placeholder="Untitled Event" className="w-full p-2.5 bg-white border border-green-200 rounded-lg focus:ring-2 ring-green-500 outline-none" />
              </div>
              <div className="flex gap-3">
                <div className="flex-1 space-y-1">
                  <label className="text-[10px] font-bold text-green-700 uppercase ml-1">Date</label>
                  <input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} className="w-full p-2.5 bg-white border border-green-200 rounded-lg outline-none" />
                </div>
                <div className="flex-1 space-y-1">
                  <label className="text-[10px] font-bold text-green-700 uppercase ml-1">Time</label>
                  <input type="time" value={eventTime} onChange={e => setEventTime(e.target.value)} className="w-full p-2.5 bg-white border border-green-200 rounded-lg outline-none" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-green-700 uppercase ml-1">Location / Link</label>
                <input value={eventLocation} onChange={e => setEventLocation(e.target.value)} placeholder="Physical location or URL" className="w-full p-2.5 bg-white border border-green-200 rounded-lg outline-none" />
              </div>
            </div>
          )}

          <input type="file" ref={fileRef} className="hidden" accept={acceptMap[activeTab]} onChange={handleFileChange} />
        </div>

        {/* Status Messages */}
        {statusMsg && (
          <div className={`mx-5 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium ${status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {status === 'success' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
            {statusMsg}
          </div>
        )}

        {/* Footer */}
        <div className="p-5 border-t flex justify-end items-center gap-3 shrink-0">
          <button onClick={onClose} className="px-5 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors">Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className={`px-8 py-2.5 rounded-full font-bold text-sm shadow-sm transition-all flex items-center gap-2 
              ${submitting ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'}`}
          >
            {submitting && <Loader size={14} className="animate-spin" />}
            {submitting ? 'Processing...' : shouldDeletePost() ? 'Delete Post' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPostModal;