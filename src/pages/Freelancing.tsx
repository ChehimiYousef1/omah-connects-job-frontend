import React, { useState, useEffect } from 'react';
import {
  Search, MapPin, SlidersHorizontal, Bookmark, FileText,
  Clock, TrendingUp, Award, Briefcase, DollarSign, Users2,
  Zap, ExternalLink, Share2, Bell, ChevronRight, Building2,
  CheckCircle2, ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  level: string;
  postedTime: string;
  applicants: number;
  logo: string;
  easyApply: boolean;
  activelyRecruiting: boolean;
  promoted: boolean;
  description: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  salary: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const JOBS: Job[] = [
  {
    id: 1,
    title: 'Senior Software Engineer',
    company: 'TechCorp Inc.',
    location: 'Remote',
    type: 'Full-time',
    level: 'Mid-Senior level',
    postedTime: '2 hours ago',
    applicants: 47,
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=TC&backgroundColor=0a66c2',
    easyApply: true,
    activelyRecruiting: true,
    promoted: false,
    description: "We're looking for a talented Senior Software Engineer to join our growing team. You'll be working on cutting-edge technology and building scalable solutions that impact millions of users.",
    responsibilities: [
      'Design and develop scalable backend services',
      'Collaborate with cross-functional teams',
      'Mentor junior developers',
      'Participate in code reviews and architecture discussions',
    ],
    requirements: [
      '5+ years of software engineering experience',
      'Strong proficiency in Python, Java, or Go',
      'Experience with cloud platforms (AWS, GCP, or Azure)',
      'Excellent problem-solving skills',
    ],
    skills: ['Python', 'AWS', 'React', 'Docker'],
    salary: '$120k – $180k/year',
  },
  {
    id: 2,
    title: 'Product Designer',
    company: 'DesignHub',
    location: 'San Francisco, CA (Hybrid)',
    type: 'Full-time',
    level: 'Entry level',
    postedTime: '5 hours ago',
    applicants: 89,
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=DH&backgroundColor=e16745',
    easyApply: true,
    activelyRecruiting: false,
    promoted: true,
    description: 'Join our design team to create beautiful and intuitive user experiences. We are looking for someone passionate about design who can translate complex problems into elegant solutions.',
    responsibilities: [
      'Create user-centered designs for web and mobile',
      'Develop wireframes, prototypes, and high-fidelity mockups',
      'Conduct user research and usability testing',
      'Collaborate with product and engineering teams',
    ],
    requirements: [
      '2+ years of product design experience',
      'Proficiency in Figma and design systems',
      'Strong portfolio demonstrating UX/UI work',
      'Understanding of front-end development',
    ],
    skills: ['Figma', 'UI/UX', 'Prototyping', 'User Research'],
    salary: '$90k – $130k/year',
  },
  {
    id: 3,
    title: 'Marketing Manager',
    company: 'GrowthCo',
    location: 'New York, NY (On-site)',
    type: 'Full-time',
    level: 'Mid-Senior level',
    postedTime: '1 day ago',
    applicants: 124,
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=GC&backgroundColor=57bb63',
    easyApply: false,
    activelyRecruiting: true,
    promoted: false,
    description: 'Lead our marketing efforts and drive growth for our B2B SaaS platform. You will develop and execute marketing strategies that generate qualified leads and build brand awareness.',
    responsibilities: [
      'Develop and execute marketing strategies',
      'Manage digital marketing campaigns',
      'Analyze campaign performance and ROI',
      'Lead a team of marketing specialists',
    ],
    requirements: [
      '5+ years in B2B marketing',
      'Experience with marketing automation tools',
      'Strong analytical and leadership skills',
      'Proven track record of lead generation',
    ],
    skills: ['Digital Marketing', 'SEO', 'Content Marketing', 'Analytics'],
    salary: '$100k – $140k/year',
  },
  {
    id: 4,
    title: 'Data Scientist',
    company: 'DataWorks AI',
    location: 'Remote',
    type: 'Full-time',
    level: 'Mid-Senior level',
    postedTime: '2 days ago',
    applicants: 203,
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=DW&backgroundColor=8b5cf6',
    easyApply: true,
    activelyRecruiting: false,
    promoted: false,
    description: 'Help us build the next generation of AI-powered analytics tools. You will work with large datasets and develop machine learning models that drive business decisions.',
    responsibilities: [
      'Build and deploy machine learning models',
      'Analyze complex datasets',
      'Collaborate with product and engineering teams',
      'Present insights to stakeholders',
    ],
    requirements: [
      'PhD or Master\'s in Data Science, Statistics, or related field',
      'Strong programming skills in Python and R',
      'Experience with ML frameworks (TensorFlow, PyTorch)',
      'Excellent communication skills',
    ],
    skills: ['Python', 'Machine Learning', 'SQL', 'Statistics'],
    salary: '$130k – $190k/year',
  },
  {
    id: 5,
    title: 'DevOps Engineer',
    company: 'CloudScale',
    location: 'Austin, TX (Hybrid)',
    type: 'Full-time',
    level: 'Mid-Senior level',
    postedTime: '3 days ago',
    applicants: 67,
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=CS&backgroundColor=f59e0b',
    easyApply: true,
    activelyRecruiting: true,
    promoted: false,
    description: 'Join our infrastructure team to build and maintain scalable cloud infrastructure. You will automate deployments and ensure our systems run smoothly at scale.',
    responsibilities: [
      'Design and maintain CI/CD pipelines',
      'Manage cloud infrastructure (AWS/GCP)',
      'Implement monitoring and alerting systems',
      'Optimize system performance and costs',
    ],
    requirements: [
      '3+ years of DevOps experience',
      'Strong knowledge of Kubernetes and Docker',
      'Experience with infrastructure as code (Terraform)',
      'Scripting skills in Python or Bash',
    ],
    skills: ['Kubernetes', 'AWS', 'Terraform', 'CI/CD'],
    salary: '$110k – $160k/year',
  },
];

// ─── Styles ───────────────────────────────────────────────────────────────────

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=Outfit:wght@300;400;500;600;700&display=swap');

/* ── Tokens ── */
:root {
  --brand-900:  #071D3B;
  --brand-800:  #0A2A52;
  --brand-700:  #0D3468;
  --brand-100:  #E6EEF8;
  --brand-50:   #F0F5FB;
  --accent-700: #1F8E9E;
  --accent-500: #2DAEBF;
  --accent-100: #C8EFF4;
  --accent-50:  #EEF9FB;
  --slate-800:  #1E293B;
  --slate-600:  #2F3E4D;
  --slate-400:  #64748B;
  --slate-200:  #CBD5E1;
  --slate-100:  #F1F5F9;
  --slate-50:   #F8FAFC;
  --white:      #FFFFFF;
  --success:    #16A34A;
  --warning:    #D97706;

  --border:     rgba(10,42,82,0.08);
  --border-md:  rgba(10,42,82,0.12);
  --border-acc: rgba(45,174,191,0.28);

  --sh-xs:  0 1px 3px rgba(10,42,82,0.07);
  --sh-sm:  0 2px 10px rgba(10,42,82,0.09);
  --sh-md:  0 8px 28px rgba(10,42,82,0.11);
  --sh-lg:  0 18px 52px rgba(10,42,82,0.14);
  --sh-acc: 0 6px 22px rgba(45,174,191,0.28);

  --r-sm:   8px;
  --r-md:   12px;
  --r-lg:   16px;
  --r-xl:   20px;
  --r-full: 9999px;

  --ease-out:    cubic-bezier(0.16,1,0.3,1);
  --ease-spring: cubic-bezier(0.34,1.56,0.64,1);

  --font-d: 'Sora', sans-serif;
  --font-b: 'Outfit', sans-serif;

  --navbar-h:    60px;
  --search-h:    70px;
  --sidebar-w:   228px;
  --list-w:      380px;
}

/* ── Reset ── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: 16px; scroll-behavior: smooth; }
body {
  font-family: var(--font-b);
  background: #EFF4FA;
  color: var(--slate-800);
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}
body::before {
  content: '';
  position: fixed; inset: 0;
  background:
    radial-gradient(ellipse 55% 35% at 5%  0%,   rgba(45,174,191,0.06) 0%, transparent 60%),
    radial-gradient(ellipse 45% 45% at 95% 100%,  rgba(10,42,82,0.05)  0%, transparent 60%);
  pointer-events: none; z-index: 0;
}
img { display: block; max-width: 100%; }
button { cursor: pointer; font-family: var(--font-b); }
a { text-decoration: none; color: inherit; }
ul { list-style: none; }

::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--slate-100); }
::-webkit-scrollbar-thumb {
  background: linear-gradient(160deg, var(--accent-500), var(--brand-700));
  border-radius: var(--r-full);
}
:focus-visible { outline: 2px solid var(--accent-500); outline-offset: 3px; border-radius: 4px; }

/* ── Animations ── */
@keyframes pageIn  { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:none; } }
@keyframes slideIn { from { opacity:0; transform:translateX(-14px); } to { opacity:1; transform:none; } }
@keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
@keyframes detailIn{ from { opacity:0; transform:translateX(14px); } to { opacity:1; transform:none; } }

/* ── Page wrapper ── */
.lj-page {
  min-height: 100vh;
  position: relative; z-index: 1;
  animation: pageIn 0.5s var(--ease-out) both;
}

/* ───────────────────────────────────────────
   SEARCH BAR
─────────────────────────────────────────── */
.lj-search-bar {
  background: rgba(255,255,255,0.88);
  backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid var(--border);
  box-shadow: var(--sh-sm);
  position: sticky;
  top: 0;
  z-index: 90;
  padding: 14px 0;
}

.lj-search-inner {
  max-width: 1260px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  gap: 10px;
  align-items: center;
}

.lj-search-field {
  position: relative;
  flex: 1;
}
.lj-search-field svg {
  position: absolute; left: 14px; top: 50%;
  transform: translateY(-50%);
  color: var(--accent-500); pointer-events: none;
}
.lj-search-field input {
  width: 100%;
  height: 42px;
  padding: 0 14px 0 42px;
  border: 1.5px solid var(--border-md);
  border-radius: var(--r-full);
  background: var(--slate-50);
  font-family: var(--font-b);
  font-size: 14px;
  font-weight: 500;
  color: var(--slate-800);
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  outline: none;
}
.lj-search-field input::placeholder { color: var(--slate-400); }
.lj-search-field input:focus {
  border-color: var(--accent-500);
  background: var(--white);
  box-shadow: 0 0 0 4px rgba(45,174,191,0.11), var(--sh-xs);
}

.lj-btn-filter {
  display: flex; align-items: center; gap: 7px;
  height: 42px; padding: 0 18px;
  border: 1.5px solid var(--border-md);
  border-radius: var(--r-full);
  background: var(--slate-50);
  font-family: var(--font-b); font-size: 13.5px; font-weight: 600;
  color: var(--slate-600);
  white-space: nowrap;
  transition: all 0.2s;
}
.lj-btn-filter:hover {
  background: var(--accent-50); border-color: var(--border-acc); color: var(--accent-700);
}

.lj-btn-search {
  height: 42px; padding: 0 24px;
  border: none; border-radius: var(--r-full);
  background: linear-gradient(135deg, var(--accent-500), var(--brand-700));
  color: var(--white);
  font-family: var(--font-b); font-size: 14px; font-weight: 600;
  white-space: nowrap;
  box-shadow: var(--sh-acc);
  transition: transform 0.2s var(--ease-spring), box-shadow 0.2s, filter 0.15s;
  position: relative; overflow: hidden;
}
.lj-btn-search::after {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.16) 0%, transparent 55%);
  pointer-events: none;
}
.lj-btn-search:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(45,174,191,0.38);
  filter: brightness(1.05);
}

/* ───────────────────────────────────────────
   LAYOUT
─────────────────────────────────────────── */
.lj-layout {
  max-width: 1260px;
  margin: 0 auto;
  padding: 24px 24px 80px;
  display: grid;
  grid-template-columns: var(--sidebar-w) var(--list-w) 1fr;
  gap: 22px;
  align-items: start;
}

/* ───────────────────────────────────────────
   LEFT SIDEBAR
─────────────────────────────────────────── */
.lj-sidebar {
  position: sticky;
  top: calc(var(--search-h) + 24px);
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--r-xl);
  box-shadow: var(--sh-sm);
  overflow: hidden;
  animation: slideIn 0.5s 0.05s var(--ease-out) both;
  transition: box-shadow 0.25s;
}
.lj-sidebar:hover { box-shadow: var(--sh-md); }

.lj-sidebar-section {
  padding: 16px 0;
  border-bottom: 1px solid var(--border);
}
.lj-sidebar-section:last-child { border-bottom: none; }

.lj-sidebar-title {
  font-family: var(--font-d);
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--slate-400);
  padding: 0 18px 10px;
}

.lj-sidebar-item {
  display: flex; align-items: center; gap: 11px;
  padding: 11px 18px;
  font-size: 13.5px; font-weight: 500;
  color: var(--slate-600);
  border-left: 3px solid transparent;
  transition: all 0.18s;
  position: relative;
}
.lj-sidebar-item svg { color: var(--slate-400); flex-shrink: 0; transition: color 0.18s; }
.lj-sidebar-item:hover {
  background: var(--accent-50); color: var(--accent-700);
  border-left-color: var(--accent-500);
  padding-left: 22px;
}
.lj-sidebar-item:hover svg { color: var(--accent-500); }
.lj-sidebar-item.active {
  background: var(--accent-50); color: var(--accent-700);
  border-left-color: var(--accent-500);
  font-weight: 600; padding-left: 22px;
}
.lj-sidebar-item.active svg { color: var(--accent-500); }

.lj-sidebar-badge {
  margin-left: auto;
  background: linear-gradient(135deg, var(--accent-500), var(--brand-700));
  color: var(--white);
  font-size: 10.5px; font-weight: 700;
  padding: 2px 9px; border-radius: var(--r-full);
  box-shadow: 0 2px 7px rgba(45,174,191,0.3);
}

.lj-post-btn {
  display: block; width: calc(100% - 32px); margin: 16px;
  height: 40px; border: none; border-radius: var(--r-full);
  background: linear-gradient(135deg, var(--accent-500), var(--brand-700));
  color: var(--white);
  font-family: var(--font-b); font-size: 13.5px; font-weight: 600;
  box-shadow: var(--sh-acc);
  transition: transform 0.2s var(--ease-spring), box-shadow 0.2s;
  position: relative; overflow: hidden;
}
.lj-post-btn::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 55%);
  pointer-events: none;
}
.lj-post-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 26px rgba(45,174,191,0.36);
}

/* ───────────────────────────────────────────
   JOB LIST
─────────────────────────────────────────── */
.lj-list-panel {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--r-xl);
  box-shadow: var(--sh-sm);
  display: flex; flex-direction: column;
  height: calc(100vh - calc(var(--search-h) + 24px + 24px));
  min-height: 400px;
  position: sticky;
  top: calc(var(--search-h) + 24px);
  overflow: hidden;
  animation: slideIn 0.5s 0.1s var(--ease-out) both;
  transition: box-shadow 0.25s;
}
.lj-list-panel:hover { box-shadow: var(--sh-md); }

.lj-list-head {
  padding: 18px 20px 14px;
  border-bottom: 1px solid var(--border);
  background: linear-gradient(135deg, rgba(240,245,251,0.7), rgba(238,249,251,0.7));
  flex-shrink: 0;
}
.lj-list-head h2 {
  font-family: var(--font-d);
  font-size: 16px; font-weight: 700;
  color: var(--brand-800); letter-spacing: -0.02em;
  margin-bottom: 3px;
}
.lj-list-subtext { font-size: 12px; color: var(--slate-400); font-weight: 500; }

.lj-list-scroll { overflow-y: auto; flex: 1; }

/* ── Job Card ── */
.lj-job-card {
  padding: 16px 18px;
  border-bottom: 1px solid var(--border);
  cursor: pointer;
  position: relative;
  border-left: 3px solid transparent;
  transition: background 0.16s, border-left-color 0.16s, padding-left 0.2s var(--ease-out);
}
.lj-job-card:last-child { border-bottom: none; }
.lj-job-card:hover {
  background: var(--slate-50);
  border-left-color: var(--accent-100);
  padding-left: 22px;
}
.lj-job-card.selected {
  background: var(--accent-50);
  border-left-color: var(--accent-500);
  padding-left: 22px;
}

.lj-card-row { display: flex; gap: 13px; }

.lj-logo {
  width: 52px; height: 52px; border-radius: var(--r-md);
  flex-shrink: 0; object-fit: cover;
  border: 1px solid var(--border);
  box-shadow: var(--sh-xs);
  transition: transform 0.2s var(--ease-spring), box-shadow 0.2s;
}
.lj-job-card:hover .lj-logo { transform: scale(1.06); box-shadow: var(--sh-sm); }

.lj-card-body { flex: 1; min-width: 0; }

.lj-card-title {
  font-family: var(--font-d);
  font-size: 14px; font-weight: 600;
  color: var(--brand-800); letter-spacing: -0.01em;
  margin-bottom: 3px; line-height: 1.3;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.lj-job-card.selected .lj-card-title { color: var(--accent-700); }

.lj-card-company { font-size: 13px; font-weight: 500; color: var(--slate-600); margin-bottom: 2px; }
.lj-card-location { font-size: 12px; color: var(--slate-400); margin-bottom: 8px; }

.lj-card-meta {
  display: flex; gap: 14px; margin-bottom: 8px;
  flex-wrap: wrap;
}
.lj-meta-item {
  display: flex; align-items: center; gap: 4px;
  font-size: 11.5px; color: var(--slate-400); font-weight: 500;
}
.lj-meta-item svg { flex-shrink: 0; }

.lj-card-badges { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 4px; }

.lj-badge {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 11px; font-weight: 600;
  padding: 3px 10px; border-radius: var(--r-full);
}
.lj-badge.easy  { background: #D1FAE5; color: #065F46; }
.lj-badge.rec   { background: var(--accent-50); color: var(--accent-700); border: 1px solid var(--accent-100); }
.lj-badge.promo { background: #FEF3C7; color: #92400E; }

.lj-save-btn {
  position: absolute; top: 14px; right: 14px;
  width: 32px; height: 32px; border-radius: 50%;
  border: 1px solid var(--border); background: var(--slate-50);
  color: var(--slate-400);
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s var(--ease-spring);
  flex-shrink: 0;
}
.lj-save-btn:hover {
  background: var(--accent-50); border-color: var(--border-acc);
  color: var(--accent-500); transform: scale(1.1);
}
.lj-save-btn.saved { color: var(--accent-500); background: var(--accent-50); border-color: var(--border-acc); }

/* ───────────────────────────────────────────
   JOB DETAIL
─────────────────────────────────────────── */
.lj-detail-panel {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--r-xl);
  box-shadow: var(--sh-sm);
  display: flex; flex-direction: column;
  height: calc(100vh - calc(var(--search-h) + 24px + 24px));
  min-height: 400px;
  position: sticky;
  top: calc(var(--search-h) + 24px);
  overflow: hidden;
  animation: detailIn 0.45s 0.15s var(--ease-out) both;
  transition: box-shadow 0.25s;
}
.lj-detail-panel:hover { box-shadow: var(--sh-md); }

/* detail header */
.lj-detail-head {
  padding: 24px 26px 20px;
  border-bottom: 1px solid var(--border);
  background: linear-gradient(135deg, rgba(240,245,251,0.6), rgba(238,249,251,0.6));
  flex-shrink: 0;
}

.lj-detail-top {
  display: flex; align-items: flex-start; gap: 16px;
  margin-bottom: 18px;
}

.lj-detail-logo {
  width: 68px; height: 68px; border-radius: var(--r-lg);
  flex-shrink: 0; object-fit: cover;
  border: 1px solid var(--border); box-shadow: var(--sh-sm);
  transition: transform 0.25s var(--ease-spring);
}
.lj-detail-panel:hover .lj-detail-logo { transform: scale(1.04) rotate(-2deg); }

.lj-detail-info { flex: 1; min-width: 0; }
.lj-detail-title {
  font-family: var(--font-d);
  font-size: 20px; font-weight: 700;
  color: var(--brand-800); letter-spacing: -0.025em; line-height: 1.2;
  margin-bottom: 5px;
}
.lj-detail-company { font-size: 14px; font-weight: 600; color: var(--brand-700); margin-bottom: 3px; }
.lj-detail-loc     { font-size: 13px; color: var(--slate-400); margin-bottom: 3px; }
.lj-detail-time    { font-size: 12px; color: var(--slate-400); font-weight: 500; }

.lj-detail-save {
  width: 38px; height: 38px; border-radius: 50%;
  border: 1.5px solid var(--border-md); background: var(--slate-50);
  color: var(--slate-400); flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s var(--ease-spring);
  align-self: flex-start;
}
.lj-detail-save:hover {
  background: var(--accent-50); border-color: var(--border-acc);
  color: var(--accent-500); transform: scale(1.1);
}
.lj-detail-save.saved { color: var(--accent-500); background: var(--accent-50); border-color: var(--border-acc); }

.lj-detail-actions { display: flex; gap: 10px; align-items: center; }

.lj-apply-btn {
  display: flex; align-items: center; gap: 8px;
  height: 42px; padding: 0 28px;
  border: none; border-radius: var(--r-full);
  background: linear-gradient(135deg, var(--accent-500), var(--brand-700));
  color: var(--white);
  font-family: var(--font-b); font-size: 14px; font-weight: 600;
  box-shadow: var(--sh-acc);
  transition: transform 0.2s var(--ease-spring), box-shadow 0.2s, filter 0.15s;
  position: relative; overflow: hidden;
}
.lj-apply-btn::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.16) 0%, transparent 55%);
  pointer-events: none;
}
.lj-apply-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 26px rgba(45,174,191,0.38);
  filter: brightness(1.05);
}

.lj-share-btn {
  width: 42px; height: 42px; border-radius: 50%;
  border: 1.5px solid var(--border-md); background: var(--slate-50);
  color: var(--slate-400);
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s var(--ease-spring);
}
.lj-share-btn:hover {
  background: var(--accent-50); border-color: var(--border-acc);
  color: var(--accent-500); transform: rotate(12deg) scale(1.08);
}

/* detail scroll body */
.lj-detail-body {
  overflow-y: auto; flex: 1;
  padding: 24px 26px 36px;
  animation: fadeIn 0.3s ease both;
}

/* insights row */
.lj-insights {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 10px; margin-bottom: 26px;
}
.lj-insight {
  display: flex; align-items: flex-start; gap: 10px;
  padding: 13px 14px;
  background: var(--slate-50);
  border: 1px solid var(--border); border-radius: var(--r-lg);
  transition: background 0.18s, border-color 0.18s, transform 0.18s var(--ease-spring);
  cursor: default;
}
.lj-insight:hover {
  background: var(--accent-50); border-color: var(--border-acc);
  transform: translateY(-2px);
}
.lj-insight svg { color: var(--accent-500); flex-shrink: 0; margin-top: 1px; }
.lj-insight-label {
  font-size: 11px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase;
  color: var(--slate-400); margin-bottom: 3px;
}
.lj-insight-value {
  font-size: 13px; font-weight: 600; color: var(--brand-800); line-height: 1.3;
}

/* skills */
.lj-skills { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 4px; }
.lj-skill {
  font-size: 12px; font-weight: 600;
  padding: 4px 13px; border-radius: var(--r-full);
  background: var(--brand-100); color: var(--brand-800);
  border: 1px solid rgba(10,42,82,0.12);
  transition: all 0.2s var(--ease-spring);
  cursor: pointer;
}
.lj-skill:hover {
  background: linear-gradient(135deg, var(--accent-500), var(--brand-700));
  color: var(--white); border-color: transparent;
  transform: translateY(-2px);
  box-shadow: 0 5px 14px rgba(45,174,191,0.3);
}

/* divider */
.lj-section-divider { height: 1px; background: var(--border); margin: 20px 0; }

/* prose */
.lj-section-title {
  font-family: var(--font-d);
  font-size: 16px; font-weight: 700;
  color: var(--brand-800); letter-spacing: -0.02em;
  margin-bottom: 12px; display: flex; align-items: center; gap: 10px;
}
.lj-section-title::after {
  content: ''; flex: 1; height: 1px;
  background: linear-gradient(90deg, var(--border-acc), transparent);
}

.lj-prose {
  font-size: 14px; line-height: 1.75;
  color: var(--slate-600); margin-bottom: 6px;
}

.lj-list-items { margin: 0 0 6px; }
.lj-list-items li {
  display: flex; align-items: flex-start; gap: 10px;
  font-size: 14px; line-height: 1.65; color: var(--slate-600);
  padding: 7px 0;
  border-bottom: 1px solid var(--border);
  transition: color 0.15s, padding-left 0.18s;
}
.lj-list-items li:last-child { border-bottom: none; }
.lj-list-items li:hover { color: var(--brand-800); padding-left: 4px; }
.lj-list-items li svg { color: var(--accent-500); flex-shrink: 0; margin-top: 3px; }

/* footer apply */
.lj-apply-footer {
  margin-top: 26px; padding: 22px;
  background: linear-gradient(135deg, var(--accent-50), var(--brand-50));
  border: 1px solid var(--border-acc); border-radius: var(--r-xl);
}
.lj-apply-full {
  display: flex; align-items: center; justify-content: center; gap: 9px;
  width: 100%; height: 48px;
  border: none; border-radius: var(--r-full);
  background: linear-gradient(135deg, var(--accent-500), var(--brand-700));
  color: var(--white);
  font-family: var(--font-b); font-size: 15px; font-weight: 600;
  box-shadow: var(--sh-acc);
  transition: transform 0.2s var(--ease-spring), box-shadow 0.2s;
  position: relative; overflow: hidden;
}
.lj-apply-full::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 55%);
  pointer-events: none;
}
.lj-apply-full:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(45,174,191,0.4);
}

/* ───────────────────────────────────────────
   MOBILE DETAIL OVERLAY (≤768px)
─────────────────────────────────────────── */
.lj-mobile-detail {
  position: fixed; inset: 0; z-index: 200;
  background: var(--white);
  overflow-y: auto;
  animation: pageIn 0.3s var(--ease-out) both;
  display: flex; flex-direction: column;
}
.lj-mobile-back {
  display: flex; align-items: center; gap: 8px;
  padding: 14px 18px;
  background: rgba(255,255,255,0.9); backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--border);
  position: sticky; top: 0; z-index: 10;
  font-size: 14px; font-weight: 600; color: var(--brand-800);
  cursor: pointer;
}
.lj-mobile-back svg { color: var(--accent-500); }
.lj-mobile-back:hover { background: var(--accent-50); color: var(--accent-700); }

/* ───────────────────────────────────────────
   RESPONSIVE
─────────────────────────────────────────── */

/* ≤1200px: hide detail panel from grid */
@media (max-width: 1200px) {
  .lj-layout { grid-template-columns: var(--sidebar-w) 1fr; }
  .lj-detail-panel { display: none; }
}

/* ≤900px: hide sidebar */
@media (max-width: 900px) {
  .lj-layout { grid-template-columns: 1fr; padding: 18px 16px 80px; }
  .lj-sidebar { display: none; }
  .lj-list-panel {
    height: auto; min-height: unset;
    position: static; max-height: none;
  }
  .lj-detail-panel { display: none; }
}

/* ≤640px: search bar stacks */
@media (max-width: 640px) {
  .lj-search-inner { flex-wrap: wrap; gap: 8px; }
  .lj-search-field { min-width: 100%; }
  .lj-btn-filter, .lj-btn-search { flex: 1; justify-content: center; }
  .lj-insights { grid-template-columns: 1fr; }
}

/* ≤480px */
@media (max-width: 480px) {
  .lj-search-inner { padding: 0 14px; }
  .lj-layout { padding: 14px 12px 80px; }
  .lj-detail-title { font-size: 17px; }
  .lj-detail-head { padding: 18px 18px 16px; }
  .lj-detail-body { padding: 18px 18px 30px; }
  .lj-list-head { padding: 14px 16px 12px; }
  .lj-job-card { padding: 14px 16px; }
  .lj-job-card:hover { padding-left: 20px; }
  .lj-job-card.selected { padding-left: 20px; }
}

/* print */
@media print {
  .lj-sidebar, .lj-search-bar, .lj-save-btn, .lj-share-btn { display: none !important; }
  .lj-layout { display: block; }
}

/* reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
`;

// ─── Component ────────────────────────────────────────────────────────────────

const LinkedInJobs: React.FC = () => {
  const [selectedId, setSelectedId]   = useState<number>(1);
  const [savedJobs,  setSavedJobs]    = useState<number[]>([1, 3]);
  const [showMobile, setShowMobile]   = useState<boolean>(false);
  const navigate = useNavigate();

  // Inject styles
  useEffect(() => {
    const id = 'lj-styles';
    if (!document.getElementById(id)) {
      const el = document.createElement('style');
      el.id = id;
      el.textContent = STYLES;
      document.head.appendChild(el);
    }
    return () => { document.getElementById(id)?.remove(); };
  }, []);

  const currentJob = JOBS.find(j => j.id === selectedId)!;

  const toggleSave = (id: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSavedJobs(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSelectJob = (id: number) => {
    setSelectedId(id);
    // On small screens open mobile overlay
    if (window.innerWidth <= 1200) setShowMobile(true);
  };

  const isSaved = (id: number) => savedJobs.includes(id);

  // ── Detail content (shared between panel + mobile overlay) ──
  const DetailContent = ({ job }: { job: Job }) => (
    <>
      {/* Header */}
      <div className="lj-detail-head">
        <div className="lj-detail-top">
          <img src={job.logo} alt={job.company} className="lj-detail-logo" />
          <div className="lj-detail-info">
            <h1 className="lj-detail-title">{job.title}</h1>
            <p className="lj-detail-company">{job.company}</p>
            <p className="lj-detail-loc">{job.location}</p>
            <p className="lj-detail-time">{job.postedTime}</p>
          </div>
          <button
            className={`lj-detail-save${isSaved(job.id) ? ' saved' : ''}`}
            onClick={(e) => toggleSave(job.id, e)}
            aria-label={isSaved(job.id) ? 'Unsave job' : 'Save job'}
          >
            <Bookmark size={18} fill={isSaved(job.id) ? 'currentColor' : 'none'} />
          </button>
        </div>

        <div className="lj-detail-actions">
          <button className="lj-apply-btn">
            {job.easyApply && <Zap size={15} />}
            {job.easyApply ? 'Easy Apply' : 'Apply'}
          </button>
          <button className="lj-share-btn" aria-label="Share job">
            <Share2 size={16} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="lj-detail-body">

        {/* Insights */}
        <div className="lj-insights">
          <div className="lj-insight">
            <Users2 size={16} />
            <div>
              <div className="lj-insight-label">Applicants</div>
              <div className="lj-insight-value">{job.applicants}</div>
            </div>
          </div>
          <div className="lj-insight">
            <Briefcase size={16} />
            <div>
              <div className="lj-insight-label">Job type</div>
              <div className="lj-insight-value">{job.type}</div>
            </div>
          </div>
          <div className="lj-insight">
            <DollarSign size={16} />
            <div>
              <div className="lj-insight-label">Salary</div>
              <div className="lj-insight-value">{job.salary}</div>
            </div>
          </div>
          <div className="lj-insight">
            <Award size={16} />
            <div>
              <div className="lj-insight-label">Level</div>
              <div className="lj-insight-value">{job.level}</div>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="lj-section-divider" />
        <div className="lj-section-title">Skills</div>
        <div className="lj-skills">
          {job.skills.map(s => <span key={s} className="lj-skill">{s}</span>)}
        </div>

        {/* About */}
        <div className="lj-section-divider" />
        <div className="lj-section-title">About the role</div>
        <p className="lj-prose">{job.description}</p>

        {/* Responsibilities */}
        <div className="lj-section-divider" />
        <div className="lj-section-title">Responsibilities</div>
        <ul className="lj-list-items">
          {job.responsibilities.map((r, i) => (
            <li key={i}><CheckCircle2 size={14} />{r}</li>
          ))}
        </ul>

        {/* Requirements */}
        <div className="lj-section-divider" />
        <div className="lj-section-title">Requirements</div>
        <ul className="lj-list-items">
          {job.requirements.map((r, i) => (
            <li key={i}><CheckCircle2 size={14} />{r}</li>
          ))}
        </ul>

        {/* Footer Apply */}
        <div className="lj-apply-footer">
          <button className="lj-apply-full">
            {job.easyApply ? <><Zap size={16} /> Easy Apply</> : <><ExternalLink size={16} /> Apply on company site</>}
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="lj-page">

      {/* ── Search Bar ── */}
      <div className="lj-search-bar">
        <div className="lj-search-inner">
          <div className="lj-search-field">
            <Search size={16} />
            <input type="text" placeholder="Search by title, skill, or company" />
          </div>
          <div className="lj-search-field">
            <MapPin size={16} />
            <input type="text" placeholder="City, state, or zip code" />
          </div>
          <button className="lj-btn-filter">
            <SlidersHorizontal size={15} />
            Filters
          </button>
          <button className="lj-btn-search">Search</button>
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div className="lj-layout">

        {/* Left Sidebar */}
        <aside className="lj-sidebar">
          <div className="lj-sidebar-section">
            <div className="lj-sidebar-title">My Jobs</div>
            <a href="#" className="lj-sidebar-item"><Bookmark size={16} /><span>Saved jobs</span></a>
            <a href="#" className="lj-sidebar-item active">
              <Search size={16} /><span>Job alerts</span>
              <span className="lj-sidebar-badge">3</span>
            </a>
            <a href="#" className="lj-sidebar-item"><FileText size={16} /><span>Skill assessments</span></a>
            <a href="#" className="lj-sidebar-item"><Award size={16} /><span>Interview prep</span></a>
            <a href="#" className="lj-sidebar-item"><TrendingUp size={16} /><span>Seeker guidance</span></a>
          </div>

          <div className="lj-sidebar-section">
            <div className="lj-sidebar-title">Preferences</div>
            <a href="#" className="lj-sidebar-item"><Bell size={16} /><span>Alert emails</span></a>
            <a href="#" className="lj-sidebar-item"><DollarSign size={16} /><span>Salary prefs</span></a>
            <a href="#" className="lj-sidebar-item"><MapPin size={16} /><span>Location prefs</span></a>
          </div>

          <div className="lj-sidebar-section">
            <button className="lj-post-btn">Post a free job</button>
          </div>
        </aside>

        {/* Job List */}
        <div className="lj-list-panel">
          <div className="lj-list-head">
            <h2>Recommended for you</h2>
            <span className="lj-list-subtext">Based on your profile and search history</span>
          </div>

          <div className="lj-list-scroll">
            {JOBS.map(job => (
              <div
                key={job.id}
                className={`lj-job-card${selectedId === job.id ? ' selected' : ''}`}
                onClick={() => handleSelectJob(job.id)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && handleSelectJob(job.id)}
                aria-label={`${job.title} at ${job.company}`}
              >
                <div className="lj-card-row">
                  <img src={job.logo} alt={job.company} className="lj-logo" />
                  <div className="lj-card-body">
                    <div className="lj-card-title">{job.title}</div>
                    <div className="lj-card-company">{job.company}</div>
                    <div className="lj-card-location">{job.location}</div>
                    <div className="lj-card-meta">
                      <span className="lj-meta-item"><Clock size={12} />{job.postedTime}</span>
                      <span className="lj-meta-item"><Users2 size={12} />{job.applicants} applicants</span>
                    </div>
                    <div className="lj-card-badges">
                      {job.easyApply        && <span className="lj-badge easy"><Zap size={10} />Easy Apply</span>}
                      {job.activelyRecruiting && <span className="lj-badge rec">Recruiting</span>}
                      {job.promoted          && <span className="lj-badge promo">Promoted</span>}
                    </div>
                  </div>
                </div>

                <button
                  className={`lj-save-btn${isSaved(job.id) ? ' saved' : ''}`}
                  onClick={e => toggleSave(job.id, e)}
                  aria-label={isSaved(job.id) ? 'Unsave' : 'Save'}
                >
                  <Bookmark size={16} fill={isSaved(job.id) ? 'currentColor' : 'none'} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Detail Panel */}
        <div className="lj-detail-panel">
          <DetailContent job={currentJob} />
        </div>
      </div>

      {/* Mobile Detail Overlay */}
      {showMobile && (
        <div className="lj-mobile-detail">
          <div className="lj-mobile-back" onClick={() => setShowMobile(false)} role="button" tabIndex={0}>
            <ArrowLeft size={18} />
            Back to jobs
          </div>
          <DetailContent job={currentJob} />
        </div>
      )}
    </div>
  );
};

export default LinkedInJobs;