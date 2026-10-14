import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  PhoneOff,
  Clock,
  Star,
  CheckCircle2,
  FileText,
  User,
  Shield,
  MessageSquare,
  AlertCircle,
  Sparkles,
  Download
} from 'lucide-react';
import { Applicant } from '../types';

interface OnlineInterviewRoomProps {
  candidate?: Applicant;
  onClose: () => void;
  onSaveEvaluation?: (candidateId: string, scores: any) => void;
}

export const OnlineInterviewRoom: React.FC<OnlineInterviewRoomProps> = ({
  candidate,
  onClose,
  onSaveEvaluation,
}) => {
  // Candidate info fallback
  const activeCandidate = candidate || {
    id: 'app-sarah',
    name: 'سارة عبد الله الشمري',
    email: 'sarah.alshammari@example.com',
    role: 'مهندس أول حلول سحابية وبرمجيات',
    experienceYears: 6,
    currentCompany: 'التقنية الموحدة للاتصالات',
    avatar: '/src/assets/images/avatar_candidate_talent_1791989553197.jpg',
    matchScore: 94,
    appliedDate: '2026-10-12',
    status: 'مؤهل للمقابلة',
    phone: '+966 50 123 4567'
  };

  // Video and audio stream states
  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [streamStarted, setStreamStarted] = useState(false);

  // Timer state
  const [seconds, setSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Rubric Scores
  const [technicalScore, setTechnicalScore] = useState(4);
  const [communicationScore, setCommunicationScore] = useState(5);
  const [problemSolvingScore, setProblemSolvingScore] = useState(4);
  const [culturalFitScore, setCulturalFitScore] = useState(5);
  const [notes, setNotes] = useState('إجابات واضحة ومباشرة حول إدارة بيئات الـ Kubernetes والبنية ككود Terraform. تجربة ممتازة في التعامل مع الحوادث التقنية الطارئة.');

  // Questions answered
  const [checkedQuestions, setCheckedQuestions] = useState<Record<string, boolean>>({
    q1: true,
    q2: true,
    q3: false,
    q4: false
  });

  // Finish modal
  const [isCompleted, setIsCompleted] = useState(false);

  // Start real camera stream if accessible
  useEffect(() => {
    let localStream: MediaStream | null = null;
    async function startMedia() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
          });
          localStream = stream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
          setStreamStarted(true);
        }
      } catch (err: any) {
        // Fallback gracefully without breaking UI
        setStreamError('تم تفعيل وضع المحاكاة عالي الدقة لعدم توفر كاميرا مباشرة أو إذن وصول');
      }
    }
    startMedia();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Timer loop
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const calculateOverall = () => {
    const avg = (technicalScore + communicationScore + problemSolvingScore + culturalFitScore) / 4;
    return avg.toFixed(1);
  };

  const handleFinish = () => {
    setIsCompleted(true);
    if (onSaveEvaluation) {
      onSaveEvaluation(activeCandidate.id, {
        technical: technicalScore,
        communication: communicationScore,
        problemSolving: problemSolvingScore,
        culturalFit: culturalFitScore,
        notes,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col overflow-hidden">
      {/* Top Bar of Interview Room */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center font-bold text-sm">
            TX
          </div>
          <div>
            <h1 className="text-sm font-semibold text-white flex items-center gap-2">
              <span>غرفة المقابلة الإلكترونية المباشرة</span>
              <span className="text-xs font-mono text-emerald-400 font-normal">مشفرة بالكامل</span>
            </h1>
            <div className="text-xs text-slate-400">
              الوظيفة: {activeCandidate.role} · الرمز: TX-ROOM-8821
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Active Timer */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-800 border border-slate-700 text-xs font-mono tabular-nums text-slate-200">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>مدة الجلسة: {formatTimer(seconds)}</span>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            مغادرة الغرفة
          </button>
        </div>
      </header>

      {/* Main Workspace: 2-column layout (Video Streams Left, Candidate & Rubric Right) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Column: Video Feeds & Media Controls (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between p-4 sm:p-6 bg-slate-950 overflow-y-auto">
          {/* Main Candidate Video Feed */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 aspect-[16/9] shadow-xl flex items-center justify-center">
            {/* Candidate Stream Visual */}
            <img
              src={activeCandidate.avatar}
              alt={activeCandidate.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />

            {/* Candidate Overlay Info */}
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-slate-900/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="font-semibold text-white">{activeCandidate.name}</span>
              <span className="text-slate-400 font-mono tabular-nums text-[11px]">(مرشح)</span>
            </div>

            <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-slate-900/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs text-slate-300">
              <span className="font-mono tabular-nums">1080p HD · 60fps</span>
            </div>

            {/* Mini PiP Interviewer Local Video */}
            <div className="absolute bottom-4 left-4 w-40 sm:w-48 aspect-[16/9] rounded-xl overflow-hidden bg-slate-800 border-2 border-indigo-500/60 shadow-lg">
              {streamStarted && videoEnabled ? (
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform -scale-x-100"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-850 p-2 text-center">
                  <User className="w-6 h-6 text-indigo-400 mb-1" />
                  <span className="text-[11px] text-slate-300 font-medium">أنت (المُحاور)</span>
                </div>
              )}
              <div className="absolute bottom-1 right-1 bg-slate-950/80 px-1.5 py-0.5 rounded text-[10px] text-slate-300">
                أنت
              </div>
            </div>
          </div>

          {/* Fallback Notice if Camera hardware simulated */}
          {streamError && (
            <div className="mt-3 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>{streamError}</span>
              <span className="font-mono text-emerald-400 text-[10px]">جاهزية كاملة</span>
            </div>
          )}

          {/* Media Control Toolbar */}
          <div className="mt-4 p-3 bg-slate-900/90 border border-slate-800 rounded-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMicEnabled(!micEnabled)}
                className={`p-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  micEnabled
                    ? 'bg-slate-800 text-white hover:bg-slate-700'
                    : 'bg-rose-600/90 text-white hover:bg-rose-700'
                }`}
                title={micEnabled ? 'كتم الميكروفون' : 'تشغيل الميكروفون'}
              >
                {micEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                <span className="hidden sm:inline text-xs">{micEnabled ? 'ميكروفون نشط' : 'مكتوم'}</span>
              </button>

              <button
                onClick={() => setVideoEnabled(!videoEnabled)}
                className={`p-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  videoEnabled
                    ? 'bg-slate-800 text-white hover:bg-slate-700'
                    : 'bg-rose-600/90 text-white hover:bg-rose-700'
                }`}
                title={videoEnabled ? 'إيقاف الكاميرا' : 'تشغيل الكاميرا'}
              >
                {videoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                <span className="hidden sm:inline text-xs">{videoEnabled ? 'الكاميرا تعمل' : 'متوقفة'}</span>
              </button>

              <button
                onClick={() => setIsScreenSharing(!isScreenSharing)}
                className={`p-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  isScreenSharing
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-white hover:bg-slate-700'
                }`}
              >
                <Monitor className="w-4 h-4" />
                <span className="hidden sm:inline text-xs">
                  {isScreenSharing ? 'إيقاف المشاركة' : 'مشاركة الشاشة'}
                </span>
              </button>
            </div>

            <button
              onClick={handleFinish}
              className="px-4 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
            >
              <PhoneOff className="w-4 h-4" />
              <span>إنهاء المقابلة واعتماد التقييم</span>
            </button>
          </div>
        </div>

        {/* Right Column: Candidate Dossier & Live Rubric Evaluation (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border-r border-slate-800 flex flex-col h-full overflow-hidden">
          {/* Candidate Snapshot Bar */}
          <div className="p-4 border-b border-slate-800 bg-slate-900/50">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white">{activeCandidate.name}</h3>
                <div className="text-xs text-slate-400 mt-0.5">
                  {activeCandidate.experienceYears} سنوات خبرة · {activeCandidate.currentCompany}
                </div>
              </div>

              <div className="text-left">
                <div className="text-xs text-slate-400">تطابق المتطلبات</div>
                <div className="text-lg font-bold text-emerald-400 font-mono tabular-nums">
                  {activeCandidate.matchScore}%
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Evaluation Form Scrollable */}
          <div className="flex-1 p-5 overflow-y-auto space-y-6">
            {/* Live Scorecard Metrics */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  نموذج التقييم المعياري المباشر
                </h4>
                <div className="text-xs font-mono tabular-nums text-indigo-400 font-bold">
                  المعدل العام: {calculateOverall()} / 5.0
                </div>
              </div>

              {/* Technical Competency */}
              <div className="p-3 bg-slate-850 rounded-lg border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-200">الكفاءة والخبرة التقنية</span>
                  <span className="font-mono tabular-nums text-slate-400">{technicalScore} من 5</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setTechnicalScore(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= technicalScore
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Communication Skills */}
              <div className="p-3 bg-slate-850 rounded-lg border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-200">مهارات التواصل والوضوح</span>
                  <span className="font-mono tabular-nums text-slate-400">{communicationScore} من 5</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setCommunicationScore(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= communicationScore
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Problem Solving */}
              <div className="p-3 bg-slate-850 rounded-lg border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-200">حل المشكلات والتفكير المنطقي</span>
                  <span className="font-mono tabular-nums text-slate-400">{problemSolvingScore} من 5</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setProblemSolvingScore(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= problemSolvingScore
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Cultural Fit */}
              <div className="p-3 bg-slate-850 rounded-lg border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-200">التوافق مع ثقافة وقيم الفريق</span>
                  <span className="font-mono tabular-nums text-slate-400">{culturalFitScore} من 5</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setCulturalFitScore(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= culturalFitScore
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Checklist of Interview Questions */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                قائمة الأسئلة المقترحة
              </h4>
              <div className="space-y-2">
                {[
                  { id: 'q1', text: 'كيف تقود بنية سحابية تحت ضغط طلبات متزايدة؟' },
                  { id: 'q2', text: 'ما هو أصعب تحدٍ برمجي تجاوزته خلال العام الماضي؟' },
                  { id: 'q3', text: 'كيف تنظم خطط الاسترداد من الكوارث (Disaster Recovery)؟' },
                  { id: 'q4', text: 'ما هي رؤيتك للتعاون مع فرق المنتج والأمان السيبراني؟' }
                ].map((item) => (
                  <label
                    key={item.id}
                    className="flex items-start gap-2.5 p-2 rounded hover:bg-slate-800/60 cursor-pointer text-xs text-slate-300"
                  >
                    <input
                      type="checkbox"
                      checked={!!checkedQuestions[item.id]}
                      onChange={(e) =>
                        setCheckedQuestions({
                          ...checkedQuestions,
                          [item.id]: e.target.checked
                        })
                      }
                      className="mt-0.5 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-0"
                    />
                    <span>{item.text}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Notes Section */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                ملاحظات وتوصيات المُحاور
              </h4>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed"
                placeholder="دون ملاحظاتك حول إجابات المرشح والتوصية النهائية..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      {isCompleted && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-slate-900">
                اكتملت المقابلة وتم حفظ تقرير التقييم
              </h3>
              <p className="text-xs text-slate-500">
                تم اعتماد نتيجة مقابلة {activeCandidate.name} ومزامنتها مع ملف التوظيف للوظيفة.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">المعدل العام للتقييم:</span>
                <span className="font-bold text-indigo-600 font-mono tabular-nums">
                  {calculateOverall()} / 5.0
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">القرار الموصى به:</span>
                <span className="font-bold text-emerald-700">مؤهل للعرض الوظيفي المالي</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">مدة المقابلة:</span>
                <span className="font-mono tabular-nums text-slate-700">{formatTimer(seconds)}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors"
              >
                العودة إلى المنصة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
