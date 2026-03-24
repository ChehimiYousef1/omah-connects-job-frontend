import React, { useState } from 'react';
import { Home, Users, Briefcase, MessageSquare, Bell, Search, ChevronDown, MapPin, SlidersHorizontal, Bookmark, FileText, Clock, TrendingUp, Award, Building2, DollarSign, Users2, Zap, ExternalLink, Share2, X } from 'lucide-react';
import '../styles/Freelancing.css';
import { useNavigate } from "react-router-dom";

const LinkedInJobs = () => {
  const [selectedJob, setSelectedJob] = useState(1);
  const [savedJobs, setSavedJobs] = useState([1, 3]);

  const jobsData = [
    {
      id: 1,
      title: "Senior Software Engineer",
      company: "TechCorp Inc.",
      location: "Remote",
      type: "Full-time",
      level: "Mid-Senior level",
      postedTime: "2 hours ago",
      applicants: 47,
      logo: "https://api.dicebear.com/7.x/initials/svg?seed=TC&backgroundColor=0a66c2",
      easyApply: true,
      activelyRecruiting: true,
      promoted: false,
      description: "We're looking for a talented Senior Software Engineer to join our growing team. You'll be working on cutting-edge technology and building scalable solutions that impact millions of users.",
      responsibilities: [
        "Design and develop scalable backend services",
        "Collaborate with cross-functional teams",
        "Mentor junior developers",
        "Participate in code reviews and architecture discussions"
      ],
      requirements: [
        "5+ years of software engineering experience",
        "Strong proficiency in Python, Java, or Go",
        "Experience with cloud platforms (AWS, GCP, or Azure)",
        "Excellent problem-solving skills"
      ],
      skills: ["Python", "AWS", "React", "Docker"],
      salary: "$120k - $180k/year"
    },
    {
      id: 2,
      title: "Product Designer",
      company: "DesignHub",
      location: "San Francisco, CA (Hybrid)",
      type: "Full-time",
      level: "Entry level",
      postedTime: "5 hours ago",
      applicants: 89,
      logo: "https://api.dicebear.com/7.x/initials/svg?seed=DH&backgroundColor=e16745",
      easyApply: true,
      activelyRecruiting: false,
      promoted: true,
      description: "Join our design team to create beautiful and intuitive user experiences. We're looking for someone passionate about design who can translate complex problems into elegant solutions.",
      responsibilities: [
        "Create user-centered designs for web and mobile",
        "Develop wireframes, prototypes, and high-fidelity mockups",
        "Conduct user research and usability testing",
        "Collaborate with product and engineering teams"
      ],
      requirements: [
        "2+ years of product design experience",
        "Proficiency in Figma and design systems",
        "Strong portfolio demonstrating UX/UI work",
        "Understanding of front-end development"
      ],
      skills: ["Figma", "UI/UX", "Prototyping", "User Research"],
      salary: "$90k - $130k/year"
    },
    {
      id: 3,
      title: "Marketing Manager",
      company: "GrowthCo",
      location: "New York, NY (On-site)",
      type: "Full-time",
      level: "Mid-Senior level",
      postedTime: "1 day ago",
      applicants: 124,
      logo: "https://api.dicebear.com/7.x/initials/svg?seed=GC&backgroundColor=57bb63",
      easyApply: false,
      activelyRecruiting: true,
      promoted: false,
      description: "Lead our marketing efforts and drive growth for our B2B SaaS platform. You'll develop and execute marketing strategies that generate qualified leads and build brand awareness.",
      responsibilities: [
        "Develop and execute marketing strategies",
        "Manage digital marketing campaigns",
        "Analyze campaign performance and ROI",
        "Lead a team of marketing specialists"
      ],
      requirements: [
        "5+ years in B2B marketing",
        "Experience with marketing automation tools",
        "Strong analytical and leadership skills",
        "Proven track record of lead generation"
      ],
      skills: ["Digital Marketing", "SEO", "Content Marketing", "Analytics"],
      salary: "$100k - $140k/year"
    },
    {
      id: 4,
      title: "Data Scientist",
      company: "DataWorks AI",
      location: "Remote",
      type: "Full-time",
      level: "Mid-Senior level",
      postedTime: "2 days ago",
      applicants: 203,
      logo: "https://api.dicebear.com/7.x/initials/svg?seed=DW&backgroundColor=8b5cf6",
      easyApply: true,
      activelyRecruiting: false,
      promoted: false,
      description: "Help us build the next generation of AI-powered analytics tools. You'll work with large datasets and develop machine learning models that drive business decisions.",
      responsibilities: [
        "Build and deploy machine learning models",
        "Analyze complex datasets",
        "Collaborate with product and engineering teams",
        "Present insights to stakeholders"
      ],
      requirements: [
        "PhD or Master's in Data Science, Statistics, or related field",
        "Strong programming skills in Python and R",
        "Experience with ML frameworks (TensorFlow, PyTorch)",
        "Excellent communication skills"
      ],
      skills: ["Python", "Machine Learning", "SQL", "Statistics"],
      salary: "$130k - $190k/year"
    },
    {
      id: 5,
      title: "DevOps Engineer",
      company: "CloudScale",
      location: "Austin, TX (Hybrid)",
      type: "Full-time",
      level: "Mid-Senior level",
      postedTime: "3 days ago",
      applicants: 67,
      logo: "https://api.dicebear.com/7.x/initials/svg?seed=CS&backgroundColor=f59e0b",
      easyApply: true,
      activelyRecruiting: true,
      promoted: false,
      description: "Join our infrastructure team to build and maintain scalable cloud infrastructure. You'll automate deployments and ensure our systems run smoothly at scale.",
      responsibilities: [
        "Design and maintain CI/CD pipelines",
        "Manage cloud infrastructure (AWS/GCP)",
        "Implement monitoring and alerting systems",
        "Optimize system performance and costs"
      ],
      requirements: [
        "3+ years of DevOps experience",
        "Strong knowledge of Kubernetes and Docker",
        "Experience with infrastructure as code (Terraform)",
        "Scripting skills in Python or Bash"
      ],
      skills: ["Kubernetes", "AWS", "Terraform", "CI/CD"],
      salary: "$110k - $160k/year"
    }
  ];

  const toggleSaveJob = (jobId: number) => {
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const currentJob = jobsData.find(job => job.id === selectedJob);

  const navigate = useNavigate();
    return (
      
      <div className="linkedin-feed">
        {/* Navbar */}
  
        <nav className="navbar">
          <div className="nav-container">
            <div className="nav-left">
              <div>
                <img src="/assets/SVG/Logo v1.svg" alt="OpenAI Hamburg Logo" className="w-full h-full"/></div>
                
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

      {/* Jobs Search Bar */}
      <div className="jobs-search-bar">
        <div className="jobs-search-container">
          <div className="search-input-group">
            <Search size={20} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by title, skill, or company"
              className="job-search-input"
            />
          </div>
          <div className="search-input-group">
            <MapPin size={20} className="search-icon" />
            <input 
              type="text" 
              placeholder="City, state, or zip code"
              className="job-search-input"
            />
          </div>
          <button className="filters-btn">
            <SlidersHorizontal size={20} />
            <span>All filters</span>
          </button>
          <button className="search-btn-primary">Search</button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="jobs-layout">
        {/* Left Sidebar */}
        <aside className="jobs-sidebar">
          <div className="sidebar-section">
            <h3 className="sidebar-title">My Jobs</h3>
            <div className="sidebar-menu">
              <a href="#" className="sidebar-menu-item">
                <Bookmark size={18} />
                <span>My jobs</span>
              </a>
              <a href="#" className="sidebar-menu-item active">
                <Search size={18} />
                <span>Job alerts</span>
                <span className="badge">3</span>
              </a>
              <a href="#" className="sidebar-menu-item">
                <FileText size={18} />
                <span>Skill assessments</span>
              </a>
              <a href="#" className="sidebar-menu-item">
                <Award size={18} />
                <span>Interview prep</span>
              </a>
              <a href="#" className="sidebar-menu-item">
                <TrendingUp size={18} />
                <span>Job seeker guidance</span>
              </a>
            </div>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-title">Preferences</h3>
            <div className="sidebar-menu">
              <a href="#" className="sidebar-menu-item">
                <Bell size={18} />
                <span>Job alert emails</span>
              </a>
              <a href="#" className="sidebar-menu-item">
                <DollarSign size={18} />
                <span>Salary preferences</span>
              </a>
              <a href="#" className="sidebar-menu-item">
                <MapPin size={18} />
                <span>Location preferences</span>
              </a>
            </div>
          </div>

          <div className="sidebar-footer">
            <button className="post-job-btn">
              <span>Post a free job</span>
            </button>
          </div>
        </aside>

        {/* Jobs List */}
        <div className="jobs-list-container">
          <div className="jobs-list-header">
            <h2>Recommended for you</h2>
            <span className="jobs-count">Based on your profile and search history</span>
          </div>
          <div className="jobs-list">
            {jobsData.map(job => (
              <div 
                key={job.id}
                className={`job-card ${selectedJob === job.id ? 'selected' : ''}`}
                onClick={() => setSelectedJob(job.id)}
              >
                <div className="job-card-content">
                  <img src={job.logo} alt={job.company} className="company-logo" />
                  <div className="job-info">
                    <h3 className="job-title">{job.title}</h3>
                    <p className="company-name">{job.company}</p>
                    <p className="job-location">{job.location}</p>
                    <div className="job-meta">
                      <span className="job-time">
                        <Clock size={14} />
                        {job.postedTime}
                      </span>
                      {job.applicants && (
                        <span className="job-applicants">
                          <Users2 size={14} />
                          {job.applicants} applicants
                        </span>
                      )}
                    </div>
                    <div className="job-badges">
                      {job.easyApply && (
                        <span className="badge-easy-apply">
                          <Zap size={12} />
                          Easy Apply
                        </span>
                      )}
                      {job.activelyRecruiting && (
                        <span className="badge-recruiting">Actively recruiting</span>
                      )}
                      {job.promoted && (
                        <span className="badge-promoted">Promoted</span>
                      )}
                    </div>
                  </div>
                </div>
                <button 
                  className="save-job-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSaveJob(job.id);
                  }}
                >
                  <Bookmark 
                    size={20} 
                    fill={savedJobs.includes(job.id) ? 'currentColor' : 'none'}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Job Details */}
        <div className="job-details-panel">
          {currentJob && (
            <>
              <div className="job-details-header">
                <div className="job-header-top">
                  <div className="job-header-info">
                    <img src={currentJob.logo} alt={currentJob.company} className="company-logo-large" />
                    <div>
                      <h1 className="job-detail-title">{currentJob.title}</h1>
                      <p className="job-detail-company">{currentJob.company}</p>
                      <p className="job-detail-location">{currentJob.location}</p>
                      <p className="job-detail-time">{currentJob.postedTime}</p>
                    </div>
                  </div>
                  <button 
                    className="save-job-detail-btn"
                    onClick={() => toggleSaveJob(currentJob.id)}
                  >
                    <Bookmark 
                      size={24} 
                      fill={savedJobs.includes(currentJob.id) ? 'currentColor' : 'none'}
                    />
                  </button>
                </div>
                <div className="job-header-actions">
                  {currentJob.easyApply ? (
                    <button className="apply-btn primary">
                      <Zap size={18} />
                      Easy Apply
                    </button>
                  ) : (
                    <button className="apply-btn primary">
                      Apply
                    </button>
                  )}
                  <button className="action-btn-secondary">
                    <Share2 size={18} />
                  </button>
                </div>
              </div>

              <div className="job-details-content">
                <div className="job-insights">
                  <div className="insight-item">
                    <Users2 size={18} />
                    <div>
                      <p className="insight-label">{currentJob.applicants} applicants</p>
                    </div>
                  </div>
                  <div className="insight-item">
                    <Briefcase size={18} />
                    <div>
                      <p className="insight-label">{currentJob.level}</p>
                      <p className="insight-value">{currentJob.type}</p>
                    </div>
                  </div>
                  <div className="insight-item">
                    <DollarSign size={18} />
                    <div>
                      <p className="insight-label">Salary range</p>
                      <p className="insight-value">{currentJob.salary}</p>
                    </div>
                  </div>
                  <div className="insight-item">
                    <Award size={18} />
                    <div>
                      <p className="insight-label">Skills</p>
                      <div className="skills-tags">
                        {currentJob.skills.map((skill, index) => (
                          <span key={index} className="skill-tag">{skill}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="job-description-section">
                  <h2>About the job</h2>
                  <p>{currentJob.description}</p>

                  <h3>Responsibilities</h3>
                  <ul>
                    {currentJob.responsibilities.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>

                  <h3>Requirements</h3>
                  <ul>
                    {currentJob.requirements.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="job-apply-footer">
                  {currentJob.easyApply ? (
                    <button className="apply-btn primary large">
                      <Zap size={18} />
                      Easy Apply
                    </button>
                  ) : (
                    <button className="apply-btn primary large">
                      Apply on company site
                      <ExternalLink size={18} />
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LinkedInJobs;