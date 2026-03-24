import { useState } from 'react';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { AnimatedSection } from '../components/ui/animated-section';
import { GradientButton } from '../components/ui/gradient-button';
import LogoV1 from '../assets/SVG/Logo v1.svg';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Something went wrong');
      } else {
        setIsSubmitted(true);
      }
    } catch (err) {
      setError('Unable to connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <AnimatedSection direction="up" delay={0.1}>
          <div className="text-center mb-10">
            <div className="flex justify-center">
              <img 
                src={LogoV1} 
                alt="OpenAI Hamburg Logo" 
                className="w-32 h-32 object-contain" 
              />
            </div>
          </div>
        </AnimatedSection>

        {/* Forgot Password Card */}
        <AnimatedSection direction="up" delay={0.2}>
          <div className="bg-white rounded-2xl p-10 shadow-lg border border-slate-200/60">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-slate-900 mb-2">
                Reset your password
              </h1>
              <p className="text-slate-600 text-sm leading-relaxed">
                Enter your email address and we'll send you a link to reset your password
              </p>
            </div>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Input */}
                <div>
                  <label 
                    htmlFor="email" 
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-red-500 text-sm">{error}</p>
                )}

                {/* Submit Button */}
                <GradientButton
                  type="submit"
                  className={`w-full py-2.5 text-white font-medium rounded-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send reset link'}
                </GradientButton>
              </form>
            ) : (
              <div className="text-center space-y-5">
                <div className="flex justify-center">
                  <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-7 h-7 text-green-600" />
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 mb-2">
                    Check your email
                  </h2>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    We've sent a password reset link to<br />
                    <span className="font-medium text-slate-900">{email}</span>
                  </p>
                </div>
                <p className="text-xs text-slate-500 pt-2">
                  Didn't receive the email? Check your spam folder or request a new link.
                </p>
              </div>
            )}

            {/* Back to Login */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <Link to="/login" className="block">
                <Button 
                  variant="ghost" 
                  className="w-full group text-slate-700 hover:text-slate-900 hover:bg-slate-50"
                >
                  <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                  Back to login
                </Button>
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
