import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  AlertTriangle,
  BookOpen,
  Trophy,
  TrendingUp,
  ArrowRight,
  ShieldAlert,
  Award,
  Clock,
  Sparkles
} from 'lucide-react';
import {
  calculateStudentMonthScore,
  calculateGroupMonthScore,
  getStudentConductViolations,
  getStudentStudyRecords,
  calculateStudentWeekScore
} from '../../services/scoreCalculations';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { NavTab } from '../layout/Navbar';

interface OverviewDashboardProps {
  onNavigate: (tab: NavTab) => void;
  onOpenQuickGrading: () => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  onNavigate,
  onOpenQuickGrading
}) => {
  const { db, currentMonth, currentWeek } = useApp();
  const { students, groups, transactions, groupBonuses, classInfo } = db;

  const totalStudents = students.length;
  const maleCount = students.filter((s) => s.gender === 'Nam').length;
  const femaleCount = students.filter((s) => s.gender === 'Nữ').length;

  // Tính tổng lỗi vi phạm và học tập trong tháng
  let totalConductViolations = 0;
  let totalStudyIssues = 0;

  students.forEach((s) => {
    totalConductViolations += getStudentConductViolations(s.id, currentMonth, transactions).totalCount;
    totalStudyIssues += getStudentStudyRecords(s.id, currentMonth, transactions).totalCount;
  });

  // Điểm và xếp hạng thi đua từng tổ trong tháng
  const groupScores = groups.map((g) => {
    const score = calculateGroupMonthScore(g.id, currentMonth, students, transactions, groupBonuses);
    const memberCount = students.filter((s) => s.groupId === g.id).length;
    return {
      group: g,
      personalTotal: score.personalTotal,
      bonusTotal: score.bonusTotal,
      total: score.total,
      memberCount
    };
  });

  // Sắp xếp theo tổng điểm giảm dần
  groupScores.sort((a, b) => b.total - a.total);
  const leadingGroup = groupScores[0];

  // Tiến độ nhập điểm của tuần hiện tại
  const studentsWithGradeInWeek = students.filter((s) => {
    const weekScore = calculateStudentWeekScore(s.id, currentWeek, transactions);
    return weekScore.count > 0;
  }).length;
  const weeklyProgressPercent = totalStudents > 0 ? Math.round((studentsWithGradeInWeek / totalStudents) * 100) : 0;

  // Danh sách học sinh cảnh báo: Điểm thấp (< 60), nhiều lỗi vi phạm (>= 2 lỗi) hoặc chưa nhập điểm tuần
  const warningStudents = students
    .map((s) => {
      const monthScore = calculateStudentMonthScore(s.id, currentMonth, transactions);
      const violations = getStudentConductViolations(s.id, currentMonth, transactions).totalCount;
      const weekGrade = calculateStudentWeekScore(s.id, currentWeek, transactions);
      const isUnrecorded = weekGrade.count === 0;

      let reason = '';
      if (violations >= 2) reason = `Có ${violations} lỗi vi phạm rèn luyện`;
      else if (monthScore.total < 60 && monthScore.count > 0) reason = `Điểm tháng thấp (${monthScore.total}đ)`;
      else if (isUnrecorded) reason = `Chưa có dữ liệu tuần ${currentWeek}`;

      return {
        student: s,
        monthScore: monthScore.total,
        violations,
        isUnrecorded,
        reason
      };
    })
    .filter((item) => item.reason !== '');

  // Dữ liệu biểu đồ so sánh các tổ
  const chartData = groupScores.map((gs) => ({
    name: gs.group.name,
    'Điểm cá nhân': gs.personalTotal,
    'Điểm thưởng': gs.bonusTotal,
    'Tổng điểm': gs.total
  }));

  return (
    <div className="space-y-6 pb-12">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-2xl p-5 sm:p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-end pr-6">
          <Trophy className="w-48 h-48" />
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-white/20 text-xs px-2.5 py-0.5 rounded-full font-semibold backdrop-blur-xs">
                Tổng quan Tháng {currentMonth}
              </span>
              <span className="text-emerald-100 text-xs">• Tuần học số {currentWeek}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              Lớp {classInfo.name} - {classInfo.school}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-xl">
              Chào mừng {classInfo.teacher}! Hệ thống tự động đồng bộ điểm tuần, xếp hạng thi đua 4 tổ và cảnh báo vi phạm theo thời gian thực.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <button
              onClick={onOpenQuickGrading}
              className="px-4 py-2.5 bg-white text-emerald-800 hover:bg-emerald-50 rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Ghi nhận nhanh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bento Grid: 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Sĩ số */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sĩ số học sinh</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-800">{totalStudents}</span>
            <span className="text-xs text-slate-500">học sinh</span>
          </div>
          <div className="mt-2 flex items-center gap-3 text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>Nam: <strong className="text-slate-700">{maleCount}</strong></span>
            <span>•</span>
            <span>Nữ: <strong className="text-slate-700">{femaleCount}</strong></span>
          </div>
        </div>

        {/* Dẫn đầu thi đua */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tổ dẫn đầu tháng</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-600">{leadingGroup ? leadingGroup.group.name : '---'}</span>
            <span className="text-xs text-slate-500">
              ({leadingGroup ? leadingGroup.total : 0} điểm)
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span>Cá nhân: {leadingGroup ? leadingGroup.personalTotal : 0}đ</span>
            <span>Thưởng: +{leadingGroup ? leadingGroup.bonusTotal : 0}đ</span>
          </div>
        </div>

        {/* Tổng vi phạm */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Vi phạm rèn luyện</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-rose-600">{totalConductViolations}</span>
            <span className="text-xs text-slate-500">lượt tháng này</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>Lỗi học tập: <strong className="text-amber-600">{totalStudyIssues}</strong> lượt</span>
          </div>
        </div>

        {/* Tiến độ nhập tuần */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tiến độ Tuần {currentWeek}</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-teal-600">{weeklyProgressPercent}%</span>
            <span className="text-xs text-slate-500">
              ({studentsWithGradeInWeek}/{totalStudents})
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100">
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-teal-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${weeklyProgressPercent}%` }}
              />
            </div>
          </div>
        </div>

      </div>

      {/* Main Row: Chart & Group Rankings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Biểu đồ thi đua các tổ */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-800">
                Biểu đồ Thi đua Các Tổ (Tháng {currentMonth})
              </h2>
              <p className="text-xs text-slate-500">So sánh điểm cá nhân và điểm thưởng giữa 4 tổ</p>
            </div>
            <button
              onClick={() => onNavigate('group_competition')}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
            >
              <span>Xem chi tiết</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="Điểm cá nhân" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Điểm thưởng" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bảng Xếp hạng thi đua mini */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Bảng Xếp Hạng Tổ</span>
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
              Tháng {currentMonth}
            </span>
          </div>

          <div className="space-y-2.5 flex-1">
            {groupScores.map((item, index) => {
              const rank = index + 1;
              const isFirst = rank === 1;
              const isSecond = rank === 2;
              const isThird = rank === 3;

              return (
                <div
                  key={item.group.id}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    isFirst
                      ? 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-400/20'
                      : isSecond
                      ? 'bg-slate-50 border-slate-200'
                      : isThird
                      ? 'bg-amber-50/30 border-amber-200'
                      : 'bg-white border-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                        isFirst
                          ? 'bg-amber-500 text-white shadow-xs'
                          : isSecond
                          ? 'bg-slate-400 text-white'
                          : isThird
                          ? 'bg-amber-700/80 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {rank}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 text-xs sm:text-sm">{item.group.name}</div>
                      <div className="text-[11px] text-slate-500">{item.memberCount} học sinh</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-black text-sm text-emerald-700">{item.total} đ</div>
                    <div className="text-[10px] text-slate-400">
                      +{item.bonusTotal}đ thưởng
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => onNavigate('group_competition')}
            className="w-full mt-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl transition-colors text-center border border-slate-200"
          >
            Xem bục vinh danh thi đua
          </button>
        </div>

      </div>

      {/* Cảnh báo & Danh sách học sinh cần lưu ý */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm sm:text-base font-bold text-slate-800">
              Danh sách cần lưu ý ({warningStudents.length} học sinh)
            </h2>
          </div>
          <span className="text-xs text-slate-500">Cảnh báo tự động từ dữ liệu nhập</span>
        </div>

        {warningStudents.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            🎉 Không có học sinh nào bị cảnh báo trong tháng này. Cả lớp duy trì nề nếp rất tốt!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {warningStudents.map((item) => (
              <div
                key={item.student.id}
                className="p-3 rounded-xl border border-amber-200 bg-amber-50/50 flex items-start justify-between gap-2"
              >
                <div>
                  <div className="font-bold text-slate-800 text-xs sm:text-sm">{item.student.fullName}</div>
                  <div className="text-[11px] text-slate-500">
                    STT {item.student.orderNumber} • {groups.find((g) => g.id === item.student.groupId)?.name}
                  </div>
                  <div className="text-xs font-medium text-amber-800 mt-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <span>{item.reason}</span>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('weekly_grading')}
                  className="shrink-0 text-xs px-2 py-1 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg font-medium transition-colors"
                >
                  Xử lý
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

