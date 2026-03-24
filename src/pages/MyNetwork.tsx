import React, { useState } from 'react';
import { Home, Users, Briefcase, MessageSquare, Bell, Search, ChevronDown, UserPlus, X, Check, MoreHorizontal, Mail, Building, MapPin, UserCheck, TrendingUp } from 'lucide-react';
import '../styles/MyNetwork.css';


import { useNavigate } from 'react-router-dom';

interface Connection {
  id: number;
  name: string;
  headline: string;
  avatar: string;
  mutualConnections: number;
  company?: string;
  location?: string;
}

interface Invitation {
  id: number;
  name: string;
  headline: string;
  avatar: string;
  mutualConnections: number;
  timeAgo: string;
}
    
const LinkedInNetwork: React.FC = () => {
  const navigate = useNavigate();
  const [invitations, setInvitations] = useState<Invitation[]>([
    {
      id: 1,
      name: "Alex Thompson",
      headline: "Product Manager at Microsoft | AI & Innovation",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      mutualConnections: 12,
      timeAgo: "1 week ago"
    },
    {
      id: 2,
      name: "Maria Garcia",
      headline: "Senior UX Designer | Creating delightful experiences",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
      mutualConnections: 8,
      timeAgo: "2 days ago"
    },
    {
      id: 3,
      name: "James Wilson",
      headline: "Software Engineer at Google | Full Stack Developer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
      mutualConnections: 15,
      timeAgo: "3 days ago"
    }
  ]);

  const [suggestions, setSuggestions] = useState<Connection[]>([
    {
      id: 1,
      name: "Sarah Chen",
      headline: "Marketing Director at Adobe",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      mutualConnections: 24,
      company: "Adobe",
      location: "San Francisco, CA"
    },
    {
      id: 2,
      name: "David Kumar",
      headline: "Data Scientist | Machine Learning Expert",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      mutualConnections: 18,
      company: "Meta",
      location: "New York, NY"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      headline: "Frontend Developer at Netflix",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
      mutualConnections: 31,
      company: "Netflix",
      location: "Los Angeles, CA"
    },
    {
      id: 4,
      name: "Michael Park",
      headline: "Product Designer | UI/UX Specialist",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
      mutualConnections: 9,
      company: "Airbnb",
      location: "Seattle, WA"
    },
    {
      id: 5,
      name: "Jennifer Lee",
      headline: "CEO at StartupCo | Entrepreneur",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jennifer",
      mutualConnections: 42,
      company: "StartupCo",
      location: "Austin, TX"
    },
    {
      id: 6,
      name: "Robert Anderson",
      headline: "Cloud Architect at AWS",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
      mutualConnections: 27,
      company: "Amazon Web Services",
      location: "Boston, MA"
    }
  ]);

  const handleAcceptInvitation = (id: number) => {
    setInvitations(invitations.filter(inv => inv.id !== id));
  };

  const handleIgnoreInvitation = (id: number) => {
    setInvitations(invitations.filter(inv => inv.id !== id));
  };

  const handleConnect = (id: number) => {
    setSuggestions(suggestions.filter(sug => sug.id !== id));
  };

  return (
    <div className="linkedin-network">

      {/* Main Content */}
      <div className="main-container">
        {/* Left Sidebar */}
        <aside className="left-sidebar">
          <div className="manage-network-card">
            <h3>Manage my network</h3>
            <a href="#" className="network-link">
              <Users size={20} />
              <div className="link-content">
                <span className="link-title">Connections</span>
                <span className="link-count">1,247</span>
              </div>
            </a>
            <a href="#" className="network-link">
              <UserCheck size={20} />
              <div className="link-content">
                <span className="link-title">Following & followers</span>
                <span className="link-count">892</span>
              </div>
            </a>
            <a href="#" className="network-link">
              <Building size={20} />
              <div className="link-content">
                <span className="link-title">Groups</span>
                <span className="link-count">14</span>
              </div>
            </a>
            <a href="#" className="network-link">
              <Mail size={20} />
              <div className="link-content">
                <span className="link-title">Events</span>
                <span className="link-count">3</span>
              </div>
            </a>
            <a href="#" className="network-link">
              <TrendingUp size={20} />
              <div className="link-content">
                <span className="link-title">Pages</span>
                <span className="link-count">8</span>
              </div>
            </a>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="network-center">
          {/* Invitations Section */}
          {invitations.length > 0 && (
            <section className="invitations-section">
              <div className="section-header">
                <h2>Invitations</h2>
                <span className="invitation-count">{invitations.length}</span>
              </div>
              <div className="invitations-grid">
                {invitations.map(invitation => (
                  <div key={invitation.id} className="invitation-card">
                    <button className="card-more-btn">
                      <MoreHorizontal size={20} />
                    </button>
                    <img src={invitation.avatar} alt={invitation.name} className="invitation-avatar" />
                    <h3>{invitation.name}</h3>
                    <p className="invitation-headline">{invitation.headline}</p>
                    <p className="mutual-connections">{invitation.mutualConnections} mutual connections</p>
                    <p className="invitation-time">{invitation.timeAgo}</p>
                    <div className="invitation-actions">
                      <button 
                        className="btn-ignore"
                        onClick={() => handleIgnoreInvitation(invitation.id)}
                      >
                        <X size={18} />
                        Ignore
                      </button>
                      <button 
                        className="btn-accept"
                        onClick={() => handleAcceptInvitation(invitation.id)}
                      >
                        <Check size={18} />
                        Accept
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Suggestions Section */}
          <section className="suggestions-section">
            <div className="section-header">
              <h2>People you may know</h2>
            </div>
            <div className="suggestions-grid">
              {suggestions.map(suggestion => (
                <div key={suggestion.id} className="suggestion-card">
                  <button className="card-more-btn">
                    <MoreHorizontal size={20} />
                  </button>
                  <div className="suggestion-background"></div>
                  <img src={suggestion.avatar} alt={suggestion.name} className="suggestion-avatar" />
                  <h3>{suggestion.name}</h3>
                  <p className="suggestion-headline">{suggestion.headline}</p>
                  <div className="suggestion-meta">
                    {suggestion.location && (
                      <div className="meta-item">
                        <MapPin size={14} />
                        <span>{suggestion.location}</span>
                      </div>
                    )}
                    {suggestion.company && (
                      <div className="meta-item">
                        <Building size={14} />
                        <span>{suggestion.company}</span>
                      </div>
                    )}
                  </div>
                  <p className="mutual-connections">{suggestion.mutualConnections} mutual connections</p>
                  <button 
                    className="btn-connect"
                    onClick={() => handleConnect(suggestion.id)}
                  >
                    <UserPlus size={18} />
                    Connect
                  </button>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* Right Sidebar */}
        <aside className="right-sidebar">
          <div className="network-stats-card">
            <h3>Your network stats</h3>
            <div className="stat-item">
              <div className="stat-icon">
                <Users size={20} />
              </div>
              <div className="stat-info">
                <span className="stat-value">1,247</span>
                <span className="stat-label">Connections</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <UserCheck size={20} />
              </div>
              <div className="stat-info">
                <span className="stat-value">892</span>
                <span className="stat-label">Followers</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <TrendingUp size={20} />
              </div>
              <div className="stat-info">
                <span className="stat-value">3.2K</span>
                <span className="stat-label">Profile views (30 days)</span>
              </div>
            </div>
          </div>

          <div className="tips-card">
            <h3>Grow your network</h3>
            <p>Connect with people you know and trust to expand your professional network.</p>
            <ul className="tips-list">
              <li>✓ Add colleagues and classmates</li>
              <li>✓ Connect with industry leaders</li>
              <li>✓ Join relevant groups</li>
              <li>✓ Engage with content regularly</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default LinkedInNetwork;