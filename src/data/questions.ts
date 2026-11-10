import { QuestionDefinition, RatingLevel, SurveyResponse } from '../types/survey';

export const SURVEY_QUESTIONS: QuestionDefinition[] = [
  {
    id: 'q1',
    index: 1,
    title: '1. ความรู้ความเชี่ยวชาญ และความสามารถในการถ่ายทอดของวิทยากร',
    shortLabel: 'วิทยากร',
    description: 'วิทยากรมีความเชี่ยวชาญ ตอบคำถามชัดเจน และสร้างบรรยากาศการเรียนรู้ได้ดี',
    category: 'วิทยากร (Speaker)'
  },
  {
    id: 'q2',
    index: 2,
    title: '2. ความชัดเจน ความสมบูรณ์ และประโยชน์ของเนื้อหาหลักสูตร',
    shortLabel: 'เนื้อหาหลักสูตร',
    description: 'เนื้อหามีความทันสมัย ตรงตามวัตถุประสงค์ และเข้าใจง่าย',
    category: 'เนื้อหา (Content)'
  },
  {
    id: 'q3',
    index: 3,
    title: '3. ความเหมาะสมของระยะเวลา ขั้นตอน และรูปแบบการจัดกิจกรรม',
    shortLabel: 'ระยะเวลา/รูปแบบ',
    description: 'การจัดสรรเวลาพอเหมาะ ลำดับขั้นตอนกิจกรรมต่อเนื่องและมีส่วนร่วม',
    category: 'การจัดกิจกรรม (Activities)'
  },
  {
    id: 'q4',
    index: 4,
    title: '4. การอำนวยความสะดวก สถานที่/ระบบ และการประสานงาน',
    shortLabel: 'สถานที่/ระบบ',
    description: 'อุปกรณ์ เสียง สัญญาณอินเทอร์เน็ต และการดูแลของผู้ประสานงาน',
    category: 'การบริการ (Facilities)'
  },
  {
    id: 'q5',
    index: 5,
    title: '5. ภาพรวมความพึงพอใจ และการนำความรู้ไปประยุกต์ใช้ได้จริง',
    shortLabel: 'ภาพรวมและการประยุกต์ใช้',
    description: 'ได้รับประโยชน์คุ้มค่า สามารถนำความรู้และทักษะไปปรับใช้ในการทำงานได้',
    category: 'ผลลัพธ์ (Impact)'
  }
];

export const RATING_SCALE_INFO = [
  { value: 1, label: 'น้อยที่สุด', emoji: '😞', color: 'bg-rose-50 text-rose-700 border-rose-300 ring-rose-400' },
  { value: 2, label: 'น้อย', emoji: '🙁', color: 'bg-orange-50 text-orange-700 border-orange-300 ring-orange-400' },
  { value: 3, label: 'ปานกลาง', emoji: '😐', color: 'bg-amber-50 text-amber-700 border-amber-300 ring-amber-400' },
  { value: 4, label: 'มาก', emoji: '🙂', color: 'bg-blue-50 text-blue-700 border-blue-300 ring-blue-400' },
  { value: 5, label: 'มากที่สุด', emoji: '🤩', color: 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-emerald-400' }
];

export const INTERPRETATION_LEVELS: RatingLevel[] = [
  {
    min: 4.51,
    max: 5.00,
    label: 'มากที่สุด (Excellent)',
    description: 'ผู้เข้าอบรมมีความพึงพอใจในระดับสูงสุด ผลการจัดอบรมประสบความสำเร็จอย่างดีเยี่ยม',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300',
    colorHex: '#10b981'
  },
  {
    min: 3.51,
    max: 4.50,
    label: 'มาก (Good)',
    description: 'ผู้เข้าอบรมมีความพึงพอใจในเกณฑ์ดี บรรลุตามเป้าหมายของหลักสูตร',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300',
    colorHex: '#3b82f6'
  },
  {
    min: 2.51,
    max: 3.50,
    label: 'ปานกลาง (Moderate)',
    description: 'ผู้เข้าอบรมมีความพึงพอใจระดับปานกลาง ควรพิจารณาปรับปรุงบางจุด',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300',
    colorHex: '#f59e0b'
  },
  {
    min: 1.51,
    max: 2.50,
    label: 'น้อย (Fair)',
    description: 'ความพึงพอใจอยู่ในเกณฑ์ต่ำ จำเป็นต้องปรับปรุงเนื้อหาหรือวิธีการจัด',
    badgeClass: 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-950 dark:text-orange-300',
    colorHex: '#f97316'
  },
  {
    min: 1.00,
    max: 1.50,
    label: 'น้อยที่สุด (Poor)',
    description: 'ความพึงพอใจไม่เป็นไปตามเกณฑ์ ต้องทบทวนและปรับโครงสร้างการจัดอบรม',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300',
    colorHex: '#f43f5e'
  }
];

export function getInterpretation(averageScore: number): RatingLevel {
  if (averageScore <= 0) {
    return {
      min: 0,
      max: 0,
      label: 'ยังไม่มีข้อมูล',
      description: 'รอผู้เข้าอบรมร่วมตอบแบบประเมิน',
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
      colorHex: '#94a3b8'
    };
  }
  for (const level of INTERPRETATION_LEVELS) {
    if (averageScore >= level.min && averageScore <= level.max + 0.009) {
      return level;
    }
  }
  if (averageScore > 5.0) return INTERPRETATION_LEVELS[0];
  return INTERPRETATION_LEVELS[INTERPRETATION_LEVELS.length - 1];
}

// Initial sample respondents to illustrate dashboard on first load if empty
export const SAMPLE_RESPONSES: SurveyResponse[] = [
  {
    id: 'sample-1',
    ratings: { q1: 5, q2: 5, q3: 4, q4: 5, q5: 5 },
    feedback: 'วิทยากรยกตัวอย่างได้เห็นภาพชัดเจนมาก เข้าใจง่าย นำไปประยุกต์ใช้กับงานที่ทำอยู่ได้ทันทีครับ',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    timestamp: Date.now() - 3600000 * 3
  },
  {
    id: 'sample-2',
    ratings: { q1: 5, q2: 4, q3: 5, q4: 4, q5: 5 },
    feedback: 'ชอบการทำ Workshop แบบมีส่วนร่วมมากค่ะ อยากให้มีหลักสูตรภาคต่อขั้นสูงเพิ่มเติมในครั้งหน้า',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    timestamp: Date.now() - 3600000 * 2
  },
  {
    id: 'sample-3',
    ratings: { q1: 5, q2: 5, q3: 5, q4: 5, q5: 5 },
    feedback: 'การจัดเตรียมสถานที่และอาหารว่างดีมาก วิทยากรอธิบายตรงประเด็น สนุกและไม่น่าเบื่อเลย',
    createdAt: new Date(Date.now() - 3600000 * 1.2).toISOString(),
    timestamp: Date.now() - 3600000 * 1.2
  },
  {
    id: 'sample-4',
    ratings: { q1: 4, q2: 4, q3: 4, q4: 3, q5: 4 },
    feedback: 'ห้องอบรมช่วงบ่ายแอร์ค่อนข้างเย็นไปนิดนึงครับ แต่เนื้อหาและสไลด์ประกอบดีมากครับ',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    timestamp: Date.now() - 1800000
  },
  {
    id: 'sample-5',
    ratings: { q1: 5, q2: 5, q3: 4, q4: 5, q5: 5 },
    feedback: 'ประทับใจมากค่ะ ตอบคำถามผู้เข้าร่วมได้ละเอียดทุกประเด็นเลย',
    createdAt: new Date(Date.now() - 600000).toISOString(),
    timestamp: Date.now() - 600000
  }
];
