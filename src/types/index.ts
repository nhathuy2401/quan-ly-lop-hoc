export type UserRole = 'gvcn' | 'bancansu' | 'guest';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  photoURL?: string;
}

export type SyncStatus = 'connected' | 'synced' | 'connecting' | 'offline' | 'error';

export type EvaluationRating = 'Tốt' | 'Khá' | 'Đạt' | 'Chưa đạt' | 'Chưa đủ dữ liệu';

export interface ClassInfo {
  id: string;
  name: string;
  school: string;
  teacher: string;
  academicYear: string;
  startDate: string; // YYYY-MM-DD
  totalWeeks: number; // default 38
  periodsPerDay: number; // 5 - 10
  totalGroups: number;
  slogan: string;
  logoUrl?: string;
  googleSheetUrl?: string;
  firebaseConfig?: string;
  // Criteria thresholds
  thresholdGood: number; // Tốt, default >= 100
  thresholdFair: number; // Khá, default >= 80
  thresholdPass: number; // Đạt, default >= 60
}

export interface Group {
  id: string;
  name: string;
  order: number;
}

export interface Student {
  id: string;
  orderNumber: number;
  fullName: string;
  birthDate: string;
  gender: 'Nam' | 'Nữ';
  groupId: string;
  duty: string; // 'Học sinh' | 'Lớp trưởng' | 'Lớp phó học tập' | 'Lớp phó kỷ luật' | 'Bí thư' | 'Thủ quỹ' | 'Tổ trưởng' | custom
  phone: string;
  note?: string;
}

export type ScoreCategory = 'chuyen_can' | 'hoc_tap' | 'ren_luyen' | 'phong_trao' | 'khac';

export interface ScoreRule {
  id: string;
  name: string;
  type: 'plus' | 'minus';
  category: ScoreCategory;
  points: number; // e.g. 5, 10, -2, -5
  color: string;
  icon?: string;
  allowOfficer: boolean;
  isViolation: boolean;
  isActive: boolean;
}

export interface ScoreTransaction {
  id: string;
  classId: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  weekNumber: number;
  ruleId: string;
  ruleName: string;
  points: number;
  type: 'plus' | 'minus';
  category: ScoreCategory;
  createdBy: string;
  createdAt: string;
  note?: string;
  isViolation?: boolean;
}

export interface GroupBonus {
  id: string;
  groupId: string;
  weekNumber: number;
  points: number;
  reason: string;
  createdBy: string;
  createdAt: string;
}

export interface WeeklyLock {
  id: string;
  weekNumber: number;
  date?: string; // If set, only that specific day is locked. If undefined, whole week is locked
  isLocked: boolean;
  lockedBy: string;
  lockedAt: string;
}

export interface TimetableSlot {
  id: string;
  dayOfWeek: number; // 2 -> 7 (Thứ 2 -> Thứ 7)
  period: number; // 1 -> 10
  subject: string;
  homework?: string;
  note?: string;
  isImportant?: boolean;
}

export interface MonthlyComment {
  id: string;
  studentId: string;
  month: number;
  teacherComment: string;
  reminders: string;
  isOfficial: boolean;
}

export interface AuditLog {
  id: string;
  action: string;
  userName: string;
  timestamp: string;
  details: string;
}

