import React, { useState, useEffect } from 'react';
import { User, PaymentStatus, WAConnectionStatus, AIConfig } from '../types';
import { Card, Button, Input, Badge } from '../components/ui';
import { PLANS, BANK_DETAILS } from '../constants';
import { Check, AlertTriangle, Upload, MessageSquare, Settings, CreditCard, Activity, Save, Play, RefreshCw, LogOut, ChevronRight, Zap, BarChart3, Bot, LayoutDashboard, Smartphone, MoreHorizontal } from 'lucide-react';
import { simulateAIResponse } from '../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';

interface UserDashboardProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
  onLogout: () => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ user, onUpdateUser, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'whatsapp' | 'ai' | 'billing'>('overview');
  const [testMessage, setTestMessage] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [localAiConfig, setLocalAiConfig] = useState<AIConfig>(user.aiConfig);
  const [proofFile, setProofFile] = useState<File | null>(null);

  useEffect(() => {
    setLocalAiConfig(user.aiConfig);
  }, [user]);

  const handleSaveAiConfig = () => {
    onUpdateUser({ ...user, aiConfig: localAiConfig });
    alert('AI Configuration Saved Successfully!');
  };

  const handleToggleAI = () => {
    onUpdateUser({ ...user, aiConfig: { ...user.aiConfig, isActive: !user.aiConfig.isActive } });
  };

  const handleSimulate = async () => {
    if (!testMessage) return;
    setIsSimulating(true);
    setAiResponse('Thinking...');
    
    const response = await simulateAIResponse(testMessage, localAiConfig, user.businessName);
    
    setAiResponse(response);
    setIsSimulating(false);
  };

  const handlePaymentSubmit = () => {
    if (!proofFile) {
        alert("Please upload a proof of payment");
        return;
    }
    onUpdateUser({
        ...user,
        subscription: {
            ...user.subscription,
            status: PaymentStatus.PENDING_APPROVAL,
            paymentProofUrl: URL.createObjectURL(proofFile)
        }
    });
    alert("Payment submitted for approval!");
  };

  const handleConnectWhatsapp = () => {
     onUpdateUser({ ...user, waStatus: WAConnectionStatus.CONNECTING });
     setTimeout(() => {
         onUpdateUser({ 
             ...user, 
             waStatus: WAConnectionStatus.CONNECTED,
             waPhoneNumber: user.phone
         });
     }, 3000);
  };

  const mockChartData = [
    { name: 'Mon', messages: 120, ai: 110 },
    { name: 'Tue', messages: 150, ai: 145 },
    { name: 'Wed', messages: 200, ai: 190 },
    { name: 'Thu', messages: 180, ai: 175 },
    { name: 'Fri', messages: 250, ai: 240 },
    { name: 'Sat', messages: 300, ai: 295 },
    { name: 'Sun', messages: 280, ai: 270 },
  ];

  const steps = [
    { 
        id: 'whatsapp', 
        label: 'Connect WhatsApp', 
        done: user.waStatus === WAConnectionStatus.CONNECTED,
        action: () => setActiveTab('whatsapp')
    },
    { 
        id: 'payment', 
        label: 'Submit Payment Proof', 
        done: user.subscription.status === PaymentStatus.PAID || user.subscription.status === PaymentStatus.PENDING_APPROVAL,
        action: () => setActiveTab('billing')
    },
    { 
        id: 'ai', 
        label: 'Activate AI Auto-Replies', 
        done: user.aiConfig.isActive,
        action: () => setActiveTab('ai')
    }
  ];
  
  const setupProgress = Math.round((steps.filter(s => s.done).length / steps.length) * 100);
  const showOnboarding = setupProgress < 100;

  const renderContent = () => {
    switch(activeTab) {
      case 'overview':
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white font-display">Dashboard Overview</h2>
                {user.aiConfig.isActive && (
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 ai-glow"></div>
                        AI System Active
                    </div>
                )}
            </div>
            
            {showOnboarding && (
                <Card className="bg-indigo-900/20 border-indigo-500/30">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-indigo-400">Setup Progress</h3>
                        <span className="text-sm font-medium text-indigo-300">{setupProgress}% Complete</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 mb-8">
                        <div className="bg-indigo-500 h-1.5 rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(99,102,241,0.5)]" style={{ width: `${setupProgress}%` }}></div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                        {steps.map((step, idx) => (
                            <div key={idx} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${step.done ? 'bg-emerald-500/5 border-emerald-500/20 opacity-80' : 'bg-slate-800/50 border-slate-700'}`}>
                                <div className="flex items-center gap-3">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step.done ? 'bg-emerald-500 text-slate-900' : 'bg-slate-700 text-slate-400'}`}>
                                        {step.done ? <Check size={14} /> : idx + 1}
                                    </div>
                                    <span className={`font-medium text-sm ${step.done ? 'text-emerald-400' : 'text-slate-300'}`}>{step.label}</span>
                                </div>
                                {!step.done && (
                                    <Button size="sm" onClick={step.action} className="text-xs h-8 px-3">
                                        Start
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-t-2 border-t-emerald-500">
                    <div className="text-slate-400 text-sm font-medium flex items-center gap-2"><MessageSquare size={14}/> Total Messages</div>
                    <div className="text-4xl font-bold text-white mt-3 font-display">
                        {user.waStatus === WAConnectionStatus.CONNECTED ? '1,480' : '0'}
                    </div>
                    {user.waStatus === WAConnectionStatus.CONNECTED && <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1">↑ 12% <span className="text-slate-500">from last week</span></div>}
                </Card>
                <Card className="border-t-2 border-t-amber-400">
                    <div className="text-slate-400 text-sm font-medium flex items-center gap-2"><Zap size={14}/> AI Auto-Replies</div>
                    <div className="text-4xl font-bold text-white mt-3 font-display">
                         {user.waStatus === WAConnectionStatus.CONNECTED ? '1,425' : '0'}
                    </div>
                    {user.waStatus === WAConnectionStatus.CONNECTED && <div className="text-xs text-amber-400 mt-2">96% automation rate</div>}
                </Card>
                <Card className="border-t-2 border-t-indigo-500">
                    <div className="text-slate-400 text-sm font-medium flex items-center gap-2"><Activity size={14}/> Hours Saved</div>
                    <div className="text-4xl font-bold text-white mt-3 font-display">
                         {user.waStatus === WAConnectionStatus.CONNECTED ? '42.5' : '0'}
                    </div>
                    {user.waStatus === WAConnectionStatus.CONNECTED && <div className="text-xs text-indigo-400 mt-2">~ ₦200k value generated</div>}
                </Card>
            </div>

            <Card title="Activity Analytics">
                <div className="h-72 w-full mt-2">
                    {user.waStatus === WAConnectionStatus.CONNECTED ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={mockChartData}>
                                <defs>
                                    <linearGradient id="colorAi" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                <Tooltip 
                                    contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff'}}
                                    itemStyle={{color: '#fff'}}
                                />
                                <Area type="monotone" dataKey="messages" stroke="#64748b" fillOpacity={1} fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
                                <Area type="monotone" dataKey="ai" stroke="#10b981" fillOpacity={1} fill="url(#colorAi)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-600">
                            <BarChart3 size={48} className="mb-4 opacity-50" />
                            <p>Connect WhatsApp to view analytics</p>
                        </div>
                    )}
                </div>
            </Card>
          </div>
        );

      case 'whatsapp':
        return (
            <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-bold text-white font-display">WhatsApp Connection</h2>
                <Card className="relative overflow-hidden">
                     {/* Decorative background pulse */}
                     {user.waStatus === WAConnectionStatus.CONNECTED && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
                     )}

                    <div className="flex flex-col items-center justify-center py-16 space-y-8 relative z-10">
                        <div className={`w-32 h-32 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${user.waStatus === WAConnectionStatus.CONNECTED ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_50px_rgba(16,185,129,0.3)]' : 'bg-slate-900 border-slate-700 text-slate-500'}`}>
                            {user.waStatus === WAConnectionStatus.CONNECTED ? <Smartphone size={48} /> : <AlertTriangle size={48} />}
                        </div>
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-white mb-2">
                                {user.waStatus === WAConnectionStatus.CONNECTED 
                                    ? `Connected: ${user.waPhoneNumber}` 
                                    : user.waStatus === WAConnectionStatus.CONNECTING 
                                    ? 'Establishing Secure Connection...' 
                                    : 'Device Disconnected'}
                            </h3>
                            <p className="text-slate-400 max-w-sm mx-auto">
                                {user.waStatus === WAConnectionStatus.CONNECTED 
                                    ? 'Your AI is active and monitoring messages.' 
                                    : 'Scan the QR code to link your WhatsApp Business account.'}
                            </p>
                        </div>
                        
                        {user.waStatus === WAConnectionStatus.DISCONNECTED && (
                             <div className="border border-slate-700 p-8 rounded-2xl bg-slate-900/50 backdrop-blur-sm max-w-sm w-full">
                                 <div className="w-48 h-48 bg-white mx-auto mb-6 flex items-center justify-center rounded-lg">
                                     <div className="text-xs text-slate-900 font-bold tracking-widest">[QR CODE]</div>
                                 </div>
                                 <Button onClick={handleConnectWhatsapp} className="w-full">Simulate Scan</Button>
                             </div>
                        )}
                        
                        {user.waStatus === WAConnectionStatus.CONNECTED && (
                            <Button variant="danger" onClick={() => onUpdateUser({...user, waStatus: WAConnectionStatus.DISCONNECTED})}>Disconnect Device</Button>
                        )}
                    </div>
                </Card>
            </div>
        );

      case 'ai':
        return (
            <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-white font-display">AI Configuration</h2>
                        <p className="text-slate-400 text-sm mt-1">Manage the brain of your business assistant.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button 
                            variant={user.aiConfig.isActive ? "danger" : "primary"}
                            onClick={handleToggleAI}
                            className="flex items-center gap-2 shadow-none"
                        >
                            <Zap size={16} /> {user.aiConfig.isActive ? "Stop AI" : "Activate AI"}
                        </Button>
                        <Button onClick={handleSaveAiConfig} variant="secondary" className="flex items-center gap-2">
                            <Save size={16} /> Save Changes
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-250px)] min-h-[600px]">
                    <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar">
                        <Card title="System Persona">
                            <p className="text-sm text-slate-500 mb-3">Define the personality and core instructions.</p>
                            <textarea 
                                className="w-full h-48 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 p-4 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors resize-none leading-relaxed"
                                value={localAiConfig.systemPrompt}
                                onChange={(e) => setLocalAiConfig({...localAiConfig, systemPrompt: e.target.value})}
                                placeholder="Example: You are a friendly receptionist. You help schedule appointments..."
                            />
                        </Card>

                        <Card title="Knowledge Base (FAQs)">
                            <div className="space-y-4">
                                {localAiConfig.faqs.map((faq, idx) => (
                                    <div key={idx} className="p-4 bg-slate-900 rounded-lg border border-slate-800 group hover:border-slate-700 transition-colors relative">
                                        <div className="font-medium text-sm text-emerald-400 mb-1">Q: {faq.question}</div>
                                        <div className="text-sm text-slate-400 leading-relaxed">A: {faq.answer}</div>
                                        <button 
                                            className="absolute top-3 right-3 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                            onClick={() => {
                                                const newFaqs = [...localAiConfig.faqs];
                                                newFaqs.splice(idx, 1);
                                                setLocalAiConfig({...localAiConfig, faqs: newFaqs});
                                            }}
                                        >
                                            <MoreHorizontal size={16} />
                                        </button>
                                    </div>
                                ))}
                                <div className="border-t border-slate-800 pt-5 mt-2">
                                    <h4 className="text-sm font-medium mb-3 text-slate-300">Add New Knowledge</h4>
                                    <div className="space-y-3">
                                        <Input id="new-q" placeholder="Question" className="bg-slate-950" />
                                        <Input id="new-a" placeholder="Answer" className="bg-slate-950" />
                                        <Button size="sm" variant="outline" className="w-full" onClick={() => {
                                            const q = (document.getElementById('new-q') as HTMLInputElement).value;
                                            const a = (document.getElementById('new-a') as HTMLInputElement).value;
                                            if (q && a) {
                                                setLocalAiConfig({...localAiConfig, faqs: [...localAiConfig.faqs, { question: q, answer: a }]});
                                                (document.getElementById('new-q') as HTMLInputElement).value = '';
                                                (document.getElementById('new-a') as HTMLInputElement).value = '';
                                            }
                                        }}>+ Add to Knowledge Base</Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="flex flex-col h-full">
                        <Card title="Simulation Playground" className="flex-1 flex flex-col h-full border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.05)]" noPadding>
                            <div className="flex-1 bg-slate-950/50 p-6 overflow-y-auto space-y-4 flex flex-col">
                                {aiResponse ? (
                                    <>
                                        <div className="self-end bg-indigo-600 text-white p-3 rounded-2xl rounded-tr-sm max-w-[85%] text-sm shadow-lg animate-fade-in">
                                            {testMessage}
                                        </div>
                                        <div className="self-start bg-slate-800 border border-slate-700 text-slate-200 p-4 rounded-2xl rounded-tl-sm max-w-[90%] shadow-lg text-sm leading-relaxed animate-fade-in delay-100 flex gap-3">
                                            <div className="mt-1 min-w-[20px]"><Bot size={20} className="text-emerald-500" /></div>
                                            <div>{aiResponse}</div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-slate-600 opacity-50">
                                        <Bot size={48} className="mb-4" />
                                        <p>Test your AI's responses here.</p>
                                    </div>
                                )}
                            </div>
                            <div className="p-4 bg-slate-900 border-t border-slate-800">
                                <div className="flex gap-2">
                                    <Input 
                                        value={testMessage}
                                        onChange={(e) => setTestMessage(e.target.value)}
                                        placeholder="Type a message as a customer..."
                                        onKeyDown={(e) => e.key === 'Enter' && handleSimulate()}
                                        className="bg-slate-950 border-slate-700"
                                    />
                                    <Button onClick={handleSimulate} disabled={isSimulating} className="px-4">
                                        {isSimulating ? <RefreshCw className="animate-spin" size={18}/> : <Play size={18} fill="currentColor" />}
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        );

      case 'billing':
        return (
            <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-bold text-white font-display">Subscription & Billing</h2>
                <div className="grid md:grid-cols-2 gap-8">
                    <Card title="Current Plan Status">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-2xl font-bold text-emerald-400 font-display">{PLANS[user.subscription.plan].name}</h3>
                                <p className="text-slate-400">₦{PLANS[user.subscription.plan].price.toLocaleString()}/month</p>
                            </div>
                            <Badge color={
                                user.subscription.status === PaymentStatus.PAID ? 'green' :
                                user.subscription.status === PaymentStatus.PENDING_APPROVAL ? 'yellow' : 'red'
                            }>
                                {user.subscription.status}
                            </Badge>
                        </div>
                        {user.subscription.status === PaymentStatus.UNPAID && (
                            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mb-6">
                                <div className="flex gap-3">
                                    <AlertTriangle className="text-amber-500 shrink-0" size={20} />
                                    <div>
                                        <p className="text-sm text-amber-500 font-medium">Action Required</p>
                                        <p className="text-xs text-amber-400/80 mt-1">Your AI service is paused until payment is confirmed.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        <ul className="text-sm text-slate-400 space-y-3">
                             {PLANS[user.subscription.plan].features.map((f, i) => <li key={i} className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-600"></div> {f}</li>)}
                        </ul>
                    </Card>

                    <Card title="Payment Details">
                        <div className="space-y-6">
                            <div className="text-sm text-slate-300 p-5 bg-slate-950 rounded-xl border border-slate-800 shadow-inner font-mono leading-relaxed">
                                <div className="flex justify-between mb-2 text-slate-500 border-b border-slate-800 pb-2">
                                    <span>INVOICE</span>
                                    <span>#{Math.floor(Math.random() * 10000)}</span>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between"><span>Plan:</span> <span className="text-white">{PLANS[user.subscription.plan].name}</span></div>
                                    <div className="flex justify-between"><span>Amount:</span> <span className="text-emerald-400">₦{PLANS[user.subscription.plan].price.toLocaleString()}</span></div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-800 space-y-1">
                                    <div className="text-xs text-slate-500 mb-1">PAY TO:</div>
                                    <div className="text-white">{BANK_DETAILS.bankName}</div>
                                    <div className="text-white tracking-wider">{BANK_DETAILS.accountNumber}</div>
                                    <div className="text-slate-400 text-xs">{BANK_DETAILS.accountName}</div>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Upload Payment Proof</label>
                                <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center cursor-pointer hover:bg-slate-800/50 hover:border-emerald-500/50 transition-all relative group">
                                    <input 
                                        type="file" 
                                        accept="image/*,.pdf"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        onChange={(e) => setProofFile(e.target.files ? e.target.files[0] : null)}
                                    />
                                    <div className="bg-slate-800 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400 group-hover:text-emerald-400 transition-colors">
                                        <Upload size={20} />
                                    </div>
                                    <p className="text-sm text-slate-300 font-medium">
                                        {proofFile ? <span className="text-emerald-400">{proofFile.name}</span> : "Click to upload receipt"}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1">Supports IMG, PDF</p>
                                </div>
                            </div>
                            
                            <Button className="w-full" onClick={handlePaymentSubmit} disabled={user.subscription.status === PaymentStatus.PENDING_APPROVAL}>
                                {user.subscription.status === PaymentStatus.PENDING_APPROVAL ? 'Verifying Payment...' : 'Submit Payment Proof'}
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden text-slate-200">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col z-20 shadow-xl">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
           <div className="bg-emerald-500 text-slate-900 p-1.5 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                <MessageSquare size={20} strokeWidth={2.5} />
            </div>
           <span className="font-display font-bold text-xl text-white tracking-tight">DOLOR<span className="text-emerald-500">.AI</span></span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
            {[
                { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
                { id: 'whatsapp', icon: Smartphone, label: 'WhatsApp' },
                { id: 'ai', icon: Bot, label: 'AI Config' },
                { id: 'billing', icon: CreditCard, label: 'Billing' },
            ].map((item) => (
                <button 
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === item.id ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                >
                    <item.icon size={18} /> {item.label}
                </button>
            ))}
        </nav>
        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
            <div className="flex items-center gap-3 mb-4 p-2 rounded-lg bg-slate-800/50 border border-slate-700">
                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xs">
                    {user.businessName.substring(0, 2).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                    <div className="text-sm font-medium text-white truncate">{user.businessName}</div>
                    <div className="text-xs text-slate-500 truncate">{user.email}</div>
                </div>
            </div>
            <Button variant="ghost" size="sm" className="w-full justify-start text-slate-500 hover:text-red-400" onClick={onLogout}>
                <LogOut size={16} className="mr-2" /> Sign Out
            </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative bg-slate-950">
          {/* Background Ambient Glow */}
         <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-emerald-900/10 blur-[100px] pointer-events-none rounded-full z-0"></div>

         <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 p-4 md:hidden flex justify-between items-center sticky top-0 z-30">
             <span className="font-bold text-lg text-white font-display">Dolor AI</span>
             <Button size="sm" variant="secondary" onClick={onLogout}>Log Out</Button>
         </header>
         <div className="p-6 md:p-10 max-w-7xl mx-auto relative z-10">
             {renderContent()}
         </div>
      </main>
    </div>
  );
};

export default UserDashboard;