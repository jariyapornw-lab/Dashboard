import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Send, 
  Smartphone, 
  Sparkles, 
  Info, 
  AlertCircle,
  RotateCcw,
  Check,
  Star
} from 'lucide-react';
import { SURVEY_QUESTIONS, RATING_SCALE_INFO } from '../data/questions';
import { saveResponse, hasDeviceSubmitted, resetDeviceSubmissionFlag } from '../services/storageService';
import { SurveyRating } from '../types/survey';

interface SurveyViewProps {
  onSubmitted?: () => void;
}

export const SurveyView: React.FC<SurveyViewProps> = ({ onSubmitted }) => {
  const [ratings, setRatings] = useState<Partial<SurveyRating>>({});
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isDuplicateDevice, setIsDuplicateDevice] = useState(false);
  const [lastSubmittedData, setLastSubmittedData] = useState<{ ratings: SurveyRating; feedback: string } | null>(null);

  useEffect(() => {
    // Check if user already submitted on this device
    if (hasDeviceSubmitted()) {
      setIsDuplicateDevice(true);
    }
  }, []);

  const handleSelectScore = (questionId: keyof SurveyRating, score: number) => {
    setRatings(prev => ({
      ...prev,
      [questionId]: score
    }));
  };

  const answeredCount = Object.keys(ratings).length;
  const isAllAnswered = answeredCount === SURVEY_QUESTIONS.length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAllAnswered) {
      alert('กรุณาเลือกคะแนนให้ครบทั้ง 5 ข้อก่อนกดส่งครับ');
      return;
    }

    setIsSubmitting(true);

    const completedRatings = ratings as SurveyRating;

    setTimeout(() => {
      saveResponse(completedRatings, feedback);

      // Trigger Confetti effect
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }

      setLastSubmittedData({ ratings: completedRatings, feedback });
      setHasSubmitted(true);
      setIsSubmitting(false);
      setIsDuplicateDevice(true);

      if (onSubmitted) {
        onSubmitted();
      }
    }, 400);
  };

  const handleResetForTesting = () => {
    resetDeviceSubmissionFlag();
    setIsDuplicateDevice(false);
    setHasSubmitted(false);
    setRatings({});
    setFeedback('');
    setLastSubmittedData(null);
  };

  return (
    <div className="py-6 sm:py-10 px-4 max-w-2xl mx-auto">

      {/* Top Banner & Context */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-medium mb-3">
          <Smartphone className="w-3.5 h-3.5" />
          <span>หน้าแบบสอบถามสำหรับผู้เข้าร่วมอบรม (Mobile-First)</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          แบบประเมินความพึงพอใจการอบรม
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">
          โปรดให้คะแนนตามความเป็นจริงเพื่อเป็นข้อมูลในการพัฒนาหลักสูตร ระบบบันทึกแบบไม่ระบุตัวตน (Anonymous)
        </p>

        {/* Live Progress Bar */}
        {!hasSubmitted && !isDuplicateDevice && (
          <div className="mt-5 max-w-md mx-auto bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden p-0.5">
            <div 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${(answeredCount / 5) * 100}%` }}
            />
          </div>
        )}
        {!hasSubmitted && !isDuplicateDevice && (
          <p className="text-[11px] text-slate-500 mt-1">
            ตอบแล้ว {answeredCount} จาก 5 ข้อ {isAllAnswered ? '🎉 (ครบทุกข้อแล้ว)' : ''}
          </p>
        )}
      </div>

      {/* State 1: Already Submitted on this Device */}
      {isDuplicateDevice && !hasSubmitted && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800 text-center animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">เครื่องนี้ส่งแบบประเมินไปแล้ว</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-md mx-auto">
            ระบบป้องกันการตอบซ้ำ (Duplicate Prevention) ได้บันทึกว่าอุปกรณ์นี้ส่งข้อมูลเรียบร้อยแล้ว ขอบคุณสำหรับความร่วมมือครับ
          </p>
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleResetForTesting}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-2 transition-all"
            >
              <RotateCcw className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>รีเซ็ตสถานะเพื่อทดสอบตอบใหม่อีกครั้ง</span>
            </button>
          </div>
        </div>
      )}

      {/* State 2: Freshly Submitted Success Screen */}
      {hasSubmitted && lastSubmittedData && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-lg border border-slate-200 dark:border-slate-800 text-center animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-5 shadow-xl shadow-emerald-500/25">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">ส่งแบบประเมินสำเร็จ!</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-md mx-auto">
            ขอบพระคุณที่ร่วมแสดงความคิดเห็น ข้อมูลของคุณถูกส่งต่อไปยังหน้า Dashboard บนจอของวิทยากรทันทีแล้ว
          </p>

          <div className="mt-6 bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 text-left border border-slate-200/60 dark:border-slate-700/60">
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              สรุปคะแนนที่คุณให้:
            </div>
            <div className="grid grid-cols-5 gap-2 text-center">
              {SURVEY_QUESTIONS.map(q => {
                const score = lastSubmittedData.ratings[q.id];
                return (
                  <div key={q.id} className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block line-clamp-1">{q.shortLabel}</span>
                    <span className="text-base font-bold text-blue-600 dark:text-blue-400">{score}★</span>
                  </div>
                );
              })}
            </div>
            {lastSubmittedData.feedback && (
              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
                <span className="font-semibold text-slate-700 dark:text-slate-200">ข้อเสนอแนะ: </span>
                {lastSubmittedData.feedback}
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleResetForTesting}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-2 transition-all"
            >
              <RotateCcw className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>ทดสอบส่งใหม่อีกครั้ง</span>
            </button>
          </div>
        </div>
      )}

      {/* State 3: Normal Form View */}
      {!hasSubmitted && !isDuplicateDevice && (
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          
          {/* Instructions Box */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200 dark:border-blue-900/60 rounded-2xl p-4 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-3 shadow-xs">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">เกณฑ์คะแนน (1 - 5): </span>
              <div className="grid grid-cols-5 gap-1 mt-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                <span>1 = น้อยที่สุด</span>
                <span>2 = น้อย</span>
                <span>3 = ปานกลาง</span>
                <span>4 = มาก</span>
                <span>5 = มากที่สุด</span>
              </div>
            </div>
          </div>

          {/* 5 Questions */}
          {SURVEY_QUESTIONS.map((question) => {
            const currentScore = ratings[question.id];

            return (
              <div 
                key={question.id}
                className={`bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 shadow-xs border transition-all ${
                  currentScore 
                    ? 'border-blue-300 dark:border-blue-800/80 ring-2 ring-blue-500/10' 
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Question Header */}
                <div className="flex items-start gap-3 mb-4">
                  <span className={`w-7 h-7 rounded-xl font-bold text-xs flex items-center justify-center flex-shrink-0 transition-colors ${
                    currentScore 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}>
                    {currentScore ? <Check className="w-4 h-4" /> : question.index}
                  </span>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {question.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {question.description}
                    </p>
                  </div>
                </div>

                {/* Rating Scale Buttons (1-5) */}
                <div className="grid grid-cols-5 gap-2 sm:gap-3">
                  {RATING_SCALE_INFO.map((item) => {
                    const isSelected = currentScore === item.value;

                    return (
                      <button
                        type="button"
                        key={item.value}
                        onClick={() => handleSelectScore(question.id, item.value)}
                        className={`group relative p-2 sm:p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 active:scale-95 ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/25 ring-2 ring-blue-400/40 scale-102 font-bold'
                            : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span className={`text-xl sm:text-2xl transition-transform group-hover:scale-110 ${isSelected ? 'scale-110' : ''}`}>
                          {item.emoji}
                        </span>
                        <span className={`text-sm sm:text-base font-extrabold ${isSelected ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                          {item.value}
                        </span>
                        <span className={`text-[10px] leading-tight line-clamp-1 ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Optional Feedback Box */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 shadow-xs border border-slate-200 dark:border-slate-800">
            <label htmlFor="user-feedback" className="block text-sm font-bold text-slate-900 dark:text-white mb-1">
              ข้อเสนอแนะเพิ่มเติมเพื่อการปรับปรุงและพัฒนา <span className="text-xs font-normal text-slate-400 dark:text-slate-500">(ไม่บังคับ)</span>
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              สิ่งที่ท่านประทับใจ หรือสิ่งที่ต้องการให้เพิ่มเติมในกิจกรรมครั้งถัดไป
            </p>
            <textarea
              id="user-feedback"
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="พิมพ์ความคิดเห็น หรือข้อเสนอแนะของคุณที่นี่..."
              className="w-full text-sm p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2 sticky bottom-4 z-20">
            <button
              type="submit"
              disabled={!isAllAnswered || isSubmitting}
              className={`w-full py-4 px-6 rounded-2xl font-bold text-base shadow-xl flex items-center justify-center gap-2.5 transition-all ${
                isAllAnswered && !isSubmitting
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98]'
                  : 'bg-slate-300 dark:bg-slate-800 text-slate-500 dark:text-slate-500 cursor-not-allowed shadow-none'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Sparkles className="w-5 h-5 animate-spin" />
                  <span>กำลังบันทึกข้อมูล...</span>
                </>
              ) : (
                <>
                  <span>ส่งแบบประเมินความพึงพอใจ</span>
                  <Send className="w-5 h-5" />
                </>
              )}
            </button>
            {!isAllAnswered && (
              <p className="text-center text-[11px] text-amber-600 dark:text-amber-400 mt-2 font-medium">
                * โปรดให้คะแนนให้ครบทั้ง 5 ข้อก่อนกดส่ง (เหลืออีก {5 - answeredCount} ข้อ)
              </p>
            )}
          </div>

        </form>
      )}

    </div>
  );
};
