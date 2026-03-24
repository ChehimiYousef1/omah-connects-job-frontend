import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Eye, EyeOff, Mail, Lock, User, ArrowLeft, Users, Building,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { AnimatedSection } from '../components/ui/animated-section';
import { GradientButton } from '../components/ui/gradient-button';
import { Alert } from '../components/ui/alert';
import LogoV1 from '../assets/SVG/Logo v1.svg';

export function Register() {
  const [selectedRole, setSelectedRole] = useState<'FREELANCER' | 'COMPANY'>('FREELANCER');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!formData.email || !formData.password || !formData.name) {
      setError('All fields are required');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const result = await register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: selectedRole,
      });

      if (!result.success) {
        setError(result.error || 'Registration failed');
      } else {
        navigate('/social/feed');
      }
    } catch (err) {
      console.error('Unexpected registration error:', err);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Column */}
          <AnimatedSection direction="left" className="hidden lg:block">
            <div className="pr-12">
              <div className="mb-8">
                <img src={LogoV1} alt="Logo" className="w-32 h-32 mb-6" />
                <h1 className="text-4xl font-bold text-slate-900 mb-4">Join Our Professional Network</h1>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Connect with top talent or find your next opportunity. Create your account to get started.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">For Freelancers</h3>
                    <p className="text-sm text-slate-600">Showcase your skills and connect with companies seeking your expertise</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <Building className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">For Companies</h3>
                    <p className="text-sm text-slate-600">Find qualified professionals and build your dream team</p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Right Column */}
          <AnimatedSection direction="right">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-700 px-8 py-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-white">Create Account</h2>
                  <GradientButton
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/')}
                    className="text-xs bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <ArrowLeft className="w-3 h-3 mr-1" />
                    Back
                  </GradientButton>
                </div>
                <p className="text-slate-300 text-sm">Join our platform and start your journey</p>
              </div>

              <div className="px-8 py-6 max-h-[600px] overflow-y-auto">
                {/* Role Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-3">Account Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => setSelectedRole('FREELANCER')}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        selectedRole === 'FREELANCER'
                          ? 'border-blue-500 bg-blue-50 shadow-sm'
                          : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                      }`}
                    >
                      <Users className={`w-5 h-5 mx-auto mb-2 ${selectedRole === 'FREELANCER' ? 'text-blue-600' : 'text-slate-400'}`} />
                      <span className={`text-sm font-medium ${selectedRole === 'FREELANCER' ? 'text-blue-700' : 'text-slate-600'}`}>Freelancer</span>
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => setSelectedRole('COMPANY')}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        selectedRole === 'COMPANY'
                          ? 'border-purple-500 bg-purple-50 shadow-sm'
                          : 'border-slate-200 hover:border-purple-300 hover:bg-slate-50'
                      }`}
                    >
                      <Building className={`w-5 h-5 mx-auto mb-2 ${selectedRole === 'COMPANY' ? 'text-purple-600' : 'text-slate-400'}`} />
                      <span className={`text-sm font-medium ${selectedRole === 'COMPANY' ? 'text-purple-700' : 'text-slate-600'}`}>Company</span>
                    </motion.button>
                  </div>
                </div>

                {/* Error Alert */}
                {error && <Alert variant="destructive" className="mb-6">{error}</Alert>}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                      {selectedRole === 'COMPANY' ? 'Company Name' : 'Full Name'}
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder={selectedRole === 'COMPANY' ? 'Enter company name' : 'Enter your full name'}
                        className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your email"
                        className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        placeholder="Create a strong password"
                        className="w-full pl-11 pr-12 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 mt-1.5">Must be at least 8 characters long</p>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 mb-2">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        placeholder="Confirm your password"
                        className="w-full pl-11 pr-12 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Submit */}
                  <GradientButton
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 text-white font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating Account...
                      </div>
                    ) : (
                      `Create ${selectedRole === 'FREELANCER' ? 'Freelancer' : 'Company'} Account`
                    )}
                  </GradientButton>
                </form>

                {/* Footer Links */}
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <p className="text-center text-sm text-slate-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                      Sign in
                    </Link>
                  </p>

                  <p className="text-center text-xs text-slate-500 mt-4">
                    By creating an account, you agree to our{' '}
                    <Link to="/terms" className="text-blue-600 hover:text-blue-700">Terms of Service</Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-blue-600 hover:text-blue-700">Privacy Policy</Link>
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
