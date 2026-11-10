import { SurveyResponse, SurveyRating } from '../types/survey';
import { SAMPLE_RESPONSES, SURVEY_QUESTIONS } from '../data/questions';

const STORAGE_KEY = 'training_survey_responses_v1';
const SUBMITTED_DEVICE_KEY = 'training_survey_submitted_flag';
const CHANNEL_NAME = 'training_survey_broadcast_channel';

// Singleton broadcast channel
let channel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    channel = new BroadcastChannel(CHANNEL_NAME);
  }
} catch (e) {
  console.warn('BroadcastChannel not supported or restricted in this environment', e);
}

// Pleasant chime notification using Web Audio API
export function playNewResponseSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // Simple 2-note pleasant chime (E5 -> G#5)
    const now = ctx.currentTime;
    
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now); // E5
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.2, now + 0.05);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.4);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(830.61, now + 0.12); // G#5
    gain2.gain.setValueAtTime(0, now + 0.12);
    gain2.gain.linearRampToValueAtTime(0.25, now + 0.17);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.6);
  } catch {
    // Ignore audio autoplay restrictions
  }
}

export function loadResponsesFromStorage(): SurveyResponse[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed with sample responses so initial dashboard isn't completely blank
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_RESPONSES));
      return SAMPLE_RESPONSES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return SAMPLE_RESPONSES;
  } catch (e) {
    console.error('Error reading responses from localStorage', e);
    return SAMPLE_RESPONSES;
  }
}

export function saveResponse(ratings: SurveyRating, feedback: string = ''): SurveyResponse {
  const responses = loadResponsesFromStorage();
  const newResponse: SurveyResponse = {
    id: 'resp-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    ratings,
    feedback: feedback.trim(),
    createdAt: new Date().toISOString(),
    timestamp: Date.now(),
    deviceInfo: navigator.userAgent ? (navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop') : 'Web'
  };

  const updated = [newResponse, ...responses];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  markDeviceAsSubmitted();

  // Notify other tabs immediately
  if (channel) {
    try {
      channel.postMessage({ type: 'NEW_RESPONSE', response: newResponse });
    } catch (e) {
      console.warn('Channel postMessage failed', e);
    }
  }

  // Dispatch local window custom event for this tab
  window.dispatchEvent(new CustomEvent('training-survey-updated', { detail: newResponse }));

  return newResponse;
}

export function subscribeToResponses(callback: (responses: SurveyResponse[]) => void): () => void {
  const handleUpdate = () => {
    const latest = loadResponsesFromStorage();
    callback(latest);
  };

  const handleBroadcast = (e: MessageEvent) => {
    if (e.data && (e.data.type === 'NEW_RESPONSE' || e.data.type === 'RESET_RESPONSES')) {
      handleUpdate();
      if (e.data.type === 'NEW_RESPONSE') {
        playNewResponseSound();
      }
    }
  };

  const handleStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      handleUpdate();
    }
  };

  const handleCustom = () => {
    handleUpdate();
  };

  if (channel) {
    channel.addEventListener('message', handleBroadcast);
  }
  window.addEventListener('storage', handleStorage);
  window.addEventListener('training-survey-updated', handleCustom);

  return () => {
    if (channel) {
      channel.removeEventListener('message', handleBroadcast);
    }
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener('training-survey-updated', handleCustom);
  };
}

// Device submission check (Prevention of repeated submissions on the same device)
export function hasDeviceSubmitted(): boolean {
  try {
    return localStorage.getItem(SUBMITTED_DEVICE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function markDeviceAsSubmitted(): void {
  try {
    localStorage.setItem(SUBMITTED_DEVICE_KEY, 'true');
  } catch {
    // ignore
  }
}

export function resetDeviceSubmissionFlag(): void {
  try {
    localStorage.removeItem(SUBMITTED_DEVICE_KEY);
  } catch {
    // ignore
  }
}

// Reset all responses back to initial or clear
export function clearAllResponses(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  if (channel) {
    channel.postMessage({ type: 'RESET_RESPONSES' });
  }
  window.dispatchEvent(new CustomEvent('training-survey-updated'));
}

export function seedMockResponses(count: number = 5): void {
  const current = loadResponsesFromStorage();
  const mockComments = [
    'วิทยากรสอนสนุกมาก อธิบายเห็นภาพชัดเจน',
    'อยากให้มีเวลาทำ workshop มากกว่านี้ครับ',
    'เนื้อหาดีมาก ตอบโจทย์งานที่ทำอยู่',
    'จัดสถานที่ได้ดี อาหารว่างอร่อย เอกสารครบ',
    'วิทยากรตอบคำถามได้ตรงประเด็นมาก',
    'ขอสไลด์ประกอบการบรรยายเพิ่มเติมด้วยนะคะ',
    'ชอบเทคนิคและ Best Practices ที่แชร์ในคลาสครับ',
    'บรรยากาศการเรียนรู้เป็นกันเอง ไม่เกร็งเลย'
  ];

  const added: SurveyResponse[] = [];
  for (let i = 0; i < count; i++) {
    const q1 = Math.floor(Math.random() * 2) + 4; // 4-5
    const q2 = Math.floor(Math.random() * 2) + 4;
    const q3 = Math.floor(Math.random() * 3) + 3; // 3-5
    const q4 = Math.floor(Math.random() * 2) + 4;
    const q5 = Math.floor(Math.random() * 2) + 4;
    const randomFeedback = Math.random() > 0.3 ? mockComments[Math.floor(Math.random() * mockComments.length)] : '';

    added.push({
      id: 'mock-' + Date.now() + '-' + i,
      ratings: { q1, q2, q3, q4, q5 },
      feedback: randomFeedback,
      createdAt: new Date(Date.now() - (count - i) * 120000).toISOString(),
      timestamp: Date.now() - (count - i) * 120000,
      deviceInfo: 'Mobile'
    });
  }

  const updated = [...added.reverse(), ...current];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  if (channel) {
    channel.postMessage({ type: 'NEW_RESPONSE' });
  }
  window.dispatchEvent(new CustomEvent('training-survey-updated'));
}

// Download CSV with UTF-8 BOM for Thai language Excel support
export function exportResponsesToCSV(responses: SurveyResponse[]): void {
  if (!responses || responses.length === 0) {
    alert('ยังไม่มีข้อมูลสำหรับดาวน์โหลด');
    return;
  }

  const headers = [
    'ลำดับ (No.)',
    'วัน-เวลาที่ส่ง (Timestamp)',
    'ข้อ 1: วิทยากร (1-5)',
    'ข้อ 2: เนื้อหาหลักสูตร (1-5)',
    'ข้อ 3: ระยะเวลาและรูปแบบ (1-5)',
    'ข้อ 4: สถานที่และระบบ (1-5)',
    'ข้อ 5: ภาพรวมและการประยุกต์ใช้ (1-5)',
    'ค่าเฉลี่ยรายบุคคล (Average)',
    'ข้อเสนอแนะเพิ่มเติม (Feedback)',
    'อุปกรณ์ (Device)'
  ];

  const escapeCSV = (val: string | number | undefined): string => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = responses.map((r, index) => {
    const avg = ((r.ratings.q1 + r.ratings.q2 + r.ratings.q3 + r.ratings.q4 + r.ratings.q5) / 5).toFixed(2);
    const dateStr = new Date(r.createdAt).toLocaleString('th-TH', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    return [
      escapeCSV(index + 1),
      escapeCSV(dateStr),
      escapeCSV(r.ratings.q1),
      escapeCSV(r.ratings.q2),
      escapeCSV(r.ratings.q3),
      escapeCSV(r.ratings.q4),
      escapeCSV(r.ratings.q5),
      escapeCSV(avg),
      escapeCSV(r.feedback || '-'),
      escapeCSV(r.deviceInfo || 'Web')
    ].join(',');
  });

  // Calculate Summary row
  const total = responses.length;
  const avgQ1 = (responses.reduce((acc, r) => acc + r.ratings.q1, 0) / total).toFixed(2);
  const avgQ2 = (responses.reduce((acc, r) => acc + r.ratings.q2, 0) / total).toFixed(2);
  const avgQ3 = (responses.reduce((acc, r) => acc + r.ratings.q3, 0) / total).toFixed(2);
  const avgQ4 = (responses.reduce((acc, r) => acc + r.ratings.q4, 0) / total).toFixed(2);
  const avgQ5 = (responses.reduce((acc, r) => acc + r.ratings.q5, 0) / total).toFixed(2);
  const grandAvg = ((Number(avgQ1) + Number(avgQ2) + Number(avgQ3) + Number(avgQ4) + Number(avgQ5)) / 5).toFixed(2);

  const summaryRow = [
    escapeCSV('สรุปค่าเฉลี่ยรวม'),
    escapeCSV(`ผู้ตอบ ${total} คน`),
    escapeCSV(avgQ1),
    escapeCSV(avgQ2),
    escapeCSV(avgQ3),
    escapeCSV(avgQ4),
    escapeCSV(avgQ5),
    escapeCSV(grandAvg),
    escapeCSV(''),
    escapeCSV('')
  ].join(',');

  // UTF-8 BOM: \uFEFF ensures Thai characters render perfectly in Excel
  const csvContent = '\uFEFF' + [headers.join(','), ...rows, summaryRow].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const timestampStr = new Date().toISOString().slice(0, 10);
  link.setAttribute('href', url);
  link.setAttribute('download', `training_satisfaction_results_${timestampStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
