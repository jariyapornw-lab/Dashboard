import React from 'react';
import { 
  ClipboardList, 
  BarChart3, 
  QrCode, 
  FileCode, 
  Download, 
  PlusCircle, 
  RotateCcw,
  Sparkles,
  Radio
} from 'lucide-react';
import { exportResponsesToCSV, seedMockResponses, clearAllResponses, resetDeviceSubmissionFlag } from '../services/storageService';
import { SurveyResponse } from '../types/survey';

export type ActiveTab = 'survey' | 'dashboard' | 'qrcode' | 'guide';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  responses: SurveyResponse[];
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, responses }) => {
  const [showConfirmReset, setShowConfirmReset] = React.useState(false);

  const handleSeed = () => {
    seedMockResponses(5);
  };

  const handleReset = () => {
    clearAllResponses();
    resetDeviceSubmissionFlag();
    setShowConfirmReset(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-tight">
                  ระบบแบบประเมินความพึงพอใจการอบรม
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  <Radio className="w-3 h-3 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                  Realtime
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                เก็บข้อมูลผ่านมือถือ • แสดงผลสดบนจอโปรเจกเตอร์ • Firebase Realtime DB
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('survey')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'survey'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              <span className="hidden xs:inline">หน้าทำแบบประเมิน</span>
              <span className="xs:hidden">แบบประเมิน</span>
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'dashboard'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden xs:inline">หน้า Dashboard สด</span>
              <span className="xs:hidden">Dashboard</span>
              {responses.length > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeTab === 'dashboard' ? 'bg-white text-blue-700' : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                }`}>
                  {responses.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('qrcode')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'qrcode'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span className="hidden md:inline">คิวอาร์โค้ด & ลิงก์</span>
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'guide'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <FileCode className="w-4 h-4" />
              <span className="hidden md:inline">โค้ด 2 ไฟล์ & Firebase</span>
            </button>
          </nav>

          {/* Quick Actions */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => exportResponsesToCSV(responses)}
              title="ดาวน์โหลดผลประเมินเป็นไฟล์ CSV (เปิดใน Excel ได้ภาษาไทยไม่เพี้ยน)"
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium shadow-xs transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">ส่งออก CSV</span>
            </button>

            {/* Quick Demo seeder */}
            <button
              onClick={handleSeed}
              title="จำลองคนตอบเพิ่ม +5 คนทันที เพื่อทดสอบการขึ้นผลบนจอ"
              className="p-2 sm:px-2.5 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium transition-all flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span className="hidden xl:inline">+สุ่ม 5 คน</span>
            </button>

            {/* Reset */}
            <button
              onClick={() => setShowConfirmReset(true)}
              title="รีเซ็ตและล้างข้อมูลทั้งหมดเพื่อเริ่มการอบรมใหม่"
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">ต้องการล้างข้อมูลทั้งหมดหรือไม่?</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-5">
              ข้อมูลผลการตอบทั้งหมดจะถูกลบ และปลดล็อกให้เครื่องนี้สามารถตอบใหม่ได้
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-200"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-medium hover:bg-rose-700"
              >
                ยืนยันล้างข้อมูล
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
