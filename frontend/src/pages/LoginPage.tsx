import React, { useState } from 'react';
import { Building2, Shield, AlertCircle, Loader2 } from 'lucide-react';
import { authAPI } from '../services/api';
import { OTPVerification } from '../components/OTPVerification';

type PortalType = 'institution' | 'aicte' | null;
type LoginStep = 'portal-selection' | 'credentials' | 'otp-verification';

interface LoginPageProps {
  onLoginSuccess: (user: any, token: string) => void;
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [loginStep, setLoginStep] = useState<LoginStep>('portal-selection');
  const [selectedPortal, setSelectedPortal] = useState<PortalType>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(email, password);
      
      console.log('Login response:', response); // Debug log
      
      if (response.success) {
        // Check if OTP is required (for institution users)
        // Backend returns requiresOTP at response level, not response.data level
        if (response.requiresOTP) {
          console.log('OTP Required! Showing OTP screen...');
          setLoginStep('otp-verification');
          setLoading(false);
          return;
        }

        // Direct login for AICTE users
        if (response.data) {
          const { user, token } = response.data;
          
          // Validate portal access
          if (selectedPortal === 'institution' && user.role !== 'institution') {
            setError('Access denied. This portal is for institutions only.');
            setLoading(false);
            return;
          }
          
          if (selectedPortal === 'aicte' && user.role === 'institution') {
            setError('Access denied. This portal is for AICTE officials only.');
            setLoading(false);
            return;
          }

          // Store credentials
          localStorage.setItem('nidhi_token', token);
          localStorage.setItem('nidhi_user', JSON.stringify(user));
          
          onLoginSuccess(user, token);
        }
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerified = (user: any, token: string) => {
    // Store credentials
    localStorage.setItem('nidhi_token', token);
    localStorage.setItem('nidhi_user', JSON.stringify(user));
    
    onLoginSuccess(user, token);
  };

  const handleBack = () => {
    if (loginStep === 'otp-verification') {
      setLoginStep('credentials');
      setError('');
    } else {
      setLoginStep('portal-selection');
      setSelectedPortal(null);
      setEmail('');
      setPassword('');
      setError('');
    }
  };

  const handlePortalSelect = (portal: PortalType) => {
    setSelectedPortal(portal);
    setLoginStep('credentials');
  };

  // OTP Verification Screen
  if (loginStep === 'otp-verification') {
    return (
      <OTPVerification
        email={email}
        onVerifySuccess={handleOTPVerified}
        onBack={handleBack}
      />
    );
  }

  // Portal Selection Screen
  if (loginStep === 'portal-selection') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-5xl w-full">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Building2 className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-3">
              Nidhi Track
            </h1>
            <p className="text-xl text-gray-600">
              Security Deposit Management Portal
            </p>
            <p className="text-sm text-gray-500 mt-2">
              All India Council for Technical Education (AICTE)
            </p>
          </div>

          {/* Portal Selection */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Institution Portal */}
            <button
              onClick={() => handlePortalSelect('institution')}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border-2 border-transparent hover:border-indigo-500"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative">
                <div className="w-20 h-20 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:bg-indigo-600 transition-colors">
                  <Building2 className="w-10 h-10 text-indigo-600 group-hover:text-white transition-colors" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Institution Portal
                </h3>
                
                <p className="text-gray-600 mb-6">
                  Access for educational institutions to manage FDRs, submit release requests, and track applications.
                </p>
                
                <ul className="text-sm text-gray-500 space-y-2 text-left">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />
                    Manage Fixed Deposit Receipts
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />
                    Submit Release Requests
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />
                    Track Application Status
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />
                    Upload Documents
                  </li>
                </ul>

                <div className="mt-6 text-indigo-600 font-semibold group-hover:text-indigo-700 flex items-center justify-center gap-2">
                  Sign In as Institution
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </button>

            {/* AICTE Portal */}
            <button
              onClick={() => handlePortalSelect('aicte')}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border-2 border-transparent hover:border-emerald-500"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative">
                <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:bg-emerald-600 transition-colors">
                  <Shield className="w-10 h-10 text-emerald-600 group-hover:text-white transition-colors" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  AICTE Portal
                </h3>
                
                <p className="text-gray-600 mb-6">
                  Access for AICTE officials to review applications, verify documents, and manage approvals.
                </p>
                
                <ul className="text-sm text-gray-500 space-y-2 text-left">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                    Review Release Requests
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                    Verify Documentation
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                    Case Prioritization
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                    System Analytics
                  </li>
                </ul>

                <div className="mt-6 text-emerald-600 font-semibold group-hover:text-emerald-700 flex items-center justify-center gap-2">
                  Sign In as AICTE Official
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </button>
          </div>

          {/* Footer */}
          <div className="text-center mt-12 text-sm text-gray-500">
            <p>© 2024 AICTE - All India Council for Technical Education</p>
            <p className="mt-1">Ministry of Education, Government of India</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="mb-6 text-gray-600 hover:text-gray-900 flex items-center gap-2 transition-colors"
        >
          <span>←</span> Back to portal selection
        </button>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Icon */}
          <div className={`w-16 h-16 ${selectedPortal === 'institution' ? 'bg-indigo-100' : 'bg-emerald-100'} rounded-2xl flex items-center justify-center mb-6 mx-auto`}>
            {selectedPortal === 'institution' ? (
              <Building2 className="w-8 h-8 text-indigo-600" />
            ) : (
              <Shield className="w-8 h-8 text-emerald-600" />
            )}
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-center mb-2">
            {selectedPortal === 'institution' ? 'Institution Portal' : 'AICTE Portal'}
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Sign in to access Nidhi Track
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-800">{error}</div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="your.email@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="••••••••"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 ${
                selectedPortal === 'institution'
                  ? 'bg-indigo-600 hover:bg-indigo-700'
                  : 'bg-emerald-600 hover:bg-emerald-700'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs font-semibold text-gray-700 mb-2">Demo Credentials:</p>
            {selectedPortal === 'institution' ? (
              <div className="text-xs text-gray-600 space-y-1">
                <p><strong>Email:</strong> principal@apextech.edu.in</p>
                <p><strong>Password:</strong> password123</p>
              </div>
            ) : (
              <div className="text-xs text-gray-600 space-y-2">
                <div>
                  <p className="font-medium text-gray-700">Admin:</p>
                  <p><strong>Email:</strong> admin@aicte.gov.in</p>
                  <p><strong>Password:</strong> admin123</p>
                </div>
                <div className="mt-2">
                  <p className="font-medium text-gray-700">Council:</p>
                  <p><strong>Email:</strong> council@aicte.gov.in</p>
                  <p><strong>Password:</strong> council123</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-gray-500">
          <p>Nidhi Track - AICTE Security Deposit Management</p>
        </div>
      </div>
    </div>
  );
}
