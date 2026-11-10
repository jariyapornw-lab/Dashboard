import React, { useState } from 'react';
import { 
  FileCode, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  Terminal, 
  ShieldCheck, 
  Flame, 
  Globe, 
  Sparkles,
  BookOpen,
  HelpCircle,
  Smartphone,
  BarChart3
} from 'lucide-react';

export const ExportCodeGuide: React.FC = () => {
  const [activeCodeTab, setActiveCodeTab] = useState<'survey' | 'dashboard'>('survey');
  const [copiedSurvey, setCopiedSurvey] = useState(false);
  const [copiedDashboard, setCopiedDashboard] = useState(false);

  // Standalone survey.html source
  const surveyCode = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>แบบประเมินความพึงพอใจการอบรม</title>
  <!-- Google Font: Prompt -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Canvas Confetti CDN -->
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
  <!-- Firebase App & Realtime Database CDN (Compat v9) -->
  <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-database-compat.js"></script>
  <style>
    body { font-family: 'Prompt', sans-serif; -webkit-tap-highlight-color: transparent; }
    .score-btn.active {
      transform: scale(1.05);
      border-color: #2563eb;
      background-color: #eff6ff;
      color: #1d4ed8;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
    }
  </style>
</head>
<body class="bg-slate-50 text-slate-800 min-h-screen pb-12">

  <!-- Header Banner -->
  <header class="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-md">
    <div class="max-w-md mx-auto px-5 py-6 text-center">
      <div class="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-2xl mb-3 backdrop-blur-sm">
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      <h1 class="text-xl font-bold tracking-tight">แบบประเมินความพึงพอใจการอบรม</h1>
      <p class="text-blue-100 text-xs mt-1 font-light">ความคิดเห็นของท่านมีคุณค่าอย่างยิ่งในการพัฒนาหลักสูตร</p>
      <div class="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 rounded-full text-xs backdrop-blur-xs">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>ระบบบันทึกแบบไม่ระบุตัวตน (Anonymous)</span>
      </div>
    </div>
  </header>

  <!-- Main Container -->
  <main class="max-w-md mx-auto px-4 mt-4">

    <!-- Card: Already Submitted State -->
    <div id="already-submitted-card" class="hidden bg-white rounded-2xl p-6 shadow-sm border border-slate-200 text-center mt-4">
      <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">✓</div>
      <h2 class="text-lg font-bold text-slate-800">ท่านได้ส่งแบบประเมินแล้ว</h2>
      <p class="text-slate-600 text-sm mt-2">เครื่องของท่านได้ทำการบันทึกข้อมูลเรียบร้อยแล้ว ขอบพระคุณสำหรับข้อเสนอแนะอันมีค่า</p>
      <div class="mt-6 pt-5 border-t border-slate-100">
        <button id="btn-re-evaluate" class="text-xs text-blue-600 hover:text-blue-800 underline">
          กดที่นี่หากต้องการทดสอบทำแบบประเมินใหม่อีกครั้ง
        </button>
      </div>
    </div>

    <!-- Card: Success Thank You State -->
    <div id="success-card" class="hidden bg-white rounded-2xl p-8 shadow-sm border border-slate-200 text-center mt-4">
      <div class="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-5 text-4xl shadow-lg shadow-emerald-200">🎉</div>
      <h2 class="text-2xl font-bold text-slate-800">ส่งแบบประเมินสำเร็จ!</h2>
      <p class="text-slate-600 text-sm mt-2">ขอบพระคุณที่สละเวลาให้ความคิดเห็น ข้อมูลถูกส่งไปยังหน้าจอสรุปผลของวิทยากรทันทีแล้ว</p>
    </div>

    <!-- Survey Form -->
    <form id="survey-form" class="space-y-4">
      <div class="bg-blue-50 border border-blue-200 rounded-xl p-3.5 text-xs text-blue-800 flex items-start gap-2.5">
        <span class="text-base">💡</span>
        <div><span class="font-semibold">เกณฑ์คะแนน:</span> 1 = น้อยที่สุด, 2 = น้อย, 3 = ปานกลาง, 4 = มาก, 5 = มากที่สุด</div>
      </div>

      <!-- Q1 -->
      <div class="bg-white rounded-2xl p-4 shadow-xs border border-slate-200">
        <h3 class="text-sm font-semibold text-slate-800 mb-1">1. ความรู้ความเชี่ยวชาญ และการถ่ายทอดของวิทยากร</h3>
        <p class="text-xs text-slate-500 mb-3">การอธิบายชัดเจน เป็นกันเอง และตอบข้อซักถามได้ตรงประเด็น</p>
        <div class="grid grid-cols-5 gap-1.5" data-question="q1">
          <button type="button" class="score-btn p-2 rounded-xl border border-slate-200 bg-slate-50 text-center" data-val="1"><span class="text-lg block">😞</span><span class="text-xs font-semibold">1</span></button>
          <button type="button" class="score-btn p-2 rounded-xl border border-slate-200 bg-slate-50 text-center" data-val="2"><span class="text-lg block">🙁</span><span class="text-xs font-semibold">2</span></button>
          <button type="button" class="score-btn p-2 rounded-xl border border-slate-200 bg-slate-50 text-center" data-val="3"><span class="text-lg block">😐</span><span class="text-xs font-semibold">3</span></button>
          <button type="button" class="score-btn p-2 rounded-xl border border-slate-200 bg-slate-50 text-center" data-val="4"><span class="text-lg block">🙂</span><span class="text-xs font-semibold">4</span></button>
          <button type="button" class="score-btn p-2 rounded-xl border border-slate-200 bg-slate-50 text-center" data-val="5"><span class="text-lg block">🤩</span><span class="text-xs font-semibold">5</span></button>
        </div>
        <input type="hidden" name="q1" id="input-q1" required>
      </div>

      <!-- Q2 -->
      <div class="bg-white rounded-2xl p-4 shadow-xs border border-slate-200">
        <h3 class="text-sm font-semibold text-slate-800 mb-1">2. ความชัดเจน สมบูรณ์ และประโยชน์ของเนื้อหาหลักสูตร</h3>
        <p class="text-xs text-slate-500 mb-3">เนื้อหาทันสมัย เรียงลำดับเข้าใจง่าย และตรงตามความต้องการ</p>
        <div class="grid grid-cols-5 gap-1.5" data-question="q2">
          <button type="button" class="score-btn p-2 rounded-xl border border-slate-200 bg-slate-50 text-center" data-val="1"><span class="text-lg block">😞</span><span class="text-xs font-semibold">1</span></button>
          <button type="button" class="score-btn p-2 rounded-xl border border-slate-200 bg-slate-50 text-center" data-val="2"><span class="text-lg block">🙁</span><span class="text-xs font-semibold">2</span></button>
          <button type="button" class="score-btn p-2 rounded-xl border border-slate-200 bg-slate-50 text-center" data-val="3"><span class="text-lg block">😐</span><span class="text-xs font-semibold">3</span></button>
          <button type="button" class="score-btn p-2 rounded-xl border border-slate-200 bg-slate-50 text-center" data-val="4"><span class="text-lg block">🙂</span><span class="text-xs font-semibold">4</span></button>
          <button type="button" class="score-btn p-2 rounded-xl border border-slate-200 bg-slate-50 text-center" data-val="5"><span class="text-lg block">🤩</span><span class="text-xs font-semibold">5</span></button>
        </div>
        <input type="hidden" name="q2" id="input-q2" required>
      </div>

      <!-- Q3 -->
      <div class="bg-white rounded-2xl p-4 shadow-xs border border-slate-200">
        <h3 class="text-sm font-semibold text-slate-800 mb-1">3. ความเหมาะสมของระยะเวลา ขั้นตอน และรูปแบบกิจกรรม</h3>
        <p class="text-xs text-slate-500 mb-3">เวลาที่ใช้เหมาะสม มีกิจกรรมฝึกปฏิบัติหรือมีส่วนร่วมอย่างพอดี</p>
        <div class="grid grid-cols-5 gap-1.5" data-question="q3">
          <button type="button" class="score-btn p-2 rounded-xl border border-slate-200 bg-slate-50 text-center" data-val="1"><span class="text-lg block">😞</span><span class="text-xs font-semibold">1</span></button>
          <button type="button" class="score-btn p-2 rounded-xl border border-slate-200 bg-slate-50 text-center" data-val="2"><span class="text-lg block">🙁</span><span class="text-xs font-semibold">2</span></button>
          <button type="button" class="score-btn p-2 rounded-xl border border-slate-200 bg-slate-50 text-center" data-val="3"><span class="text-lg block">😐</span><span class="text-xs font-semibold">3</span></button>
          <button type="button" class="score-btn p-2 rounded-xl border border-slate-200 bg-slate-50 text-center" data-val="4"><span class="text-lg block">🙂</span><span class="text-xs font-semibold">4</span></button>
          <button type="button" class="score-btn p-2 rounded-xl border border-slate-200 bg-slate-50 text-center" data-val="5"><span class="text-lg block">🤩</span><span class="text-xs font-semibold">5</span></button>
        </div>
        <input type="hidden" name="q3" id="input-q3" required>
      </div>

      <!-- Q4 -->
      <div class="bg-white rounded-2xl p-4 shadow-xs border border-slate-200">
        <h3 class="text-sm font-semibold text-slate-800 mb-1">4. การอำนวยความสะดวก สถานที่/ระบบ และการประสานงาน</h3>
        <p class="text-xs text-slate-500 mb-3">ระบบเชื่อมต่อ อุปกรณ์ สัญญาณ และการดูแลของทีมงาน</p>
        <div class="grid grid-cols-5 gap-1.5" data-question="q4">
          <button type="button" class="score-btn p-2 rounded-xl border border-slate-200 bg-slate-50 text-center" data-val="1"><span class="text-lg block">😞</span><span class="text-xs font-semibold">1</span></button>
          <button type="button" class="score-btn p-2 rounded-xl border border-slate-200 bg-slate-50 text-center" data-val="2"><span class="text-lg block">🙁</span><span class="text-xs font-semibold">2</span></button>
          <button type="button" class="score-btn p-2 rounded-xl border border-slate-200 bg-slate-50 text-center" data-val="3"><span class="text-lg block">😐</span><span class="text-xs font-semibold">3</span></button>
          <button type="button" class="score-btn p-2 rounded-xl border border-slate-200 bg-slate-50 text-center" data-val="4"><span class="text-lg block">🙂</span><span class="text-xs font-semibold">4</span></button>
          <button type="button" class="score-btn p-2 rounded-xl border border-slate-200 bg-slate-50 text-center" data-val="5"><span class="text-lg block">🤩</span><span class="text-xs font-semibold">5</span></button>
        </div>
        <input type="hidden" name="q4" id="input-q4" required>
      </div>

      <!-- Q5 -->
      <div class="bg-white rounded-2xl p-4 shadow-xs border border-slate-200">
        <h3 class="text-sm font-semibold text-slate-800 mb-1">5. ภาพรวมความพึงพอใจ และการนำความรู้ไปประยุกต์ใช้ได้จริง</h3>
        <p class="text-xs text-slate-500 mb-3">คุ้มค่าต่อเวลา สามารถนำความรู้และเทคนิคไปใช้งานได้จริง</p>
        <div class="grid grid-cols-5 gap-1.5" data-question="q5">
          <button type="button" class="score-btn p-2 rounded-xl border border-slate-200 bg-slate-50 text-center" data-val="1"><span class="text-lg block">😞</span><span class="text-xs font-semibold">1</span></button>
          <button type="button" class="score-btn p-2 rounded-xl border border-slate-200 bg-slate-50 text-center" data-val="2"><span class="text-lg block">🙁</span><span class="text-xs font-semibold">2</span></button>
          <button type="button" class="score-btn p-2 rounded-xl border border-slate-200 bg-slate-50 text-center" data-val="3"><span class="text-lg block">😐</span><span class="text-xs font-semibold">3</span></button>
          <button type="button" class="score-btn p-2 rounded-xl border border-slate-200 bg-slate-50 text-center" data-val="4"><span class="text-lg block">🙂</span><span class="text-xs font-semibold">4</span></button>
          <button type="button" class="score-btn p-2 rounded-xl border border-slate-200 bg-slate-50 text-center" data-val="5"><span class="text-lg block">🤩</span><span class="text-xs font-semibold">5</span></button>
        </div>
        <input type="hidden" name="q5" id="input-q5" required>
      </div>

      <!-- Feedback -->
      <div class="bg-white rounded-2xl p-4 shadow-xs border border-slate-200">
        <label for="feedback" class="block text-sm font-semibold text-slate-800 mb-1">ข้อเสนอแนะเพิ่มเติมเพื่อการปรับปรุงและพัฒนา (ไม่บังคับ)</label>
        <textarea id="feedback" rows="3" placeholder="สิ่งที่ประทับใจ หรือข้อเสนอแนะเพิ่มเติม..." class="w-full text-sm p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"></textarea>
      </div>

      <!-- Submit Button -->
      <button type="submit" id="submit-btn" class="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base shadow-lg transition-all">
        ส่งแบบประเมินความพึงพอใจ
      </button>
    </form>
  </main>

  <!-- Script: Firebase Realtime Database & Logic -->
  <script>
    // 1. ใส่ค่า Firebase Config ของคุณตรงนี้
    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
      databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_PROJECT_ID.appspot.com",
      messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
      appId: "YOUR_APP_ID"
    };

    let db = null;
    try {
      if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
        firebase.initializeApp(firebaseConfig);
        db = firebase.database();
      }
    } catch(e) {
      console.warn("Firebase fallback:", e);
    }

    const SUBMIT_FLAG_KEY = "training_survey_submitted_flag";
    const form = document.getElementById("survey-form");
    const successCard = document.getElementById("success-card");
    const alreadySubmittedCard = document.getElementById("already-submitted-card");

    if (localStorage.getItem(SUBMIT_FLAG_KEY) === "true") {
      form.classList.add("hidden");
      alreadySubmittedCard.classList.remove("hidden");
    }

    document.getElementById("btn-re-evaluate")?.addEventListener("click", () => {
      localStorage.removeItem(SUBMIT_FLAG_KEY);
      alreadySubmittedCard.classList.add("hidden");
      form.classList.remove("hidden");
    });

    document.querySelectorAll("[data-question]").forEach(container => {
      const qId = container.getAttribute("data-question");
      const hiddenInput = document.getElementById("input-" + qId);
      const buttons = container.querySelectorAll(".score-btn");
      buttons.forEach(btn => {
        btn.addEventListener("click", () => {
          buttons.forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          hiddenInput.value = btn.getAttribute("data-val");
        });
      });
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const q1 = parseInt(document.getElementById("input-q1").value);
      const q2 = parseInt(document.getElementById("input-q2").value);
      const q3 = parseInt(document.getElementById("input-q3").value);
      const q4 = parseInt(document.getElementById("input-q4").value);
      const q5 = parseInt(document.getElementById("input-q5").value);
      const feedback = document.getElementById("feedback").value.trim();

      if (!q1 || !q2 || !q3 || !q4 || !q5) {
        alert("กรุณาเลือกคะแนนให้ครบทั้ง 5 ข้อครับ");
        return;
      }

      const newResponse = {
        ratings: { q1, q2, q3, q4, q5 },
        feedback: feedback,
        createdAt: new Date().toISOString(),
        timestamp: Date.now(),
        deviceInfo: navigator.userAgent.includes("Mobile") ? "Mobile" : "Desktop"
      };

      try {
        if (db) {
          await db.ref("responses").push().set(newResponse);
        } else {
          const list = JSON.parse(localStorage.getItem("training_survey_responses_v1") || "[]");
          list.unshift({ id: "resp-" + Date.now(), ...newResponse });
          localStorage.setItem("training_survey_responses_v1", JSON.stringify(list));
        }

        localStorage.setItem(SUBMIT_FLAG_KEY, "true");
        if (window.confetti) confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        form.classList.add("hidden");
        successCard.classList.remove("hidden");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err) {
        alert("เกิดข้อผิดพลาด: " + err.message);
      }
    });
  </script>
</body>
</html>`;

  // Standalone dashboard.html source
  const dashboardCode = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Realtime Dashboard - ผลการประเมินความพึงพอใจการอบรม</title>
  <!-- Google Font: Prompt -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Chart.js CDN -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <!-- QRCode.js CDN -->
  <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js"></script>
  <!-- Firebase App & Realtime Database CDN (Compat v9) -->
  <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-database-compat.js"></script>
  <style>body { font-family: 'Prompt', sans-serif; }</style>
</head>
<body class="bg-slate-900 text-slate-100 min-h-screen flex flex-col">

  <!-- Header -->
  <header class="border-b border-slate-800 bg-slate-950/80 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">📊</div>
      <div>
        <h1 class="text-xl font-bold text-white flex items-center gap-2">
          <span>ผลการประเมินความพึงพอใจการอบรม</span>
          <span class="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">LIVE</span>
        </h1>
        <p class="text-xs text-slate-400">อัปเดตสดทันทีที่มีผู้ส่งแบบสอบถามผ่านมือถือ</p>
      </div>
    </div>
    <div class="flex items-center gap-2">
      <button id="btn-export-csv" class="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium">ดาวน์โหลด CSV</button>
      <button id="btn-fullscreen" class="p-2 rounded-xl bg-slate-800 text-slate-300">เต็มจอโปรเจกเตอร์</button>
    </div>
  </header>

  <!-- Main KPI & Content -->
  <main class="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-slate-800/80 border border-slate-700 rounded-2xl p-5">
        <span class="text-xs text-slate-400">จำนวนผู้ตอบ</span>
        <div class="text-4xl font-extrabold text-white mt-2"><span id="stat-total-count">0</span> คน</div>
      </div>
      <div class="bg-slate-800/80 border border-slate-700 rounded-2xl p-5">
        <span class="text-xs text-slate-400">คะแนนเฉลี่ยรวม (เต็ม 5.00)</span>
        <div class="text-4xl font-extrabold text-blue-400 mt-2"><span id="stat-grand-average">0.00</span> / 5</div>
        <div id="stat-interpretation-badge" class="mt-2 text-xs font-bold text-emerald-400">-</div>
      </div>
      <div class="bg-slate-800/80 border border-slate-700 rounded-2xl p-5">
        <span class="text-xs text-slate-400">จุดเด่นสูงสุด</span>
        <div id="stat-top-aspect" class="text-base font-bold text-emerald-400 mt-2">-</div>
      </div>
      <div class="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 flex items-center gap-3">
        <canvas id="mini-qrcode-canvas" class="w-16 h-16 bg-white p-1 rounded-lg"></canvas>
        <div class="text-xs">
          <span class="font-bold text-blue-400 block">สแกนทำแบบสอบถาม</span>
          <span class="text-slate-400 text-[11px]">ผลจะขึ้นบนจอนี้ทันที</span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 bg-slate-800/80 border border-slate-700 rounded-2xl p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-base font-bold text-white">คะแนนเฉลี่ยรายข้อ (กราฟวงกลม)</h3>
          <span class="text-xs text-blue-400 font-semibold">Doughnut Chart</span>
        </div>
        <div class="h-[320px] flex items-center justify-center"><canvas id="chart-questions"></canvas></div>
      </div>
      <div class="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 flex flex-col h-[420px]">
        <h3 class="text-base font-bold text-white mb-3">ข้อเสนอแนะล่าสุด</h3>
        <div id="feedback-list" class="flex-1 overflow-y-auto space-y-2.5 text-xs text-slate-300">
          <div class="text-center py-10 text-slate-500">รอข้อเสนอแนะ...</div>
        </div>
      </div>
    </div>
  </main>

  <script>
    // 1. ใส่ค่า Firebase Config ของคุณตรงนี้
    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
      databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_PROJECT_ID.appspot.com",
      messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
      appId: "YOUR_APP_ID"
    };

    let allResponses = [];
    let chart = null;

    function initChart() {
      const ctx = document.getElementById("chart-questions").getContext("2d");
      chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ["1. วิทยากร", "2. เนื้อหา", "3. เวลา/รูปแบบ", "4. สถานที่/ระบบ", "5. ภาพรวม"],
          datasets: [{
            label: 'คะแนนเฉลี่ย',
            data: [0,0,0,0,0],
            backgroundColor: ['#3b82f6', '#6366f1', '#a855f7', '#0ea5e9', '#10b981'],
            borderColor: '#1e293b',
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '60%',
          plugins: {
            legend: { position: 'bottom', labels: { color: '#cbd5e1', font: { family: 'Prompt', size: 12 } } },
            tooltip: {
              callbacks: {
                label: function(ctx) { return ' ' + ctx.label + ': ' + ctx.parsed.toFixed(2) + ' / 5.00 คะแนน'; }
              }
            }
          }
        }
      });
    }

    function updateDashboard(list) {
      allResponses = list;
      document.getElementById("stat-total-count").textContent = list.length;
      if (list.length === 0) return;

      let s1=0, s2=0, s3=0, s4=0, s5=0;
      list.forEach(r => {
        s1 += Number(r.ratings.q1);
        s2 += Number(r.ratings.q2);
        s3 += Number(r.ratings.q3);
        s4 += Number(r.ratings.q4);
        s5 += Number(r.ratings.q5);
      });
      const c = list.length;
      const a1 = s1/c, a2 = s2/c, a3 = s3/c, a4 = s4/c, a5 = s5/c;
      const grand = (a1+a2+a3+a4+a5)/5;

      document.getElementById("stat-grand-average").textContent = grand.toFixed(2);
      document.getElementById("stat-interpretation-badge").textContent = grand >= 4.51 ? "มากที่สุด (Excellent)" : (grand >= 3.51 ? "มาก (Good)" : "ปานกลาง");

      if (chart) {
        chart.data.datasets[0].data = [a1.toFixed(2), a2.toFixed(2), a3.toFixed(2), a4.toFixed(2), a5.toFixed(2)];
        chart.update();
      }

      const fb = list.filter(r => r.feedback && r.feedback.trim());
      document.getElementById("feedback-list").innerHTML = fb.map(r => \`
        <div class="p-2.5 rounded-lg bg-slate-900 border border-slate-700">
          <div class="text-[10px] text-amber-400 font-bold mb-1">⭐ \${((r.ratings.q1+r.ratings.q2+r.ratings.q3+r.ratings.q4+r.ratings.q5)/5).toFixed(1)} คะแนน</div>
          <p class="text-slate-200">\${r.feedback}</p>
        </div>
      \`).join("");
    }

    // ดาวน์โหลด CSV
    document.getElementById("btn-export-csv").addEventListener("click", () => {
      if (allResponses.length === 0) return alert("ยังไม่มีข้อมูล");
      const headers = ["ลำดับ", "วันเวลา", "ข้อ1", "ข้อ2", "ข้อ3", "ข้อ4", "ข้อ5", "เฉลี่ย", "ข้อเสนอแนะ"];
      const rows = allResponses.map((r, i) => [
        i+1, \`"\${r.createdAt}"\`, r.ratings.q1, r.ratings.q2, r.ratings.q3, r.ratings.q4, r.ratings.q5,
        ((r.ratings.q1+r.ratings.q2+r.ratings.q3+r.ratings.q4+r.ratings.q5)/5).toFixed(2),
        \`"\${(r.feedback||'').replace(/"/g, '""')}"\`
      ].join(","));
      const csv = "\\uFEFF" + [headers.join(","), ...rows].join("\\r\\n");
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
      a.download = "survey_results.csv";
      a.click();
    });

    // Firebase Listener
    let db = null;
    try {
      if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
        firebase.initializeApp(firebaseConfig);
        db = firebase.database();
        db.ref("responses").on("value", snap => {
          const v = snap.val();
          const arr = v ? Object.keys(v).map(k => v[k]).reverse() : [];
          updateDashboard(arr);
        });
      }
    } catch(e) { console.warn(e); }

    window.addEventListener("DOMContentLoaded", () => {
      initChart();
      const surveyUrl = window.location.href.replace(/dashboard\.html.*$/, 'survey.html');
      QRCode.toCanvas(document.getElementById("mini-qrcode-canvas"), surveyUrl, { width: 64, margin: 1 });
    });
  </script>
</body>
</html>`;

  const handleCopyCode = (type: 'survey' | 'dashboard') => {
    const text = type === 'survey' ? surveyCode : dashboardCode;
    navigator.clipboard.writeText(text).then(() => {
      if (type === 'survey') {
        setCopiedSurvey(true);
        setTimeout(() => setCopiedSurvey(false), 2000);
      } else {
        setCopiedDashboard(true);
        setTimeout(() => setCopiedDashboard(false), 2000);
      }
    });
  };

  const handleDownloadFile = (type: 'survey' | 'dashboard') => {
    const text = type === 'survey' ? surveyCode : dashboardCode;
    const filename = type === 'survey' ? 'survey.html' : 'dashboard.html';
    const blob = new Blob([text], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-3">
          <FileCode className="w-4 h-4" />
          <span>โค้ดแยก 2 ไฟล์พร้อมใช้งาน (HTML + JS + Firebase RTDB)</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          ไฟล์โค้ดสำหรับนำไปใช้ & วิธีตั้งค่า Firebase
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          สามารถคัดลอกโค้ดไปวางหรือดาวน์โหลดเป็นไฟล์ .html นำไปเปิดใช้งานหรือโฮสต์ได้ทันที ไม่ต้องมี Node.js หรือเซิร์ฟเวอร์
        </p>
      </div>

      {/* Code Viewer Box */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
        
        {/* Code Tabs Header */}
        <div className="bg-slate-950/90 px-6 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveCodeTab('survey')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                activeCodeTab === 'survey'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>ไฟล์ที่ 1: survey.html (หน้าตอบแบบสอบถาม)</span>
            </button>

            <button
              onClick={() => setActiveCodeTab('dashboard')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                activeCodeTab === 'dashboard'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>ไฟล์ที่ 2: dashboard.html (หน้าแดชบอร์ดขึ้นจอ)</span>
            </button>
          </div>

          {/* Action buttons for current tab */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopyCode(activeCodeTab)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
            >
              {(activeCodeTab === 'survey' ? copiedSurvey : copiedDashboard) ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">คัดลอกโค้ดแล้ว!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>คัดลอกโค้ด</span>
                </>
              )}
            </button>

            <button
              onClick={() => handleDownloadFile(activeCodeTab)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ดาวน์โหลด .{activeCodeTab}.html</span>
            </button>
          </div>
        </div>

        {/* Code Content Box */}
        <div className="p-6 max-h-[460px] overflow-y-auto font-mono text-xs text-slate-300 leading-relaxed bg-slate-950/40">
          <pre className="whitespace-pre overflow-x-auto">
            {activeCodeTab === 'survey' ? surveyCode : dashboardCode}
          </pre>
        </div>

      </div>

      {/* Step-by-Step Firebase & Deployment Guide */}
      <div className="space-y-6">
        
        <div className="flex items-center gap-2 text-slate-900 dark:text-white">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-bold">คู่มือการตั้งค่า Firebase Realtime Database & วิธี Deploy ทีละขั้น</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Step 1 */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-blue-600 text-white font-extrabold text-sm flex items-center justify-center">1</span>
              <h4 className="font-bold text-slate-900 dark:text-white text-base">สร้าง Firebase Project & Realtime Database</h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Firebase มีแพ็กเกจฟรี (Spark Plan) ใช้งาน Realtime Database ได้ฟรีตลอดชีพ ไม่ต้องผูกบัตรเครดิต:
            </p>
            <ol className="list-decimal list-inside text-xs text-slate-600 dark:text-slate-300 space-y-1.5 pl-1">
              <li>ไปที่เว็บ <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-blue-600 underline">console.firebase.google.com</a> ล็อกอินด้วยบัญชี Google</li>
              <li>คลิก <strong>"Add project"</strong> (เพิ่มโปรเจกต์) ตั้งชื่อ เช่น <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-blue-600">training-survey</code> แล้วกด Continue</li>
              <li>ในเมนูด้านซ้าย เลือก <strong>Build</strong> &gt; <strong>Realtime Database</strong></li>
              <li>คลิกปุ่ม <strong>"Create Database"</strong> &gt; เลือกตำแหน่ง Server เช่น <em>Singapore (asia-southeast1)</em> &gt; กด Next</li>
              <li>ในหน้า Security rules เลือก <strong>"Start in test mode"</strong> แล้วกด <strong>Enable</strong></li>
            </ol>
          </div>

          {/* Step 2 */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-extrabold text-sm flex items-center justify-center">2</span>
              <h4 className="font-bold text-slate-900 dark:text-white text-base">ตั้งค่า Security Rules ให้อ่าน/เขียนได้โดยไม่ต้องล็อกอิน</h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              เนื่องจากโจทย์ต้องการให้ผู้เข้าอบรมตอบได้ทันทีโดยไม่ต้อง Sign in:
            </p>
            <div className="bg-slate-900 text-emerald-400 p-3.5 rounded-2xl font-mono text-xs border border-slate-800">
              <pre>{`{
  "rules": {
    ".read": true,
    ".write": true
  }
}`}</pre>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              ไปที่แท็บ <strong>Rules</strong> บนเมนู Realtime Database วางโค้ดด้านบน แล้วกด <strong>"Publish"</strong>
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-purple-600 text-white font-extrabold text-sm flex items-center justify-center">3</span>
              <h4 className="font-bold text-slate-900 dark:text-white text-base">นำ firebaseConfig มาใส่ในโค้ดทั้ง 2 ไฟล์</h4>
            </div>
            <ol className="list-decimal list-inside text-xs text-slate-600 dark:text-slate-300 space-y-1.5 pl-1">
              <li>คลิกรูปเฟือง ⚙️ ด้านบนซ้าย &gt; <strong>Project settings</strong></li>
              <li>เลื่อนลงมาหัวข้อ <em>Your apps</em> คลิกไอคอน <strong>&lt;/&gt;</strong> (Web)</li>
              <li>ตั้งชื่อแอป เช่น <em>Satisfaction App</em> แล้วกด <strong>Register app</strong></li>
              <li>ก๊อปปี้บล็อก <code className="text-blue-600 bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">firebaseConfig = &#123; ... &#125;</code></li>
              <li>เปิดไฟล์ <code className="text-blue-600">survey.html</code> และ <code className="text-blue-600">dashboard.html</code> แล้ววางแทนที่ค่าจำลองเดิม</li>
            </ol>
          </div>

          {/* Step 4 */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center">4</span>
              <h4 className="font-bold text-slate-900 dark:text-white text-base">วิธีทดสอบและ Deploy ขึ้นออนไลน์ฟรี</h4>
            </div>
            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <p><strong>ทดสอบในเครื่อง:</strong> ดับเบิลคลิกเปิดไฟล์ <code className="text-blue-600">survey.html</code> และ <code className="text-blue-600">dashboard.html</code> ใน Browser ได้ทันที</p>
              <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-slate-900 dark:text-white block mb-1">ทางเลือกโฮสต์ฟรี:</span>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Netlify Drop (ง่ายสุด):</strong> ลากโฟลเดอร์ที่มี 2 ไฟล์นี้ไปวางที่ <a href="https://app.netlify.com/drop" target="_blank" rel="noreferrer" className="text-blue-600 underline">app.netlify.com/drop</a> จะได้ URL ออนไลน์ทันที!</li>
                  <li><strong>GitHub Pages:</strong> อัปโหลด 2 ไฟล์ขึ้น GitHub Repo แล้วเปิด Pages ใน Settings</li>
                  <li><strong>Firebase Hosting:</strong> รัน <code className="bg-slate-200 dark:bg-slate-900 px-1 rounded">firebase deploy --only hosting</code></li>
                </ul>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
