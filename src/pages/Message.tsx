import React, { useState, useEffect, useRef, useMemo, FormEvent } from "react";
import {
  Search,
  MoreHorizontal,
  Phone,
  Video,
  Info,
  Paperclip,
  Send,
  ChevronLeft,
  MessageSquare,
} from "lucide-react";

/** ---------------------
 * TypeScript Interfaces
 * --------------------- */
interface Message {
  id: number;
  sender: string;
  text: string;
  timestamp: string;
  isSent: boolean;
}

interface Conversation {
  id: number;
  name: string;
  role?: string;
  avatar: string;
  online: boolean;
  messages: Message[];
}

/** ---------------------
 * Static Data (outside component)
 * --------------------- */
const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 1,
    name: "John Doe",
    role: "Senior Product Manager",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    online: true,
    messages: [
      { id: 1, sender: "John Doe", text: "Hey, how are you?", timestamp: "2:30 PM", isSent: false },
      { id: 2, sender: "You", text: "I'm doing great! How about you?", timestamp: "2:32 PM", isSent: true },
    ],
  },
  // Add more conversations here
];

/** ---------------------
 * Messaging Component
 * --------------------- */
const Messaging: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeId, setActiveId] = useState<number>(INITIAL_CONVERSATIONS[0].id);
  const [newMessage, setNewMessage] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showMobileChat, setShowMobileChat] = useState<boolean>(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  /** ---------------------
   * Derived State
   * --------------------- */
  const selectedConv = useMemo(
    () => conversations.find((c) => c.id === activeId),
    [conversations, activeId]
  );

  /** ---------------------
   * Auto Scroll to Bottom
   * --------------------- */
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [selectedConv?.messages]);

  /** ---------------------
   * Handle Sending Message
   * --------------------- */
  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageEntry: Message = {
      id: Date.now(),
      sender: "You",
      text: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isSent: true,
    };

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === activeId ? { ...conv, messages: [...conv.messages, messageEntry] } : conv
      )
    );
    setNewMessage("");
  };

  /** ---------------------
   * Filtered Conversations
   * --------------------- */
  const filteredConversations = useMemo(
    () =>
      conversations.filter((conv) =>
        conv.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [conversations, searchQuery]
  );

  /** ---------------------
   * Render
   * --------------------- */
  return (
    <div className="sticky min-h-screen bg-slate-50 font-sans antialiased text-slate-900">
      <div className="max-w-5xl mx-auto px-4 h-screen py-4">
        <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden h-full flex">

          {/* ----------------- Sidebar ----------------- */}
          <aside className={`w-full md:w-80 lg:w-96 border-r border-slate-200 flex flex-col ${showMobileChat ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight">Messages</h2>
                <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <MoreHorizontal size={20} />
                </button>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto cursor-pointer">
              {filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => { setActiveId(conv.id); setShowMobileChat(true); }}
                  className={`flex items-center gap-3 p-4 transition-all ${
                    conv.id === activeId ? 'bg-blue-50 border-r-4 border-blue-600' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="relative">
                    <img src={conv.avatar} alt={conv.name} className="w-12 h-12 rounded-full bg-slate-200" />
                    {conv.online && <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <p className="font-semibold truncate text-sm">{conv.name}</p>
                      <span className="text-[10px] text-slate-400 uppercase font-medium">
                        {conv.messages[conv.messages.length - 1]?.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 truncate">
                      {conv.messages[conv.messages.length - 1]?.text}
                    </p>
                  </div>
                </div>
              ))}
            </nav>
          </aside>

          {/* ----------------- Chat Main Area ----------------- */}
          <main className={`flex-1 flex flex-col min-w-1 bg-white ${showMobileChat ? 'flex' : 'hidden md:flex'}`}>

            {selectedConv ? (
              <>
                {/* Header */}
                <header className="p-4 border-b border-slate-200 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setShowMobileChat(false)} className="md:hidden p-2 -ml-2 hover:bg-slate-100 rounded-full">
                      <ChevronLeft size={20} />
                    </button>
                    <img src={selectedConv.avatar} alt={selectedConv.name} className="w-10 h-10 rounded-full" />
                    <div>
                      <h3 className="font-bold text-sm leading-none">{selectedConv.name}</h3>
                      <p className="text-[11px] text-emerald-600 font-medium mt-1">
                        {selectedConv.online ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[Phone, Video, Info].map((Icon, i) => (
                      <button key={i} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
                        <Icon size={18} />
                      </button>
                    ))}
                  </div>
                </header>

                {/* Messages Area */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#f8fafc]">
                  {selectedConv.messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.isSent ? 'justify-end' : 'justify-start'}`}>
                      <div className="max-w-[70%] group">
                        <div className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                          msg.isSent ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                        }`}>
                          {msg.text}
                        </div>
                        <p className={`text-[10px] mt-1.5 text-slate-400 font-medium ${msg.isSent ? 'text-right' : 'text-left'}`}>
                          {msg.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Input */}
                <footer className="flex-none p-3 bg-white border-t border-slate-200">
                  <form 
                    onSubmit={handleSendMessage} 
                    className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl focus-within:ring-2 focus-within:ring-blue-200 focus-within:bg-white transition-all"
                  >
                    <button type="button" className="p-2 text-slate-500 hover:text-blue-600">
                      <Paperclip size={20} />
                    </button>
                    <input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2"
                    />
                    <button 
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 disabled:opacity-40 disabled:grayscale transition-all"
                    >
                      <Send size={18} />
                    </button>
                  </form>
                </footer>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <MessageSquare size={40} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">No conversation selected</h3>
                <p className="text-sm text-center max-w-xs">Select a colleague from the left to view your message history.</p>
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
};

export default Messaging;
