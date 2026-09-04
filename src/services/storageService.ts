import {
  ClassInfo,
  Group,
  Student,
  ScoreRule,
  ScoreTransaction,
  GroupBonus,
  WeeklyLock,
  TimetableSlot,
  AuditLog
} from '../types';
import {
  initialClassInfo,
  initialGroups,
  initialStudents,
  initialScoreRules,
  initialTimetable,
  initialTransactions,
  initialGroupBonuses
} from './mockData';

const KEYS = {
  CLASS_INFO: 'gvc_class_info_v1',
  GROUPS: 'gvc_groups_v1',
  STUDENTS: 'gvc_students_v1',
  SCORE_RULES: 'gvc_score_rules_v1',
  TRANSACTIONS: 'gvc_transactions_v1',
  GROUP_BONUSES: 'gvc_group_bonuses_v1',
  WEEKLY_LOCKS: 'gvc_weekly_locks_v1',
  TIMETABLE: 'gvc_timetable_v1',
  AUDIT_LOGS: 'gvc_audit_logs_v1',
};

export interface AppDatabase {
  classInfo: ClassInfo;
  groups: Group[];
  students: Student[];
  scoreRules: ScoreRule[];
  transactions: ScoreTransaction[];
  groupBonuses: GroupBonus[];
  weeklyLocks: WeeklyLock[];
  timetable: TimetableSlot[];
  auditLogs: AuditLog[];
}

export const storageService = {
  loadDatabase(): AppDatabase {
    try {
      const classInfoStr = localStorage.getItem(KEYS.CLASS_INFO);
      const groupsStr = localStorage.getItem(KEYS.GROUPS);
      const studentsStr = localStorage.getItem(KEYS.STUDENTS);
      const scoreRulesStr = localStorage.getItem(KEYS.SCORE_RULES);
      const transactionsStr = localStorage.getItem(KEYS.TRANSACTIONS);
      const groupBonusesStr = localStorage.getItem(KEYS.GROUP_BONUSES);
      const weeklyLocksStr = localStorage.getItem(KEYS.WEEKLY_LOCKS);
      const timetableStr = localStorage.getItem(KEYS.TIMETABLE);
      const auditLogsStr = localStorage.getItem(KEYS.AUDIT_LOGS);

      // Nếu chưa có dữ liệu trong LocalStorage -> Khởi tạo dữ liệu mẫu
      const classInfo: ClassInfo = classInfoStr ? JSON.parse(classInfoStr) : initialClassInfo;
      const groups: Group[] = groupsStr ? JSON.parse(groupsStr) : initialGroups;
      const students: Student[] = studentsStr ? JSON.parse(studentsStr) : initialStudents;
      const scoreRules: ScoreRule[] = scoreRulesStr ? JSON.parse(scoreRulesStr) : initialScoreRules;
      const transactions: ScoreTransaction[] = transactionsStr ? JSON.parse(transactionsStr) : initialTransactions;
      const groupBonuses: GroupBonus[] = groupBonusesStr ? JSON.parse(groupBonusesStr) : initialGroupBonuses;
      const weeklyLocks: WeeklyLock[] = weeklyLocksStr ? JSON.parse(weeklyLocksStr) : [];
      const timetable: TimetableSlot[] = timetableStr ? JSON.parse(timetableStr) : initialTimetable;
      const auditLogs: AuditLog[] = auditLogsStr ? JSON.parse(auditLogsStr) : [
        {
          id: 'log-init',
          action: 'Khởi tạo hệ thống',
          userName: 'Hệ thống',
          timestamp: new Date().toISOString(),
          details: 'Nạp dữ liệu mẫu ban đầu'
        }
      ];

      return {
        classInfo,
        groups,
        students,
        scoreRules,
        transactions,
        groupBonuses,
        weeklyLocks,
        timetable,
        auditLogs
      };
    } catch (error) {
      console.error('Lỗi khi đọc LocalStorage:', error);
      return {
        classInfo: initialClassInfo,
        groups: initialGroups,
        students: initialStudents,
        scoreRules: initialScoreRules,
        transactions: initialTransactions,
        groupBonuses: initialGroupBonuses,
        weeklyLocks: [],
        timetable: initialTimetable,
        auditLogs: []
      };
    }
  },

  saveDatabase(db: AppDatabase): void {
    try {
      localStorage.setItem(KEYS.CLASS_INFO, JSON.stringify(db.classInfo));
      localStorage.setItem(KEYS.GROUPS, JSON.stringify(db.groups));
      localStorage.setItem(KEYS.STUDENTS, JSON.stringify(db.students));
      localStorage.setItem(KEYS.SCORE_RULES, JSON.stringify(db.scoreRules));
      localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(db.transactions));
      localStorage.setItem(KEYS.GROUP_BONUSES, JSON.stringify(db.groupBonuses));
      localStorage.setItem(KEYS.WEEKLY_LOCKS, JSON.stringify(db.weeklyLocks));
      localStorage.setItem(KEYS.TIMETABLE, JSON.stringify(db.timetable));
      localStorage.setItem(KEYS.AUDIT_LOGS, JSON.stringify(db.auditLogs));
    } catch (error) {
      console.error('Lỗi khi lưu LocalStorage:', error);
    }
  },

  resetToMockData(): AppDatabase {
    const db: AppDatabase = {
      classInfo: { ...initialClassInfo },
      groups: [...initialGroups],
      students: [...initialStudents],
      scoreRules: [...initialScoreRules],
      transactions: [...initialTransactions],
      groupBonuses: [...initialGroupBonuses],
      weeklyLocks: [],
      timetable: [...initialTimetable],
      auditLogs: [
        {
          id: 'log-reset-' + Date.now(),
          action: 'Đặt lại dữ liệu mẫu',
          userName: 'GVCN',
          timestamp: new Date().toISOString(),
          details: 'Tạo lại 4 tổ, 12 học sinh và bộ quy tắc điểm mẫu'
        }
      ]
    };
    this.saveDatabase(db);
    return db;
  },

  clearAllData(): AppDatabase {
    const db: AppDatabase = {
      classInfo: {
        ...initialClassInfo,
        name: 'Lớp mới',
        teacher: '',
        slogan: ''
      },
      groups: [
        { id: 'group-1', name: 'Tổ 1', order: 1 },
        { id: 'group-2', name: 'Tổ 2', order: 2 },
        { id: 'group-3', name: 'Tổ 3', order: 3 },
        { id: 'group-4', name: 'Tổ 4', order: 4 },
      ],
      students: [],
      scoreRules: [...initialScoreRules],
      transactions: [],
      groupBonuses: [],
      weeklyLocks: [],
      timetable: [],
      auditLogs: [
        {
          id: 'log-clear-' + Date.now(),
          action: 'Xóa toàn bộ dữ liệu mẫu',
          userName: 'GVCN',
          timestamp: new Date().toISOString(),
          details: 'Đã dọn dẹp dữ liệu để bắt đầu lớp học thực tế'
        }
      ]
    };
    this.saveDatabase(db);
    return db;
  },

  exportJSON(db: AppDatabase): string {
    return JSON.stringify(
      {
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        appName: 'QUẢN LÝ LỚP CHỦ NHIỆM',
        ...db
      },
      null,
      2
    );
  },

  validateAndImportJSON(jsonString: string): { success: boolean; data?: AppDatabase; message: string } {
    try {
      const parsed = JSON.parse(jsonString);

      // Kiểm tra cấu trúc bắt buộc
      if (!parsed || typeof parsed !== 'object') {
        return { success: false, message: 'Dữ liệu không phải định dạng JSON hợp lệ.' };
      }

      if (!parsed.classInfo || !Array.isArray(parsed.students) || !Array.isArray(parsed.groups)) {
        return {
          success: false,
          message: 'Cấu trúc file sao lưu không hợp lệ (thiếu classInfo, students hoặc groups).'
        };
      }

      const db: AppDatabase = {
        classInfo: parsed.classInfo,
        groups: parsed.groups,
        students: parsed.students,
        scoreRules: Array.isArray(parsed.scoreRules) ? parsed.scoreRules : initialScoreRules,
        transactions: Array.isArray(parsed.transactions) ? parsed.transactions : [],
        groupBonuses: Array.isArray(parsed.groupBonuses) ? parsed.groupBonuses : [],
        weeklyLocks: Array.isArray(parsed.weeklyLocks) ? parsed.weeklyLocks : [],
        timetable: Array.isArray(parsed.timetable) ? parsed.timetable : [],
        auditLogs: Array.isArray(parsed.auditLogs)
          ? [
              ...parsed.auditLogs,
              {
                id: 'log-import-' + Date.now(),
                action: 'Khôi phục sao lưu',
                userName: 'GVCN',
                timestamp: new Date().toISOString(),
                details: 'Đã nạp dữ liệu từ file sao lưu JSON'
              }
            ]
          : []
      };

      this.saveDatabase(db);
      return { success: true, data: db, message: 'Khôi phục dữ liệu từ file JSON thành công!' };
    } catch (e: any) {
      return { success: false, message: `Lỗi đọc file: ${e.message}` };
    }
  }
};

