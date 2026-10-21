import React, { useState } from 'react';
import { Send, Loader2, Code } from 'lucide-react';

export const AdminAIAssistant = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([
    { role: 'bot', text: 'مرحباً بك في مساعد المطور. الصق كود الخطأ أو اسألني عن أي مشكلة تقنية في المشروع.' }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch('/api/ai/debug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ errorLog: userMsg }),
      });
      const data = await res.json();
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'bot', text: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'bot', text: 'عذراً، لم أستطع تحليل هذا.' }]);
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'bot', text: 'خطأ في الاتصال بالخادم.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
      
      {/* رأس الشات */}
      <div className="bg-slate-950 p-4 flex items-center gap-2 text-white font-bold border-b border-slate-800">
        <Code className="w-5 h-5 text-emerald-400" />
        مساعد المطور الذكي
      </div>
      
      {/* منطقة الرسائل */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-br-none' 
                : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 p-4 rounded-2xl rounded-bl-none border border-slate-700 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
              <span className="text-sm text-slate-400">جاري التحليل...</span>
            </div>
          </div>
        )}
      </div>

      {/* مربع الكتابة - تم تعديله ليكون داكن وواضح */}
      <div className="p-4 bg-slate-950 border-t border-slate-800 flex gap-2">
        <input
          autoComplete="off"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="الصق كود الخطأ هنا أو اسأل سؤالاً..."
          className="flex-1 bg-slate-800 text-white placeholder-slate-400 border border-slate-700 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-xl disabled:opacity-50 transition-colors shadow-lg shadow-indigo-600/20"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
