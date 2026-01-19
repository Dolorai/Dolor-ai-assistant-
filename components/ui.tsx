import React from 'react';

// Button
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'warning';
  size?: 'sm' | 'md' | 'lg';
}
export const Button: React.FC<ButtonProps> = ({ variant = 'primary', size = 'md', className = '', ...props }) => {
  const baseStyle = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";
  
  const variants = {
    primary: "bg-emerald-500 text-slate-950 hover:bg-emerald-400 focus:ring-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)]",
    secondary: "bg-slate-800 text-white hover:bg-slate-700 focus:ring-slate-500 border border-slate-700",
    outline: "border border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white focus:ring-emerald-500",
    danger: "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 focus:ring-red-500",
    ghost: "bg-transparent text-slate-400 hover:text-emerald-400 hover:bg-slate-800/50",
    warning: "bg-amber-400 text-slate-900 hover:bg-amber-300 focus:ring-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.2)] hover:shadow-[0_0_25px_rgba(251,191,36,0.4)]"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-8 py-3.5 text-base",
  };

  return <button className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`} {...props} />;
};

// Input
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}
export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => (
  <div className="w-full">
    {label && <label className="block text-sm font-medium text-slate-400 mb-1.5 ml-1">{label}</label>}
    <input 
      className={`w-full rounded-lg bg-slate-900/50 border border-slate-700 text-slate-100 placeholder-slate-500 shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 sm:text-sm p-3 transition-colors ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500' : ''} ${className}`} 
      {...props} 
    />
    {error && <p className="mt-1.5 text-xs text-red-400 ml-1">{error}</p>}
  </div>
);

// Card
export const Card: React.FC<{ children: React.ReactNode; className?: string; title?: string; noPadding?: boolean }> = ({ children, className = '', title, noPadding = false }) => (
  <div className={`glass-panel rounded-xl overflow-hidden ${className}`}>
    {title && <div className="px-6 py-4 border-b border-slate-800 font-display font-semibold text-slate-200 tracking-wide">{title}</div>}
    <div className={noPadding ? '' : 'p-6'}>{children}</div>
  </div>
);

// Badge
export const Badge: React.FC<{ children: React.ReactNode; color?: 'green' | 'yellow' | 'red' | 'blue' | 'gray' }> = ({ children, color = 'gray' }) => {
  const colors = {
    green: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    yellow: "bg-amber-400/10 text-amber-400 border border-amber-400/20",
    red: "bg-red-500/10 text-red-400 border border-red-500/20",
    blue: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    gray: "bg-slate-800 text-slate-400 border border-slate-700",
  };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[color]}`}>{children}</span>;
};