import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, AlertTriangle, Plus, Minus, Filter, Search, User } from 'lucide-react';
import { getStudentConductViolations } from '../../services/scoreCalculations';
import { formatDateISO } from '../../utils/dateUtils';

export const ConductViolations: React.FC = () => {
  const { db, currentMonth, currentWeek, userRole, recordScore, deleteTransaction, isDayLocked } = useApp();
  const { students, groups, scoreRules, transactions } = db;

  const [selectedGroupId, setSelectedGroupId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Lọc các quy tắc thuộc nhóm vi phạm rèn luyện hoặc chuyên cần có tính là vi phạm
  const conductRules = scoreRules.filter(
    (r) => r.isViolation && (r.category === 'ren_luyen' || r.category === 'chuyen_can') && r.isActive
  );

  const filteredStudents = students.filter((s) => {
    if (selectedGroupId !== 'all' && s.groupId !== selectedGroupId) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return s.fullName.toLowerCase().includes(q) || s.orderNumber.toString().includes(q);
    }
    return true;
  });

  const todayStr = formatDateISO(new Date());

  // Xử lý tăng số lần vi phạm (Tạo transaction điểm trừ)
  const handleAddViolation = (studentId: string, ruleId: string) => {
    recordScore(studentId, ruleId, todayStr, currentWeek, 'Ghi nhận từ phân hệ Vi phạm rèn luyện');
  };

  // Xử lý giảm số lần vi phạm (Xóa transaction gần nhất của quy tắc này)
  const handleRemoveViolation = (studentId: string, ruleId: string) => {
    const recentTx = transactions.find(
      (t) => t.studentId === studentId && t.ruleId === ruleId
    );
    if (recentTx) {
      deleteTransaction(recentTx.id);
    }
  };

  return (
    <div className="space-y-4 pb-16">
      
      {/* Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-800">
              Vi Phạm Rèn Luyện & Kỷ Luật
            </h1>
            <p className="text-xs text-slate-500">
              Ghi nhận đồng bộ trực tiếp vào điểm tuần và bảng xếp hạng tổ (Tháng {currentMonth})
            </p>
          </div>
        </div>

        {/* Filter Group */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedGroupId}
            onChange={(e) => setSelectedGroupId(e.target.value)}
            className="text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700"
          >
            <option value="all">Tất cả các tổ</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards of common violations */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {conductRules.slice(0, 6).map((rule) => {
          const count = transactions.filter(
            (t) => t.ruleId === rule.id && new Date(t.date).getMonth() + 1 === currentMonth
          ).length;

          return (
            <div
              key={rule.id}
              className="bg-white p-3 rounded-xl border border-slate-200 text-center shadow-2xs"
            >
              <span className="text-[11px] font-medium text-slate-500 line-clamp-1 block">
                {rule.name}
              </span>
              <div className="mt-1 flex items-baseline justify-center gap-1">
                <span className="text-xl font-black text-rose-600">{count}</span>
                <span className="text-[10px] text-slate-400">lượt</span>
              </div>
              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded mt-1 inline-block">
                {rule.points}đ
              </span>
            </div>
          );
        })}
      </div>

      {/* Students Table with Quick +/- Buttons */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3 w-12 text-center">STT</th>
                <th className="p-3 min-w-[160px]">Họ và tên</th>
                <th className="p-3 w-20 text-center">Tổ</th>
                <th className="p-3 w-24 text-center">Tổng Lỗi Tháng</th>
                <th className="p-3 min-w-[360px]">Ghi nhận nhanh vi phạm (Tạo transaction)</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((student) => {
                const group = groups.find((g) => g.id === student.groupId);
                const violations = getStudentConductViolations(student.id, currentMonth, transactions);

                return (
                  <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 text-center font-medium text-slate-500">
                      {student.orderNumber}
                    </td>

                    <td className="p-3 font-bold text-slate-800">
                      {student.fullName}
                    </td>

                    <td className="p-3 text-center text-slate-600">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium text-[11px]">
                        {group?.name}
                      </span>
                    </td>

                    <td className="p-3 text-center">
                      <span
                        className={`font-black text-sm px-2 py-0.5 rounded-md ${
                          violations.totalCount > 0
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        {violations.totalCount} lỗi
                      </span>
                    </td>

                    {/* Quick +/- Action Buttons for Each Rule */}
                    <td className="p-3">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {conductRules.map((rule) => {
                          // Đếm số lần học sinh vi phạm lỗi này trong tháng
                          const ruleCount = violations.list.filter((t) => t.ruleId === rule.id).length;

                          return (
                            <div
                              key={rule.id}
                              className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-[11px] ${
                                ruleCount > 0
                                  ? 'bg-rose-50 border-rose-200 text-rose-900 font-semibold'
                                  : 'bg-slate-50 border-slate-200 text-slate-600'
                              }`}
                            >
                              <span className="truncate max-w-[120px]">{rule.name}</span>
                              {ruleCount > 0 && (
                                <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white font-black text-[10px]">
                                  {ruleCount}
                                </span>
                              )}

                              <div className="flex items-center ml-1 border-l border-slate-300 pl-1">
                                <button
                                  type="button"
                                  onClick={() => handleAddViolation(student.id, rule.id)}
                                  className="p-0.5 hover:bg-rose-200 text-rose-700 rounded"
                                  title={`Thêm 1 lần ${rule.name} (${rule.points}đ)`}
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                                {ruleCount > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveViolation(student.id, rule.id)}
                                    className="p-0.5 hover:bg-slate-200 text-slate-600 rounded ml-0.5"
                                    title="Giảm 1 lần (Xóa giao dịch gần nhất)"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

