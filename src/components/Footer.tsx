import React from 'react';
import { ShieldCheck, Mail, Globe, Lock, CreditCard } from 'lucide-react';

export const Footer = ({ onNavigate }: { onNavigate: (tab: any) => void }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">T</span>
            توظيف ذكي | ThakiHire
          </h3>
          <p className="text-sm leading-relaxed text-slate-400">
            The global, AI-powered platform for smart recruitment, job posting, and seamless digital video interviews.
          </p>
          <div className="flex items-center gap-2 text-sm text-slate-400 mt-4">
            <Globe className="w-4 h-4 text-indigo-400" />
            <span>Serving clients globally.</span>
          </div>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Platform</h4>
          <ul className="space-y-2 text-sm">
            <li><button onClick={() => onNavigate('jobs')} className="hover:text-indigo-400">Explore Jobs</button></li>
            <li><button onClick={() => onNavigate('packages')} className="hover:text-indigo-400">Pricing & Packages</button></li>
            <li><button onClick={() => onNavigate('interviews')} className="hover:text-indigo-400">Digital Interviews</button></li>
            <li><button onClick={() => onNavigate('employer')} className="hover:text-indigo-400">Employer Dashboard</button></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Security & Payments</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2 text-emerald-400"><ShieldCheck className="w-4 h-4" /> 256-Bit SSL Encrypted</li>
            <li className="flex items-center gap-2"><Lock className="w-4 h-4 text-slate-400" /> PCI-DSS Compliant</li>
            <li className="flex items-center gap-2"><CreditCard className="w-4 h-4 text-slate-400" /> Global Gateways (Visa, MC)</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Support</h4>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-indigo-400" /> <a href="mailto:support@thakihire.com" className="hover:text-white">support@thakihire.com</a></li>
            <li className="flex items-center gap-2"><Globe className="w-4 h-4 text-indigo-400" /> Global Support (24/7)</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500">
        <p>© 2026 ThakiHire. All rights reserved globally.</p>
      </div>
    </footer>
  );
};
