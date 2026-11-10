import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Award, 
  TrendingUp, 
  MessageSquare, 
  Download, 
  Maximize2, 
  Volume2, 
  VolumeX, 
  QrCode, 
  Star,
  CheckCircle,
  HelpCircle,
  Search,
  Filter,
  Sparkles,
  BarChart2,
  PieChart
} from 'lucide-react';
import { SurveyResponse, QuestionDefinition } from '../types/survey';
import { SURVEY_QUESTIONS, getInterpretation, INTERPRETATION_LEVELS } from '../data/questions';
import { exportResponsesToCSV } from '../services/storageService';

interface DashboardViewProps {
  responses: SurveyResponse[];
  onOpenQR: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ responses, onOpenQR }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'with-feedback' | 'high' | 'low'>('all');
  const [activeQuestionTab, setActiveQuestionTab] = useState<string>('overview');
  const [chartView, setChartView] = useState<'circular' | 'bar'>('circular');

  // Calculate metrics
  const totalCount = responses.length;

  const calculations = useMemo(() => {
    if (totalCount === 0) {
      return {
        avgQ1: 0,
        avgQ2: 0,
        avgQ3: 0,
        avgQ4: 0,
        avgQ5: 0,
        grandAverage: 0,
        questionAverages: SURVEY_QUESTIONS.map(q => ({ ...q, average: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } })),
        topAspect: null,
        lowestAspect: null,
        satisfactionRate: 0,
        totalStarCounts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        totalVotes: 0
      };
    }

    const sums = { q1: 0, q2: 0, q3: 0, q4: 0, q5: 0 };
    const dist: Record<string, Record<number, number>> = {
      q1: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      q2: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      q3: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      q4: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      q5: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    };

    let satisfiedCount = 0; // rating 4 or 5 on overall Q5

    responses.forEach(r => {
      const q = r.ratings;
      sums.q1 += q.q1;
      sums.q2 += q.q2;
      sums.q3 += q.q3;
      sums.q4 += q.q4;
      sums.q5 += q.q5;

      dist.q1[q.q1] = (dist.q1[q.q1] || 0) + 1;
      dist.q2[q.q2] = (dist.q2[q.q2] || 0) + 1;
      dist.q3[q.q3] = (dist.q3[q.q3] || 0) + 1;
      dist.q4[q.q4] = (dist.q4[q.q4] || 0) + 1;
      dist.q5[q.q5] = (dist.q5[q.q5] || 0) + 1;

      if (q.q5 >= 4) {
        satisfiedCount++;
      }
    });

    const avgQ1 = sums.q1 / totalCount;
    const avgQ2 = sums.q2 / totalCount;
    const avgQ3 = sums.q3 / totalCount;
    const avgQ4 = sums.q4 / totalCount;
    const avgQ5 = sums.q5 / totalCount;
    const grandAverage = (avgQ1 + avgQ2 + avgQ3 + avgQ4 + avgQ5) / 5;

    const questionAverages = SURVEY_QUESTIONS.map(q => {
      const avg = sums[q.id] / totalCount;
      return {
        ...q,
        average: avg,
        distribution: dist[q.id]
      };
    });

    const sortedByAvg = [...questionAverages].sort((a, b) => b.average - a.average);
    const topAspect = sortedByAvg[0];
    const lowestAspect = sortedByAvg[sortedByAvg.length - 1];
    const satisfactionRate = (satisfiedCount / totalCount) * 100;

    const totalStarCounts = {
      5: dist.q1[5] + dist.q2[5] + dist.q3[5] + dist.q4[5] + dist.q5[5],
      4: dist.q1[4] + dist.q2[4] + dist.q3[4] + dist.q4[4] + dist.q5[4],
      3: dist.q1[3] + dist.q2[3] + dist.q3[3] + dist.q4[3] + dist.q5[3],
      2: dist.q1[2] + dist.q2[2] + dist.q3[2] + dist.q4[2] + dist.q5[2],
      1: dist.q1[1] + dist.q2[1] + dist.q3[1] + dist.q4[1] + dist.q5[1],
    };
    const totalVotes = totalCount * 5;

    return {
      avgQ1,
      avgQ2,
      avgQ3,
      avgQ4,
      avgQ5,
      grandAverage,
      questionAverages,
      topAspect,
      lowestAspect,
      satisfactionRate,
      totalStarCounts,
      totalVotes
    };
  }, [responses, totalCount]);

  const interpretation = getInterpretation(calculations.grandAverage);

  // Filter feedback
  const filteredResponses = useMemo(() => {
    return responses.filter(r => {
      const hasText = !searchTerm || (r.feedback && r.feedback.toLowerCase().includes(searchTerm.toLowerCase()));
      if (!hasText) return false;

      const avg = (r.ratings.q1 + r.ratings.q2 + r.ratings.q3 + r.ratings.q4 + r.ratings.q5) / 5;

      if (selectedFilter === 'with-feedback') return Boolean(r.feedback && r.feedback.trim());
      if (selectedFilter === 'high') return avg >= 4.5;
      if (selectedFilter === 'low') return avg < 3.5;
      return true;
    });
  }, [responses, searchTerm, selectedFilter]);

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.log(err));
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">

      {/* Dashboard Top Header & Presenter Controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              REALTIME LIVE DASHBOARD
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              อัปเดตอัตโนมัติทันทีที่มีคนส่งแบบสอบถาม
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1 tracking-tight">
            สรุปผลการประเมินความพึงพอใจการจัดอบรม
          </h2>
        </div>

        {/* Toolbar Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={onOpenQR}
            className="px-3.5 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-semibold border border-blue-200 dark:border-blue-800 transition-all flex items-center gap-2"
          >
            <QrCode className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>ฉาย QR Code</span>
          </button>

          <button
            onClick={() => exportResponsesToCSV(responses)}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>ดาวน์โหลด CSV</span>
          </button>

          <button
            onClick={handleFullscreen}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all"
            title="ขึ้นจอโปรเจกเตอร์แบบเต็มหน้าจอ"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border transition-all ${
              soundEnabled
                ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
            }`}
            title={soundEnabled ? 'เปิดเสียงแจ้งเตือนเมื่อมีคำตอบใหม่' : 'ปิดเสียงแจ้งเตือน'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* KPI 4 Cards Grid (Optimized for Large Display Readability) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Card 1: Total Respondents */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>ผู้ร่วมตอบแบบสอบถาม</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                {totalCount}
              </span>
              <span className="text-slate-500 text-sm font-semibold">คน</span>
            </div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>พร้อมสำหรับการสรุปผล</span>
            </p>
          </div>
        </div>

        {/* Card 2: Grand Average Score */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>คะแนนเฉลี่ยรวมทุกด้าน</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Star className="w-4 h-4 fill-amber-500" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black text-blue-600 dark:text-blue-400 tracking-tight">
                {calculations.grandAverage.toFixed(2)}
              </span>
              <span className="text-slate-400 text-sm font-bold">/ 5.00</span>
            </div>
            <div className="mt-2.5">
              <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold border ${interpretation.badgeClass}`}>
                {interpretation.label}
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Satisfaction Percentage */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>ความพึงพอใจระดับดีขึ้นไป (4-5★)</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                {calculations.satisfactionRate.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mt-3 overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, calculations.satisfactionRate)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 4: Top Aspect Highlight */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>จุดเด่นที่ได้คะแนนสูงสุด</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white line-clamp-1">
              {calculations.topAspect ? calculations.topAspect.shortLabel : '-'}
            </h4>
            <p className="text-xs text-blue-600 dark:text-blue-400 font-bold mt-1">
              เฉลี่ย {calculations.topAspect ? calculations.topAspect.average.toFixed(2) : '0.00'} / 5.00 คะแนน
            </p>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
              {calculations.topAspect ? calculations.topAspect.category : ''}
            </p>
          </div>
        </div>

      </div>

      {/* Main Analysis Section: Bar Chart & Feedback Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column (2 spans): Interactive Bar Chart of 5 Questions */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {chartView === 'circular' ? (
                  <PieChart className="w-5 h-5 text-blue-600" />
                ) : (
                  <BarChart2 className="w-5 h-5 text-blue-600" />
                )}
                <span>คะแนนเฉลี่ยรายข้อ (สเกล 1.00 - 5.00)</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {chartView === 'circular' 
                  ? 'แสดงผลด้วยกราฟวงกลม (Circular Gauges) พร้อมสัดส่วนคะแนน'
                  : 'ประเมินผลแยกตามแต่ละองค์ประกอบ พร้อมแถบเปรียบเทียบมาตรฐาน'}
              </p>
            </div>

            {/* Toggle between Circular Chart & Bar Chart */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setChartView('circular')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  chartView === 'circular'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <PieChart className="w-3.5 h-3.5" />
                <span>กราฟวงกลม</span>
              </button>
              <button
                type="button"
                onClick={() => setChartView('bar')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  chartView === 'bar'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span>กราฟแท่ง</span>
              </button>
            </div>
          </div>

          {/* CIRCULAR VIEW */}
          {chartView === 'circular' ? (
            <div className="space-y-4 flex-1">
              
              {/* Overall Ratings Donut Breakdown Banner */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200/80 dark:border-blue-900/60 rounded-3xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-5 shadow-xs">
                
                {/* Left: Overall SVG Donut Chart */}
                <div className="flex items-center gap-4">
                  <div className="relative w-28 h-28 flex-shrink-0 flex items-center justify-center">
                    <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 100 100">
                      {/* Base Track */}
                      <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-200 dark:text-slate-800" />
                      
                      {/* Slices calculation for 5, 4, 3, 2, 1 stars */}
                      {(() => {
                        const total = calculations.totalVotes || 1;
                        const c = 2 * Math.PI * 40; // ~251.327
                        const p5 = (calculations.totalStarCounts[5] / total) * c;
                        const p4 = (calculations.totalStarCounts[4] / total) * c;
                        const p3 = (calculations.totalStarCounts[3] / total) * c;
                        const p2 = (calculations.totalStarCounts[2] / total) * c;
                        const p1 = (calculations.totalStarCounts[1] / total) * c;

                        let offset = 0;
                        const slices = [
                          { len: p5, color: '#10b981', label: '5 ดาว' },
                          { len: p4, color: '#3b82f6', label: '4 ดาว' },
                          { len: p3, color: '#f59e0b', label: '3 ดาว' },
                          { len: p2, color: '#f97316', label: '2 ดาว' },
                          { len: p1, color: '#f43f5e', label: '1 ดาว' },
                        ];

                        return slices.map((s, idx) => {
                          const currentOffset = offset;
                          offset -= s.len;
                          if (s.len <= 0) return null;
                          return (
                            <circle
                              key={idx}
                              cx="50"
                              cy="50"
                              r="40"
                              stroke={s.color}
                              strokeWidth="12"
                              strokeDasharray={`${s.len} ${c - s.len}`}
                              strokeDashoffset={currentOffset}
                              fill="transparent"
                              className="transition-all duration-700"
                            />
                          );
                        });
                      })()}
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">เฉลี่ยรวม</span>
                      <span className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                        {calculations.grandAverage.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider block">
                      กราฟวงกลมสรุปสัดส่วนการให้คะแนน
                    </span>
                    <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                      สัดส่วนดาว 1-5 ทั้งหมด ({calculations.totalVotes} คะแนนที่ได้รับ)
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      รวมทุกข้อคำถามเพื่อดูภาพรวมระดับความพึงพอใจ
                    </p>
                  </div>
                </div>

                {/* Right: Legend with Pill counts */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 w-full md:w-auto text-center text-xs">
                  <div className="bg-white dark:bg-slate-900/80 px-2.5 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-900/60 shadow-xs">
                    <span className="text-emerald-600 dark:text-emerald-400 font-black block">5★ ({calculations.totalStarCounts[5]})</span>
                    <span className="text-[10px] text-slate-400">
                      {calculations.totalVotes ? ((calculations.totalStarCounts[5] / calculations.totalVotes) * 100).toFixed(0) : 0}%
                    </span>
                  </div>
                  <div className="bg-white dark:bg-slate-900/80 px-2.5 py-1.5 rounded-xl border border-blue-200 dark:border-blue-900/60 shadow-xs">
                    <span className="text-blue-600 dark:text-blue-400 font-black block">4★ ({calculations.totalStarCounts[4]})</span>
                    <span className="text-[10px] text-slate-400">
                      {calculations.totalVotes ? ((calculations.totalStarCounts[4] / calculations.totalVotes) * 100).toFixed(0) : 0}%
                    </span>
                  </div>
                  <div className="bg-white dark:bg-slate-900/80 px-2.5 py-1.5 rounded-xl border border-amber-200 dark:border-amber-900/60 shadow-xs">
                    <span className="text-amber-600 dark:text-amber-400 font-black block">3★ ({calculations.totalStarCounts[3]})</span>
                    <span className="text-[10px] text-slate-400">
                      {calculations.totalVotes ? ((calculations.totalStarCounts[3] / calculations.totalVotes) * 100).toFixed(0) : 0}%
                    </span>
                  </div>
                  <div className="bg-white dark:bg-slate-900/80 px-2.5 py-1.5 rounded-xl border border-orange-200 dark:border-orange-900/60 shadow-xs">
                    <span className="text-orange-600 dark:text-orange-400 font-black block">2★ ({calculations.totalStarCounts[2]})</span>
                    <span className="text-[10px] text-slate-400">
                      {calculations.totalVotes ? ((calculations.totalStarCounts[2] / calculations.totalVotes) * 100).toFixed(0) : 0}%
                    </span>
                  </div>
                  <div className="bg-white dark:bg-slate-900/80 px-2.5 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 shadow-xs">
                    <span className="text-rose-600 dark:text-rose-400 font-black block">1★ ({calculations.totalStarCounts[1]})</span>
                    <span className="text-[10px] text-slate-400">
                      {calculations.totalVotes ? ((calculations.totalStarCounts[1] / calculations.totalVotes) * 100).toFixed(0) : 0}%
                    </span>
                  </div>
                </div>

              </div>

              {/* 5 Questions Circular Gauge Cards */}
              <div className="space-y-3.5">
                {calculations.questionAverages.map((q) => {
                  const percentage = Math.min(100, Math.max(0, (q.average / 5) * 100));
                  const qInterpretation = getInterpretation(q.average);
                  
                  // Radial SVG circle calculations
                  const radius = 38;
                  const circumference = 2 * Math.PI * radius; // ~238.76
                  const strokeDashoffset = circumference - (percentage / 100) * circumference;

                  return (
                    <div 
                      key={q.id}
                      className="p-4 sm:p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 transition-all hover:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      {/* Left: Question Information */}
                      <div className="flex-1 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                            {q.index}
                          </span>
                          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            {q.category}
                          </span>
                          <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ml-auto sm:ml-0 ${qInterpretation.badgeClass}`}>
                            {qInterpretation.label.split(' ')[0]}
                          </span>
                        </div>

                        <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                          {q.title}
                        </h4>
                        
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {q.description}
                        </p>

                        {/* Star Distribution mini breakdown */}
                        <div className="flex items-center gap-2 sm:gap-3 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                          <span>การกระจาย:</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">5★ ({q.distribution[5] || 0})</span>
                          <span>•</span>
                          <span className="text-blue-600 dark:text-blue-400 font-semibold">4★ ({q.distribution[4] || 0})</span>
                          <span>•</span>
                          <span className="text-amber-600 dark:text-amber-400 font-semibold">3★ ({q.distribution[3] || 0})</span>
                          <span>•</span>
                          <span className="text-orange-600 dark:text-orange-400 font-semibold">2★ ({q.distribution[2] || 0})</span>
                          <span>•</span>
                          <span className="text-rose-600 dark:text-rose-400 font-semibold">1★ ({q.distribution[1] || 0})</span>
                        </div>
                      </div>

                      {/* Right: Circular Gauge */}
                      <div className="flex items-center justify-center sm:justify-end gap-3 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-slate-700">
                        <div className="relative w-24 h-24 flex items-center justify-center">
                          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                            {/* Background Track */}
                            <circle
                              cx="50"
                              cy="50"
                              r={radius}
                              stroke="currentColor"
                              strokeWidth="10"
                              className="text-slate-200 dark:text-slate-700"
                              fill="transparent"
                            />
                            {/* Animated Circular Progress */}
                            <circle
                              cx="50"
                              cy="50"
                              r={radius}
                              stroke={qInterpretation.colorHex}
                              strokeWidth="10"
                              strokeDasharray={circumference}
                              strokeDashoffset={strokeDashoffset}
                              strokeLinecap="round"
                              className="transition-all duration-1000 ease-out"
                              fill="transparent"
                            />
                          </svg>

                          {/* Center Score & Percentage */}
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                            <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white leading-none">
                              {q.average.toFixed(2)}
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold mt-0.5">
                              {percentage.toFixed(0)}%
                            </span>
                          </div>
                        </div>

                        <div className="text-left text-xs hidden sm:block">
                          <span className="text-slate-400 block text-[10px]">คะแนนเต็ม 5.00</span>
                          <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                            {q.average.toFixed(2)} / 5
                          </span>
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block mt-0.5 font-semibold">
                            {q.average >= 4.0 ? '✓ ผ่านเกณฑ์' : 'ต่ำกว่าเกณฑ์'}
                          </span>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          ) : (
            /* BAR CHART VIEW (FALLBACK/TOGGLE) */
            <div className="space-y-4 flex-1">
              {calculations.questionAverages.map((q) => {
                const percentage = (q.average / 5) * 100;
                const qInterpretation = getInterpretation(q.average);

                return (
                  <div key={q.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 transition-all hover:shadow-xs">
                    
                    {/* Question Title & Score */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                          {q.index}
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                          {q.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs pl-7 sm:pl-0">
                        <span className="font-extrabold text-blue-600 dark:text-blue-400 text-sm">
                          {q.average.toFixed(2)}
                        </span>
                        <span className="text-slate-400">/ 5.00</span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${qInterpretation.badgeClass}`}>
                          {qInterpretation.label.split(' ')[0]}
                        </span>
                      </div>
                    </div>

                    {/* Horizontal Bar */}
                    <div className="w-full bg-slate-200 dark:bg-slate-700/60 rounded-full h-3 overflow-hidden relative">
                      {/* Target line at 4.00 (80%) */}
                      <div 
                        className="absolute top-0 bottom-0 w-0.5 bg-slate-400 dark:bg-slate-400 z-10" 
                        style={{ left: '80%' }}
                        title="เป้าหมาย 4.00"
                      />
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-700"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    {/* Rating counts mini breakdown (1 to 5 stars) */}
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
                      <span>การกระจายคะแนน:</span>
                      <div className="flex items-center gap-2.5">
                        <span title="1 ดาว">😞 1★ ({q.distribution[1] || 0})</span>
                        <span title="2 ดาว">🙁 2★ ({q.distribution[2] || 0})</span>
                        <span title="3 ดาว">😐 3★ ({q.distribution[3] || 0})</span>
                        <span title="4 ดาว">🙂 4★ ({q.distribution[4] || 0})</span>
                        <span title="5 ดาว">🤩 5★ ({q.distribution[5] || 0})</span>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

          {/* 5-Level Reference Footer */}
          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              เกณฑ์การแปลความหมายคะแนนเฉลี่ย Likert 5 ระดับ:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-[11px]">
              {INTERPRETATION_LEVELS.map(lvl => (
                <div key={lvl.label} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80">
                  <span className="font-bold text-slate-900 dark:text-white block">
                    {lvl.min.toFixed(2)} - {lvl.max.toFixed(2)}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">{lvl.label.split(' ')[0]}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (1 span): Live Feedback Feed */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col h-[650px]">
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-600" />
                <span>ข้อเสนอแนะล่าสุด</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                  {filteredResponses.filter(r => r.feedback).length}
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                ความคิดเห็นสดจากผู้เข้าร่วมอบรม
              </p>
            </div>
          </div>

          {/* Filter and Search Bar */}
          <div className="space-y-2 mb-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="ค้นหาข้อเสนอแนะ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px]">
              <button
                onClick={() => setSelectedFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedFilter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                ทั้งหมด
              </button>
              <button
                onClick={() => setSelectedFilter('with-feedback')}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedFilter === 'with-feedback'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                มีข้อความ
              </button>
              <button
                onClick={() => setSelectedFilter('high')}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedFilter === 'high'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                คะแนนสูง (4.5+)
              </button>
            </div>
          </div>

          {/* Feed List Container */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {filteredResponses.length === 0 ? (
              <div className="text-center py-16 text-slate-400 text-xs">
                ยังไม่มีข้อมูลที่ตรงกับเงื่อนไข
              </div>
            ) : (
              filteredResponses.map((r, idx) => {
                const avg = ((r.ratings.q1 + r.ratings.q2 + r.ratings.q3 + r.ratings.q4 + r.ratings.q5) / 5).toFixed(1);
                const timeStr = new Date(r.createdAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });

                return (
                  <div 
                    key={r.id} 
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-xs transition-all hover:border-blue-400"
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1.5">
                      <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        ⭐ {avg} คะแนน
                      </span>
                      <span>{timeStr} น.</span>
                    </div>

                    {r.feedback ? (
                      <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
                        "{r.feedback}"
                      </p>
                    ) : (
                      <span className="text-slate-400 italic text-[11px]">
                        (ไม่ได้ระบุข้อเสนอแนะเพิ่มเติม)
                      </span>
                    )}

                    <div className="mt-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between text-[10px] text-slate-400">
                      <span>ข้อ 1: {r.ratings.q1}★ • ข้อ 2: {r.ratings.q2}★ • ข้อ 5: {r.ratings.q5}★</span>
                      <span className="uppercase">{r.deviceInfo || 'Mobile'}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
