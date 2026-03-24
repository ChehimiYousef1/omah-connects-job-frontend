import React, { useState } from 'react';
import { Home, Users, Briefcase, MessageSquare, Bell, Search, ChevronDown, ThumbsUp, MessageCircle, UserPlus, Repeat2, Award, Briefcase as BriefcaseIcon, TrendingUp, Eye, MoreHorizontal, Trash2, Settings } from 'lucide-react';
import '../styles/Notification.css';

import { useNavigate } from 'react-router-dom';

interface Notification {
  id: number;
  type: 'like' | 'comment' | 'connection' | 'repost' | 'mention' | 'job' | 'milestone' | 'view';
  user: {
    name: string;
    avatar: string;
    headline?: string;
  };
  action: string;
  content?: string;
  timeAgo: string;
  read: boolean;
  postImage?: string;
}

const LinkedInNotifications: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'mentions' | 'posts'>('all');
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'like',
      user: {
        name: 'Sarah Chen',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        headline: 'Marketing Director at Adobe'
      },
      action: 'and 12 others liked your post',
      content: 'Excited to share that our team just launched...',
      timeAgo: '2h',
      read: false,
      postImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=100&h=100&fit=crop'
    },
    {
      id: 2,
      type: 'comment',
      user: {
        name: 'Michael Park',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
        headline: 'Product Designer at Airbnb'
      },
      action: 'commented on your post',
      content: 'Great insights! I completely agree with your perspective on design thinking.',
      timeAgo: '4h',
      read: false
    },
    {
      id: 3,
      type: 'connection',
      user: {
        name: 'Emily Rodriguez',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
        headline: 'Frontend Developer at Netflix'
      },
      action: 'accepted your connection request',
      timeAgo: '6h',
      read: false
    },
    {
      id: 4,
      type: 'repost',
      user: {
        name: 'David Kumar',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
        headline: 'Data Scientist at Meta'
      },
      action: 'reposted your post',
      content: 'Just finished an amazing coding session...',
      timeAgo: '8h',
      read: true
    },
    {
      id: 5,
      type: 'milestone',
      user: {
        name: 'Jennifer Lee',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jennifer',
        headline: 'CEO at StartupCo'
      },
      action: 'celebrated a work anniversary',
      content: '5 years at StartupCo',
      timeAgo: '1d',
      read: true
    },
    {
      id: 6,
      type: 'mention',
      user: {
        name: 'Alex Thompson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
        headline: 'Product Manager at Microsoft'
      },
      action: 'mentioned you in a post',
      content: 'Thanks to @You for the amazing collaboration on this project!',
      timeAgo: '1d',
      read: true
    },
    {
      id: 7,
      type: 'view',
      user: {
        name: 'Robert Anderson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert',
        headline: 'Cloud Architect at AWS'
      },
      action: 'viewed your profile',
      timeAgo: '2d',
      read: true
    },
    {
      id: 8,
      type: 'job',
      user: {
        name: 'LinkedIn Jobs',
        avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=LI&backgroundColor=0A2A52',
        headline: 'Job Recommendations'
      },
      action: 'New job openings match your profile',
      content: 'Senior Product Manager at Google and 5 other jobs',
      timeAgo: '2d',
      read: true
    }
  ]);

  const getNotificationIcon = (type: Notification['type']) => {
    const iconProps = { size: 20, strokeWidth: 2.5 };
    switch (type) {
      case 'like':
        return <ThumbsUp {...iconProps} />;
      case 'comment':
        return <MessageCircle {...iconProps} />;
      case 'connection':
        return <UserPlus {...iconProps} />;
      case 'repost':
        return <Repeat2 {...iconProps} />;
      case 'mention':
        return <MessageCircle {...iconProps} />;
      case 'job':
        return <BriefcaseIcon {...iconProps} />;
      case 'milestone':
        return <Award {...iconProps} />;
      case 'view':
        return <Eye {...iconProps} />;
      default:
        return <Bell {...iconProps} />;
    }
  };

  const getIconColor = (type: Notification['type']) => {
    switch (type) {
      case 'like':
        return '#0073b1';
      case 'comment':
        return '#2DAEBF';
      case 'connection':
        return '#0A2A52';
      case 'repost':
        return '#00a876';
      case 'mention':
        return '#915907';
      case 'job':
        return '#0A2A52';
      case 'milestone':
        return '#f5c542';
      case 'view':
        return '#0073b1';
      default:
        return '#2DAEBF';
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = notifications.filter(notif => {
    if (activeTab === 'all') return true;
    if (activeTab === 'mentions') return notif.type === 'mention';
    if (activeTab === 'posts') return ['like', 'comment', 'repost'].includes(notif.type);
    return true;
  });

const navigate = useNavigate();
  return (
    <div className="linkedin-notifications">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-left">
            <div>
              <img src="/assets/SVG/Logo v1.svg" alt="OpenAI Hamburg Logo" className="w-full h-full"/>
            </div>
            
          </div>
          <div className="nav-right">
            <button
                          className="nav-item active"
                         onClick={() => navigate('/Feed')}
                                    >
                               <Home size={20} />
                             <span>Home</span>
                        </button>
                        <button className="nav-item"
                        onClick={() => navigate('/MyNetwork')}>
                          <Users size={20} />
                          <span>My Network</span>
                        </button>
                        <button className="nav-item"
                        onClick={() => navigate('/Freelancing')}>
                          <Briefcase size={20} />
                          <span>Freelancing</span>
                        </button>
                        <button className="nav-item"
                        onClick={() => navigate('/Message')}>
                          <MessageSquare size={20} />
                          <span>Messaging</span>
                        </button>
                        <button className="nav-item"
                        onClick={() => navigate('/Notification')}>
                          <Bell size={20} />
                          <span>Notifications</span>
                        </button>
                        <button className="nav-item profile-dropdown"
                        onClick={() => navigate('/Profile')}>
                          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=You" alt="Profile" className="nav-avatar" />
                          <span>Me <ChevronDown size={12} /></span>
                        </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="main-container">
        {/* Notifications Panel */}
        <main className="notifications-panel">
          <div className="notifications-header">
            <h1>Notifications</h1>
            <div className="header-actions">
              <button className="action-btn" onClick={markAllAsRead}>
                Mark all as read
              </button>
              <button className="icon-btn">
                <Settings size={20} />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="notifications-tabs">
            <button 
              className={`tab ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All
            </button>
            <button 
              className={`tab ${activeTab === 'mentions' ? 'active' : ''}`}
              onClick={() => setActiveTab('mentions')}
            >
              My mentions
            </button>
            <button 
              className={`tab ${activeTab === 'posts' ? 'active' : ''}`}
              onClick={() => setActiveTab('posts')}
            >
              My posts
            </button>
          </div>

          {/* Notifications List */}
          <div className="notifications-list">
            {filteredNotifications.length === 0 ? (
              <div className="empty-state">
                <Bell size={64} />
                <h3>No notifications yet</h3>
                <p>When you get notifications, they'll show up here</p>
              </div>
            ) : (
              filteredNotifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div 
                    className="notification-icon"
                    style={{ backgroundColor: `${getIconColor(notification.type)}15` }}
                  >
                    <div style={{ color: getIconColor(notification.type) }}>
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>

                  <div className="notification-avatar">
                    <img src={notification.user.avatar} alt={notification.user.name} />
                  </div>

                  <div className="notification-content">
                    <div className="notification-text">
                      <span className="user-name">{notification.user.name}</span>
                      {' '}
                      <span className="action-text">{notification.action}</span>
                    </div>
                    {notification.content && (
                      <p className="notification-preview">{notification.content}</p>
                    )}
                    {notification.user.headline && notification.type === 'view' && (
                      <p className="user-headline">{notification.user.headline}</p>
                    )}
                    <span className="notification-time">{notification.timeAgo}</span>
                  </div>

                  {notification.postImage && (
                    <div className="notification-thumbnail">
                      <img src={notification.postImage} alt="Post" />
                    </div>
                  )}

                  <div className="notification-actions">
                    <button 
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                    <button className="more-btn">
                      <MoreHorizontal size={20} />
                    </button>
                  </div>

                  {!notification.read && <div className="unread-indicator"></div>}
                </div>
              ))
            )}
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="right-sidebar">
          <div className="sidebar-card">
            <h3>Notification settings</h3>
            <p className="sidebar-description">
              Manage how you want to be notified about activity on LinkedIn
            </p>
            <button className="settings-link">
              <Settings size={16} />
              View all settings
            </button>
          </div>

          <div className="sidebar-card">
            <h3>Trending now</h3>
            <div className="trending-item">
              <TrendingUp size={16} />
              <div>
                <h4>AI Revolution 2025</h4>
                <p className="trending-meta">12.5K readers</p>
              </div>
            </div>
            <div className="trending-item">
              <TrendingUp size={16} />
              <div>
                <h4>Remote Work Trends</h4>
                <p className="trending-meta">8.2K readers</p>
              </div>
            </div>
            <div className="trending-item">
              <TrendingUp size={16} />
              <div>
                <h4>Tech Layoffs Continue</h4>
                <p className="trending-meta">15.3K readers</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default LinkedInNotifications;