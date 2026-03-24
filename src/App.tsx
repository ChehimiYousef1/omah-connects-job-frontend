import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { About as AboutPage } from './pages/About';
import { Projects as ProjectsPage } from './pages/Projects';
import { Contact as ContactPage } from './pages/Contact';
import { Education } from './pages/Education';
import { Learning } from './pages/Learning';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { RoleSelection } from './pages/RoleSelection';
import { CompanyOpportunities } from './pages/CompanyOpportunities';
import { FreelancerOpportunities } from './pages/FreelancerOpportunities';
import { FreelancerDashboard } from './pages/FreelancerDashboard';
import { CompanyDashboard } from './pages/CompanyDashboard';
import { CompanyProfile } from './pages/CompanyProfile';
import { Settings } from './pages/Settings';
import { NotFound } from './pages/NotFound';
import { Terms } from './pages/Terms';
import { Privacy } from './pages/Privacy';
import { ForgotPassword } from './pages/ForgotPassword';
import { Courses } from './pages/Courses';
import { RoleGuard } from './components/RoleGuard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ToastProvider } from './components/ui/toast';
import { SocialFeedLayout } from './components/SocialFeedLayout';
import GitHubCallback from './pages/GitHubCallback';

// Social feed pages
import Feed from './pages/Feed';
import Freelancing from './pages/Freelancing';
import Message from './pages/Message';
import MyNetworkComponent from './pages/MyNetwork';
import NotificationComponent from './pages/Notification';
import Profile from './pages/Profile';

// =========================
// Dashboard Redirect Component
// =========================
function DashboardRedirect() {
  const { user } = useAuth();

  if (user?.role === 'COMPANY') return <Navigate to="/dashboard/company" replace />;
  if (user?.role === 'FREELANCER') return <Navigate to="/dashboard/freelancer" replace />;

  return <Navigate to="/dashboard/freelancer" replace />;
}

// =========================
// Main App Content
// =========================
function AppContent() {
  const location = useLocation();
  const isAuthPage = ['/login', '/register', '/forgot-password', '/auth/github/callback'].includes(location.pathname);
  const { user } = useAuth();
  const shouldShowFooter = !isAuthPage && !user;

  return (
    <div className="min-h-screen bg-background">
      {!isAuthPage && <Header />}
      <main className={isAuthPage ? '' : 'pt-0'}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/education" element={<Education />} />
          <Route path="/learning" element={<Learning />} />
          <Route path="/courses" element={<Courses />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/github/callback" element={<GitHubCallback />} />

          {/* Legal */}
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />

          {/* Role Selection */}
          <Route path="/opportunities" element={<RoleSelection />} />

          {/* Protected Opportunity Routes */}
          <Route
            path="/opportunities/company"
            element={
              <RoleGuard requiredRole="company">
                <CompanyOpportunities />
              </RoleGuard>
            }
          />
          <Route
            path="/opportunities/freelancer"
            element={
              <RoleGuard requiredRole="freelancer">
                <FreelancerOpportunities />
              </RoleGuard>
            }
          />

          {/* Dashboard redirect */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <DashboardRedirect />
              </ProtectedRoute>
            }
          />

          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard/company"
            element={
              <ProtectedRoute requiredRole="COMPANY">
                <CompanyDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/freelancer"
            element={
              <ProtectedRoute requiredRole="FREELANCER">
                <FreelancerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Company Profile */}
          <Route
            path="/company-profile"
            element={
              <ProtectedRoute requiredRole="COMPANY">
                <CompanyProfile />
              </ProtectedRoute>
            }
          />

          {/* Settings */}
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* Social feed nested routes */}
          <Route
            path="/social"
            element={
              <ProtectedRoute>
                <SocialFeedLayout />
              </ProtectedRoute>
            }
          >
            <Route path="feed" element={<Feed />} />
            <Route path="freelancing" element={<Freelancing />} />
            <Route path="message" element={<Message />} />
            <Route path="mynetwork" element={<MyNetworkComponent />} />
            <Route path="notification" element={<NotificationComponent />} />
            <Route path="profile" element={<Profile />} />
            <Route index element={<Feed />} /> {/* /social defaults to feed */}
          </Route>

          {/* Catch all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {shouldShowFooter && <Footer />}
    </div>
  );
}

// =========================
// Root App
// =========================
function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;