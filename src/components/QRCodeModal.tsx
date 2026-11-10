import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  QrCode as QrIcon,
  Smartphone,
  Sparkles,
  Maximize2
} from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  surveyUrl?: string;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose, surveyUrl: propUrl }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [isStageMode, setIsStageMode] = useState(false);

  // Compute default survey URL: fallback to current location
  const finalSurveyUrl = React.useMemo(() => {
    if (propUrl) return propUrl;
    if (typeof window !== 'undefined') {
      const base = window.location.origin;
      return `${base}/survey.html`;
    }
    return 'https://ais-dev-dobq7zlt2shmz65csmbj7i-272568006170.asia-east1.run.app/survey.html';
  }, [propUrl]);

  useEffect(() => {
    if ((isOpen || isStageMode) && canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        finalSurveyUrl,
        {
          width: isStageMode ? 320 : 260,
          margin: 2,
          color: {
            dark: '#0f172a',
            light: '#ffffff'
          }
        },
        (error) => {
          if (error) console.error('QR code generation error:', error);
        }
      );
    }
  }, [isOpen, isStageMode, finalSurveyUrl]);

  const handleCopy = () => {
    navigator.clipboard.writeText(finalSurveyUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownloadPNG = () => {
    if (!canvasRef.current) return;
    const pngUrl = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = pngUrl;
    a.download = 'training_survey_qr_code.png';
    a.click();
  };

  if (!isOpen && !isStageMode) return null;

  // Stage Mode (Fullscreen for Projector)
  if (isStageMode) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col justify-between p-8 sm:p-12 animate-fade-in">
        
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold">
              <QrIcon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">
                STAGE PRESENTATION MODE
              </span>
              <h2 className="text-xl sm:text-2xl font-black">
                แบบประเมินความพึงพอใจการอบรม
              </h2>
            </div>
          </div>
          <button
            onClick={() => setIsStageMode(false)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <X className="w-4 h-4" />
            <span>ปิดโหมดฉายจอ</span>
          </button>
        </div>

        {/* Center Content: Giant QR Code & Instructions */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 my-auto">
          
          {/* QR Code Container with nice glow */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition duration-1000"></div>
            <div className="relative bg-white p-6 sm:p-8 rounded-3xl shadow-2xl flex flex-col items-center">
              <canvas ref={canvasRef} className="rounded-xl" />
              <div className="mt-4 text-center">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  สแกนด้วยกล้องมือถือได้ทันที
                </span>
                <span className="text-[11px] text-slate-400">
                  ไม่ต้องโหลดแอป • ไม่ต้องล็อกอิน
                </span>
              </div>
            </div>
          </div>

          {/* Right Side Instructions */}
          <div className="max-w-md text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ใช้เวลาเพียง 1 นาที</span>
            </div>

            <h3 className="text-3xl sm:text-4xl font-extrabold leading-tight">
              ร่วมส่งความคิดเห็น เพื่อพัฒนาหลักสูตรถัดไป
            </h3>

            <div className="space-y-3 text-slate-300 text-sm">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                <span>เปิดกล้องโทรศัพท์มือถือ แล้วส่องที่ QR Code</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                <span>เลือกคะแนนความพึงพอใจ 5 ด้าน (1 - 5 ดาว)</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                <span>กดส่ง ผลคะแนนจะปรากฏบนจอนี้ทันทีแบบเรียลไทม์!</span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between gap-3">
              <div className="truncate text-xs font-mono text-blue-400">
                {finalSurveyUrl}
              </div>
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1 flex-shrink-0 transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="text-center text-xs text-slate-500">
          กดปุ่ม Esc หรือปุ่ม "ปิดโหมดฉายจอ" เพื่อกลับสู่หน้า Dashboard ปกติ
        </div>

      </div>
    );
  }

  // Regular Modal View
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative text-center animate-scale-in">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-3">
          <QrIcon className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          คิวอาร์โค้ด & ลิงก์สำหรับผู้เข้าอบรม
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-5">
          แชร์ลิงก์หรือฉายภาพ QR Code นี้ให้ผู้เข้าอบรมสแกนทำแบบสอบถามผ่านมือถือ
        </p>

        {/* QR Code Canvas */}
        <div className="bg-white p-4 rounded-2xl shadow-inner border border-slate-200 inline-block mx-auto mb-5">
          <canvas ref={canvasRef} className="mx-auto" />
        </div>

        {/* URL Display & Copy */}
        <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-2.5 flex items-center justify-between gap-2 text-xs mb-4">
          <span className="truncate text-slate-600 dark:text-slate-300 font-mono text-left pl-2">
            {finalSurveyUrl}
          </span>
          <button
            onClick={handleCopy}
            className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 flex-shrink-0 transition-all ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
          </button>
        </div>

        {/* Actions Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={handleDownloadPNG}
            className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>ดาวน์โหลด .PNG</span>
          </button>

          <button
            onClick={() => setIsStageMode(true)}
            className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 transition-all"
          >
            <Maximize2 className="w-4 h-4" />
            <span>ฉายเต็มจอโปรเจกเตอร์</span>
          </button>
        </div>

        {/* Direct Link button */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <a
            href={finalSurveyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline"
          >
            <span>เปิดหน้าแบบสอบถามในแท็บใหม่เพื่อทดสอบ</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

      </div>
    </div>
  );
};
