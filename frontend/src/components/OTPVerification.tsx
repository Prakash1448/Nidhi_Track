import React, { useState, useEffect } from 'react';
import { Shield, Mail, Loader2, RefreshCw, ArrowLeft } from 'lucide-react';
import { authAPI } from '../services/api';

interface OTPVerificationProps {
  email: string;
  onVerifySuccess: (user: any, token: string) => void;
  onBack: () => void;
}

export function OTPVerification({ email, onVerifySuccess, onBack }: OTPVerificationProps) {
  const [otp, setOTP] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resending, setResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Auto-focus first input on mount
  useEffect(() => {
    document.getElementById('otp-0')?.focus();
  }, []);

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOTP = [...otp];
    newOTP[index] = value;
    setOTP(newOTP);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }

    // Auto-submit when all 6 digits are entered
    if (newOTP.every(digit => digit !== '') && index === 5) {
      handleVerify(newOTP.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    
    if (/^\d+$/.test(pastedData)) {
      const newOTP = pastedData.split('');
      setOTP([...newOTP, ...Array(6 - newOTP.length).fill('')].slice(0, 6));
      
      // Focus last filled input
      const lastIndex = Math.min(pastedData.length - 1, 5);
      document.getElementById(`otp-${lastIndex}`)?.focus();

      // Auto-submit if 6 digits
      if (pastedData.length === 6) {
        handleVerify(pastedData);
      }
    }
  };

  const handleVerify = async (otpCode?: string) => {
    const code = otpCode || otp.join('');
    
    if (code.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authAPI.verifyOTP(email, code);
      
      if (response.success && response.data) {
        const { user, token } = response.data;
        onVerifySuccess(user, token);
      } else {
        setError('OTP verification failed. Please try again.');
        setOTP(['', '', '', '', '', '']);
        document.getElementById('otp-0')?.focus();
      }
    } catch (err: any) {
      console.error('OTP verification error:', err);
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
      setOTP(['', '', '', '', '', '']);
      document.getElementById('otp-0')?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setResending(true);
    setError('');

    try {
      const response = await authAPI.resendOTP(email);
      
      if (response.success) {
        setResendTimer(60);
        setCanResend(false);
        setOTP(['', '', '', '', '', '']);
        document.getElementById('otp-0')?.focus();
      }
    } catch (err: any) {
      console.error('Resend OTP error:', err);
      setError(err.response?.data?.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-6 text-gray-600 hover:text-gray-900 flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </button>

        {/* OTP Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Icon */}
          <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 mx-auto">
            <Shield className="w-8 h-8 text-indigo-600" />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-center mb-2">
            Verify Your Identity
          </h2>
          <p className="text-gray-600 text-center mb-8">
            We've sent a 6-digit code to
            <br />
            <span className="font-semibold text-gray-900">{email}</span>
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800 text-center">
              {error}
            </div>
          )}

          {/* OTP Input */}
          <div className="mb-6">
            <div className="flex gap-2 justify-center" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  disabled={loading}
                  className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              ))}
            </div>
          </div>

          {/* Verify Button */}
          <button
            onClick={() => handleVerify()}
            disabled={loading || otp.some(digit => !digit)}
            className="w-full py-3 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <Shield className="w-5 h-5" />
                Verify OTP
              </>
            )}
          </button>

          {/* Resend OTP */}
          <div className="text-center">
            {canResend ? (
              <button
                onClick={handleResend}
                disabled={resending}
                className="text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-2 mx-auto transition-colors disabled:opacity-50"
              >
                {resending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Resend OTP
                  </>
                )}
              </button>
            ) : (
              <p className="text-gray-500 text-sm">
                Resend OTP in <span className="font-semibold">{resendTimer}s</span>
              </p>
            )}
          </div>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-semibold mb-1">Didn't receive the code?</p>
                <ul className="text-blue-800 space-y-1 text-xs">
                  <li>• Check your spam/junk folder</li>
                  <li>• Wait a few moments for the email to arrive</li>
                  <li>• Click "Resend OTP" to get a new code</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-gray-500">
          <p>Nidhi Track - AICTE Security Deposit Management</p>
          <p className="mt-1">This OTP is valid for 10 minutes</p>
        </div>
      </div>
    </div>
  );
}
