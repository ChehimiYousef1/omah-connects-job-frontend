import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGithub, FaMicrosoft } from "react-icons/fa";
import { motion } from 'framer-motion';
import {
  Eye, EyeOff, Mail, Lock, ArrowRight,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { AnimatedSection } from '../components/ui/animated-section';
import { Alert } from '../components/ui/alert';
import LogoV1 from '../assets/SVG/Logo v1.svg';

export function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        // ✅ Only navigate on success
        navigate('/social/feed', { replace: true });
      } else {
        setError(result.error || 'Invalid email or password');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // --- OAUTH HANDLERS ---

  const handleGoogleLogin = async () => {
    try {
      // It's cleaner to let the backend generate the URL
      const res = await fetch('http://localhost:3001/api/auth/google');
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (error) {
      console.error('Google login error:', error);
      setError('Failed to initialize Google login');
    }
  };

  const handleMicrosoftLogin = () => {
    window.location.href = 'http://localhost:3001/api/auth/microsoft';
  };

const handleGitHubLogin = () => {
  // Just redirect to backend
  window.location.href = 'http://localhost:3001/api/auth/github';
};


  const handleAppleLogin = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/auth/apple');
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (error) {
      setError('Failed to initialize Apple login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          
          {/* Left Column - Branding */}
          <AnimatedSection direction="left" className="hidden lg:block">
            <div className="pr-12">
              <img src={LogoV1} alt="Logo" className="w-32 h-32 mb-6" />
              <h1 className="text-4xl font-bold text-slate-900 mb-4">Welcome Back</h1>
              <p className="text-lg text-slate-600 mb-6">Sign in to manage your projects and dashboard.</p>
            </div>
          </AnimatedSection>

          {/* Right Column - Form */}
          <AnimatedSection direction="right">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-slate-900 to-slate-700 px-8 py-6 text-white">
                <h2 className="text-2xl font-bold">Sign In</h2>
                <p className="text-slate-300 text-sm">Enter your credentials to continue</p>
              </div>

              <div className="px-8 py-6">
                {error && <Alert variant="destructive" className="mb-6">{error}</Alert>}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-11 pr-12 py-2.5 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="••••••••"
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <a
                    href="../forgot-password"
                    className="block mt-12 mb-4 text-sm text-right text-blue-600 hover:underline"
                  >
                    Forgot your password?
                  </a>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                  >
                    {isLoading ? "Signing in..." : <>Sign In <ArrowRight size={18}/></>}
                  </button>
                </form>

                <div className="relative my-8 text-center">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                  <span className="relative bg-white px-4 text-xs text-slate-500 uppercase">Or continue with</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/*
                  <button onClick={handleGoogleLogin} className="flex items-center justify-center gap-2 py-2 border rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
                    Google
                  </button>
                  */}
                  <button
                      onClick={handleGitHubLogin}
                      className="flex items-center justify-center gap-2 py-2 border rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
                  >
                      <FaGithub className="w-4 h-4" />
                      GitHub
                  </button>
                  <button
                    onClick={handleMicrosoftLogin}
                    className="flex items-center justify-center gap-3 py-2 px-4 rounded-lg
                              bg-[#0078D4] hover:bg-[#106EBE]
                              text-white transition-colors text-sm font-medium"
                  >
                    {/* Microsoft official logo */}
                    <svg width="18" height="18" viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg">
                      <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
                      <rect x="13" y="1" width="9" height="9" fill="#7FBA00"/>
                      <rect x="1" y="13" width="9" height="9" fill="#00A4EF"/>
                      <rect x="13" y="13" width="9" height="9" fill="#FFB900"/>
                    </svg>

                    Continue with Microsoft
                  </button>


                  {/*
                  <button onClick={handleAppleLogin} className="flex items-center justify-center gap-2 py-2 border rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
                    Apple
                  </button>
                  */}
                </div>

                <p className="mt-8 text-center text-sm text-slate-600">
                  New to OMAH? <Link to="/register" className="text-blue-600 font-bold hover:underline">Join now</Link>
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}