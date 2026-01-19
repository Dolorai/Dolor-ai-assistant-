import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Shield, Zap, MessageSquare, CheckCircle, BarChart3, Lock, UserCog, Mail, ArrowRight, Check, Activity, Globe } from 'lucide-react';
import { Button, Input, Card } from '../components/ui';
import { PLANS } from '../constants';
import { PlanType } from '../types';

interface LandingProps {
  onLogin: (email: string) => void;
  onAdminLogin: (username: string, password: string) => void;
  onRegister: (data: { email: string; businessName: string; phone: string; plan: PlanType }) => void;
}

const Landing: React.FC<LandingProps> = ({ onLogin, onAdminLogin, onRegister }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const inviteCode = searchParams.get('invite');

  const [mode, setMode] = useState<'landing' | 'login' | 'register' | 'admin' | 'lead-capture'>('landing');
  const [selectedPlan, setSelectedPlan] = useState<PlanType>(PlanType.STARTER);
  
  // Form States
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  
  // Lead Capture State
  const [leadStatus, setLeadStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  
  // Admin Form States
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  useEffect(() => {
    if (inviteCode) {
      setMode('register');
    }
  }, [inviteCode]);

  const handleLeadCaptureSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLeadStatus('submitting');
    
    // Simulate webhook expectation
    console.log('Sending data to Formspree and expecting webhook to /api/forms/intake');

    try {
      const response = await fetch("https://formspree.io/f/mpqqdwkw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          businessName,
          phone,
          plan: selectedPlan,
          _subject: "New Dolor AI Lead"
        })
      });

      if (response.ok) {
        setLeadStatus('success');
      } else {
        setLeadStatus('error');
      }
    } catch (error) {
      setLeadStatus('error');
    }
  };

  const handleSimulateInviteClick = () => {
      setSearchParams({ invite: 'secure-token-123' });
      setMode('register');
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegister({ email, businessName, phone, plan: selectedPlan });
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email);
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdminLogin(adminUsername, adminPassword);
  };

  if (mode === 'lead-capture') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 animate-fade-in">
          <Card className="w-full max-w-lg shadow-2xl border-t-2 border-t-emerald-500">
             {leadStatus === 'success' ? (
                 <div className="text-center py-8">
                     <div className="bg-emerald-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-400 border border-emerald-500/20 ai-glow">
                         <Mail size={32} />
                     </div>
                     <h2 className="text-3xl font-bold text-white mb-2 font-display">Check Your Inbox</h2>
                     <p className="text-slate-400 mb-8 max-w-sm mx-auto">
                         We've sent a secure, encrypted sign-up link to <span className="text-emerald-400">{email}</span>.
                     </p>
                     
                     <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 text-sm mb-6">
                         <p className="font-semibold text-slate-500 mb-3 uppercase text-xs tracking-wider flex items-center justify-center gap-2">
                             <Lock size={12} /> Encrypted Session
                         </p>
                         <Button onClick={handleSimulateInviteClick} className="w-full flex items-center justify-center gap-2 group">
                             Simulate "Open Secure Link" <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                         </Button>
                     </div>
                     
                     <button type="button" onClick={() => setMode('landing')} className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
                        Return to Homepage
                     </button>
                 </div>
             ) : (
                 <>
                    <div className="text-center mb-8">
                        <div className="bg-emerald-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-400 border border-emerald-500/20">
                            <Zap size={28} />
                        </div>
                        <h2 className="text-2xl font-bold text-white font-display">Request Access</h2>
                        <p className="text-slate-400 mt-2">Join the intelligent automation platform.</p>
                    </div>
                    
                    {leadStatus === 'error' && (
                        <div className="bg-red-500/10 border-l-2 border-red-500 p-4 mb-6 rounded-r">
                            <p className="text-sm text-red-400">Connection error. Please try again.</p>
                        </div>
                    )}

                    <form onSubmit={handleLeadCaptureSubmit} className="space-y-5">
                        <Input 
                            label="Business Name" 
                            required 
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            placeholder="Your Company Ltd"
                        />
                        <Input 
                            label="Business Email" 
                            type="email" 
                            required 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="contact@company.com"
                        />
                        <Input 
                            label="WhatsApp Number" 
                            type="tel" 
                            required 
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+234..."
                        />
                        
                        <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                            <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Selected Plan</span>
                            <div className="font-medium text-emerald-400 flex justify-between items-center mt-1">
                                {PLANS[selectedPlan].name} Plan
                                <button type="button" onClick={() => setMode('landing')} className="text-xs text-slate-400 underline hover:text-slate-200">Change</button>
                            </div>
                        </div>

                        <Button type="submit" className="w-full" disabled={leadStatus === 'submitting'}>
                            {leadStatus === 'submitting' ? 'Processing...' : 'Request Early Access'}
                        </Button>
                        
                        <div className="text-center mt-6 space-y-3">
                            <div>
                                <button type="button" onClick={() => setMode('login')} className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
                                    Already have an account? Log in
                                </button>
                            </div>
                            <div>
                                <button type="button" onClick={() => setMode('landing')} className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </form>
                 </>
             )}
          </Card>
        </div>
      );
  }

  if (mode === 'login') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 animate-fade-in">
        <Card className="w-full max-w-md shadow-2xl border-t-2 border-t-emerald-500">
          <div className="text-center mb-8">
             <h2 className="text-3xl font-bold text-white font-display">Welcome Back</h2>
             <p className="text-slate-400 mt-2">Log in to your AI dashboard</p>
          </div>
          <form onSubmit={handleLoginSubmit} className="space-y-5">
            <Input 
              label="Email Address" 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
            />
            <Button type="submit" className="w-full">Sign In</Button>
            <div className="text-center mt-6">
              <button type="button" onClick={() => setMode('lead-capture')} className="text-sm text-emerald-400 hover:text-emerald-300">
                Need an account? Request Access
              </button>
            </div>
            <div className="text-center mt-4 border-t border-slate-800 pt-6">
              <button type="button" onClick={() => setMode('admin')} className="text-xs text-slate-600 hover:text-emerald-500 flex items-center justify-center w-full gap-2 transition-colors">
                <Lock size={12} /> Admin Login
              </button>
            </div>
            <div className="text-center mt-2">
              <button type="button" onClick={() => setMode('landing')} className="text-xs text-slate-600 hover:text-slate-400">
                &larr; Back to Home
              </button>
            </div>
          </form>
        </Card>
      </div>
    );
  }

  if (mode === 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 animate-fade-in">
        <Card className="w-full max-w-md shadow-2xl border-none bg-slate-900">
          <div className="text-center mb-8">
             <div className="bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200 border border-slate-700">
                <UserCog size={28} />
             </div>
             <h2 className="text-2xl font-bold text-white font-display">Admin Portal</h2>
             <p className="text-slate-500 mt-2">Authorized personnel only</p>
          </div>
          <form onSubmit={handleAdminSubmit} className="space-y-5">
            <Input 
              label="Username" 
              type="text" 
              required 
              value={adminUsername}
              onChange={(e) => setAdminUsername(e.target.value)}
              placeholder="Enter username"
            />
            <Input 
              label="Password" 
              type="password" 
              required 
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="••••••••"
            />
            <Button type="submit" variant="warning" className="w-full">Login</Button>
            
            <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs text-amber-200/80 text-center">
                <p className="font-semibold uppercase tracking-wider mb-1 text-amber-500">Demo Credentials</p>
                <p>Username: <code className="bg-slate-950 px-1.5 py-0.5 rounded text-amber-200 font-mono">admin</code></p>
                <p className="mt-1">Password: <code className="bg-slate-950 px-1.5 py-0.5 rounded text-amber-200 font-mono">admin</code></p>
            </div>

            <div className="text-center mt-6">
              <button type="button" onClick={() => setMode('login')} className="text-xs text-slate-500 hover:text-slate-300">
                &larr; Return to Business Login
              </button>
            </div>
          </form>
        </Card>
      </div>
    );
  }

  if (mode === 'register') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 animate-fade-in">
        <Card className="w-full max-w-lg shadow-2xl border-t-2 border-t-emerald-500">
          <div className="text-center mb-8">
             {inviteCode ? (
               <div className="mb-6 inline-flex items-center px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
                 <Check size={12} className="mr-2" /> Secure Invite Verified
               </div>
             ) : (
                <div className="mb-6 inline-flex items-center px-4 py-1.5 rounded-full bg-slate-800 text-slate-400 text-xs font-medium border border-slate-700">
                 Account Setup
               </div>
             )}
             <h2 className="text-3xl font-bold text-white font-display">Create Account</h2>
             <p className="text-slate-400 mt-2">Complete your registration to start.</p>
          </div>
          <form onSubmit={handleRegisterSubmit} className="space-y-5">
            <Input 
              label="Business Name" 
              required 
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Dolor Enterprises"
            />
            <Input 
              label="Business Email" 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@dolor.com"
            />
            <Input 
              label="WhatsApp Number" 
              type="tel" 
              required 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+234..."
            />
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-400 mb-2 ml-1">Select Plan</label>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(PLANS).map(([key, plan]) => (
                  <div 
                    key={key}
                    onClick={() => setSelectedPlan(key as PlanType)}
                    className={`cursor-pointer border rounded-xl p-3 text-center text-sm transition-all duration-200 ${selectedPlan === key ? 'border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500/50' : 'border-slate-800 bg-slate-900 hover:border-slate-600'}`}
                  >
                    <div className={`font-semibold ${selectedPlan === key ? 'text-emerald-400' : 'text-slate-300'}`}>{plan.name}</div>
                    <div className="text-xs text-slate-500 mt-1">₦{plan.price.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full mt-2">Complete Registration</Button>
            <div className="text-center mt-6">
              <button type="button" onClick={() => setMode('login')} className="text-sm text-emerald-400 hover:text-emerald-300">
                Already have an account? Log in
              </button>
            </div>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Navbar */}
      <nav className="fixed w-full z-50 glass-panel border-b-0 border-b-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500 text-slate-950 p-2 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                <MessageSquare size={22} strokeWidth={2.5} />
              </div>
              <span className="font-display font-bold text-2xl text-white tracking-tight">DOLOR<span className="text-emerald-500">.AI</span></span>
            </div>
            <div className="flex gap-4">
              <Button variant="ghost" size="sm" onClick={() => setMode('login')}>Login</Button>
              <Button size="sm" onClick={() => setMode('lead-capture')}>Get Started</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative pt-32 pb-24 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
            <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl opacity-50 animate-pulse"></div>
            <div className="absolute top-40 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl opacity-30"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 animate-fade-in">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium text-emerald-400 mb-8">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
            v2.0 Now Available
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold text-white tracking-tight mb-8 font-display leading-[1.1]">
            Automate Your <br/>
            <span className="text-emerald-400 drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]">WhatsApp Business</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-400 mb-12 leading-relaxed">
            Intelligent 24/7 customer support for Nigerian businesses. Auto-reply to inquiries, manage bookings, and scale without hiring more staff.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-5">
            <Button size="lg" onClick={() => setMode('lead-capture')} className="text-lg px-10">Start Free Trial</Button>
            <Button variant="outline" size="lg" onClick={() => setMode('lead-capture')} className="text-lg px-10">
                 <Activity size={20} className="mr-2 text-emerald-500" /> Live Demo
            </Button>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-24 bg-slate-950 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:border-emerald-500/30 transition-colors duration-300">
              <div className="bg-slate-800/50 w-14 h-14 rounded-xl flex items-center justify-center mb-6 text-emerald-400 border border-slate-700">
                <Zap size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white font-display">Instant Auto-Replies</h3>
              <p className="text-slate-400 leading-relaxed">Never miss a customer. Respond instantly to thousands of chats simultaneously with human-like precision.</p>
            </Card>
            <Card className="hover:border-emerald-500/30 transition-colors duration-300">
              <div className="bg-slate-800/50 w-14 h-14 rounded-xl flex items-center justify-center mb-6 text-emerald-400 border border-slate-700">
                <Shield size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white font-display">Secure & Reliable</h3>
              <p className="text-slate-400 leading-relaxed">Enterprise-grade security. We prioritize data protection with end-to-end encryption standards.</p>
            </Card>
            <Card className="hover:border-emerald-500/30 transition-colors duration-300">
              <div className="bg-slate-800/50 w-14 h-14 rounded-xl flex items-center justify-center mb-6 text-emerald-400 border border-slate-700">
                <BarChart3 size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white font-display">Insightful Analytics</h3>
              <p className="text-slate-400 leading-relaxed">Track conversation volume, AI performance, and customer satisfaction in real-time.</p>
            </Card>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="py-24 bg-slate-900/50 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-display">Simple, Transparent Pricing</h2>
            <p className="text-slate-400">Choose the plan that fits your business scale.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {Object.entries(PLANS).map(([key, plan]) => (
              <Card key={key} className={`relative transition-all duration-300 ${key === PlanType.GROWTH ? 'border-amber-400/50 shadow-[0_0_30px_rgba(251,191,36,0.1)]' : 'hover:border-slate-600'}`}>
                 {key === PlanType.GROWTH && (
                   <div className="absolute top-0 right-0 bg-amber-400 text-slate-900 text-xs font-bold px-4 py-1.5 rounded-bl-xl tracking-wide">
                     POPULAR
                   </div>
                 )}
                 <h3 className={`text-xl font-bold mb-2 font-display ${key === PlanType.GROWTH ? 'text-amber-400' : 'text-white'}`}>{plan.name}</h3>
                 <div className="text-4xl font-bold text-white mb-6 font-display">
                   ₦{plan.price.toLocaleString()}<span className="text-base font-normal text-slate-500 ml-1">/mo</span>
                 </div>
                 <ul className="space-y-4 mb-8">
                   {plan.features.map((feature, idx) => (
                     <li key={idx} className="flex items-start text-slate-400 text-sm">
                       <CheckCircle size={18} className={`mr-3 flex-shrink-0 ${key === PlanType.GROWTH ? 'text-amber-400' : 'text-emerald-500'}`} />
                       {feature}
                     </li>
                   ))}
                 </ul>
                 <Button 
                    className="w-full" 
                    variant={key === PlanType.GROWTH ? 'primary' : 'outline'} 
                    onClick={() => {
                        setSelectedPlan(key as PlanType);
                        setMode('lead-capture');
                    }}
                 >
                   Choose {plan.name}
                 </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
            <div className="flex items-center gap-2 mb-6 opacity-70">
                <MessageSquare size={20} className="text-emerald-500" />
                <span className="font-display font-bold text-lg text-slate-200">DOLOR.AI</span>
            </div>
           <div className="flex gap-6 mb-8 text-sm">
             <a href="#" className="hover:text-emerald-400 transition-colors">Privacy</a>
             <a href="#" className="hover:text-emerald-400 transition-colors">Terms</a>
             <a href="#" className="hover:text-emerald-400 transition-colors">Support</a>
             <button onClick={() => setMode('admin')} className="hover:text-emerald-400 transition-colors">
                Admin
              </button>
           </div>
          <p className="text-sm text-slate-600">&copy; {new Date().getFullYear()} Dolor AI Assistant. Built for Nigerian Business.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;