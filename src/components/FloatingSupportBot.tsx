import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Loader2 } from 'lucide-react';

export const FloatingSupportBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user'|'bot', text: string}[]>([
    { role: 'bot', text: 'مرحباً بك! أنا مساعدك الذكي. كيف يمكنني مساعدتك اليوم؟' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch('/api/ai/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await res.json();
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'bot', text: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'bot', text: 'عذراً، حدث خطأ في الاتصال.' }]);
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'bot', text: 'تعذر الاتصال بالخادم.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50" dir="rtl">
      {!isOpen ? (
        <button onClick={() => setIsOpen(true)} className="bg-indigo-600 text-white p-4 rounded-full shadow-2xl hover:bg-indigo-700 transition-transform hover:scale-110">
          <MessageSquare className="w-6 h-6" />
        </button>
      ) : (
        <div className="bg-white w-80 sm:w-96 rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[500px]">
          <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2 font-bold"><Bot className="w-5 h-5 text-emerald-400" /> المساعد الذكي</div>
            <button onClick={() => setIsOpen(false)}><X className="w-5 h-5 text-slate-400 hover:text-white" /></button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white border text-slate-700 rounded-bl-none shadow-sm'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && <div className="flex justify-start"><div className="bg-white p-3 rounded-2xl rounded-bl-none border"><Loader2 className="w-4 h-4 animate-spin text-indigo-600" /></div></div>}
            <div ref={endRef} />
          </div>

          <div className="p-3 bg-white border-t flex gap-2">
            <input 
              value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="اكتب سؤالك..." 
              className="flex-1 bg-slate-100 px-3 py-2 rounded-lg text-sm focus:outline-none"
            />
            <button onClick={handleSend} disabled={loading} className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
