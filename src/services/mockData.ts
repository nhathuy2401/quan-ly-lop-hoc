import { ClassInfo, Group, Student, ScoreRule, TimetableSlot, ScoreTransaction, GroupBonus } from '../types';

export const initialClassInfo: ClassInfo = {
  id: 'class-demo-1',
  name: 'Lớp 12A1',
  school: 'THPT Nguyễn Trãi',
  teacher: 'Cô Nguyễn Thị Mai',
  academicYear: '2026 - 2027',
  startDate: '2026-09-07', // Thứ 2, Tuần 1
  totalWeeks: 38,
  periodsPerDay: 8,
  totalGroups: 4,
  slogan: 'Kỷ luật - Đoàn kết - Tự giác - Vươn xa',
  logoUrl: '',
  googleSheetUrl: '',
  thresholdGood: 100,
  thresholdFair: 80,
  thresholdPass: 60,
};

export const initialGroups: Group[] = [
  { id: 'group-1', name: 'Tổ 1', order: 1 },
  { id: 'group-2', name: 'Tổ 2', order: 2 },
  { id: 'group-3', name: 'Tổ 3', order: 3 },
  { id: 'group-4', name: 'Tổ 4', order: 4 },
];

export const initialStudents: Student[] = [
  // Tổ 1
  { id: 'std-1', orderNumber: 1, fullName: 'Nguyễn An Bình', birthDate: '2009-03-15', gender: 'Nam', groupId: 'group-1', duty: 'Lớp trưởng', phone: '0912345678', note: 'Chăm ngoan, gương mẫu' },
  { id: 'std-2', orderNumber: 2, fullName: 'Trần Bảo Châu', birthDate: '2009-07-22', gender: 'Nữ', groupId: 'group-1', duty: 'Tổ trưởng', phone: '0923456789', note: 'Học lực xuất sắc' },
  { id: 'std-3', orderNumber: 3, fullName: 'Lê Hoàng Cường', birthDate: '2009-11-05', gender: 'Nam', groupId: 'group-1', duty: 'Học sinh', phone: '0934567890', note: 'Cần chú ý bài tập Toán' },
  // Tổ 2
  { id: 'std-4', orderNumber: 4, fullName: 'Phạm Thùy Dung', birthDate: '2009-02-18', gender: 'Nữ', groupId: 'group-2', duty: 'Lớp phó học tập', phone: '0945678901', note: 'Quản lý tốt học tập' },
  { id: 'std-5', orderNumber: 5, fullName: 'Vũ Đức Giang', birthDate: '2009-09-10', gender: 'Nam', groupId: 'group-2', duty: 'Tổ trưởng', phone: '0956789012', note: 'Nhiệt tình phong trào' },
  { id: 'std-6', orderNumber: 6, fullName: 'Hoàng Ánh Hoa', birthDate: '2009-04-30', gender: 'Nữ', groupId: 'group-2', duty: 'Học sinh', phone: '0967890123', note: 'Hát hay, năng nổ' },
  // Tổ 3
  { id: 'std-7', orderNumber: 7, fullName: 'Đặng Quốc Khánh', birthDate: '2009-08-14', gender: 'Nam', groupId: 'group-3', duty: 'Lớp phó kỷ luật', phone: '0978901234', note: 'Nghiêm túc, trách nhiệm' },
  { id: 'std-8', orderNumber: 8, fullName: 'Bùi Thảo Linh', birthDate: '2009-05-19', gender: 'Nữ', groupId: 'group-3', duty: 'Tổ trưởng', phone: '0989012345', note: 'Cẩn thận, tỉ mỉ' },
  { id: 'std-9', orderNumber: 9, fullName: 'Ngô Quang Minh', birthDate: '2009-12-25', gender: 'Nam', groupId: 'group-3', duty: 'Thủ quỹ', phone: '0990123456', note: 'Minh bạch sổ sách' },
  // Tổ 4
  { id: 'std-10', orderNumber: 10, fullName: 'Dương Yến Nhi', birthDate: '2009-01-08', gender: 'Nữ', groupId: 'group-4', duty: 'Bí thư', phone: '0901234567', note: 'Dẫn đầu hoạt động Đoàn' },
  { id: 'std-11', orderNumber: 11, fullName: 'Lý Trọng Phúc', birthDate: '2009-06-12', gender: 'Nam', groupId: 'group-4', duty: 'Tổ trưởng', phone: '0913456789', note: 'Tích cực phát biểu' },
  { id: 'std-12', orderNumber: 12, fullName: 'Hồ Tuệ Quỳnh', birthDate: '2009-10-27', gender: 'Nữ', groupId: 'group-4', duty: 'Học sinh', phone: '0924567890', note: 'Trầm tính, vẽ đẹp' },
];

export const initialScoreRules: ScoreRule[] = [
  // Điểm cộng
  { id: 'rule-plus-1', name: 'Đi học chuyên cần cả tuần', type: 'plus', category: 'chuyen_can', points: 10, color: 'emerald', allowOfficer: true, isViolation: false, isActive: true },
  { id: 'rule-plus-2', name: 'Giơ tay phát biểu tích cực', type: 'plus', category: 'hoc_tap', points: 2, color: 'emerald', allowOfficer: true, isViolation: false, isActive: true },
  { id: 'rule-plus-3', name: 'Trả lời bài tốt / Xuất sắc', type: 'plus', category: 'hoc_tap', points: 5, color: 'emerald', allowOfficer: true, isViolation: false, isActive: true },
  { id: 'rule-plus-4', name: 'Làm việc tốt / Giúp đỡ bạn', type: 'plus', category: 'ren_luyen', points: 5, color: 'emerald', allowOfficer: true, isViolation: false, isActive: true },
  { id: 'rule-plus-5', name: 'Tham gia phong trào thi đua', type: 'plus', category: 'phong_trao', points: 10, color: 'emerald', allowOfficer: true, isViolation: false, isActive: true },
  { id: 'rule-plus-6', name: 'Trực nhật sạch sẽ, đúng giờ', type: 'plus', category: 'ren_luyen', points: 5, color: 'emerald', allowOfficer: true, isViolation: false, isActive: true },
  { id: 'rule-plus-7', name: 'Ban cán sự hoàn thành nhiệm vụ', type: 'plus', category: 'ren_luyen', points: 10, color: 'emerald', allowOfficer: false, isViolation: false, isActive: true },
  
  // Điểm trừ
  { id: 'rule-minus-1', name: 'Vắng học có phép', type: 'minus', category: 'chuyen_can', points: -2, color: 'amber', allowOfficer: true, isViolation: true, isActive: true },
  { id: 'rule-minus-2', name: 'Vắng học không phép', type: 'minus', category: 'chuyen_can', points: -5, color: 'rose', allowOfficer: true, isViolation: true, isActive: true },
  { id: 'rule-minus-3', name: 'Đi học muộn / Vào lớp trễ', type: 'minus', category: 'chuyen_can', points: -2, color: 'rose', allowOfficer: true, isViolation: true, isActive: true },
  { id: 'rule-minus-4', name: 'Ngủ gật trong giờ học', type: 'minus', category: 'ren_luyen', points: -3, color: 'rose', allowOfficer: true, isViolation: true, isActive: true },
  { id: 'rule-minus-5', name: 'Mất trật tự trong giờ', type: 'minus', category: 'ren_luyen', points: -2, color: 'rose', allowOfficer: true, isViolation: true, isActive: true },
  { id: 'rule-minus-6', name: 'Sai đồng phục / Tác phong', type: 'minus', category: 'ren_luyen', points: -3, color: 'rose', allowOfficer: true, isViolation: true, isActive: true },
  { id: 'rule-minus-7', name: 'Không thuộc bài / Chưa học bài', type: 'minus', category: 'hoc_tap', points: -5, color: 'rose', allowOfficer: true, isViolation: true, isActive: true },
  { id: 'rule-minus-8', name: 'Quên sách vở / Tài liệu học', type: 'minus', category: 'hoc_tap', points: -3, color: 'rose', allowOfficer: true, isViolation: true, isActive: true },
  { id: 'rule-minus-9', name: 'Không làm bài tập về nhà', type: 'minus', category: 'hoc_tap', points: -5, color: 'rose', allowOfficer: true, isViolation: true, isActive: true },
  { id: 'rule-minus-10', name: 'Viết bản kiểm điểm', type: 'minus', category: 'ren_luyen', points: -10, color: 'rose', allowOfficer: false, isViolation: true, isActive: true },
];

export const initialTimetable: TimetableSlot[] = [
  // Thứ 2
  { id: 'tt-2-1', dayOfWeek: 2, period: 1, subject: 'Chào cờ', isImportant: true, note: 'Tập trung toàn trường' },
  { id: 'tt-2-2', dayOfWeek: 2, period: 2, subject: 'Toán', homework: 'Bài 1-5 trang 42 SGK' },
  { id: 'tt-2-3', dayOfWeek: 2, period: 3, subject: 'Toán', homework: 'Chuẩn bị bài hình học' },
  { id: 'tt-2-4', dayOfWeek: 2, period: 4, subject: 'Ngữ văn', homework: 'Đọc trước tác phẩm' },
  { id: 'tt-2-5', dayOfWeek: 2, period: 5, subject: 'Tiếng Anh' },
  // Thứ 3
  { id: 'tt-3-1', dayOfWeek: 3, period: 1, subject: 'Vật lý', isImportant: true, note: 'Kiểm tra 15 phút' },
  { id: 'tt-3-2', dayOfWeek: 3, period: 2, subject: 'Hóa học' },
  { id: 'tt-3-3', dayOfWeek: 3, period: 3, subject: 'Sinh học' },
  { id: 'tt-3-4', dayOfWeek: 3, period: 4, subject: 'Lịch sử' },
  { id: 'tt-3-5', dayOfWeek: 3, period: 5, subject: 'Địa lý' },
  // Thứ 4
  { id: 'tt-4-1', dayOfWeek: 4, period: 1, subject: 'Ngữ văn' },
  { id: 'tt-4-2', dayOfWeek: 4, period: 2, subject: 'Ngữ văn' },
  { id: 'tt-4-3', dayOfWeek: 4, period: 3, subject: 'Toán' },
  { id: 'tt-4-4', dayOfWeek: 4, period: 4, subject: 'Tiếng Anh' },
  { id: 'tt-4-5', dayOfWeek: 4, period: 5, subject: 'GDCD' },
  // Thứ 5
  { id: 'tt-5-1', dayOfWeek: 5, period: 1, subject: 'Hóa học', homework: 'Ôn lý thuyết este' },
  { id: 'tt-5-2', dayOfWeek: 5, period: 2, subject: 'Vật lý' },
  { id: 'tt-5-3', dayOfWeek: 5, period: 3, subject: 'Tin học', note: 'Học tại phòng máy 2' },
  { id: 'tt-5-4', dayOfWeek: 5, period: 4, subject: 'Thể dục' },
  { id: 'tt-5-5', dayOfWeek: 5, period: 5, subject: 'Quốc phòng' },
  // Thứ 6
  { id: 'tt-6-1', dayOfWeek: 6, period: 1, subject: 'Toán' },
  { id: 'tt-6-2', dayOfWeek: 6, period: 2, subject: 'Tiếng Anh' },
  { id: 'tt-6-3', dayOfWeek: 6, period: 3, subject: 'Sinh học' },
  { id: 'tt-6-4', dayOfWeek: 6, period: 4, subject: 'Công nghệ' },
  { id: 'tt-6-5', dayOfWeek: 6, period: 5, subject: 'Tự chọn' },
  // Thứ 7
  { id: 'tt-7-1', dayOfWeek: 7, period: 1, subject: 'Ôn tập Toán' },
  { id: 'tt-7-2', dayOfWeek: 7, period: 2, subject: 'Ôn tập Văn' },
  { id: 'tt-7-3', dayOfWeek: 7, period: 3, subject: 'Ôn tập Anh' },
  { id: 'tt-7-4', dayOfWeek: 7, period: 4, subject: 'Sinh hoạt lớp', isImportant: true, note: 'Tổng kết tuần và xếp hạng tổ' },
];

export const initialTransactions: ScoreTransaction[] = [
  {
    id: 'tx-init-1',
    classId: 'class-demo-1',
    studentId: 'std-1',
    date: '2026-09-07',
    weekNumber: 1,
    ruleId: 'rule-plus-1',
    ruleName: 'Đi học chuyên cần cả tuần',
    points: 10,
    type: 'plus',
    category: 'chuyen_can',
    createdBy: 'GVCN',
    createdAt: '2026-09-07T08:00:00Z',
    isViolation: false
  },
  {
    id: 'tx-init-2',
    classId: 'class-demo-1',
    studentId: 'std-2',
    date: '2026-09-07',
    weekNumber: 1,
    ruleId: 'rule-plus-3',
    ruleName: 'Trả lời bài tốt / Xuất sắc',
    points: 5,
    type: 'plus',
    category: 'hoc_tap',
    createdBy: 'Lớp phó học tập',
    createdAt: '2026-09-07T09:30:00Z',
    isViolation: false
  },
  {
    id: 'tx-init-3',
    classId: 'class-demo-1',
    studentId: 'std-3',
    date: '2026-09-08',
    weekNumber: 1,
    ruleId: 'rule-minus-3',
    ruleName: 'Đi học muộn / Vào lớp trễ',
    points: -2,
    type: 'minus',
    category: 'chuyen_can',
    createdBy: 'Lớp phó kỷ luật',
    createdAt: '2026-09-08T07:15:00Z',
    isViolation: true
  },
  {
    id: 'tx-init-4',
    classId: 'class-demo-1',
    studentId: 'std-4',
    date: '2026-09-08',
    weekNumber: 1,
    ruleId: 'rule-plus-2',
    ruleName: 'Giơ tay phát biểu tích cực',
    points: 2,
    type: 'plus',
    category: 'hoc_tap',
    createdBy: 'Lớp phó học tập',
    createdAt: '2026-09-08T10:00:00Z',
    isViolation: false
  },
  {
    id: 'tx-init-5',
    classId: 'class-demo-1',
    studentId: 'std-5',
    date: '2026-09-09',
    weekNumber: 1,
    ruleId: 'rule-plus-4',
    ruleName: 'Làm việc tốt / Giúp đỡ bạn',
    points: 5,
    type: 'plus',
    category: 'ren_luyen',
    createdBy: 'GVCN',
    createdAt: '2026-09-09T11:00:00Z',
    isViolation: false
  }
];

export const initialGroupBonuses: GroupBonus[] = [
  {
    id: 'bonus-1',
    groupId: 'group-2',
    weekNumber: 1,
    points: 15,
    reason: 'Trực nhật xuất sắc tuần',
    createdBy: 'GVCN',
    createdAt: '2026-09-12T10:00:00Z'
  }
];

