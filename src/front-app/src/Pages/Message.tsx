// src/Components/Messaging/Messaging.jsx
import React, { useState } from 'react';
import { Home, Users, Briefcase, MessageSquare, Bell, Search, ChevronDown, Image, Calendar, FileText, Globe, MoreHorizontal, ThumbsUp, MessageCircle, Repeat2, Send, Plus, TrendingUp } from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import '../styles/Message.css';

const conversations = [
  { id: 1, name: "John Doe", lastMessage: "Hey, how are you?" },
  { id: 2, name: "Jane Smith", lastMessage: "Let's catch up tomorrow." },
];

const Messaging = () => {
  const navigate = useNavigate();
  const [selectedConv, setSelectedConv] = useState(conversations[0]);
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = () => {
    if (!newMessage) return;
    alert(`Message sent: ${newMessage}`);
    setNewMessage("");
  };

  return (
    <>
      <div className="linkedin-feed">
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
      </div>

      <div className="messaging-page">
        {/* Conversations list */}
        <div className="conversations">
          {conversations.map(conv => (
            <div
              key={conv.id}
              className={`conversation ${conv.id === selectedConv.id ? "active" : ""}`}
              onClick={() => setSelectedConv(conv)}
            >
              <h4>{conv.name}</h4>
              <p>{conv.lastMessage}</p>
            </div>
          ))}
        </div>

        {/* Chat window */}
        <div className="chat-window">
          <h3>Chat with {selectedConv.name}</h3>
          <div className="messages">
            <p>{selectedConv.lastMessage}</p>
          </div>
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </>
  );
};


export default Messaging;
