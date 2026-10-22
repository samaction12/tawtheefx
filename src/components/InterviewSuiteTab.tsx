import React, { useState } from 'react';
import {
  Video,
  Clock,
  Sparkles,
  Play,
  Calendar,
  CheckCircle2,
  FileCheck,
  Star,
  Users,
  ShieldCheck,
  ChevronLeft,
  ArrowRight,
  Bell,
  Mail,
  Smartphone
} from 'lucide-react';
import { Applicant } from '../types';
import { INTERVIEW_QUESTIONS } from '../data/mockData';
import { useLanguage } from '../contexts/LanguageContext';
import type { TranslationDict, TranslationKey } from '../locales/translations';

/** Question categories are stored in Arabic in the data layer; map them for display. */
const CATEGORY_LABEL_KEYS = new Map<string, TranslationKey>([
  ['تقني', 'its_cat_technical'],
  ['سلوكي', 'its_cat_behavioral'],
  ['قيادي', 'its_cat_leadership'],
  ['عام', 'its_cat_general'],
]);

const CATEGORY_FILTERS: { id: string; labelKey: TranslationKey }[] = [
  { id: 'all', labelKey: 'its_cat_all' },
  ...Array.from(CATEGORY_LABEL_KEYS.entries()).map(([id, labelKey]) => ({ id, labelKey })),
];

const translateCategory = (category: string, t: TranslationDict): string => {
  const labelKey = CATEGORY_LABEL_KEYS.get(category);
  return labelKey ? t[labelKey] : category;
};

/** Suggested durations arrive from the data layer as Arabic strings (e.g. "3 دقائق"). */
const translateDuration = (duration: string, t: TranslationDict): string => {
  const value = duration.match(/\d+/)?.[0];
  return value ? `${value} ${t.its_minutes}` : duration;
};

interface InterviewSuiteTabProps {
  onLaunchLiveRoom: (applicant?: Applicant) => void;
  applicants: Applicant[];
  onOpenReminder: (applicant?: Applicant) => void;
}

export const InterviewSuiteTab: React.FC<InterviewSuiteTabProps> = ({
  onLaunchLiveRoom,
  applicants,
  onOpenReminder,
}) => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [playingAsyncVideo, setPlayingAsyncVideo] = useState(false);

  const filteredQuestions = INTERVIEW_QUESTIONS.filter((q) => {
    if (selectedCategory === 'all') return true;
    return q.category === selectedCategory;
  });

  return (
    <section className="py-10 bg-slate-50 min-h-[600px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-indigo-700 font-semibold tracking-wide">
              <span>{t.its_badge}</span>
              <span>·</span>
              <span>{t.its_badge_sub}</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              {t.its_title}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.its_subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <button
              onClick={() => onOpenReminder()}
              className="px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
            >
              <Bell className="w-4 h-4 text-indigo-600" />
              <span>{t.its_btn_reminders}</span>
            </button>

            <button
              onClick={() => onLaunchLiveRoom()}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
            >
              <Video className="w-4 h-4" />
              <span>{t.its_btn_open_room}</span>
            </button>
          </div>
        </div>

        {/* Feature Hero Card: Live Interview Room Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 border border-slate-800 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>{t.its_hero_secure}</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
              {t.its_hero_title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {t.its_hero_desc}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onLaunchLiveRoom()}
                className="px-5 py-2.5 bg-white text-slate-950 hover:bg-slate-100 rounded-lg text-xs font-bold transition-colors flex items-center gap-2"
              >
                <Video className="w-4 h-4 text-indigo-600" />
                <span>{t.its_btn_live_room}</span>
              </button>
            </div>
          </div>

          {/* Right Preview Card */}
          <div className="lg:col-span-5 bg-slate-900/80 border border-slate-700/60 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
              <span className="text-slate-300 font-semibold">{t.its_live_now}</span>
              <span className="text-emerald-400 font-mono text-[11px]">{t.its_live_status}</span>
            </div>

            <div className="flex items-center gap-3">
              <img
                src="/src/assets/images/avatar_candidate_talent_1791989553197.jpg"
                alt={t.its_alt_candidate}
                className="w-12 h-12 rounded-full object-cover border border-indigo-500"
              />
              <div>
                <div className="text-xs font-bold text-white">{t.its_candidate_name}</div>
                <div className="text-[11px] text-slate-400">{t.its_candidate_role}</div>
                <div className="text-[11px] text-emerald-400 font-mono">{t.its_match_label} 94%</div>
              </div>
            </div>

            <div className="p-2.5 bg-slate-800/80 rounded-lg text-[11px] text-slate-300 flex items-center justify-between">
              <span>{t.its_score_label}</span>
              <span className="font-mono tabular-nums text-amber-400 font-bold">4.8 / 5.0</span>
            </div>
          </div>
        </div>

        {/* 2-Column Section: Scheduled Interviews & Question Bank */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Scheduled Interviews (6 cols) */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  {t.its_scheduled_title}
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono tabular-nums">
                {applicants.filter((a) => a.interviewScheduled)?.length} {t.its_count_interviews}
              </span>
            </div>

            <div className="space-y-3 divide-y divide-slate-100">
              {applicants.filter((a) => a.interviewScheduled)?.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500 bg-slate-50 rounded-xl p-4">
                  <Video className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="font-semibold text-slate-700">{t.its_empty_title}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {t.its_empty_desc}
                  </p>
                </div>
              ) : (
                applicants
                  .filter((a) => a.interviewScheduled)
                  .map((app) => (
                  <div key={app.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={app.avatar}
                        alt={app.name}
                        className="w-10 h-10 rounded-full object-cover border"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900">{app.name}</div>
                        <div className="text-[11px] text-slate-500">{app.role}</div>
                        <div className="text-[10px] text-indigo-600 font-mono">
                          {app.interviewScheduled?.date} ({app.interviewScheduled?.time})
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenReminder(app)}
                        className={`p-1.5 rounded-lg border text-xs transition-colors flex items-center gap-1 ${
                          app.interviewScheduled?.reminderSent
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            : 'bg-white border-slate-200 text-slate-600 hover:text-indigo-600'
                        }`}
                        title={
                          app.interviewScheduled?.reminderSent
                            ? t.its_tooltip_sent
                            : t.its_tooltip_send
                        }
                      >
                        <Bell className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline text-[11px]">
                          {app.interviewScheduled?.reminderSent ? t.its_reminder_sent : t.its_reminder_send}
                        </span>
                      </button>

                      <button
                        onClick={() => onLaunchLiveRoom(app)}
                        className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>{t.its_btn_join}</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>


          {/* Asynchronous Video Screening Feature Box (6 cols) */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Play className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  {t.its_video_title}
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">{t.its_video_badge}</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {t.its_video_desc}
            </p>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800">{t.its_video_sample_label}</span>
                <span className="text-slate-500 font-mono">{t.its_video_sample_duration}</span>
              </div>

              <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-900 flex items-center justify-center">
                <img
                  src="/src/assets/images/avatar_candidate_talent_1791989553197.jpg"
                  alt={t.its_alt_recording}
                  className="w-full h-full object-cover opacity-80"
                />
                <button
                  onClick={() => setPlayingAsyncVideo(!playingAsyncVideo)}
                  className="absolute p-3 rounded-full bg-indigo-600/90 text-white hover:bg-indigo-600 transition-transform hover:scale-110 shadow-lg"
                >
                  <Play className="w-5 h-5 fill-white ml-0.5" />
                </button>
              </div>

              {playingAsyncVideo && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center justify-between">
                  <span>{t.its_video_playing}</span>
                  <span className="font-mono tabular-nums text-[11px]">{t.its_video_match}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Question Bank for Recruiters */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {t.its_bank_title}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {t.its_bank_sub}
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              {CATEGORY_FILTERS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                    selectedCategory === c.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t[c.labelKey]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {filteredQuestions.map((q) => (
              <div
                key={q.id}
                className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1.5"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-semibold text-indigo-600">{translateCategory(q.category, t)}</span>
                  <span className="font-mono tabular-nums">{t.its_duration_label} {translateDuration(q.suggestedDuration, t)}</span>
                </div>
                <div className="text-xs font-medium text-slate-800 leading-relaxed">
                  {q.question}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
