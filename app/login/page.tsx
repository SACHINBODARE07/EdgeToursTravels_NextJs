'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser, registerUser, storeAuthData } from '@/lib/auth';
import Link from 'next/link';

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loginMethod, setLoginMethod] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!mobileNumber) {
      setError('Mobile number is required');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber }),
      });
      const data = await res.json();
      if (res.ok) {
        setOtpSent(true);
        setError('');
      } else {
        setError(data.error || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        storeAuthData(data.token, data.user);
        router.push(data.user.role === 'admin' ? '/admin-dashboard' : '/employee-dashboard');
      } else {
        setError(data.error || 'Invalid OTP');
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await loginUser({ email, password });
      storeAuthData(response.token, response.user);
      router.push(response.user.role === 'admin' ? '/admin-dashboard' : '/employee-dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await registerUser({ email, password, mobileNumber, name });
      storeAuthData(response.token, response.user);
      router.push('/employee-dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="flex justify-center mb-6">
          <Link href="/">
            <img src="/images/logo.png" alt="Edge Tours" className="h-12 w-auto" />
          </Link>
        </div>
        <h2 className="text-3xl font-bold text-center text-gray-900">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        {error && <div className="mt-4 p-2 bg-red-50 text-red-700 rounded">{error}</div>}

        {isLogin && (
          <div className="mt-4 flex border-b">
            <button
              onClick={() => setLoginMethod('email')}
              className={`flex-1 py-2 text-center ${loginMethod === 'email' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500'}`}
            >
              Email Login
            </button>
            <button
              onClick={() => setLoginMethod('otp')}
              className={`flex-1 py-2 text-center ${loginMethod === 'otp' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500'}`}
            >
              OTP Login
            </button>
          </div>
        )}

        {isLogin && loginMethod === 'email' && (
          <form className="mt-6 space-y-4" onSubmit={handleEmailLogin}>
            <input type="email" placeholder="Email Address" required value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 border rounded" />
            <input type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2 border rounded" />
            <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-50">
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        )}

        {isLogin && loginMethod === 'otp' && (
          <form className="mt-6 space-y-4" onSubmit={handleOtpLogin}>
            <input type="tel" placeholder="Mobile Number" required value={mobileNumber} onChange={e => setMobileNumber(e.target.value)} className="w-full p-2 border rounded" />
            {!otpSent ? (
              <button type="button" onClick={handleSendOtp} disabled={loading} className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700">
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            ) : (
              <>
                <input type="text" placeholder="Enter OTP" required value={otp} onChange={e => setOtp(e.target.value)} className="w-full p-2 border rounded" />
                <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
                  {loading ? 'Verifying...' : 'Verify & Login'}
                </button>
              </>
            )}
          </form>
        )}

        {!isLogin && (
          <form className="mt-6 space-y-4" onSubmit={handleRegister}>
            <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border rounded" />
            <input type="tel" placeholder="Mobile Number *" required value={mobileNumber} onChange={e => setMobileNumber(e.target.value)} className="w-full p-2 border rounded" />
            <input type="email" placeholder="Email Address *" required value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 border rounded" />
            <input type="password" placeholder="Password *" required value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2 border rounded" />
            <p className="text-xs text-gray-500">Minimum 6 characters</p>
            <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>
        )}

        <div className="text-center mt-4">
          <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-indigo-600 hover:underline">
            {isLogin ? "Don't have an account? Register" : 'Already have an account? Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}