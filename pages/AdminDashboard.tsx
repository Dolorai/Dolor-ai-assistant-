import React, { useState } from 'react';
import { User, PaymentStatus } from '../types';
import { Card, Button, Badge } from '../components/ui';
import { Check, X, Search, FileText, Link as LinkIcon, Copy, ArrowLeft, LogOut } from 'lucide-react';

interface AdminDashboardProps {
  users: User[];
  onUpdateUserStatus: (userId: string, status: PaymentStatus) => void;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ users, onUpdateUserStatus, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'users'>('pending');

  const pendingUsers = users.filter(u => u.subscription.status === PaymentStatus.PENDING_APPROVAL);

  const generateInviteLink = () => {
    const code = Math.random().toString(36).substring(2, 10);
    const link = `${window.location.protocol}//${window.location.host}${window.location.pathname}#/?invite=${code}`;
    navigator.clipboard.writeText(link);
    alert(`Secure Invite Link Copied to Clipboard:\n${link}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
        <header className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={onLogout} 
                        className="text-slate-400 hover:text-white flex items-center gap-2 px-2"
                        title="Return to Login"
                    >
                        <ArrowLeft size={18} />
                        <span className="hidden sm:inline font-medium">Back</span>
                    </Button>
                    <div className="h-6 w-px bg-slate-800 hidden sm:block"></div>
                    <div className="flex items-center gap-6">
                        <h1 className="text-xl font-bold font-display text-white">Dolor Admin</h1>
                        <nav className="flex gap-2 hidden md:flex">
                            <button 
                                onClick={() => setActiveTab('pending')}
                                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'pending' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:text-white'}`}
                            >
                                Pending ({pendingUsers.length})
                            </button>
                            <button 
                                onClick={() => setActiveTab('users')}
                                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'users' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:text-white'}`}
                            >
                                All Users
                            </button>
                        </nav>
                    </div>
                </div>
                
                {/* Mobile Tab Toggle */}
                <div className="md:hidden flex gap-2 mr-auto ml-4">
                     <button 
                        onClick={() => setActiveTab('pending')}
                        className={`text-xs font-medium ${activeTab === 'pending' ? 'text-emerald-400' : 'text-slate-500'}`}
                    >
                        Pending
                    </button>
                    <span className="text-slate-700">|</span>
                    <button 
                        onClick={() => setActiveTab('users')}
                        className={`text-xs font-medium ${activeTab === 'users' ? 'text-emerald-400' : 'text-slate-500'}`}
                    >
                        Users
                    </button>
                </div>

                <div className="flex gap-3">
                    <Button variant="outline" size="sm" onClick={generateInviteLink} className="hidden sm:flex">
                        <LinkIcon size={14} className="mr-2" /> Invite
                    </Button>
                    <Button variant="secondary" size="sm" onClick={onLogout}>
                        <LogOut size={14} className="mr-2 sm:hidden" />
                        <span className="hidden sm:inline">Logout</span>
                        <span className="sm:hidden">Exit</span>
                    </Button>
                </div>
            </div>
        </header>

        <main className="max-w-7xl mx-auto p-6">
            {activeTab === 'pending' && (
                <div className="space-y-4 animate-fade-in">
                    <h2 className="text-xl font-bold text-white mb-4 font-display">Payment Approvals</h2>
                    {pendingUsers.length === 0 ? (
                        <div className="text-center py-12 bg-slate-900/50 rounded-xl border border-slate-800 text-slate-500">
                            No pending payments found. Good job!
                        </div>
                    ) : (
                        pendingUsers.map(user => (
                            <Card key={user.id} className="flex flex-col md:flex-row justify-between items-center gap-6 border-l-4 border-l-amber-400">
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg text-white font-display">{user.businessName}</h3>
                                    <p className="text-sm text-slate-400">{user.email} • {user.phone}</p>
                                    <div className="mt-3 flex items-center gap-2">
                                        <Badge color="blue">{user.subscription.plan}</Badge>
                                        <span className="text-sm font-medium text-emerald-400">₦{user.subscription.amount.toLocaleString()}</span>
                                    </div>
                                </div>
                                
                                {user.subscription.paymentProofUrl && (
                                    <div className="flex-1 text-center">
                                        <a href={user.subscription.paymentProofUrl} target="_blank" rel="noreferrer" className="text-indigo-400 text-sm hover:text-white transition-colors flex items-center justify-center gap-2 bg-slate-900 px-4 py-2 rounded-lg border border-slate-700">
                                            <FileText size={16} /> View Payment Proof
                                        </a>
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    <Button variant="danger" size="sm" onClick={() => onUpdateUserStatus(user.id, PaymentStatus.REJECTED)}>
                                        <X size={16} className="mr-1" /> Reject
                                    </Button>
                                    <Button variant="primary" size="sm" onClick={() => onUpdateUserStatus(user.id, PaymentStatus.PAID)}>
                                        <Check size={16} className="mr-1" /> Approve
                                    </Button>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            )}

            {activeTab === 'users' && (
                <div className="space-y-4 animate-fade-in">
                    <h2 className="text-xl font-bold text-white mb-4 font-display">User Management</h2>
                    <div className="bg-slate-900 rounded-xl shadow border border-slate-800 overflow-hidden">
                        <table className="min-w-full divide-y divide-slate-800">
                            <thead className="bg-slate-950">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Business</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Plan</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">WA Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {users.filter(u => u.role !== 'ADMIN').map(user => (
                                    <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-white">{user.businessName}</div>
                                            <div className="text-sm text-slate-500">{user.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-slate-300">{user.subscription.plan}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Badge color={
                                                user.subscription.status === PaymentStatus.PAID ? 'green' : 
                                                user.subscription.status === PaymentStatus.PENDING_APPROVAL ? 'yellow' : 'red'
                                            }>
                                                {user.subscription.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            {user.waStatus}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </main>
    </div>
  );
};

export default AdminDashboard;