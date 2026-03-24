import "../styles/Profile.css";
import { useNavigate } from "react-router-dom";
import { Search, Home, Users, Briefcase, MessageSquare, Bell, ChevronDown } from "lucide-react";



function ProfileNavBar() {
  const navigate = useNavigate();
  return (
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
  );
}




export default function ProfilePage() {
  return (
    <>
      <ProfileNavBar />
      <div className="profile-page">
        <ProfileHeader />
        <div className="profile-layout">
          <ProfileMain />
          <ProfileSidebar />
        </div>
      </div>
    </>
  );
}
/* ================= HEADER ================= */

function ProfileHeader() {
  return (
    <section className="profile-header">
      <div className="cover-photo"></div>

      <div className="header-content">
        <div className="profile-avatar"></div>

        <div className="header-info">
          <h1>Hussein Mayta</h1>
          <p className="headline">Software Engineer | Full Stack</p>
          <span className="meta">Lebanon · 500+ connections</span>
        </div>

        <div className="header-actions">
          <button className="primary">Connect</button>
          <button>Message</button>
          <button>More</button>
        </div>
      </div>
    </section>
  );
}

/* ================= MAIN COLUMN ================= */

function ProfileMain() {
  return (
    <main className="profile-main">
      <Section title="About">
        <p>
          Passionate software engineer focused on building scalable applications
          and clean user experiences.
        </p>
      </Section>

      <Section title="Activity">
        <PostPreview />
        <PostPreview />
      </Section>

      <Section title="Experience">
        <ExperienceItem
          role="Software Engineer"
          company="SE Factory"
          period="2025 – Present"
        />
        <ExperienceItem
          role="Junior Developer"
          company="Startup X"
          period="2024 – 2025"
        />
      </Section>

      <Section title="Education">
        <EducationItem
          school="University of Lebanon"
          degree="BSc Computer Science"
          period="2021 – 2024"
        />
      </Section>

      <Section title="Skills">
        <div className="skills">
          <span>JavaScript</span>
          <span>React</span>
          <span>Node.js</span>
          <span>SQL</span>
        </div>
      </Section>
    </main>
  );
}

/* ================= SIDEBAR ================= */

function ProfileSidebar() {
  return (
    <aside className="profile-sidebar">
      <div className="sidebar-card">
        <h4>Profile language</h4>
        <p>English</p>
      </div>

      <div className="sidebar-card">
        <h4>People also viewed</h4>
        <p>Frontend Developer</p>
        <p>Backend Engineer</p>
      </div>
    </aside>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="profile-section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function ExperienceItem({ role, company, period }: { role: string; company: string; period: string }) {
  return (
    <div className="list-item">
      <div className="logo"></div>
      <div>
        <h3>{role}</h3>
        <p>{company}</p>
        <span>{period}</span>
      </div>
    </div>
  );
}

function EducationItem({ school, degree, period }: { school: string; degree: string; period: string }) {
  return (
    <div className="list-item">
      <div className="logo"></div>
      <div>
        <h3>{school}</h3>
        <p>{degree}</p>
        <span>{period}</span>
      </div>
    </div>
  );
}

function PostPreview() {
  return (
    <div className="post-preview">
      <strong>Post title</strong>
      <p>This is a preview of a recent activity post.</p>
    </div>
  );
}
