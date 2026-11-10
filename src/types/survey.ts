export interface SurveyRating {
  q1: number; // วิทยากร
  q2: number; // เนื้อหาหลักสูตร
  q3: number; // ระยะเวลาและรูปแบบ
  q4: number; // สิ่งอำนวยความสะดวก
  q5: number; // ภาพรวมและการนำไปใช้
}

export interface SurveyResponse {
  id: string;
  ratings: SurveyRating;
  feedback?: string;
  createdAt: string; // ISO string
  timestamp: number; // Unix timestamp for sorting
  deviceInfo?: string;
}

export interface QuestionDefinition {
  id: keyof SurveyRating;
  index: number;
  title: string;
  shortLabel: string;
  description: string;
  category: string;
}

export interface RatingLevel {
  min: number;
  max: number;
  label: string;
  description: string;
  badgeClass: string;
  colorHex: string;
}

export interface FirebaseConnectionConfig {
  apiKey?: string;
  authDomain?: string;
  databaseURL?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}
