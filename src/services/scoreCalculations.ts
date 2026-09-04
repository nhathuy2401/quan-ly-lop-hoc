import { ScoreTransaction, GroupBonus, Student, EvaluationRating, ScoreRule } from '../types';
import { getMonthOfDate } from '../utils/dateUtils';

/**
 * Tính điểm trong 1 ngày cụ thể của 1 học sinh
 */
export function calculateStudentDayScore(
  studentId: string,
  dateStr: string,
  transactions: ScoreTransaction[]
): { plus: number; minus: number; total: number; transactions: ScoreTransaction[] } {
  const dayTxs = transactions.filter(t => t.studentId === studentId && t.date === dateStr);
  let plus = 0;
  let minus = 0;

  for (const t of dayTxs) {
    if (t.points > 0) {
      plus += t.points;
    } else {
      minus += t.points; // âm
    }
  }

  return {
    plus,
    minus,
    total: plus + minus,
    transactions: dayTxs
  };
}

/**
 * Tính điểm của học sinh trong 1 tuần cụ thể
 */
export function calculateStudentWeekScore(
  studentId: string,
  weekNumber: number,
  transactions: ScoreTransaction[]
): { plus: number; minus: number; total: number; count: number } {
  const weekTxs = transactions.filter(t => t.studentId === studentId && t.weekNumber === weekNumber);
  let plus = 0;
  let minus = 0;

  for (const t of weekTxs) {
    if (t.points > 0) {
      plus += t.points;
    } else {
      minus += t.points;
    }
  }

  return {
    plus,
    minus,
    total: plus + minus,
    count: weekTxs.length
  };
}

/**
 * Tính tổng điểm của học sinh trong 1 tháng cụ thể
 */
export function calculateStudentMonthScore(
  studentId: string,
  month: number,
  transactions: ScoreTransaction[]
): { plus: number; minus: number; total: number; count: number } {
  const monthTxs = transactions.filter(t => {
    return t.studentId === studentId && getMonthOfDate(t.date) === month;
  });

  let plus = 0;
  let minus = 0;

  for (const t of monthTxs) {
    if (t.points > 0) {
      plus += t.points;
    } else {
      minus += t.points;
    }
  }

  return {
    plus,
    minus,
    total: plus + minus,
    count: monthTxs.length
  };
}

/**
 * Tính điểm thi đua của một tổ trong tuần:
 * Điểm tổ = Tổng điểm cá nhân các thành viên trong tổ + Điểm thưởng tổ trong tuần
 */
export function calculateGroupWeekScore(
  groupId: string,
  weekNumber: number,
  students: Student[],
  transactions: ScoreTransaction[],
  groupBonuses: GroupBonus[]
): { personalTotal: number; bonusTotal: number; total: number } {
  const groupStudents = students.filter(s => s.groupId === groupId);
  let personalTotal = 0;

  for (const student of groupStudents) {
    const weekScore = calculateStudentWeekScore(student.id, weekNumber, transactions);
    personalTotal += weekScore.total;
  }

  const bonusTxs = groupBonuses.filter(b => b.groupId === groupId && b.weekNumber === weekNumber);
  const bonusTotal = bonusTxs.reduce((sum, b) => sum + b.points, 0);

  return {
    personalTotal,
    bonusTotal,
    total: personalTotal + bonusTotal
  };
}

/**
 * Tính điểm thi đua của một tổ trong tháng
 */
export function calculateGroupMonthScore(
  groupId: string,
  month: number,
  students: Student[],
  transactions: ScoreTransaction[],
  groupBonuses: GroupBonus[]
): { personalTotal: number; bonusTotal: number; total: number } {
  const groupStudents = students.filter(s => s.groupId === groupId);
  let personalTotal = 0;

  for (const student of groupStudents) {
    const monthScore = calculateStudentMonthScore(student.id, month, transactions);
    personalTotal += monthScore.total;
  }

  // Bonus của các tuần trong tháng
  // Để đơn giản và chính xác, lấy các bonus có createdAt hoặc lọc theo ngày
  const bonusTxs = groupBonuses.filter(b => {
    if (b.groupId !== groupId) return false;
    // Kiểm tra tháng dựa trên ngày tạo bonus
    const bMonth = getMonthOfDate(b.createdAt.slice(0, 10));
    return bMonth === month;
  });
  const bonusTotal = bonusTxs.reduce((sum, b) => sum + b.points, 0);

  return {
    personalTotal,
    bonusTotal,
    total: personalTotal + bonusTotal
  };
}

/**
 * Đánh giá xếp loại rèn luyện
 */
export function evaluateRating(
  score: number,
  hasData: boolean,
  thresholds: { good: number; fair: number; pass: number }
): EvaluationRating {
  if (!hasData) return 'Chưa đủ dữ liệu';
  if (score >= thresholds.good) return 'Tốt';
  if (score >= thresholds.fair) return 'Khá';
  if (score >= thresholds.pass) return 'Đạt';
  return 'Chưa đạt';
}

/**
 * Thống kê vi phạm rèn luyện theo học sinh trong tháng
 */
export function getStudentConductViolations(
  studentId: string,
  month: number,
  transactions: ScoreTransaction[]
): { totalCount: number; list: ScoreTransaction[] } {
  const list = transactions.filter(t => {
    return t.studentId === studentId &&
      getMonthOfDate(t.date) === month &&
      t.isViolation === true &&
      (t.category === 'ren_luyen' || t.category === 'chuyen_can');
  });

  return {
    totalCount: list.length,
    list
  };
}

/**
 * Thống kê lỗi học tập theo học sinh trong tuần/tháng
 */
export function getStudentStudyRecords(
  studentId: string,
  month: number,
  transactions: ScoreTransaction[]
): { totalCount: number; list: ScoreTransaction[] } {
  const list = transactions.filter(t => {
    return t.studentId === studentId &&
      getMonthOfDate(t.date) === month &&
      t.isViolation === true &&
      t.category === 'hoc_tap';
  });

  return {
    totalCount: list.length,
    list
  };
}

