import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BookOpen, Plus, Minus, Filter, Search, CheckCircle2 } from 'lucide-react';
import { getStudentStudyRecords } from '../../services/scoreCalculations';
import { formatDateISO } from '../../utils/dateUtils';

export const StudyRecords: React.FC = () => {
  const { db, currentMonth, currentWeek, recordScore, deleteTransaction } = useApp();
  const { students, groups, scoreRules, transactions } = db;

  const [selectedGroupId, setSelectedGroupId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Lọc quy tắc học tập có tính vi phạm
  const studyRules = scoreRules.filter(
    (r) => r.isViolation && r.category === 'hoc_tap' && r.isActive
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

  const handleAddIssue = (studentId: string, ruleId: string) => {
    recordScore(studentId, ruleId, todayStr, currentWeek, 'Ghi nhận từ Theo dõi học tập');
  };

  const handleRemoveIssue = (studentId: string, ruleId: string) => {
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
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-800">
              Theo Dõi Nề Nếp Học Tập
            </h1>
            <p className="text-xs text-slate-500">
              Kiểm tra chuẩn bị bài, sách vở, bài tập về nhà trong tuần {currentWeek} (Tháng {currentMonth})
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

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3 w-12 text-center">STT</th>
                <th className="p-3 min-w-[160px]">Họ và tên</th>
                <th className="p-3 w-20 text-center">Tổ</th>
                <th className="p-3 w-24 text-center">Lỗi Học Tập</th>
                <th className="p-3 min-w-[360px]">Ghi nhận nề nếp học tập (Đồng bộ nguyên tử)</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((student) => {
                const group = groups.find((g) => g.id === student.groupId);
                const issues = getStudentStudyRecords(student.id, currentMonth, transactions);

                return (
                  <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 text-center font-medium text-slate-500">
                      {student.orderNumber}
                    </td>

                    <td className="p-3 font-bold text-slate-800">
                      {student.fullName}
                    </td>

                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium text-[11px]">
                        {group?.name}
                      </span>
                    </td>

                    <td className="p-3 text-center">
                      <span
                        className={`font-black text-sm px-2 py-0.5 rounded-md ${
                          issues.totalCount > 0
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        {issues.totalCount} lỗi
                      </span>
                    </td>

                    <td className="p-3">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {studyRules.map((rule) => {
                          const ruleCount = issues.list.filter((t) => t.ruleId === rule.id).length;

                          return (
                            <div
                              key={rule.id}
                              className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-[11px] ${
                                ruleCount > 0
                                  ? 'bg-amber-50 border-amber-200 text-amber-900 font-semibold'
                                  : 'bg-slate-50 border-slate-200 text-slate-600'
                              }`}
                            >
                              <span className="truncate max-w-[130px]">{rule.name}</span>
                              {ruleCount > 0 && (
                                <span className="px-1.5 py-0.2 rounded-full bg-amber-600 text-white font-black text-[10px]">
                                  {ruleCount}
                                </span>
                              )}

                              <div className="flex items-center ml-1 border-l border-slate-300 pl-1">
                                <button
                                  type="button"
                                  onClick={() => handleAddIssue(student.id, rule.id)}
                                  className="p-0.5 hover:bg-amber-200 text-amber-800 rounded"
                                  title={`Ghi nhận 1 lần ${rule.name} (${rule.points}đ)`}
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                                {ruleCount > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveIssue(student.id, rule.id)}
                                    className="p-0.5 hover:bg-slate-200 text-slate-600 rounded ml-0.5"
                                    title="Giảm 1 lần"
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

