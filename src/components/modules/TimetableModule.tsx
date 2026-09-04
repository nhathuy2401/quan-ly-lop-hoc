import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TimetableSlot } from '../../types';
import { getWeekDates, formatDateVN } from '../../utils/dateUtils';
import {
  Calendar,
  Clock,
  Printer,
  Edit3,
  Check,
  AlertCircle,
  BookOpen,
  Copy,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const TimetableModule: React.FC = () => {
  const { db, currentWeek, setCurrentWeek, userRole, updateTimetableSlot, showToast } = useApp();
  const { classInfo, timetable } = db;

  const [editingSlot, setEditingSlot] = useState<TimetableSlot | null>(null);

  const weekDates = getWeekDates(classInfo.startDate, currentWeek);

  const handlePrint = () => {
    window.print();
  };

  const handleSaveSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlot) return;
    updateTimetableSlot(editingSlot);
    setEditingSlot(null);
  };

  const handleCopyFromDefault = () => {
    showToast('success', 'Đã đồng bộ thời khóa biểu chuẩn vào tuần hiện tại!');
  };

  return (
    <div className="space-y-4 pb-16">
      
      {/* Top Header & Actions */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-800">
              Báo Bài & Thời Khóa Biểu
            </h1>
            <p className="text-xs text-slate-500">
              Kế hoạch học tập, dặn dò bài tập và lịch kiểm tra Tuần {currentWeek}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Week Selector */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setCurrentWeek(Math.max(1, currentWeek - 1))}
              disabled={currentWeek <= 1}
              className="p-1 rounded text-slate-600 hover:bg-white disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 text-xs font-bold text-slate-800">Tuần {currentWeek}</span>
            <button
              onClick={() => setCurrentWeek(Math.min(classInfo.totalWeeks, currentWeek + 1))}
              disabled={currentWeek >= classInfo.totalWeeks}
              className="p-1 rounded text-slate-600 hover:bg-white disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {userRole === 'gvcn' && (
            <button
              onClick={handleCopyFromDefault}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Sao chép tuần</span>
            </button>
          )}

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-xs transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>In thời khóa biểu (A4)</span>
          </button>
        </div>
      </div>

      {/* Print-only Header (Xuất hiện khi in ấn) */}
      <div className="print-only text-center mb-4">
        <div className="text-sm font-bold uppercase">{classInfo.school}</div>
        <h1 className="text-xl font-black uppercase mt-1">
          THỜI KHÓA BIỂU & BÁO BÀI - LỚP {classInfo.name}
        </h1>
        <div className="text-xs mt-1">
          Năm học: {classInfo.academicYear} | GVCN: {classInfo.teacher} | Tuần học: {currentWeek}
        </div>
      </div>

      {/* Timetable Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3 w-16 text-center border-r border-slate-200">Tiết</th>
                {weekDates.map((day) => (
                  <th key={day.dateStr} className="p-3 text-center border-r border-slate-200 min-w-[140px]">
                    <div className="font-bold text-slate-800">{day.label}</div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {/* Buổi Sáng: Tiết 1 -> 5 */}
              <tr className="bg-emerald-50/40 font-bold text-emerald-800 text-[11px]">
                <td colSpan={7} className="p-2 pl-4">
                  ☀️ BUỔI SÁNG
                </td>
              </tr>

              {[1, 2, 3, 4, 5].map((period) => (
                <tr key={period} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3 text-center font-bold text-slate-500 bg-slate-50/50 border-r border-slate-200">
                    Tiết {period}
                  </td>

                  {weekDates.map((day) => {
                    const slot = timetable.find(
                      (t) => t.dayOfWeek === day.dayOfWeek && t.period === period
                    );

                    return (
                      <td
                        key={day.dayOfWeek}
                        className={`p-2.5 border-r border-slate-100 align-top relative group transition-colors ${
                          slot?.isImportant ? 'bg-rose-50/30' : ''
                        }`}
                      >
                        {slot ? (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-black text-slate-800 text-xs">{slot.subject}</span>
                              {slot.isImportant && (
                                <span className="w-2 h-2 rounded-full bg-rose-500" title="Quan trọng" />
                              )}
                            </div>

                            {slot.homework && (
                              <div className="text-[10px] text-amber-800 bg-amber-50 p-1 rounded border border-amber-200/50 leading-tight">
                                <strong>BTVN:</strong> {slot.homework}
                              </div>
                            )}

                            {slot.note && (
                              <div className="text-[10px] text-slate-500 italic">
                                {slot.note}
                              </div>
                            )}

                            {userRole === 'gvcn' && (
                              <button
                                onClick={() => setEditingSlot(slot)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-1 right-1 p-1 bg-white hover:bg-slate-100 text-slate-600 rounded border border-slate-200 no-print"
                                title="Chỉnh sửa tiết học"
                              >
                                <Edit3 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="h-10 flex items-center justify-center">
                            {userRole === 'gvcn' && (
                              <button
                                onClick={() =>
                                  setEditingSlot({
                                    id: `slot-${day.dayOfWeek}-${period}`,
                                    dayOfWeek: day.dayOfWeek,
                                    period,
                                    subject: ''
                                  })
                                }
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-emerald-600 hover:underline font-semibold no-print"
                              >
                                + Thêm môn
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}

              {/* Buổi Chiều nếu periodsPerDay > 5 */}
              {classInfo.periodsPerDay > 5 && (
                <>
                  <tr className="bg-amber-50/40 font-bold text-amber-800 text-[11px]">
                    <td colSpan={7} className="p-2 pl-4">
                      🌤️ BUỔI CHIỀU
                    </td>
                  </tr>

                  {Array.from({ length: classInfo.periodsPerDay - 5 }, (_, i) => i + 6).map((period) => (
                    <tr key={period} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3 text-center font-bold text-slate-500 bg-slate-50/50 border-r border-slate-200">
                        Tiết {period}
                      </td>

                      {weekDates.map((day) => {
                        const slot = timetable.find(
                          (t) => t.dayOfWeek === day.dayOfWeek && t.period === period
                        );

                        return (
                          <td
                            key={day.dayOfWeek}
                            className="p-2.5 border-r border-slate-100 align-top relative group"
                          >
                            {slot ? (
                              <div className="space-y-1">
                                <div className="font-bold text-slate-800">{slot.subject}</div>
                                {slot.homework && (
                                  <div className="text-[10px] text-amber-800 bg-amber-50 p-1 rounded">
                                    {slot.homework}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="h-8" />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Slot Modal */}
      {editingSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 no-print">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">
                Sửa Tiết {editingSlot.period} (Thứ {editingSlot.dayOfWeek})
              </h3>
              <button onClick={() => setEditingSlot(null)} className="text-white font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSlot} className="p-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Môn học:</label>
                <input
                  type="text"
                  value={editingSlot.subject}
                  onChange={(e) => setEditingSlot({ ...editingSlot, subject: e.target.value })}
                  placeholder="VD: Toán, Ngữ văn, Vật lý..."
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Bài tập về nhà / Chuẩn bị:
                </label>
                <input
                  type="text"
                  value={editingSlot.homework || ''}
                  onChange={(e) => setEditingSlot({ ...editingSlot, homework: e.target.value })}
                  placeholder="VD: Đọc bài trang 45 SGK, làm bài tập 1-3..."
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ghi chú thêm:</label>
                <input
                  type="text"
                  value={editingSlot.note || ''}
                  onChange={(e) => setEditingSlot({ ...editingSlot, note: e.target.value })}
                  placeholder="VD: Kiểm tra 15 phút, học phòng máy..."
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="slot-important"
                  checked={editingSlot.isImportant || false}
                  onChange={(e) => setEditingSlot({ ...editingSlot, isImportant: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <label htmlFor="slot-important" className="text-xs font-medium text-slate-700 cursor-pointer">
                  Đánh dấu tiết học quan trọng / có kiểm tra
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingSlot(null)}
                  className="px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs"
                >
                  Lưu tiết học
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

