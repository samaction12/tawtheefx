import React from 'react';
import { Briefcase, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: 'jobs' | 'packages' | 'interviews' | 'employer' | 'billing') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <div className="w-7 h-7 rounded bg-indigo-600 flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-white" />
              </div>
              <span>توظيف إكسبرتس TawtheefX</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              المنصة المتكاملة لخدمات نشر إعلانات الوظائف وإجراء المقابلات الوظيفية الرقمية المباشرة مع نظام دفع إلكتروني آمن وموثوق.
            </p>
            <div className="text-[11px] text-slate-500 font-mono">
              الرقم الضريبي للمنصة: 31094829100003
            </div>
          </div>

          {/* Quick Nav */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs">روابط المنصة</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('jobs')}
                  className="hover:text-white transition-colors"
                >
                  استكشاف أحدث الوظائف
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('packages')}
                  className="hover:text-white transition-colors"
                >
                  باقات إعلانات الوظائف والأسعار
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('interviews')}
                  className="hover:text-white transition-colors"
                >
                  منظومة المقابلات الإلكترونية
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('employer')}
                  className="hover:text-white transition-colors"
                >
                  لوحة تحكم جهة العمل (ATS)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('billing')}
                  className="hover:text-white transition-colors"
                >
                  سجل الفواتير وسندات الدفع
                </button>
              </li>
            </ul>
          </div>

          {/* Security & Payment */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs">الأمان والمدفوعات</h4>
            <div className="space-y-2 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>شهادة تشفير 256-Bit SSL المعتمدة</span>
              </div>
              <div>متوافق مع معايير الأمان المصرفي PCI-DSS</div>
              <div>بوابات دفع معتمدة: مدى، فيزا، ماستركارد، Apple Pay، stc pay</div>
              <div>فواتير ضريبية فورية مطابقة لهيئة الزكاة والضريبة والجمارك (ZATCA)</div>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs">المساعدة وخدمة العملاء</h4>
            <div className="space-y-2 text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                <span>support@tawtheefx.sa</span>
              </div>
              <div className="flex items-center gap-2 font-mono tabular-nums">
                <Phone className="w-3.5 h-3.5 text-indigo-400" />
                <span>+966 11 800 9200</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                <span>الرياض - واجهة الأعمال والتقنية</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            جميع الحقوق محفوظة © {new Date().getFullYear()} منصة توظيف إكسبرتس لخدمات التوظيف الرقمية.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">سياسة الخصوصية وحماية البيانات</span>
            <span aria-hidden="true">·</span>
            <span className="hover:text-slate-400 cursor-pointer">شروط الاستخدام والخدمة</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
