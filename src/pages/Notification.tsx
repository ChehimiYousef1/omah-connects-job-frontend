import React, { useState, useEffect } from 'react';
import {
  Bell,
  ThumbsUp,
  MessageCircle,
  UserPlus,
  Repeat2,
  Award,
  Briefcase,
  TrendingUp,
  Eye,
  MoreHorizontal,
  Trash2,
  Settings,
  CheckCheck,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type NotificationType =
  | 'like'
  | 'comment'
  | 'connection'
  | 'repost'
  | 'mention'
  | 'job'
  | 'milestone'
  | 'view';

type TabType = 'all' | 'mentions' | 'posts';

interface NotificationUser {
  name: string;
  avatar: string;
  headline?: string;
}

interface Notification {
  id: number;
  type: NotificationType;
  user: NotificationUser;
  action: string;
  content?: string;
  timeAgo: string;
  read: boolean;
  postImage?: string;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<
  NotificationType,
  { color: string; bg: string; label: string; icon: React.ReactNode }
> = {
  like:       { color: '#1D6FB8', bg: 'rgba(29,111,184,0.10)',  label: 'Reaction',   icon: <ThumbsUp    size={16} strokeWidth={2.5} /> },
  comment:    { color: '#1A8F9E', bg: 'rgba(26,143,158,0.10)',  label: 'Comment',    icon: <MessageCircle size={16} strokeWidth={2.5} /> },
  connection: { color: '#0A2A52', bg: 'rgba(10,42,82,0.10)',    label: 'Connection', icon: <UserPlus    size={16} strokeWidth={2.5} /> },
  repost:     { color: '#0E8A5F', bg: 'rgba(14,138,95,0.10)',   label: 'Repost',     icon: <Repeat2     size={16} strokeWidth={2.5} /> },
  mention:    { color: '#9B6200', bg: 'rgba(155,98,0,0.10)',    label: 'Mention',    icon: <MessageCircle size={16} strokeWidth={2.5} /> },
  job:        { color: '#3B5DB8', bg: 'rgba(59,93,184,0.10)',   label: 'Job',        icon: <Briefcase   size={16} strokeWidth={2.5} /> },
  milestone:  { color: '#B05A00', bg: 'rgba(176,90,0,0.10)',    label: 'Milestone',  icon: <Award       size={16} strokeWidth={2.5} /> },
  view:       { color: '#475569', bg: 'rgba(71,85,105,0.10)',   label: 'View',       icon: <Eye         size={16} strokeWidth={2.5} /> },
};

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    type: 'like',
    user: { name: 'Sarah Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', headline: 'Marketing Director at Adobe' },
    action: 'and 12 others liked your post',
    content: 'Excited to share that our team just launched...',
    timeAgo: '2h',
    read: false,
    postImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=100&h=100&fit=crop',
  },
  {
    id: 2,
    type: 'comment',
    user: { name: 'Michael Park', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael', headline: 'Product Designer at Airbnb' },
    action: 'commented on your post',
    content: 'Great insights! I completely agree with your perspective on design thinking.',
    timeAgo: '4h',
    read: false,
  },
  {
    id: 3,
    type: 'connection',
    user: { name: 'Emily Rodriguez', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily', headline: 'Frontend Developer at Netflix' },
    action: 'accepted your connection request',
    timeAgo: '6h',
    read: false,
  },
  {
    id: 4,
    type: 'repost',
    user: { name: 'David Kumar', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David', headline: 'Data Scientist at Meta' },
    action: 'reposted your post',
    content: 'Just finished an amazing coding session...',
    timeAgo: '8h',
    read: true,
  },
  {
    id: 5,
    type: 'milestone',
    user: { name: 'Jennifer Lee', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jennifer', headline: 'CEO at StartupCo' },
    action: 'celebrated a work anniversary',
    content: '5 years at StartupCo',
    timeAgo: '1d',
    read: true,
  },
  {
    id: 6,
    type: 'mention',
    user: { name: 'Alex Thompson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', headline: 'Product Manager at Microsoft' },
    action: 'mentioned you in a post',
    content: 'Thanks to @You for the amazing collaboration on this project!',
    timeAgo: '1d',
    read: true,
  },
  {
    id: 7,
    type: 'view',
    user: { name: 'Robert Anderson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert', headline: 'Cloud Architect at AWS' },
    action: 'viewed your profile',
    timeAgo: '2d',
    read: true,
  },
  {
    id: 8,
    type: 'job',
    user: { name: 'LinkedIn Jobs', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=LI&backgroundColor=0A2A52', headline: 'Job Recommendations' },
    action: 'New job openings match your profile',
    content: 'Senior Product Manager at Google and 5 other jobs',
    timeAgo: '2d',
    read: true,
  },
];

// ─── Styles (self-contained, no external CSS required) ────────────────────────

const GLOBAL_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=Outfit:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --clr-brand-900:   #071D3B;
    --clr-brand-800:   #0A2A52;
    --clr-brand-700:   #0D3468;
    --clr-accent-500:  #2DAEBF;
    --clr-accent-50:   #EEF9FB;
    --clr-slate-800:   #1E293B;
    --clr-slate-600:   #2F3E4D;
    --clr-slate-400:   #64748B;
    --clr-slate-200:   #CBD5E1;
    --clr-slate-100:   #F1F5F9;
    --clr-slate-50:    #F8FAFC;
    --clr-white:       #FFFFFF;
    --border-subtle:   rgba(10,42,82,0.08);
    --border-accent:   rgba(45,174,191,0.30);
    --shadow-sm:       0 2px 8px rgba(10,42,82,0.08);
    --shadow-md:       0 8px 28px rgba(10,42,82,0.12);
    --shadow-lg:       0 18px 52px rgba(10,42,82,0.15);
    --ease-spring:     cubic-bezier(0.34, 1.56, 0.64, 1);
    --ease-out:        cubic-bezier(0.16, 1, 0.3, 1);
    --font-display:    'Sora', sans-serif;
    --font-body:       'Outfit', sans-serif;
  }

  html { font-size: 16px; scroll-behavior: smooth; }

  body {
    font-family: var(--font-body);
    background: #F0F5FB;
    color: var(--clr-slate-800);
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  ::-webkit-scrollbar { width: 7px; }
  ::-webkit-scrollbar-track { background: #F0F5FB; }
  ::-webkit-scrollbar-thumb {
    background: linear-gradient(160deg, var(--clr-accent-500), var(--clr-brand-700));
    border-radius: 999px;
    border: 2px solid #F0F5FB;
  }

  @keyframes pageEnter {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes itemEnter {
    from { opacity: 0; transform: translateX(-10px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes slideOut {
    to { opacity: 0; transform: translateX(16px); max-height: 0; padding: 0; margin: 0; overflow: hidden; }
  }

  /* ── Page Wrapper ── */
  .ln-page {
    min-height: 100vh;
    padding: 32px 20px 80px;
    animation: pageEnter 0.5s var(--ease-out) both;
  }

  /* ── Layout ── */
  .ln-layout {
    max-width: 1060px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 288px;
    gap: 24px;
    align-items: start;
  }

  /* ── Panel ── */
  .ln-panel {
    background: var(--clr-white);
    border: 1px solid var(--border-subtle);
    border-radius: 18px;
    box-shadow: var(--shadow-sm);
    overflow: hidden;
  }

  /* ── Panel Header ── */
  .ln-panel-header {
    padding: 24px 28px 0;
  }

  .ln-header-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 20px;
  }

  .ln-title-group {}

  .ln-eyebrow {
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: var(--font-body);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--clr-accent-500);
    margin-bottom: 6px;
  }

  .ln-eyebrow-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: var(--clr-accent-500);
    animation: pulse 2.2s ease infinite;
  }

  @keyframes pulse {
    0%,100% { opacity:1; transform:scale(1); }
    50%      { opacity:0.35; transform:scale(0.65); }
  }

  .ln-title {
    font-family: var(--font-display);
    font-size: 26px;
    font-weight: 700;
    color: var(--clr-brand-800);
    letter-spacing: -0.03em;
    line-height: 1.15;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .ln-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, var(--clr-accent-500), var(--clr-brand-700));
    color: #fff;
    font-family: var(--font-display);
    font-size: 11px;
    font-weight: 700;
    min-width: 24px;
    height: 24px;
    padding: 0 7px;
    border-radius: 999px;
    box-shadow: 0 3px 10px rgba(45,174,191,0.38);
    vertical-align: middle;
  }

  .ln-header-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
    padding-top: 4px;
  }

  .ln-btn-text {
    display: flex;
    align-items: center;
    gap: 6px;
    height: 36px;
    padding: 0 16px;
    background: var(--clr-slate-50);
    border: 1.5px solid var(--border-subtle);
    border-radius: 10px;
    font-family: var(--font-body);
    font-size: 13px;
    font-weight: 600;
    color: var(--clr-slate-600);
    cursor: pointer;
    white-space: nowrap;
    transition: background 150ms, border-color 150ms, color 150ms, transform 150ms var(--ease-spring);
  }
  .ln-btn-text:hover {
    background: var(--clr-accent-50);
    border-color: var(--border-accent);
    color: #1A8F9E;
    transform: translateY(-1px);
  }

  .ln-btn-icon {
    width: 36px; height: 36px;
    border-radius: 10px;
    border: 1.5px solid var(--border-subtle);
    background: var(--clr-slate-50);
    color: var(--clr-slate-400);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    transition: background 150ms, border-color 150ms, color 150ms, transform 150ms var(--ease-spring);
  }
  .ln-btn-icon:hover {
    background: var(--clr-accent-50);
    border-color: var(--border-accent);
    color: var(--clr-accent-500);
    transform: rotate(20deg) scale(1.08);
  }

  /* ── Tabs ── */
  .ln-tabs {
    display: flex;
    gap: 0;
    margin-top: 4px;
  }

  .ln-tab {
    position: relative;
    background: none;
    border: none;
    padding: 13px 18px 15px;
    font-family: var(--font-body);
    font-size: 13.5px;
    font-weight: 500;
    color: var(--clr-slate-400);
    cursor: pointer;
    transition: color 150ms;
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 7px;
  }
  .ln-tab:hover { color: var(--clr-slate-600); }
  .ln-tab.active {
    color: var(--clr-brand-800);
    font-weight: 600;
  }
  .ln-tab.active::after {
    content: '';
    position: absolute;
    bottom: 0; left: 12px; right: 12px;
    height: 2.5px;
    background: linear-gradient(90deg, var(--clr-accent-500), var(--clr-brand-700));
    border-radius: 999px 999px 0 0;
  }

  .ln-tab-pill {
    font-size: 10px;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 999px;
    background: var(--clr-slate-100);
    color: var(--clr-slate-400);
    transition: background 150ms, color 150ms;
  }
  .ln-tab.active .ln-tab-pill {
    background: rgba(45,174,191,0.12);
    color: #1A8F9E;
  }

  /* ── Divider ── */
  .ln-divider {
    height: 1px;
    background: var(--border-subtle);
  }

  /* ── Notification List ── */
  .ln-list {}

  /* ── Notification Item ── */
  .ln-item {
    display: flex;
    align-items: center;
    gap: 13px;
    padding: 15px 24px;
    border-bottom: 1px solid var(--border-subtle);
    cursor: pointer;
    position: relative;
    transition: background 150ms;
    animation: itemEnter 0.35s var(--ease-out) both;
  }
  .ln-item:last-child { border-bottom: none; }
  .ln-item:hover { background: #FAFCFF; }
  .ln-item.unread { background: rgba(45,174,191,0.03); }
  .ln-item.unread:hover { background: rgba(45,174,191,0.06); }
  .ln-item.removing {
    animation: slideOut 0.3s var(--ease-out) forwards;
  }

  /* staggered entry */
  .ln-item:nth-child(1)  { animation-delay: 0ms; }
  .ln-item:nth-child(2)  { animation-delay: 40ms; }
  .ln-item:nth-child(3)  { animation-delay: 80ms; }
  .ln-item:nth-child(4)  { animation-delay: 120ms; }
  .ln-item:nth-child(5)  { animation-delay: 160ms; }
  .ln-item:nth-child(6)  { animation-delay: 200ms; }
  .ln-item:nth-child(7)  { animation-delay: 240ms; }
  .ln-item:nth-child(8)  { animation-delay: 280ms; }

  .ln-type-icon {
    width: 36px; height: 36px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    transition: transform 200ms var(--ease-spring);
  }
  .ln-item:hover .ln-type-icon { transform: scale(1.1); }

  .ln-avatar {
    width: 46px; height: 46px;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
    border: 2px solid var(--clr-slate-100);
    background: var(--clr-slate-100);
    transition: border-color 200ms, transform 200ms var(--ease-spring);
  }
  .ln-item:hover .ln-avatar { border-color: var(--border-accent); transform: scale(1.05); }
  .ln-avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }

  .ln-body { flex: 1; min-width: 0; }

  .ln-text {
    font-size: 13.5px;
    line-height: 1.5;
    color: var(--clr-slate-600);
    margin-bottom: 3px;
  }
  .ln-text .ln-name {
    font-weight: 600;
    color: var(--clr-brand-800);
  }
  .ln-item.unread .ln-text .ln-name { color: var(--clr-brand-900); }

  .ln-preview {
    font-size: 12px;
    color: var(--clr-slate-400);
    font-style: italic;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 420px;
    margin-bottom: 4px;
    line-height: 1.4;
  }

  .ln-headline {
    font-size: 12px;
    color: var(--clr-slate-400);
    margin-bottom: 4px;
  }

  .ln-meta {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .ln-time {
    font-size: 11.5px;
    font-weight: 500;
    color: var(--clr-slate-400);
    letter-spacing: 0.01em;
  }
  .ln-item.unread .ln-time { color: var(--clr-accent-500); font-weight: 600; }

  .ln-type-tag {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    padding: 2px 8px;
    border-radius: 999px;
    background: var(--clr-slate-100);
    color: var(--clr-slate-400);
  }

  .ln-thumbnail {
    width: 48px; height: 48px;
    border-radius: 10px;
    overflow: hidden;
    flex-shrink: 0;
    border: 1px solid var(--border-subtle);
  }
  .ln-thumbnail img { width: 100%; height: 100%; object-fit: cover; display: block; }

  .ln-actions {
    display: flex;
    gap: 5px;
    opacity: 0;
    transition: opacity 150ms;
  }
  .ln-item:hover .ln-actions { opacity: 1; }

  .ln-action-del,
  .ln-action-more {
    width: 30px; height: 30px;
    border-radius: 8px;
    border: 1px solid var(--border-subtle);
    background: var(--clr-slate-50);
    color: var(--clr-slate-400);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    transition: all 150ms;
  }
  .ln-action-del:hover {
    background: #FEF2F2;
    border-color: rgba(220,38,38,0.22);
    color: #DC2626;
  }
  .ln-action-more:hover {
    background: var(--clr-slate-100);
    color: var(--clr-slate-600);
  }

  .ln-unread-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: var(--clr-accent-500);
    flex-shrink: 0;
    box-shadow: 0 0 6px rgba(45,174,191,0.55);
  }

  /* ── Empty State ── */
  .ln-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 72px 24px;
    gap: 14px;
    color: var(--clr-slate-400);
    text-align: center;
    animation: fadeIn 0.4s ease both;
  }
  .ln-empty-icon {
    width: 64px; height: 64px;
    border-radius: 20px;
    background: var(--clr-slate-100);
    display: flex; align-items: center; justify-content: center;
    color: var(--clr-slate-400);
    margin-bottom: 4px;
  }
  .ln-empty h3 {
    font-family: var(--font-display);
    font-size: 18px;
    font-weight: 600;
    color: var(--clr-slate-600);
    letter-spacing: -0.02em;
  }
  .ln-empty p { font-size: 13px; color: var(--clr-slate-400); }

  /* ── Sidebar ── */
  .ln-sidebar {
    display: flex;
    flex-direction: column;
    gap: 16px;
    position: sticky;
    top: 32px;
    animation: pageEnter 0.5s 0.1s var(--ease-out) both;
  }

  .ln-card {
    background: var(--clr-white);
    border: 1px solid var(--border-subtle);
    border-radius: 18px;
    padding: 22px;
    box-shadow: var(--shadow-sm);
    transition: transform 250ms var(--ease-spring), box-shadow 250ms var(--ease-out);
  }
  .ln-card:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-md);
  }

  .ln-card-title {
    font-family: var(--font-display);
    font-size: 15px;
    font-weight: 600;
    color: var(--clr-brand-800);
    letter-spacing: -0.02em;
    margin-bottom: 8px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--border-subtle);
  }

  .ln-card-desc {
    font-size: 12.5px;
    color: var(--clr-slate-400);
    line-height: 1.6;
    margin-bottom: 14px;
    margin-top: 10px;
  }

  .ln-settings-btn {
    display: flex;
    align-items: center;
    gap: 7px;
    width: 100%;
    height: 36px;
    padding: 0 14px;
    background: var(--clr-slate-50);
    border: 1.5px solid var(--border-subtle);
    border-radius: 10px;
    font-family: var(--font-body);
    font-size: 12.5px;
    font-weight: 600;
    color: var(--clr-slate-600);
    cursor: pointer;
    transition: all 150ms;
  }
  .ln-settings-btn:hover {
    background: var(--clr-accent-50);
    border-color: var(--border-accent);
    color: #1A8F9E;
  }

  .ln-trending-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 9px 8px;
    margin: 0 -4px;
    border-radius: 10px;
    cursor: pointer;
    transition: background 150ms;
    border-bottom: 1px solid var(--border-subtle);
  }
  .ln-trending-item:last-child { border-bottom: none; }
  .ln-trending-item:hover { background: var(--clr-accent-50); }

  .ln-trend-icon {
    width: 28px; height: 28px;
    border-radius: 8px;
    background: rgba(45,174,191,0.1);
    display: flex; align-items: center; justify-content: center;
    color: var(--clr-accent-500);
    flex-shrink: 0;
    margin-top: 1px;
    transition: transform 200ms var(--ease-spring);
  }
  .ln-trending-item:hover .ln-trend-icon { transform: scale(1.1); }

  .ln-trend-title {
    font-size: 13px;
    font-weight: 600;
    color: var(--clr-brand-800);
    margin-bottom: 2px;
    line-height: 1.3;
  }
  .ln-trend-meta {
    font-size: 11.5px;
    color: var(--clr-slate-400);
  }

  /* ── Responsive ── */
  @media (max-width: 860px) {
    .ln-layout { grid-template-columns: 1fr; }
    .ln-sidebar { display: none; }
    .ln-page { padding: 20px 14px 60px; }
    .ln-panel-header { padding: 20px 20px 0; }
    .ln-item { padding: 13px 18px; }
    .ln-tabs .ln-tab { padding: 12px 14px 14px; font-size: 13px; }
  }

  @media (max-width: 480px) {
    .ln-title { font-size: 22px; }
    .ln-header-top { flex-direction: column; gap: 12px; }
    .ln-header-actions { width: 100%; }
    .ln-btn-text { flex: 1; justify-content: center; }
    .ln-item { padding: 12px 14px; gap: 10px; }
    .ln-type-icon { width: 30px; height: 30px; }
    .ln-avatar { width: 40px; height: 40px; }
    .ln-type-tag { display: none; }
    .ln-preview { max-width: 200px; }
  }
`;

// ─── Component ────────────────────────────────────────────────────────────────

const LinkedInNotifications: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [removingIds, setRemovingIds] = useState<Set<number>>(new Set());
  const [stylesInjected, setStylesInjected] = useState(false);

  // Inject styles once into <head>
  useEffect(() => {
    if (stylesInjected) return;
    const styleEl = document.createElement('style');
    styleEl.id = 'ln-notifications-styles';
    if (!document.getElementById('ln-notifications-styles')) {
      styleEl.textContent = GLOBAL_STYLE;
      document.head.appendChild(styleEl);
    }
    setStylesInjected(true);
    return () => {
      const el = document.getElementById('ln-notifications-styles');
      if (el) el.remove();
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const tabs: { id: TabType; label: string; count: number }[] = [
    { id: 'all',      label: 'All',          count: notifications.length },
    { id: 'mentions', label: 'My mentions',  count: notifications.filter((n) => n.type === 'mention').length },
    { id: 'posts',    label: 'My posts',     count: notifications.filter((n) => ['like','comment','repost'].includes(n.type)).length },
  ];

  const filtered = notifications.filter((n) => {
    if (activeTab === 'all')      return true;
    if (activeTab === 'mentions') return n.type === 'mention';
    if (activeTab === 'posts')    return ['like', 'comment', 'repost'].includes(n.type);
    return true;
  });

  const markAsRead = (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: number) => {
    setRemovingIds((prev) => new Set(prev).add(id));
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setRemovingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 300);
  };

  return (
    <div className="ln-page">
      <div className="ln-layout">

        {/* ── Main Panel ── */}
        <main className="ln-panel">

          {/* Header */}
          <div className="ln-panel-header">
            <div className="ln-header-top">
              <div className="ln-title-group">
                <div className="ln-eyebrow">
                  <span className="ln-eyebrow-dot" />
                  Activity Center
                </div>
                <h1 className="ln-title">
                  Notifications
                  {unreadCount > 0 && (
                    <span className="ln-badge">{unreadCount}</span>
                  )}
                </h1>
              </div>

              <div className="ln-header-actions">
                <button className="ln-btn-text" onClick={markAllAsRead}>
                  <CheckCheck size={14} />
                  Mark all read
                </button>
                <button className="ln-btn-icon" aria-label="Settings">
                  <Settings size={15} />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="ln-tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`ln-tab${activeTab === tab.id ? ' active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                  <span className="ln-tab-pill">{tab.count}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="ln-divider" />

          {/* List */}
          <div className="ln-list">
            {filtered.length === 0 ? (
              <div className="ln-empty">
                <div className="ln-empty-icon">
                  <Bell size={28} strokeWidth={1.5} />
                </div>
                <h3>No notifications here</h3>
                <p>New activity will appear in this tab</p>
              </div>
            ) : (
              filtered.map((n) => {
                const cfg = TYPE_CONFIG[n.type];
                const isRemoving = removingIds.has(n.id);
                return (
                  <div
                    key={n.id}
                    className={[
                      'ln-item',
                      n.read ? 'read' : 'unread',
                      isRemoving ? 'removing' : '',
                    ].join(' ').trim()}
                    onClick={() => markAsRead(n.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && markAsRead(n.id)}
                  >
                    {/* Type icon */}
                    <div
                      className="ln-type-icon"
                      style={{ backgroundColor: cfg.bg, color: cfg.color }}
                    >
                      {cfg.icon}
                    </div>

                    {/* Avatar */}
                    <div className="ln-avatar">
                      <img src={n.user.avatar} alt={n.user.name} loading="lazy" />
                    </div>

                    {/* Body */}
                    <div className="ln-body">
                      <div className="ln-text">
                        <span className="ln-name">{n.user.name}</span>
                        {' '}
                        <span>{n.action}</span>
                      </div>

                      {n.content && (
                        <p className="ln-preview">{n.content}</p>
                      )}

                      {n.user.headline && n.type === 'view' && (
                        <p className="ln-headline">{n.user.headline}</p>
                      )}

                      <div className="ln-meta">
                        <span className="ln-time">{n.timeAgo}</span>
                        <span className="ln-type-tag">{cfg.label}</span>
                      </div>
                    </div>

                    {/* Thumbnail */}
                    {n.postImage && (
                      <div className="ln-thumbnail">
                        <img src={n.postImage} alt="Post preview" loading="lazy" />
                      </div>
                    )}

                    {/* Actions */}
                    <div className="ln-actions">
                      <button
                        className="ln-action-del"
                        aria-label="Delete notification"
                        onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
                      >
                        <Trash2 size={15} />
                      </button>
                      <button
                        className="ln-action-more"
                        aria-label="More options"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal size={16} />
                      </button>
                    </div>

                    {/* Unread dot */}
                    {!n.read && <div className="ln-unread-dot" />}
                  </div>
                );
              })
            )}
          </div>
        </main>

        {/* ── Sidebar ── */}
        <aside className="ln-sidebar">

          {/* Settings card */}
          <div className="ln-card">
            <h3 className="ln-card-title">Notification settings</h3>
            <p className="ln-card-desc">
              Manage how you receive notifications and control what activity alerts you.
            </p>
            <button className="ln-settings-btn">
              <Settings size={14} />
              View all settings
            </button>
          </div>

          {/* Trending card */}
          <div className="ln-card">
            <h3 className="ln-card-title">Trending now</h3>

            {[
              { title: 'AI Revolution 2025',    readers: '12.5K readers' },
              { title: 'Remote Work Trends',    readers: '8.2K readers'  },
              { title: 'Tech Layoffs Continue', readers: '15.3K readers' },
            ].map((item) => (
              <div key={item.title} className="ln-trending-item">
                <div className="ln-trend-icon">
                  <TrendingUp size={14} strokeWidth={2.5} />
                </div>
                <div>
                  <div className="ln-trend-title">{item.title}</div>
                  <div className="ln-trend-meta">{item.readers}</div>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default LinkedInNotifications;