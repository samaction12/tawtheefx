import React from 'react';
import { JobListing } from '../types';
import { Briefcase, MapPin, DollarSign, Video } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  jobs: JobListing[];
  onOpenInterviewRoomForJob: (job: JobListing) => void;
  onApplySuccess: (jobId: string, candidateData: any) => void;
  onPostJobClick: () => void;
}

export const JobListings: React.FC<Props> = ({ jobs, onOpenInterviewRoomForJob, onPostJobClick }) => {
  const { t } = useLanguage();

  return (
    <section id="job-listings" className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-10 text-center md:text-start">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">{t.jobs_title}</h2>
          <p className="text-slate-600">{t.jobs_subtitle}</p>
          <div className="mt-4 inline-flex items-center gap-2 bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-semibold">
            {t.jobs_count} {jobs?.length || 0}
          </div>
        </div>

        {!jobs || jobs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium mb-6">{t.jobs_empty}</p>
            <button onClick={onPostJobClick} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold">
              {t.nav_post_job}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{job.title}</h3>
                <p className="text-sm text-slate-500 mb-4">{job.company}</p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-slate-600"><MapPin className="w-4 h-4" /> {job.location}</div>
                  <div className="flex items-center gap-2 text-sm text-slate-600"><DollarSign className="w-4 h-4" /> {job.salary}</div>
                  <div className="flex items-center gap-2 text-sm text-slate-600"><Briefcase className="w-4 h-4" /> {job.type}</div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 bg-slate-900 text-white text-sm font-bold py-2 rounded-lg">Apply Now</button>
                  {job.requiresVideoInterview && (
                    <button onClick={() => onOpenInterviewRoomForJob(job)} className="px-3 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100" title="Digital Interview">
                      <Video className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
