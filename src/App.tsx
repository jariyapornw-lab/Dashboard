import React, { useState, useEffect } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { SurveyView } from './components/SurveyView';
import { DashboardView } from './components/DashboardView';
import { QRCodeModal } from './components/QRCodeModal';
import { ExportCodeGuide } from './components/ExportCodeGuide';
import { loadResponsesFromStorage, subscribeToResponses } from './services/storageService';
import { SurveyResponse } from './types/survey';
import { Smartphone, BarChart3, QrCode, FileCode, ExternalLink, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  useEffect(() => {
    // Initial load
    const initial = loadResponsesFromStorage();
    setResponses(initial);

    // Subscribe to cross-tab updates and events
    const unsubscribe = subscribeToResponses((updated) => {
      setResponses([...updated]);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col antialiased selection:bg-blue-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        responses={responses} 
      />

      {/* Main View Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'survey' && (
          <SurveyView 
            onSubmitted={() => {
              // Switch to dashboard view or keep on confirmation
            }} 
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardView 
            responses={responses} 
            onOpenQR={() => setIsQRModalOpen(true)} 
          />
        )}

        {activeTab === 'qrcode' && (
          <div className="py-10">
            <QRCodeModal 
              isOpen={true} 
              onClose={() => setActiveTab('dashboard')} 
            />
          </div>
        )}

        {activeTab === 'guide' && (
          <ExportCodeGuide />
        )}
      </main>

      {/* Pop-up QR Modal for quick presenter trigger */}
      <QRCodeModal 
        isOpen={isQRModalOpen} 
        onClose={() => setIsQRModalOpen(false)} 
      />

      {/* Bottom Footer with Standalone Direct Links */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md py-6 px-4 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <span>ระบบแบบประเมินความพึงพอใจการอบรม • Realtime Evaluation</span>
          </div>

          {/* Quick link to standalone public files */}
          <div className="flex items-center gap-4 text-xs">
            <a 
              href="/survey.html" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-blue-600 dark:hover:text-blue-400 inline-flex items-center gap-1"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>เปิดไฟล์ survey.html ตรง</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <a 
              href="/dashboard.html" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-blue-600 dark:hover:text-blue-400 inline-flex items-center gap-1"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>เปิดไฟล์ dashboard.html ตรง</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="text-[11px] text-slate-400">
            Likert Scale 5 ระดับ • ป้องกันการตอบซ้ำ • Export CSV (UTF-8 BOM)
          </div>
        </div>
      </footer>

    </div>
  );
}
