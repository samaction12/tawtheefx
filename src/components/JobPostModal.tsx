import React, { useState } from 'react';
import { X, ArrowLeft, Video, Check, Sparkles, Briefcase, DollarSign, Building } from 'lucide-react';
import { JobListing, JobPackage } from '../types';
import { PACKAGES } from '../data/mockData';

interface JobPostModalProps {
  onClose: () => void;
  onProceedToPayment: (jobData: Partial<JobListing>, selectedPackage: JobPackage) => void;
}

export const JobPostModal: React.FC<JobPostModalProps> = ({
  onClose,
  onProceedToPayment,
}) => {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('الرياض، المملكة العربية السعودية');
  const [department, setDepartment] = useState('الهندسة والتقنية');
  const [type, setType] = useState<'دوام كامل' | 'عن بُعد' | 'هجين' | 'عقد'>('دوام كامل');
  const [salary, setSalary] = useState('18,000 - 24,000 ر.س / شهرياً');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [requiresVideoInterview, setRequiresVideoInterview] = useState(true);
  const [selectedPkgId, setSelectedPkgId] = useState<string>('pkg-pro-interview');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const chosenPkg = PACKAGES.find((p) => p.id === selectedPkgId) || PACKAGES[1];
    const reqArray = requirements
      .split('\n')
      .map((r) => r.trim())
      .filter(Boolean);

    const newJobPartial: Partial<JobListing> = {
      title,
      company,
      location,
      department,
      type,
      salary,
      description: description || 'تفاصيل الوظيفة ومسؤوليات الدور القيادي في فريق العمل.',
      requirements: reqArray.length > 0 ? reqArray : ['خبرة عملية ذات صلة لا تقل عن 3 سنوات', 'مهارات تواصل ممتازة'],
      benefits: ['تأمين صحي عائلي شامل', 'مكافأة سنوية مجزية', 'بيئة عمل مرنة ومحفزة'],
      requiresVideoInterview,
      featured: chosenPkg.popular || false,
      postedDate: 'الآن',
      deadline: '2026-11-30',
      applicantsCount: 0
    };

    onProceedToPayment(newJobPartial, chosenPkg);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                نشر إعلان وظيفي وتفعيل المقابلات الإلكترونية
              </h3>
              <p className="text-xs text-slate-500">
                أدخل تفاصيل الشاغر الوظيفي واختر باقة النشر لتوجيه الإعلان فوراً للمرشحين
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                المسمى الوظيفي *
              </label>
              <input
                type="text"
                required
                placeholder="مثال: مهندس أول أمن سيبراني"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                اسم الشركة أو المنشأة *
              </label>
              <input
                type="text"
                required
                placeholder="مثال: شركة التطوير الرقمي"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">التخصص / الإدارة</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600 bg-white"
              >
                <option value="الهندسة والتقنية">الهندسة والتقنية</option>
                <option value="إدارة المنتجات">إدارة المنتجات</option>
                <option value="الموارد البشرية">الموارد البشرية</option>
                <option value="المالية والمحاسبة">المالية والمحاسبة</option>
                <option value="التسويق والمبيعات">التسويق والمبيعات</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">نمط العمل</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600 bg-white"
              >
                <option value="دوام كامل">دوام كامل</option>
                <option value="هجين">هجين</option>
                <option value="عن بُعد">عن بُعد</option>
                <option value="عقد">عقد سنوي</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">المدينة أو النطاق</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">الراتب المتوقع</label>
              <input
                type="text"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono tabular-nums border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 p-2.5 bg-indigo-50 border border-indigo-200 rounded-lg cursor-pointer text-indigo-900">
                <input
                  type="checkbox"
                  checked={requiresVideoInterview}
                  onChange={(e) => setRequiresVideoInterview(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-0"
                />
                <span className="font-semibold text-xs flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-indigo-600" />
                  تفعيل المقابلات الإلكترونية الفورية للوظيفة
                </span>
              </label>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">الوصف العام للشاغر</label>
            <textarea
              rows={3}
              placeholder="اكتب نبذة مختصرة عن الدور والمسؤوليات الرئيسية..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600 leading-relaxed"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              المؤهلات والشروط المطلوبة (سطر لكل شرط)
            </label>
            <textarea
              rows={2}
              placeholder="خبرة 4 سنوات في تطوير البرمجيات&#10;إتقان اللغة الإنجليزية والعمل الجماعي"
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600 leading-relaxed"
            />
          </div>

          {/* Package Selection */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <label className="block font-semibold text-slate-700">
              اختر باقة نشر الإعلان المناسبة
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {PACKAGES.map((pkg) => (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPkgId(pkg.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedPkgId === pkg.id
                      ? 'border-indigo-600 bg-indigo-50/60 shadow-sm ring-1 ring-indigo-600'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 text-xs">{pkg.name.split('(')[0]}</span>
                    {selectedPkgId === pkg.id && <Check className="w-4 h-4 text-indigo-600" />}
                  </div>
                  <div className="text-sm font-bold font-mono tabular-nums text-slate-900">
                    {pkg.priceSAR.toLocaleString()} ر.س
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    {pkg.interviewSlots > 0
                      ? `${pkg.interviewSlots} مقابلة فيديو متضمنة`
                      : 'نشر وظيفي أساسي'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-3 border-t border-slate-100">
            <button
              type="submit"
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <span>المتابعة إلى الدفع الإلكتروني الآمن وتأكيد النشر</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
