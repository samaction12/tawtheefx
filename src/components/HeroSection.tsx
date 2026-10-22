import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Video, 
  Sparkles, 
  Search, 
  Briefcase, 
  ShieldCheck, 
  Star, 
  Users, 
  Globe2, 
  TrendingUp, 
  CheckCircle2, 
  Zap, 
  Building2,
  Play
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  onPostJobClick: () => void;
  onOpenInterviewRoom: () => void;
  onExploreJobs: () => void;
  onSearch?: (query: string, department?: string) => void;
}

export const HeroSection: React.FC<Props> = ({ 
  onPostJobClick, 
  onOpenInterviewRoom, 
  onExploreJobs,
  onSearch 
}) => {
  const { t, lang } = useLanguage();
  const isRtl = lang === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery, selectedDept);
    }
    onExploreJobs();
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28 bg-gradient-to-b from-slate-900 via-indigo-950/95 to-slate-900 text-white">
      {/* Dynamic Ambient Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none overflow-hidden opacity-40">
        <div className="absolute top-[-100px] left-1/4 w-[500px] h-[500px] bg-indigo-500 rounded-full blur-[140px] mix-blend-screen animate-pulse" />
        <div className="absolute top-[50px] right-1/4 w-[450px] h-[450px] bg-violet-600 rounded-full blur-[150px] mix-blend-screen" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/20 rounded-full blur-[160px]" />
      </div>

      {/* Grid Pattern Texture */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
          backgroundSize: '36px 36px'
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Hero Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Description & Search */}
          <div className="lg:col-span-7 text-center lg:text-start space-y-6">
            
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-indigo-500/10 border border-indigo-400/30 backdrop-blur-md shadow-lg shadow-indigo-500/10">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <Sparkles className="w-4 h-4 text-indigo-300" />
              <span className="text-xs sm:text-sm font-semibold text-indigo-200">
                {t.hero_badge}
              </span>
            </div>

            {/* Main Headline with Modern Gradient */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] sm:leading-[1.15]">
              <span className="block text-white">
                {t.hero_title_line1}
              </span>
              <span className="block mt-1 bg-gradient-to-r from-indigo-300 via-sky-300 to-emerald-300 bg-clip-text text-transparent">
                {t.hero_title_line2}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {t.hero_subtitle}
            </p>

            {/* Integrated Job Search Bar */}
            <div className="pt-2">
              <form 
                onSubmit={handleSearchSubmit} 
                className="bg-white/10 backdrop-blur-xl p-2 sm:p-2.5 rounded-2xl border border-white/20 shadow-2xl flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto lg:mx-0"
              >
                <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-slate-900/60 rounded-xl border border-white/10">
                  <Search className="w-5 h-5 text-indigo-400 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.hero_search_placeholder}
                    className="w-full bg-transparent text-white placeholder-slate-400 text-sm focus:outline-none"
                  />
                </div>

                <div className="hidden sm:flex items-center px-3 bg-slate-900/60 rounded-xl border border-white/10">
                  <select
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="bg-transparent text-slate-300 text-xs font-medium focus:outline-none cursor-pointer"
                  >
                    <option value="all" className="bg-slate-900 text-white">{t.hero_dept_all}</option>
                    <option value="engineering" className="bg-slate-900 text-white">{t.hero_dept_engineering}</option>
                    <option value="product" className="bg-slate-900 text-white">{t.hero_dept_product}</option>
                    <option value="business" className="bg-slate-900 text-white">{t.hero_dept_business}</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 shrink-0 active:scale-95"
                >
                  <span>{t.hero_search_btn}</span>
                  <ArrowIcon className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button 
                onClick={onPostJobClick} 
                className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-bold flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-500/25 transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                <Briefcase className="w-5 h-5" />
                <span>{t.hero_btn_post}</span>
              </button>
              
              <button 
                onClick={onOpenInterviewRoom} 
                className="w-full sm:w-auto px-7 py-3.5 bg-white/10 hover:bg-white/15 text-white border border-white/20 rounded-xl font-bold flex items-center justify-center gap-2.5 backdrop-blur-md transition-all hover:-translate-y-0.5 active:translate-y-0 group"
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-500/30 flex items-center justify-center group-hover:bg-indigo-500/50 transition-colors">
                  <Video className="w-4 h-4 text-indigo-300" />
                </div>
                <span>{t.hero_btn_try}</span>
              </button>

              <button 
                onClick={onExploreJobs} 
                className="text-xs sm:text-sm text-indigo-300 hover:text-white underline underline-offset-4 font-semibold transition-colors py-2"
              >
                {t.hero_btn_explore}
              </button>
            </div>

            {/* Social Proof Avatars */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 text-xs text-slate-400">
              <div className="flex -space-x-2 overflow-hidden">
                <img 
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 object-cover" 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" 
                  alt="Candidate" 
                />
                <img 
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 object-cover" 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80" 
                  alt="Candidate" 
                />
                <img 
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 object-cover" 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80" 
                  alt="Candidate" 
                />
                <img 
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 object-cover" 
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80" 
                  alt="Candidate" 
                />
              </div>
              <div className="flex items-center gap-1.5">
                <div className="flex text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                </div>
                <span className="font-semibold text-slate-200">4.9/5</span>
                <span>{t.hero_social_proof}</span>
              </div>
            </div>

          </div>

          {/* Right Column: Modern Live Video Interview & Candidate Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Glowing Aura Effect */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-tilt" />

              {/* Glassmorphic Mockup Container */}
              <div className="relative rounded-2xl bg-slate-900/90 border border-white/15 p-4 sm:p-5 shadow-2xl backdrop-blur-xl space-y-4">
                
                {/* Header of Interview Preview */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                    </span>
                    <span className="text-xs font-bold text-white tracking-wide uppercase">
                      {t.hero_live_interview}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{t.hero_secure_hd}</span>
                  </div>
                </div>

                {/* Candidate Video Stream Mockup */}
                <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-slate-950 border border-white/10 group cursor-pointer" onClick={onOpenInterviewRoom}>
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80" 
                    alt="Live Candidate Interview"
                    className="w-full h-full object-cover object-top filter brightness-95 group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  {/* Candidate Name & Info Badge */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold flex items-center gap-1.5">
                        <span>{t.hero_candidate_name}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 fill-sky-400/20" />
                      </h4>
                      <p className="text-[11px] text-slate-300">{t.hero_candidate_role}</p>
                    </div>

                    {/* AI Score Badge */}
                    <div className="bg-emerald-500 text-slate-950 px-2.5 py-1 rounded-lg font-black text-xs shadow-lg flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      <span>96%</span>
                    </div>
                  </div>

                  {/* Live Audio Visualizer Bars */}
                  <div className="absolute top-3 right-3 flex items-end gap-0.5 h-4 bg-slate-900/80 backdrop-blur-md px-2 py-1 rounded-md border border-white/10">
                    <span className="w-1 bg-emerald-400 rounded-full h-2 animate-bounce" />
                    <span className="w-1 bg-emerald-400 rounded-full h-3.5 animate-bounce [animation-delay:0.15s]" />
                    <span className="w-1 bg-emerald-400 rounded-full h-1.5 animate-bounce [animation-delay:0.3s]" />
                    <span className="w-1 bg-emerald-400 rounded-full h-3 animate-bounce [animation-delay:0.2s]" />
                  </div>
                </div>

                {/* AI Rubric Evaluation Real-time Cards */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <div className="flex items-center justify-between text-slate-400 text-[11px]">
                      <span>{t.hero_rubric_technical}</span>
                      <span className="text-indigo-300 font-bold">9.8/10</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-indigo-500 to-sky-400 h-1.5 rounded-full w-[98%]" />
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <div className="flex items-center justify-between text-slate-400 text-[11px]">
                      <span>{t.hero_rubric_communication}</span>
                      <span className="text-emerald-300 font-bold">9.5/10</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-1.5 rounded-full w-[95%]" />
                    </div>
                  </div>
                </div>

                {/* Micro Floating Badge: Fast Hiring */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-indigo-950/60 border border-indigo-500/30 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block font-bold text-white">{t.hero_fast_hiring_title}</span>
                      <span className="text-[10px] text-slate-400">{t.hero_fast_hiring_sub}</span>
                    </div>
                  </div>
                  <button 
                    onClick={onOpenInterviewRoom}
                    className="text-[11px] font-bold text-indigo-300 hover:text-white px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    {t.hero_try_room}
                  </button>
                </div>

              </div>

            </div>
          </div>

        </div>

        {/* Bottom Key Stats Bar */}
        <div className="mt-16 sm:mt-20 pt-10 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
          <div className="space-y-1">
            <div className="text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-200">
              +15,000
            </div>
            <div className="text-xs sm:text-sm text-slate-400 font-medium">
              {t.hero_stat_jobs}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">
              99.4%
            </div>
            <div className="text-xs sm:text-sm text-slate-400 font-medium">
              {t.hero_stat_accuracy}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300">
              {t.hero_stat_speed_value}
            </div>
            <div className="text-xs sm:text-sm text-slate-400 font-medium">
              {t.hero_stat_speed}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-indigo-300">
              {t.hero_stat_countries_value}
            </div>
            <div className="text-xs sm:text-sm text-slate-400 font-medium">
              {t.hero_stat_countries_label}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
