import React, { useState } from 'react';
import { JobListing } from '../types';
import { INITIAL_JOBS } from '../data/mockData';
import { Briefcase, MapPin, DollarSign, Video, Sparkles, Building2, CheckCircle2, Clock, Filter, Search, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  jobs: JobListing[];
  onOpenInterviewRoomForJob: (job: JobListing) => void;
  onApplySuccess: (jobId: string, candidateData: any) => void;
  onPostJobClick: () => void;
}

/** Job type values are stored in Arabic in the data layer; map them for display. */
const translateJobType = (type: string, t: any): string => {
  switch (type) {
    case 'دوام كامل':
      return t.jobs_type_fulltime;
    case 'عن بُعد':
      return t.jobs_type_remote;
    case 'هجين':
      return t.jobs_type_hybrid;
    case 'عقد':
      return t.post_type_contract;
    default:
      return type;
  }
};

export const JobListings: React.FC<Props> = ({ 
  jobs = [], 
  onOpenInterviewRoomForJob, 
  onApplySuccess, 
  onPostJobClick 
}) => {
  const { t } = useLanguage();
  const [selectedType, setSelectedType] = useState<string>('all');
  const [keyword, setKeyword] = useState<string>('');
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);
  const [appliedSuccessId, setAppliedSuccessId] = useState<string | null>(null);

  // If passed jobs is empty, fallback to rich INITIAL_JOBS so site is vibrant
  const displayJobs = (jobs && jobs.length > 0) ? jobs : INITIAL_JOBS;

  const filteredJobs = displayJobs.filter((job) => {
    const matchesType = selectedType === 'all' || job.type === selectedType;
    const matchesKeyword = !keyword || 
      job.title.toLowerCase().includes(keyword.toLowerCase()) ||
      job.company.toLowerCase().includes(keyword.toLowerCase()) ||
      job.department.toLowerCase().includes(keyword.toLowerCase());
    return matchesType && matchesKeyword;
  });

  const handleApply = (job: JobListing) => {
    if (appliedJobIds.includes(job.id)) return;
    setAppliedJobIds((prev) => [...prev, job.id]);
    setAppliedSuccessId(job.id);
    onApplySuccess(job.id, { appliedAt: new Date().toISOString() });
    setTimeout(() => setAppliedSuccessId(null), 3000);
  };

  return (
    <section id="job-listings" className="py-20 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-3 border border-indigo-100">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.jobs_badge}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {t.jobs_title}
            </h2>
            <p className="text-slate-500 mt-2 text-sm sm:text-base max-w-xl">
              {t.jobs_subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs">
              {t.jobs_count} <strong className="text-indigo-600 font-bold">{filteredJobs.length}</strong>
            </span>
            <button 
              onClick={onPostJobClick}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs"
            >
              {t.nav_post_job}
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 left-3.5 rtl:right-3.5 rtl:left-auto" />
            <input 
              type="text" 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder={t.jobs_filter_placeholder}
              className="w-full bg-white border border-slate-200 rounded-xl px-10 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-xs"
            />
          </div>

          {/* Type Filter Pills */}
          <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-none">
            {[
              { id: 'all', label: t.jobs_type_all },
              { id: 'عن بُعد', label: t.jobs_type_remote },
              { id: 'دوام كامل', label: t.jobs_type_fulltime },
              { id: 'هجين', label: t.jobs_type_hybrid }
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`px-3.5 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                  selectedType === type.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Success Alert Banner if applied */}
        {appliedSuccessId && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{t.jobs_success}</span>
          </div>
        )}

        {/* Job Listings Grid */}
        {filteredJobs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Briefcase className="w-7 h-7" />
            </div>
            <p className="text-slate-600 font-semibold">{t.jobs_empty}</p>
            <button 
              onClick={onPostJobClick} 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-indigo-600/20"
            >
              {t.nav_post_job}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => {
              const isApplied = appliedJobIds.includes(job.id);
              return (
                <div 
                  key={job.id} 
                  className="bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-300 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between p-6 group hover:-translate-y-1 relative overflow-hidden"
                >
                  {job.featured && (
                    <div className="absolute top-0 right-0 bg-gradient-to-l from-indigo-600 to-violet-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-bl-xl shadow-xs">
                      {t.jobs_featured}
                    </div>
                  )}

                  <div className="space-y-4">
                    {/* Company Header */}
                    <div className="flex items-start gap-3">
                      {job.companyLogo ? (
                        <img 
                          src={job.companyLogo} 
                          alt={job.company} 
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0 shadow-xs" 
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-50 to-slate-100 border border-slate-200 flex items-center justify-center text-indigo-600 font-bold text-lg shrink-0">
                          {job.company.charAt(0)}
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <span className="text-[11px] font-semibold text-slate-400 block truncate">
                          {job.company}
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">
                          {job.title}
                        </h3>
                      </div>
                    </div>

                    {/* Metadata Pills */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{job.location}</span>
                      </span>

                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-semibold border border-emerald-100">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{job.salary}</span>
                      </span>

                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-medium">
                        <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{translateJobType(job.type, t)}</span>
                      </span>
                    </div>

                    {/* Description excerpt */}
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {job.description}
                    </p>

                    {/* Requirements Tags */}
                    {job.requirements && job.requirements.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {job.requirements.slice(0, 2).map((req, i) => (
                          <span key={i} className="text-[10px] bg-slate-50 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200">
                            {req}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-6 mt-4 border-t border-slate-100 flex items-center gap-2">
                    <button 
                      onClick={() => handleApply(job)}
                      disabled={isApplied}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                        isApplied 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-slate-900 hover:bg-indigo-600 text-white'
                      }`}
                    >
                      {isApplied ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{t.jobs_applied}</span>
                        </>
                      ) : (
                        <span>{t.jobs_apply}</span>
                      )}
                    </button>

                    {job.requiresVideoInterview && (
                      <button 
                        onClick={() => onOpenInterviewRoomForJob(job)} 
                        className="px-3.5 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl border border-indigo-200 transition-colors flex items-center gap-1 text-xs font-semibold"
                        title={t.jobs_ai_interview_title}
                      >
                        <Video className="w-4 h-4" />
                        <span className="hidden sm:inline">{t.jobs_ai_interview}</span>
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
