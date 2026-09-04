import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  AppDatabase,
  storageService
} from '../services/storageService';
import {
  ClassInfo,
  Group,
  Student,
  ScoreRule,
  ScoreTransaction,
  GroupBonus,
  WeeklyLock,
  TimetableSlot,
  UserRole,
  UserProfile,
  SyncStatus,
  AuditLog
} from '../types';
import { firebaseService } from '../services/firebaseService';

export interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onUndo?: () => void;
}

interface AppContextType {
  db: AppDatabase;
  currentWeek: number;
  currentMonth: number;
  userRole: UserRole;
  currentUser: UserProfile | null;
  syncStatus: SyncStatus;
  toasts: ToastItem[];
  // Navigation & Filter
  setCurrentWeek: (week: number) => void;
  setCurrentMonth: (month: number) => void;
  setUserRole: (role: UserRole) => void;
  setSyncStatus: (status: SyncStatus) => void;
  loginUser: (profile: UserProfile) => void;
  logout: () => void;
  showToast: (type: ToastItem['type'], message: string, onUndo?: () => void) => void;
  removeToast: (id: string) => void;
  
  // Mutations
  updateClassInfo: (info: Partial<ClassInfo>) => void;
  
  // Students & Groups
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, data: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  addGroup: (name: string) => void;
  updateGroup: (id: string, name: string) => void;
  deleteGroup: (id: string) => void;
  
  // Rules
  addScoreRule: (rule: Omit<ScoreRule, 'id'>) => void;
  updateScoreRule: (id: string, rule: Partial<ScoreRule>) => void;
  deleteScoreRule: (id: string) => void;
  
  // Score transactions
  recordScore: (studentId: string, ruleId: string, date: string, weekNumber: number, note?: string) => boolean;
  batchRecordScore: (studentIds: string[], ruleId: string, date: string, weekNumber: number, note?: string) => boolean;
  deleteTransaction: (id: string) => void;
  undoLastTransaction: () => void;
  
  // Locks
  lockDay: (weekNumber: number, date: string) => void;
  unlockDay: (weekNumber: number, date: string) => void;
  lockWeek: (weekNumber: number) => void;
  unlockWeek: (weekNumber: number) => void;
  isDayLocked: (weekNumber: number, date: string) => boolean;
  isWeekLocked: (weekNumber: number) => boolean;
  
  // Group Bonus
  addGroupBonus: (groupId: string, weekNumber: number, points: number, reason: string) => void;
  deleteGroupBonus: (id: string) => void;
  
  // Timetable
  updateTimetableSlot: (slot: TimetableSlot) => void;
  
  // System
  resetDemoData: () => void;
  clearAllData: () => void;
  importBackup: (json: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [db, setDb] = useState<AppDatabase>(() => storageService.loadDatabase());
  const [currentWeek, setCurrentWeek] = useState<number>(1);
  const [currentMonth, setCurrentMonth] = useState<number>(9);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('gvc_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [userRole, setUserRoleState] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem('gvc_current_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.role) return parsed.role;
      }
    } catch {}
    return 'guest';
  });
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('synced');
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [lastTxId, setLastTxId] = useState<string | null>(null);

  const setUserRole = (role: UserRole) => {
    setUserRoleState(role);
    if (role === 'guest') {
      const profile: UserProfile = {
        uid: currentUser?.uid || `local-guest-${Date.now()}`,
        email: currentUser?.email || 'khach@thpt.edu.vn',
        displayName: 'Khách / Phụ huynh',
        role: 'guest'
      };
      setCurrentUser(profile);
      localStorage.setItem('gvc_current_user', JSON.stringify(profile));
    } else {
      const profile: UserProfile = {
        uid: currentUser?.uid || `local-${role}-${Date.now()}`,
        email: role === 'gvcn' ? (currentUser?.email || 'gvcn@thpt.edu.vn') : 'bancansu@lop12a1.edu.vn',
        displayName: role === 'gvcn'
          ? (db.classInfo.teacher || 'Cô Nguyễn Thị Mai')
          : 'Nguyễn An Bình (Lớp trưởng)',
        role: role,
        photoURL: role === 'gvcn'
          ? 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
      };
      setCurrentUser(profile);
      localStorage.setItem('gvc_current_user', JSON.stringify(profile));
    }
  };

  // Lắng nghe Firebase Auth thay đổi
  useEffect(() => {
    const unsubscribe = firebaseService.onAuthChanged((fbUser) => {
      if (fbUser) {
        const roleToAssign: UserRole = userRole === 'guest' ? 'gvcn' : userRole;
        const profile: UserProfile = {
          uid: fbUser.uid,
          email: fbUser.email || '',
          displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Giáo viên',
          role: roleToAssign,
          photoURL: fbUser.photoURL || undefined
        };
        setCurrentUser(profile);
        setUserRoleState(roleToAssign);
        localStorage.setItem('gvc_current_user', JSON.stringify(profile));
      }
    });
    return () => unsubscribe();
  }, [userRole]);

  const loginUser = (profile: UserProfile) => {
    setCurrentUser(profile);
    setUserRoleState(profile.role);
    localStorage.setItem('gvc_current_user', JSON.stringify(profile));
  };

  const logout = async () => {
    try {
      await firebaseService.logout();
    } catch (err) {
      console.warn('Lỗi khi logout Firebase:', err);
    }
    localStorage.removeItem('gvc_current_user');
    setCurrentUser(null);
    setUserRoleState('guest');
    showToast('info', 'Đã đăng xuất khỏi hệ thống');
  };

  // Lắng nghe đồng bộ thời gian thực giữa các tab / cửa sổ qua BroadcastChannel
  useEffect(() => {
    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel('gvc_realtime_sync');
      channel.onmessage = (event) => {
        if (event.data && event.data.type === 'SYNC_DB' && event.data.payload) {
          setDb(event.data.payload);
        }
      };
      return () => {
        channel.close();
      };
    }
  }, []);

  // Đồng bộ vào LocalStorage và phát sóng sang các tab khác khi db thay đổi
  useEffect(() => {
    storageService.saveDatabase(db);
    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel('gvc_realtime_sync');
      channel.postMessage({ type: 'SYNC_DB', payload: db });
      channel.close();
    }
  }, [db]);

  const showToast = (type: ToastItem['type'], message: string, onUndo?: () => void) => {
    const id = 'toast-' + Date.now() + Math.random();
    setToasts(prev => [...prev, { id, type, message, onUndo }]);
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const addAuditLog = (action: string, details: string) => {
    const newLog: AuditLog = {
      id: 'log-' + Date.now() + Math.random(),
      action,
      userName: userRole === 'gvcn' ? 'Giáo viên chủ nhiệm' : userRole === 'bancansu' ? 'Ban cán sự' : 'Khách',
      timestamp: new Date().toISOString(),
      details
    };
    return newLog;
  };

  const updateClassInfo = (info: Partial<ClassInfo>) => {
    setDb(prev => ({
      ...prev,
      classInfo: { ...prev.classInfo, ...info },
      auditLogs: [addAuditLog('Cập nhật thông tin lớp', 'Thay đổi cấu hình lớp học'), ...prev.auditLogs]
    }));
    showToast('success', 'Đã lưu thông tin cài đặt lớp!');
  };

  // Students
  const addStudent = (student: Omit<Student, 'id'>) => {
    const id = 'std-' + Date.now() + Math.random().toString(36).substring(2, 5);
    const newStudent: Student = { ...student, id };
    setDb(prev => ({
      ...prev,
      students: [...prev.students, newStudent],
      auditLogs: [addAuditLog('Thêm học sinh', `Thêm mới học sinh ${newStudent.fullName}`), ...prev.auditLogs]
    }));
    showToast('success', `Đã thêm học sinh ${newStudent.fullName}`);
  };

  const updateStudent = (id: string, data: Partial<Student>) => {
    setDb(prev => ({
      ...prev,
      students: prev.students.map(s => s.id === id ? { ...s, ...data } : s),
      auditLogs: [addAuditLog('Cập nhật học sinh', `Cập nhật thông tin học sinh ID ${id}`), ...prev.auditLogs]
    }));
    showToast('success', 'Đã cập nhật thông tin học sinh');
  };

  const deleteStudent = (id: string) => {
    const student = db.students.find(s => s.id === id);
    setDb(prev => ({
      ...prev,
      students: prev.students.filter(s => s.id !== id),
      // Giữ lại lịch sử giao dịch nhưng gắn cờ hoặc vẫn tồn tại
      auditLogs: [addAuditLog('Xóa học sinh', `Xóa học sinh ${student?.fullName || id}`), ...prev.auditLogs]
    }));
    showToast('info', `Đã xóa học sinh ${student?.fullName || ''}`);
  };

  // Groups
  const addGroup = (name: string) => {
    const id = 'group-' + Date.now();
    const newGroup: Group = { id, name, order: db.groups.length + 1 };
    setDb(prev => ({
      ...prev,
      groups: [...prev.groups, newGroup],
      auditLogs: [addAuditLog('Tạo tổ mới', `Tạo ${name}`), ...prev.auditLogs]
    }));
    showToast('success', `Đã thêm ${name}`);
  };

  const updateGroup = (id: string, name: string) => {
    setDb(prev => ({
      ...prev,
      groups: prev.groups.map(g => g.id === id ? { ...g, name } : g),
      auditLogs: [addAuditLog('Đổi tên tổ', `Đổi tên tổ ${id} thành ${name}`), ...prev.auditLogs]
    }));
    showToast('success', 'Đã đổi tên tổ');
  };

  const deleteGroup = (id: string) => {
    if (db.students.some(s => s.groupId === id)) {
      showToast('error', 'Không thể xóa tổ vẫn còn học sinh. Vui lòng chuyển học sinh sang tổ khác trước!');
      return;
    }
    setDb(prev => ({
      ...prev,
      groups: prev.groups.filter(g => g.id !== id),
      auditLogs: [addAuditLog('Xóa tổ', `Xóa tổ ${id}`), ...prev.auditLogs]
    }));
    showToast('info', 'Đã xóa tổ');
  };

  // Rules
  const addScoreRule = (rule: Omit<ScoreRule, 'id'>) => {
    const id = 'rule-' + Date.now();
    const newRule: ScoreRule = { ...rule, id };
    setDb(prev => ({
      ...prev,
      scoreRules: [...prev.scoreRules, newRule],
      auditLogs: [addAuditLog('Thêm quy định điểm', `Thêm quy định ${newRule.name}`), ...prev.auditLogs]
    }));
    showToast('success', `Đã tạo quy định: ${newRule.name}`);
  };

  const updateScoreRule = (id: string, rule: Partial<ScoreRule>) => {
    setDb(prev => ({
      ...prev,
      scoreRules: prev.scoreRules.map(r => r.id === id ? { ...r, ...rule } : r),
      auditLogs: [addAuditLog('Sửa quy định điểm', `Cập nhật quy định ${id}`), ...prev.auditLogs]
    }));
    showToast('success', 'Đã cập nhật quy định điểm');
  };

  const deleteScoreRule = (id: string) => {
    setDb(prev => ({
      ...prev,
      scoreRules: prev.scoreRules.filter(r => r.id !== id),
      auditLogs: [addAuditLog('Xóa quy định điểm', `Xóa quy định ${id}`), ...prev.auditLogs]
    }));
    showToast('info', 'Đã xóa quy định điểm');
  };

  // Lock status helpers
  const isWeekLocked = (weekNumber: number) => {
    return db.weeklyLocks.some(l => l.weekNumber === weekNumber && !l.date && l.isLocked);
  };

  const isDayLocked = (weekNumber: number, date: string) => {
    if (isWeekLocked(weekNumber)) return true;
    return db.weeklyLocks.some(l => l.weekNumber === weekNumber && l.date === date && l.isLocked);
  };

  const lockDay = (weekNumber: number, date: string) => {
    if (userRole !== 'gvcn') {
      showToast('error', 'Chỉ Giáo viên chủ nhiệm mới có quyền khóa/mở khóa dữ liệu!');
      return;
    }
    const newLock: WeeklyLock = {
      id: `lock-${weekNumber}-${date}`,
      weekNumber,
      date,
      isLocked: true,
      lockedBy: 'GVCN',
      lockedAt: new Date().toISOString()
    };
    setDb(prev => ({
      ...prev,
      weeklyLocks: [...prev.weeklyLocks.filter(l => !(l.weekNumber === weekNumber && l.date === date)), newLock],
      auditLogs: [addAuditLog('Khóa ngày', `Khóa dữ liệu ngày ${date} (Tuần ${weekNumber})`), ...prev.auditLogs]
    }));
    showToast('info', `Đã khóa ngày ${date}`);
  };

  const unlockDay = (weekNumber: number, date: string) => {
    if (userRole !== 'gvcn') {
      showToast('error', 'Chỉ Giáo viên chủ nhiệm mới có quyền khóa/mở khóa dữ liệu!');
      return;
    }
    setDb(prev => ({
      ...prev,
      weeklyLocks: prev.weeklyLocks.filter(l => !(l.weekNumber === weekNumber && l.date === date)),
      auditLogs: [addAuditLog('Mở khóa ngày', `Mở khóa dữ liệu ngày ${date} (Tuần ${weekNumber})`), ...prev.auditLogs]
    }));
    showToast('success', `Đã mở khóa ngày ${date}`);
  };

  const lockWeek = (weekNumber: number) => {
    if (userRole !== 'gvcn') {
      showToast('error', 'Chỉ Giáo viên chủ nhiệm mới có quyền khóa tuần!');
      return;
    }
    const newLock: WeeklyLock = {
      id: `lock-week-${weekNumber}`,
      weekNumber,
      isLocked: true,
      lockedBy: 'GVCN',
      lockedAt: new Date().toISOString()
    };
    setDb(prev => ({
      ...prev,
      weeklyLocks: [...prev.weeklyLocks.filter(l => !(l.weekNumber === weekNumber && !l.date)), newLock],
      auditLogs: [addAuditLog('Khóa tuần', `Khóa toàn bộ tuần ${weekNumber}`), ...prev.auditLogs]
    }));
    showToast('info', `Đã khóa toàn bộ Tuần ${weekNumber}`);
  };

  const unlockWeek = (weekNumber: number) => {
    if (userRole !== 'gvcn') {
      showToast('error', 'Chỉ Giáo viên chủ nhiệm mới có quyền mở khóa tuần!');
      return;
    }
    setDb(prev => ({
      ...prev,
      weeklyLocks: prev.weeklyLocks.filter(l => !(l.weekNumber === weekNumber && !l.date)),
      auditLogs: [addAuditLog('Mở khóa tuần', `Mở khóa tuần ${weekNumber}`), ...prev.auditLogs]
    }));
    showToast('success', `Đã mở khóa Tuần ${weekNumber}`);
  };

  // Score recording with atomic transactions & lock check
  const recordScore = (
    studentId: string,
    ruleId: string,
    date: string,
    weekNumber: number,
    note?: string
  ): boolean => {
    if (userRole === 'guest') {
      showToast('error', 'Khách không có quyền ghi nhận điểm!');
      return false;
    }

    if (isDayLocked(weekNumber, date)) {
      showToast('error', 'Ngày hoặc tuần này đã được GVCN khóa sổ! Không thể sửa hoặc ghi nhận thêm.');
      return false;
    }

    const rule = db.scoreRules.find(r => r.id === ruleId);
    if (!rule) {
      showToast('error', 'Quy định điểm không tồn tại!');
      return false;
    }

    if (userRole === 'bancansu' && !rule.allowOfficer) {
      showToast('error', 'Quy định này chỉ dành riêng cho GVCN ghi nhận!');
      return false;
    }

    const student = db.students.find(s => s.id === studentId);
    const txId = 'tx-' + Date.now() + Math.random().toString(36).substring(2, 6);
    const newTx: ScoreTransaction = {
      id: txId,
      classId: db.classInfo.id,
      studentId,
      date,
      weekNumber,
      ruleId,
      ruleName: rule.name,
      points: rule.points,
      type: rule.type,
      category: rule.category,
      createdBy: userRole === 'gvcn' ? 'GVCN' : 'Ban cán sự',
      createdAt: new Date().toISOString(),
      note,
      isViolation: rule.isViolation
    };

    setDb(prev => ({
      ...prev,
      transactions: [newTx, ...prev.transactions],
      auditLogs: [
        addAuditLog(
          'Ghi nhận điểm',
          `${rule.points > 0 ? '+' : ''}${rule.points}đ cho ${student?.fullName || studentId} (${rule.name})`
        ),
        ...prev.auditLogs
      ]
    }));

    setLastTxId(txId);

    showToast(
      rule.points > 0 ? 'success' : 'warning',
      `Đã ghi nhận ${rule.points > 0 ? '+' : ''}${rule.points} điểm cho ${student?.fullName || 'học sinh'}`,
      () => deleteTransaction(txId)
    );

    return true;
  };

  const batchRecordScore = (
    studentIds: string[],
    ruleId: string,
    date: string,
    weekNumber: number,
    note?: string
  ): boolean => {
    if (userRole === 'guest') {
      showToast('error', 'Khách không có quyền ghi nhận!');
      return false;
    }

    if (isDayLocked(weekNumber, date)) {
      showToast('error', 'Dữ liệu thời gian này đã bị khóa!');
      return false;
    }

    const rule = db.scoreRules.find(r => r.id === ruleId);
    if (!rule) return false;

    if (userRole === 'bancansu' && !rule.allowOfficer) {
      showToast('error', 'Quy định này chỉ dành riêng cho GVCN!');
      return false;
    }

    const newTxs: ScoreTransaction[] = studentIds.map(sId => ({
      id: 'tx-batch-' + Date.now() + Math.random().toString(36).substring(2, 6),
      classId: db.classInfo.id,
      studentId: sId,
      date,
      weekNumber,
      ruleId,
      ruleName: rule.name,
      points: rule.points,
      type: rule.type,
      category: rule.category,
      createdBy: userRole === 'gvcn' ? 'GVCN' : 'Ban cán sự',
      createdAt: new Date().toISOString(),
      note,
      isViolation: rule.isViolation
    }));

    setDb(prev => ({
      ...prev,
      transactions: [...newTxs, ...prev.transactions],
      auditLogs: [
        addAuditLog('Ghi nhận hàng loạt', `Ghi nhận cho ${studentIds.length} học sinh (${rule.name})`),
        ...prev.auditLogs
      ]
    }));

    showToast(
      'success',
      `Đã ghi nhận ${rule.points > 0 ? '+' : ''}${rule.points}đ cho ${studentIds.length} học sinh!`
    );

    return true;
  };

  const deleteTransaction = (id: string) => {
    const tx = db.transactions.find(t => t.id === id);
    if (!tx) return;

    if (userRole === 'bancansu' && isDayLocked(tx.weekNumber, tx.date)) {
      showToast('error', 'Không thể xóa giao dịch thuộc tuần đã khóa!');
      return;
    }

    setDb(prev => ({
      ...prev,
      transactions: prev.transactions.filter(t => t.id !== id),
      auditLogs: [addAuditLog('Xóa giao dịch điểm', `Xóa giao dịch ${tx.ruleName} (${tx.points}đ)`), ...prev.auditLogs]
    }));

    showToast('info', 'Đã hoàn tác / xóa giao dịch vừa chọn');
  };

  const undoLastTransaction = () => {
    if (lastTxId) {
      deleteTransaction(lastTxId);
      setLastTxId(null);
    }
  };

  // Group Bonus
  const addGroupBonus = (groupId: string, weekNumber: number, points: number, reason: string) => {
    if (userRole !== 'gvcn') {
      showToast('error', 'Chỉ GVCN mới có quyền thưởng điểm cho tổ!');
      return;
    }
    const bonus: GroupBonus = {
      id: 'bonus-' + Date.now(),
      groupId,
      weekNumber,
      points,
      reason,
      createdBy: 'GVCN',
      createdAt: new Date().toISOString()
    };
    setDb(prev => ({
      ...prev,
      groupBonuses: [bonus, ...prev.groupBonuses],
      auditLogs: [addAuditLog('Thưởng điểm tổ', `Thưởng +${points}đ cho tổ ${groupId}`), ...prev.auditLogs]
    }));
    showToast('success', `Đã cộng +${points} điểm thưởng cho tổ!`);
  };

  const deleteGroupBonus = (id: string) => {
    if (userRole !== 'gvcn') {
      showToast('error', 'Chỉ GVCN mới có quyền xóa điểm thưởng tổ!');
      return;
    }
    setDb(prev => ({
      ...prev,
      groupBonuses: prev.groupBonuses.filter(b => b.id !== id),
      auditLogs: [addAuditLog('Xóa điểm thưởng tổ', `Xóa bonus ${id}`), ...prev.auditLogs]
    }));
    showToast('info', 'Đã xóa điểm thưởng tổ');
  };

  // Timetable
  const updateTimetableSlot = (slot: TimetableSlot) => {
    if (userRole !== 'gvcn') {
      showToast('error', 'Chỉ GVCN mới có quyền sửa thời khóa biểu!');
      return;
    }
    setDb(prev => {
      const exists = prev.timetable.some(t => t.dayOfWeek === slot.dayOfWeek && t.period === slot.period);
      const updated = exists
        ? prev.timetable.map(t => (t.dayOfWeek === slot.dayOfWeek && t.period === slot.period ? slot : t))
        : [...prev.timetable, slot];
      return {
        ...prev,
        timetable: updated,
        auditLogs: [
          addAuditLog('Sửa thời khóa biểu', `Thứ ${slot.dayOfWeek}, Tiết ${slot.period}: ${slot.subject}`),
          ...prev.auditLogs
        ]
      };
    });
    showToast('success', 'Đã lưu thời khóa biểu');
  };

  // Reset & Clear
  const resetDemoData = () => {
    const freshDb = storageService.resetToMockData();
    setDb(freshDb);
    showToast('success', 'Đã tạo lại dữ liệu mẫu minh họa thành công!');
  };

  const clearAllData = () => {
    const cleanDb = storageService.clearAllData();
    setDb(cleanDb);
    showToast('warning', 'Đã xóa toàn bộ dữ liệu mẫu. Lớp học đã sẵn sàng để nhập mới!');
  };

  const importBackup = (json: string) => {
    const result = storageService.validateAndImportJSON(json);
    if (result.success && result.data) {
      setDb(result.data);
      showToast('success', result.message);
      return true;
    } else {
      showToast('error', result.message);
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        db,
        currentWeek,
        currentMonth,
        userRole,
        currentUser,
        syncStatus,
        toasts,
        setCurrentWeek,
        setCurrentMonth,
        setUserRole,
        setSyncStatus,
        loginUser,
        logout,
        showToast,
        removeToast,
        updateClassInfo,
        addStudent,
        updateStudent,
        deleteStudent,
        addGroup,
        updateGroup,
        deleteGroup,
        addScoreRule,
        updateScoreRule,
        deleteScoreRule,
        recordScore,
        batchRecordScore,
        deleteTransaction,
        undoLastTransaction,
        lockDay,
        unlockDay,
        lockWeek,
        unlockWeek,
        isDayLocked,
        isWeekLocked,
        addGroupBonus,
        deleteGroupBonus,
        updateTimetableSlot,
        resetDemoData,
        clearAllData,
        importBackup
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

