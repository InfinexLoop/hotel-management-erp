import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Hotel,
  Shield,
  UserCheck,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { BRANDING } from '@/config/branding';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, quickLogin } = useAuth();
  const navigate = useNavigate();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.error || 'Invalid credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (role: 'admin' | 'manager') => {
    setError('');
    if (role === 'admin') {
      setEmail('admin@hotel.com');
      setPassword('admin123');
    } else {
      setEmail('manager@hotel.com');
      setPassword('manager123');
    }
    // Auto-login for high demo efficiency
    quickLogin(role);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-900 text-slate-100 font-sans selection:bg-blue-500 selection:text-white">
      {/* Left Column: Brand Hero Presentation */}
      <div className="lg:w-1/2 relative flex flex-col justify-between p-8 sm:p-12 lg:p-16 overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-950">
        {/* Subtle decorative background circles */}
        <div className="absolute top-0 -left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Brand Tag */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/15 shadow-inner">
            <Hotel className="w-7 h-7 text-white" />
          </div>
          <div>
            <span className="font-black text-xl tracking-tight text-white block">
              {BRANDING.appName}
            </span>
            <span className="text-xs font-semibold text-blue-300 tracking-wider uppercase block">
              By {BRANDING.brandName}
            </span>
          </div>
        </div>

        {/* Center Sales Showcase */}
        <div className="relative z-10 my-12 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Generation Hospitality ERP Demonstration</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Streamline Hotel Operations With Confidence.
          </h1>
          <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
            Experience our unified property management platform engineered for luxury resorts, boutique hotels, and multi-property hospitality groups.
          </p>

          <div className="mt-8 space-y-3.5">
            {[
              'Complete front-desk reservation and guest folio automation',
              'Real-time room occupancy and housekeeping task dispatch',
              'Multi-role permissions: Administrator and Property Manager views',
              'Revenue analytics, ADR, and RevPAR performance metrics',
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-xs sm:text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Property Highlight Card */}
        <div className="relative z-10 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600/30 flex items-center justify-center text-blue-300">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">Grand Azure Palace Resort & Spa</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Live interactive dataset with 16 rooms, active reservations, and automated folios.
            </p>
          </div>
        </div>
      </div>

      {/* Right Column: Interactive Login & Quick-Login Portals */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-slate-950">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Sign In to Demo Portal
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
              Select a demo role below for 1-click access, or enter credentials manually.
            </p>
          </div>

          {/* Quick-Login Demo Buttons Box */}
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              One-Click Sales Demonstration Portals
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Admin Button */}
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="group p-3.5 rounded-2xl bg-gradient-to-br from-blue-600/20 to-blue-800/30 hover:from-blue-600 hover:to-indigo-600 border border-blue-500/40 text-left transition-all duration-200 cursor-pointer shadow-xs hover:shadow-lg"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="p-1.5 rounded-lg bg-blue-500/20 group-hover:bg-white/20 text-blue-300 group-hover:text-white transition-colors">
                    <Shield className="w-4 h-4" />
                  </span>
                  <span className="text-[10px] font-black uppercase text-blue-400 group-hover:text-blue-100">
                    Full Access
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white">Administrator</h4>
                <p className="text-[10px] text-slate-400 group-hover:text-blue-100 mt-0.5">
                  admin@hotel.com
                </p>
              </button>

              {/* Manager Button */}
              <button
                type="button"
                onClick={() => handleQuickLogin('manager')}
                className="group p-3.5 rounded-2xl bg-gradient-to-br from-purple-600/20 to-indigo-800/30 hover:from-purple-600 hover:to-indigo-600 border border-purple-500/40 text-left transition-all duration-200 cursor-pointer shadow-xs hover:shadow-lg"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="p-1.5 rounded-lg bg-purple-500/20 group-hover:bg-white/20 text-purple-300 group-hover:text-white transition-colors">
                    <UserCheck className="w-4 h-4" />
                  </span>
                  <span className="text-[10px] font-black uppercase text-purple-400 group-hover:text-purple-100">
                    Operations
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white">Property Manager</h4>
                <p className="text-[10px] text-slate-400 group-hover:text-purple-100 mt-0.5">
                  manager@hotel.com
                </p>
              </button>
            </div>
          </div>

          {/* Form Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-slate-950 px-3 text-[11px] font-medium text-slate-500 uppercase tracking-wider">
              Or Manual Sign In
            </span>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Standard Login Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@hotel.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-xs text-white placeholder-slate-500 outline-hidden transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-300">Password</label>
                <span className="text-[11px] text-slate-500">Demo: admin123 or manager123</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-xs text-white placeholder-slate-500 outline-hidden transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Hotel ERP</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Notice */}
          <div className="text-center text-[11px] text-slate-500">
            <p>InfinexLoop Demo Application • No external database required</p>
          </div>
        </div>
      </div>
    </div>
  );
};
