import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import { getWeekDates, formatDateVN } from '../../utils/dateUtils';
import {
  calculateStudentDayScore,
  calculateStudentWeekScore,
  evaluateRating
} from '../../services/scoreCalculations';
import {
  Calendar,
  Lock,
  Unlock,
  Plus,
  History,
  CheckCheck,
  Search,
  Users,
  Filter,
  Trash2,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { QuickGradingModal } from '../common/QuickGradingModal';

export const WeeklyGrading: React.FC = () => {
  const {
    db,
    currentWeek,
    setCurrentWeek,
    userRole,
    lockDay,
    unlockDay,
    lockWeek,
    unlockWeek,
    isDayLocked,
    isWeekLocked,
    deleteTransaction,
    batchRecordScore,
    showToast
  } = useApp();

  const { classInfo, students, groups, scoreRules, transactions } = db;

  // Filter state
  const [selectedGroupId, setSelectedGroupId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);

  // Quick grading modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalStudent, setModalStudent] = useState<Student | null>(null);
  const [modalDate, setModalDate] = useState<string>('');

  // 6 ngày trong tuần (Thứ 2 -> Thứ 7)
  const weekDates = getWeekDates(classInfo.startDate, currentWeek);
  const weekStartDate = weekDates[0]?.dateStr;
  const weekEndDate = weekDates[weekDates.length - 1]?.dateStr;

  const weekLocked = isWeekLocked(currentWeek);

  // Lọc danh sách học sinh
  const filteredStudents = students.filter((s) => {
    if (selectedGroupId !== 'all' && s.groupId !== selectedGroupId) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = s.fullName.toLowerCase().includes(q);
      const matchOrder = s.orderNumber.toString().includes(q);
      return matchName || matchOrder;
    }
    return true;
  });

  const handleOpenGrading = (student: Student, dateStr: string) => {
    setModalStudent(student);
    setModalDate(dateStr);
    setIsModalOpen(true);
  };

  const handleOpenBatchGrading = (dateStr: string) => {
    setModalStudent(null);
    setModalDate(dateStr);
    setIsModalOpen(true);
  };

  // Cộng điểm chuyên cần hàng loạt
  const handleBatchAttendance = (dateStr: string) => {
    const ruleAttendance = scoreRules.find(
      (r) => r.category === 'chuyen_can' && r.points > 0 && r.isActive
    );
    if (!ruleAttendance) {
      showToast('error', 'Không tìm thấy quy định điểm chuyên cần đang áp dụng');
      return;
    }

    const studentIds = filteredStudents.map((s) => s.id);
    batchRecordScore(studentIds, ruleAttendance.id, dateStr, currentWeek, 'Chuyên cần ngày');
  };

  return (
    <div className="space-y-4 pb-16">
      
      {/* Top Controls Bar: Week Selector, Date Range & Lock All */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Week Selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setCurrentWeek(Math.max(1, currentWeek - 1))}
              disabled={currentWeek <= 1}
              className="p-1.5 rounded-lg text-slate-600 hover:bg-white hover:shadow-xs disabled:opacity-40 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 text-xs sm:text-sm font-bold text-slate-800 whitespace-nowrap">
              Tuần {currentWeek} / {classInfo.totalWeeks}
            </span>

            <button
              onClick={() => setCurrentWeek(Math.min(classInfo.totalWeeks, currentWeek + 1))}
              disabled={currentWeek >= classInfo.totalWeeks}
              className="p-1.5 rounded-lg text-slate-600 hover:bg-white hover:shadow-xs disabled:opacity-40 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="text-xs text-slate-500">
            <span>Từ: <strong>{formatDateVN(weekStartDate)}</strong></span>
            <span className="mx-1.5">-</span>
            <span>Đến: <strong>{formatDateVN(weekEndDate)}</strong></span>
          </div>
        </div>

        {/* Lock Controls & History Button */}
        <div className="flex items-center gap-2 flex-wrap">
          {userRole === 'gvcn' && (
            <button
              onClick={() => {
                if (weekLocked) {
                  unlockWeek(currentWeek);
                } else {
                  lockWeek(currentWeek);
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                weekLocked
                  ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {weekLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
              <span>{weekLocked ? 'Mở khóa toàn bộ tuần' : 'Khóa toàn bộ tuần'}</span>
            </button>
          )}

          {weekLocked && (
            <span className="text-xs px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 font-bold border border-rose-200 flex items-center gap-1">
              <Lock className="w-3 h-3" />
              <span>Tuần đã khóa</span>
            </span>
          )}

          <button
            onClick={() => setShowHistoryModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <History className="w-3.5 h-3.5 text-slate-500" />
            <span>Xem lịch sử giao dịch</span>
          </button>
        </div>

      </div>

      {/* Filter Bar: Tổ & Tìm kiếm học sinh */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <div className="flex items-center gap-1.5 overflow-x-auto w-full py-1">
            <button
              onClick={() => setSelectedGroupId('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedGroupId === 'all'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tất cả lớp ({students.length})
            </button>
            {groups.map((g) => {
              const count = students.filter((s) => s.groupId === g.id).length;
              return (
                <button
                  key={g.id}
                  onClick={() => setSelectedGroupId(g.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    selectedGroupId === g.id
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {g.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm tên hoặc STT học sinh..."
            className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
          />
        </div>
      </div>

      {/* Main Sticky Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] relative">
          <table className="w-full text-left text-xs border-collapse">
            
            {/* Table Header */}
            <thead className="bg-slate-50 text-slate-600 sticky top-0 z-20 shadow-xs font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3 w-12 text-center sticky left-0 z-30 bg-slate-50 border-r border-slate-200">
                  STT
                </th>
                <th className="p-3 min-w-[160px] sticky left-12 z-30 bg-slate-50 border-r border-slate-200">
                  Họ và tên
                </th>

                {/* 6 Ngày (Thứ 2 -> Thứ 7) */}
                {weekDates.map((day) => {
                  const dayLocked = isDayLocked(currentWeek, day.dateStr);

                  return (
                    <th key={day.dateStr} className="p-2.5 min-w-[140px] text-center border-r border-slate-200">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-bold text-slate-800">{day.label}</span>
                        {userRole === 'gvcn' && (
                          <button
                            onClick={() => {
                              if (dayLocked) unlockDay(currentWeek, day.dateStr);
                              else lockDay(currentWeek, day.dateStr);
                            }}
                            title={dayLocked ? 'Mở khóa ngày này' : 'Khóa ngày này'}
                            className={`p-1 rounded transition-colors ${
                              dayLocked ? 'text-rose-600 hover:bg-rose-100' : 'text-slate-400 hover:text-slate-700'
                            }`}
                          >
                            {dayLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                          </button>
                        )}
                      </div>

                      {/* Fast Batch Actions for Day */}
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <button
                          onClick={() => handleOpenBatchGrading(day.dateStr)}
                          disabled={dayLocked}
                          title="Ghi nhận hàng loạt cho ngày này"
                          className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-40 text-[10px] font-bold border border-emerald-200"
                        >
                          + Ghi nhận
                        </button>
                        <button
                          onClick={() => handleBatchAttendance(day.dateStr)}
                          disabled={dayLocked}
                          title="Cộng điểm chuyên cần cả lớp"
                          className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 disabled:opacity-40 text-[10px] font-bold border border-blue-200"
                        >
                          + Chuyên cần
                        </button>
                      </div>
                    </th>
                  );
                })}

                <th className="p-3 w-24 text-center font-bold text-emerald-800 bg-emerald-50/50 border-l border-slate-200">
                  Tổng Tuần
                </th>
                <th className="p-3 w-28 text-center font-bold text-slate-700">
                  Xếp Loại
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-8 text-slate-400">
                    Không tìm thấy học sinh nào phù hợp
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const weekScore = calculateStudentWeekScore(student.id, currentWeek, transactions);
                  const groupName = groups.find((g) => g.id === student.groupId)?.name || '';
                  const rating = evaluateRating(weekScore.total, weekScore.count > 0, {
                    good: classInfo.thresholdGood,
                    fair: classInfo.thresholdFair,
                    pass: classInfo.thresholdPass
                  });

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Sticky STT */}
                      <td className="p-3 text-center font-medium text-slate-500 sticky left-0 bg-white border-r border-slate-200 z-10">
                        {student.orderNumber}
                      </td>

                      {/* Sticky Student Name & Info */}
                      <td className="p-3 sticky left-12 bg-white border-r border-slate-200 z-10">
                        <div className="font-bold text-slate-800 hover:text-emerald-700 transition-colors truncate max-w-[150px]">
                          {student.fullName}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                          <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium">
                            {groupName}
                          </span>
                          {student.duty && student.duty !== 'Học sinh' && (
                            <span className="text-emerald-700 font-medium truncate max-w-[80px]">
                              {student.duty}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 6 Ngày điểm */}
                      {weekDates.map((day) => {
                        const dayScore = calculateStudentDayScore(student.id, day.dateStr, transactions);
                        const dayLocked = isDayLocked(currentWeek, day.dateStr);

                        return (
                          <td key={day.dateStr} className="p-2 text-center border-r border-slate-100 align-middle">
                            <div className="flex flex-col items-center justify-center gap-1">
                              {/* Điểm tổng ngày */}
                              {dayScore.transactions.length > 0 ? (
                                <div className="flex items-center gap-1">
                                  {dayScore.plus > 0 && (
                                    <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded text-[11px]">
                                      +{dayScore.plus}
                                    </span>
                                  )}
                                  {dayScore.minus < 0 && (
                                    <span className="text-rose-700 font-bold bg-rose-50 px-1.5 py-0.5 rounded text-[11px]">
                                      {dayScore.minus}
                                    </span>
                                  )}
                                  <span className="font-black text-slate-800 text-xs ml-0.5">
                                    = {dayScore.total}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-slate-300 font-medium text-xs">-</span>
                              )}

                              {/* Action Button: Ghi nhận */}
                              <button
                                onClick={() => handleOpenGrading(student, day.dateStr)}
                                disabled={dayLocked}
                                title={dayLocked ? 'Ngày đã khóa' : 'Ghi nhận cho học sinh này'}
                                className={`text-[10px] px-2 py-0.5 rounded-md font-semibold transition-all ${
                                  dayLocked
                                    ? 'opacity-30 cursor-not-allowed bg-slate-100 text-slate-400'
                                    : 'bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700'
                                }`}
                              >
                                Ghi nhận
                              </button>
                            </div>
                          </td>
                        );
                      })}

                      {/* Tổng tuần */}
                      <td className="p-3 text-center bg-emerald-50/30 border-l border-slate-200">
                        <div className="font-black text-sm text-emerald-800">
                          {weekScore.total} đ
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {weekScore.count} lượt
                        </div>
                      </td>

                      {/* Xếp loại tuần */}
                      <td className="p-3 text-center">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            rating === 'Tốt'
                              ? 'bg-emerald-100 text-emerald-800'
                              : rating === 'Khá'
                              ? 'bg-teal-100 text-teal-800'
                              : rating === 'Đạt'
                              ? 'bg-amber-100 text-amber-800'
                              : rating === 'Chưa đạt'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {rating}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>

          </table>
        </div>
      </div>

      {/* Quick Grading Modal */}
      <QuickGradingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedStudent={modalStudent}
        targetDate={modalDate || weekStartDate}
        weekNumber={currentWeek}
      />

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 no-print">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-800 text-base">
                  Lịch sử giao dịch điểm (Tuần {currentWeek})
                </h3>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1 divide-y divide-slate-100">
              {transactions.filter((t) => t.weekNumber === currentWeek).length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  Chưa có giao dịch điểm nào trong tuần này
                </div>
              ) : (
                transactions
                  .filter((t) => t.weekNumber === currentWeek)
                  .map((tx) => {
                    const student = students.find((s) => s.id === tx.studentId);
                    return (
                      <div key={tx.id} className="py-2.5 flex items-center justify-between gap-3">
                        <div>
                          <div className="font-bold text-slate-800 text-xs sm:text-sm">
                            {student?.fullName} ({tx.ruleName})
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-2">
                            <span>Ngày: {tx.date}</span>
                            <span>•</span>
                            <span>Người nhập: {tx.createdBy}</span>
                            {tx.note && (
                              <>
                                <span>•</span>
                                <span className="italic text-slate-600">"{tx.note}"</span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className={`font-black text-sm ${
                              tx.points > 0 ? 'text-emerald-600' : 'text-rose-600'
                            }`}
                          >
                            {tx.points > 0 ? `+${tx.points}` : tx.points} đ
                          </span>

                          {userRole === 'gvcn' && (
                            <button
                              onClick={() => deleteTransaction(tx.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                              title="Xóa giao dịch này"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

