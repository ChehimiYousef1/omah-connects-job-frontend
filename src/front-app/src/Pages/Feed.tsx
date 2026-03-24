import React, { useState } from 'react';
import { Home, Users, Briefcase, MessageSquare, Bell, Search, ChevronDown, Image, Calendar, FileText, Globe, MoreHorizontal, ThumbsUp, MessageCircle, Repeat2, Send, Plus, TrendingUp } from 'lucide-react';
import '../styles/Feed.css';

import { useNavigate } from 'react-router-dom';




const Feed = () => {
  const [showPostModal, setShowPostModal] = useState(false);
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: {
        name: "Sarah Johnson",
        headline: "Senior Product Manager at Tech Corp",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
      },
      content: "Excited to share that our team just launched a new feature that will help thousands of users streamline their workflow. The journey from concept to launch was incredible! 🚀",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
      timeAgo: "2h",
      reactions: 245,
      comments: 18,
      reposts: 12
    },
    {
      id: 2,
      author: {
        name: "Michael Chen",
        headline: "Software Engineer | AI Enthusiast",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael"
      },
      content: "Just finished an amazing coding session. Here are 5 tips for writing cleaner React code:\n\n1. Keep components small and focused\n2. Use custom hooks for reusable logic\n3. Implement proper error boundaries\n4. Optimize re-renders with memo\n5. Write meaningful prop names\n\nWhat's your best React tip?",
      timeAgo: "5h",
      reactions: 892,
      comments: 64,
      reposts: 45
    },
    {
      id: 3,
      author: {
        name: "Emily Rodriguez",
        headline: "UX Designer | Creating delightful experiences",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily"
      },
      content: "Design is not just what it looks like and feels like. Design is how it works. - Steve Jobs\n\nThis quote resonates with me every single day.",
      timeAgo: "1d",
      reactions: 156,
      comments: 23,
      reposts: 8
    }
  ]);

  const PostModal = ({ onClose }: { onClose: () => void }) => (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create a post</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="modal-user-info">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=You" alt="You" className="avatar" />
            <div>
              <div className="user-name">Your Name</div>
              <button className="visibility-btn">
                <Globe size={12} />
                Anyone
                <ChevronDown size={12} />
              </button>
            </div>
          </div>
          <textarea 
            className="post-input-modal" 
            placeholder="What do you want to talk about?"
            autoFocus
          />
        </div>
        <div className="modal-footer">
          <div className="modal-actions">
            <button className="icon-btn"><Image size={20} /></button>
            <button className="icon-btn"><Calendar size={20} /></button>
            <button className="icon-btn"><FileText size={20} /></button>
          </div>
          <button className="post-btn">Post</button>
        </div>
      </div>
    </div>
  );
const navigate = useNavigate();
  return (
    
    <div className="linkedin-feed">
      {/* Navbar */}

      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-left">
            <div>
              <img src="/assets/SVG/Logo v1.svg" alt="OpenAI Hamburg Logo" className="w-full h-full"/></div>
            <div className="search-box">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search"
                aria-label="Search"
              />
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
        {/* Left Sidebar */}
        <aside className="left-sidebar">
          <div className="profile-card">
            <div className="profile-cover"></div>
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=You" alt="Profile" className="profile-avatar" />
            <div className="profile-info">
              <h3>Your Name</h3>
              <p className="profile-headline">Your Professional Headline</p>
            </div>
            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-label">Profile viewers</span>
                <span className="stat-value">127</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Post impressions</span>
                <span className="stat-value">1,849</span>
              </div>
            </div>
          </div>
          <div className="sidebar-links">
            <button type="button" className="sidebar-link" style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', width: '100%', cursor: 'pointer' }}>
              <span>🔖</span>
              <span>My items</span>
            </button>
            <button type="button" className="sidebar-link" style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', width: '100%', cursor: 'pointer' }}>
              <span>👥</span>
              <span>Groups</span>
            </button>
            <button type="button" className="sidebar-link" style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', width: '100%', cursor: 'pointer' }}>
              <span>📅</span>
              <span>Events</span>
            </button>
          </div>
        </aside>

        {/* Main Feed */}
        <main className="feed-center">
          {/* Create Post */}
          <div className="create-post-card">
            <div className="create-post-trigger" onClick={() => setShowPostModal(true)}>
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=You" alt="You" className="avatar" />
              <div className="fake-input">Start a post</div>
            </div>
            <div className="create-post-actions">
              <button className="action-btn">
                <Image size={20} color="#378fe9" />
                <span>Media</span>
              </button>
              <button className="action-btn">
                <Calendar size={20} color="#c37d16" />
                <span>Event</span>
              </button>
              <button className="action-btn">
                <FileText size={20} color="#e16745" />
                <span>Write article</span>
              </button>
            </div>
          </div>

          {/* Sort Bar */}
          <div className="sort-bar">
            <div className="divider-line"></div>
            <button className="sort-btn">
              Sort by: <strong>Top</strong> <ChevronDown size={16} />
            </button>
          </div>

          {/* Posts */}
          {posts.map(post => (
            <article key={post.id} className="post-card">
              {/* Post Header */}
              <div className="post-header">
                <img src={post.author.avatar} alt={post.author.name} className="avatar" />
                <div className="post-author-info">
                  <h4>{post.author.name}</h4>
                  <p className="author-headline">{post.author.headline}</p>
                  <div className="post-meta">
                    <span>{post.timeAgo}</span>
                    <span>•</span>
                    <Globe size={12} />
                  </div>
                </div>
                <button className="more-btn">
                  <MoreHorizontal size={20} />
                </button>
              </div>

              {/* Post Content */}
              <div className="post-content">
                <p>{post.content}</p>
                {post.image && (
                  <img src={post.image} alt="Post content" className="post-image" />
                )}
              </div>

              {/* Post Stats */}
              <div className="post-stats">
                <div className="reactions-summary">
                  <div className="reaction-icons">
                    <span className="reaction-icon like">👍</span>
                    <span className="reaction-icon celebrate">🎉</span>
                    <span className="reaction-icon support">💡</span>
                  </div>
                  <span>{post.reactions}</span>
                </div>
                <div className="engagement-stats">
                  <span>{post.comments} comments</span>
                  <span>•</span>
                  <span>{post.reposts} reposts</span>
                </div>
              </div>

              {/* Post Actions */}
              <div className="post-actions">
                <button className="post-action-btn">
                  <ThumbsUp size={20} />
                  <span>Like</span>
                </button>
                <button className="post-action-btn">
                  <MessageCircle size={20} />
                  <span>Comment</span>
                </button>
                <button className="post-action-btn">
                  <Repeat2 size={20} />
                  <span>Repost</span>
                </button>
                <button className="post-action-btn">
                  <Send size={20} />
                  <span>Send</span>
                </button>
              </div>
            </article>
          ))}
        </main>

        {/* Right Sidebar */}
        <aside className="right-sidebar">
          <div className="suggestions-card">
            <h3>Add to your feed</h3>
            <div className="suggestion-item">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" alt="Suggestion" className="suggestion-avatar" />
              <div className="suggestion-info">
                <h4>John Doe</h4>
                <p>Product Designer at StartupCo</p>
                <button className="follow-btn">
                  <Plus size={16} />
                  Follow
                </button>
              </div>
            </div>
            <div className="suggestion-item">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jane" alt="Suggestion" className="suggestion-avatar" />
              <div className="suggestion-info">
                <h4>Jane Smith</h4>
                <p>Marketing Director at BigTech</p>
                <button className="follow-btn">
                  <Plus size={16} />
                  Follow
                </button>
              </div>
            </div>
          </div>

          <div className="trending-card">
            <div className="trending-header">
              <TrendingUp size={16} />
              <h3>OMAH News</h3>
            </div>
            <div className="trending-item">
              <h4>Tech layoffs continue</h4>
              <p className="trending-meta">1d ago • 12,847 readers</p>
            </div>
            <div className="trending-item">
              <h4>AI transforms workplace</h4>
              <p className="trending-meta">2h ago • 8,234 readers</p>
            </div>
            <div className="trending-item">
              <h4>Remote work trends 2024</h4>
              <p className="trending-meta">5h ago • 15,932 readers</p>
            </div>
            <div className="trending-item">
              <h4>Startup funding rebounds</h4>
              <p className="trending-meta">1d ago • 6,421 readers</p>
            </div>
          </div>
        </aside>
      </div>

      {/* Post Modal */}
      {showPostModal && <PostModal onClose={() => setShowPostModal(false)} />}
    </div>
  );
};

export default Feed;