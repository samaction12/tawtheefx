import React from 'react';
import { ArrowLeft, Video, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  onPostJobClick: () => void;
  onOpenInterviewRoom: () => void;
  onExploreJobs: () => void;
}

export const HeroSection: React.FC<Props> = ({ onPostJobClick, onOpenInterviewRoom, onExploreJobs }) => {
  const { t, lang } = useLanguage();

  return (
    <section className="relative pt-20 pb-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold border border-indigo-100">
            <Sparkles className="w-4 h-4" />
            {lang === 'ar' ? 'منصة التوظيف الأذكى عالمياً' : 'The Smartest Global Recruitment Platform'}
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
          {t.hero_title}
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed">
          {t.hero_subtitle}
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <button 
            onClick={onPostJobClick}
            className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 transition-all"
          >
            <ArrowLeft className={`w-5 h-5 ${lang === 'ar' ? '' : 'rotate-180'}`} />
            {t.nav_post_job}
          </button>
          
          <button 
            onClick={onOpenInterviewRoom}
            className="w-full sm:w-auto px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
          >
            <Video className="w-5 h-5" />
            {lang === 'ar' ? 'تجربة المقابلات الرقمية' : 'Try Digital Interviews'}
          </button>
        </div>

        <div className="mt-12">
          <button onClick={onExploreJobs} className="text-indigo-600 font-semibold hover:text-indigo-800 underline decoration-2 underline-offset-4">
            {lang === 'ar' ? 'تصفح أحدث الوظائف' : 'Explore Latest Jobs'}
          </button>
        </div>
      </div>
    </section>
  );
};
