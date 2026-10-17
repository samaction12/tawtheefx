import React, { useState } from 'react';
import { Bot, X, Send, Loader2, Code } from 'lucide-react';

export const AdminAIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setReply('');
    try {
      const res = await fetch('/api/ai/debug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ errorLog: input }),
      });
      const data = await res.json();
      if (data.reply) setReply(data.reply);
      else setReply('عذراً، لم أستطع تحليل هذا الخطأ.');
    } catch (e) {
      setReply('حدث خطأ في الاتصال بالمساعد الذكي.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)} 
        className="fixed bottom-20 right-4 z-50 bg-slate-900 text-white p-3 rounded-full shadow-2xl hover:bg-slate-800"
        title="مساعد المطور الذكي"
      >
        <Code className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-20 right-4 z-50 w-80 bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden flex flex-col" dir="rtl">
      <div className="bg-slate-800 p-3 flex justify-between items-center text-white border-b border-slate-700">
        <div className="flex items-center gap-2 font-bold text-sm"><Bot className="w-4 h-4 text-emerald-400" /> مساعد المطور الذكي</div>
        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
      </div>
      
      <div className="p-3 space-y-3 max-h-96 overflow-y-auto">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="الصق كود الخطأ هنا (Error Log) أو اسأل سؤالاً تقنياً..."
          className="w-full bg-slate-950 text-slate-300 text-xs p-2 rounded-lg border border-slate-700 focus:outline-none h-24"
        />
        <button 
          onClick={handleAsk} 
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} حلل المشكلة
        </button>
        
        {reply && (
          <div className="bg-slate-800 p-3 rounded-lg text-xs text-slate-200 border border-slate-700 whitespace-pre-wrap leading-relaxed">
            {reply}
          </div>
        )}
      </div>
    </div>
  );
};
