import React, { useState } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Bot,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Video,
  CreditCard,
  FileText,
  RefreshCw,
  ChevronDown
} from 'lucide-react';
import { SupportTicket } from '../types';
import { diagnoseAndResolveUserIssue, DiagnoseParams } from '../services/aiOperationsService';
import { syncSupportTicketToCloud } from '../services/firebase';

interface FloatingSupportBotProps {
  onNewTicketCreated?: (ticket: SupportTicket) => void;
  onOpenOwnerOperations?: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  steps?: string[];
  status?: string;
  timestamp: string;
}

export const FloatingSupportBot: React.FC<FloatingSupportBotProps> = ({
  onNewTicketCreated,
  onOpenOwnerOperations,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState<'مرشح وظيفي' | 'شركة / صاحب عمل' | 'زائر'>('زائر');
  const [isDiagnosing, setIsDiagnosing] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: 'مرحباً بك في منصة توظيف ذكي! 👋\nأنا وكيل الدعم الفني الذكي المتاح 24/7. يمكنني مساعدتك في حل المشاكل التقنية، فحص الكاميرا والصوت في المقابلات، الاستفسار عن باقات التوظيف وبوابة الدفع، أو تصعيد طلبك للمالك فورياً.\n\nكيف يمكنني مساعدتك اليوم؟',
      timestamp: 'الآن'
    }
  ]);

  const quickPrompts = [
    { label: 'مشكلة بالكاميرا أو المايك', category: 'interview_audio_video', text: 'الكاميرا أو الميكروفون لا يعملان في قاعة المقابلة' },
    { label: 'التحقق من الدفع والفاتورة', category: 'payment', text: 'أريد التأكد من استلام الدفع وصدور الفاتورة الضريبية ZATCA' },
    { label: 'كيف أنشر وظيفة جديدة؟', category: 'job_post', text: 'كيف أنشر وظيفة جديدة وأفعّل المقابلات الرقمية التلقائية؟' },
    { label: 'طلب استرداد رسوم الباقة', category: 'refund', text: 'أريد طلب استرداد مالي أو تعديل باقة التوظيف' }
  ];

  const handleSendMessage = async (textToSend?: string, categoryOverride?: any) => {
    const text = (textToSend || inputText).trim();
    if (!text || isDiagnosing) return;

    const userMsgId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsDiagnosing(true);

    // Determine category
    let category: any = categoryOverride || 'general';
    if (!categoryOverride) {
      if (text.includes('كاميرا') || text.includes('مايك') || text.includes('صوت') || text.includes('فيديو') || text.includes('قاعة')) {
        category = 'interview_audio_video';
      } else if (text.includes('دفع') || text.includes('فاتورة') || text.includes('فلوس') || text.includes('مدى') || text.includes('بطاقة')) {
        category = 'payment';
      } else if (text.includes('استرداد') || text.includes('ارجاع') || text.includes('refund')) {
        category = 'refund';
      } else if (text.includes('وظيفة') || text.includes('نشر') || text.includes('إعلان')) {
        category = 'job_post';
      }
    }

    try {
      const params: DiagnoseParams = {
        userName: userName.trim() || 'مستخدم المنصة',
        userEmail: userEmail.trim() || 'user@tawtheefx.sa',
        userRole,
        issueCategory: category,
        message: text
      };

      const ticket = await diagnoseAndResolveUserIssue(params);

      // Save to Cloud Firestore
      await syncSupportTicketToCloud(ticket);
      if (onNewTicketCreated) onNewTicketCreated(ticket);

      const botReply: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: ticket.aiSolution,
        steps: ticket.diagnosticStepsTaken,
        status: ticket.status,
        timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: 'bot',
          text: 'تم استلام استفسارك وسيتم إشعار إدارة المنصة فوراً لمساعدتك.',
          timestamp: 'الآن'
        }
      ]);
    } finally {
      setIsDiagnosing(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 left-6 z-40 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-2xl flex items-center gap-2.5 transition-all transform hover:scale-105 border border-indigo-400/40 group"
          title="المساعد الذكي وحل المشكلات 24/7"
        >
          <div className="relative">
            <Bot className="w-5 h-5 group-hover:rotate-6 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-indigo-600"></span>
          </div>
          <span className="hidden sm:inline text-xs font-bold">
            مساعد الذكاء الاصطناعي 24/7
          </span>
        </button>
      )}

      {/* Floating Chat Drawer */}
      {isOpen && (
        <div className="fixed bottom-6 left-6 z-50 w-[92vw] sm:w-[410px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[560px] max-h-[85vh] animate-in fade-in slide-in-from-bottom-4 duration-200">
          
          {/* Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-white">بوت الدعم الفني الذكي</h4>
                  <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 text-[10px] rounded-full font-mono">
                    متاح الآن
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  حل فوري لمشاكل الكاميرا، المقابلات، والدفع
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick User Identity bar (optional) */}
          <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
            <div className="flex items-center gap-1.5">
              <span>دورك:</span>
              <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value as any)}
                className="bg-transparent text-[11px] font-semibold text-indigo-700 outline-none cursor-pointer"
              >
                <option value="مرشح وظيفي">مرشح وظيفي</option>
                <option value="شركة / صاحب عمل">صاحب عمل / شركة</option>
                <option value="زائر">زائر</option>
              </select>
            </div>
            <span className="text-[10px] text-slate-400">رد آلي ذكي فوري</span>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] p-3 rounded-2xl whitespace-pre-line leading-relaxed text-xs shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                  }`}
                >
                  {msg.text}

                  {/* Diagnostic steps if any */}
                  {msg.steps && msg.steps.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1 text-[10px] text-slate-500">
                      <span className="font-semibold text-slate-700 block">خطوات الفحص الآلي:</span>
                      {msg.steps.map((st, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-emerald-700">
                          <CheckCircle2 className="w-3 h-3 shrink-0" />
                          <span>{st}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {msg.status && (
                    <div className="mt-2 text-right">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                          msg.status === 'تم التصعيد لمالك المنصة'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {msg.status}
                      </span>
                    </div>
                  )}
                </div>

                <span className="text-[10px] text-slate-400 mt-1 px-1 font-mono">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isDiagnosing && (
              <div className="flex items-center gap-2 text-xs text-indigo-600 bg-white p-2.5 rounded-xl border border-indigo-100 w-fit">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>الذكاء الاصطناعي يقوم بتشخيص المشكلة وتجهيز الحل...</span>
              </div>
            )}
          </div>

          {/* Quick Prompts Bar */}
          <div className="p-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(qp.text, qp.category)}
                className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded-lg text-[11px] whitespace-nowrap transition-colors border border-slate-200 shrink-0 font-medium"
              >
                {qp.label}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="اكتب مشكلتك أو استفسارك هنا..."
              className="flex-1 text-xs px-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isDiagnosing}
              className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl transition-colors shadow-xs"
            >
              <Send className="w-4 h-4 rotate-180" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};
