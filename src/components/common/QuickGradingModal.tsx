import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Student, ScoreRule } from '../../types';
import { X, Check, Award, AlertTriangle, Users, Calendar, PlusCircle, MinusCircle } from 'lucide-react';

interface QuickGradingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStudent?: Student | null;
  targetDate: string;
  weekNumber: number;
}

export const QuickGradingModal: React.FC<QuickGradingModalProps> = ({
  isOpen,
  onClose,
  selectedStudent,
  targetDate,
  weekNumber,
}) => {
  const { db, userRole, recordScore, batchRecordScore, isDayLocked } = useApp();
  const { scoreRules, students, groups } = db;

  // State
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>(
    selectedStudent ? [selectedStudent.id] : []
  );
  const [isBatchMode, setIsBatchMode] = useState<boolean>(!selectedStudent);
  const [activeCategory, setActiveCategory] = useState<'all' | 'plus' | 'minus'>('all');
  const [selectedRuleId, setSelectedRuleId] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [filterGroup, setFilterGroup] = useState<string>('all');

  // Reset when open or student changes
  React.useEffect(() => {
    if (selectedStudent) {
      setSelectedStudentIds([selectedStudent.id]);
      setIsBatchMode(false);
    } else {
      setSelectedStudentIds([]);
      setIsBatchMode(true);
    }
    setSelectedRuleId('');
    setNote('');
  }, [selectedStudent, isOpen]);

  if (!isOpen) return null;

  const isLocked = isDayLocked(weekNumber, targetDate);

  // Lọc quy tắc được phép dùng cho ban cán sự
  const availableRules = scoreRules.filter((r) => {
    if (!r.isActive) return false;
    if (userRole === 'bancansu' && !r.allowOfficer) return false;
    if (activeCategory === 'plus') return r.type === 'plus';
    if (activeCategory === 'minus') return r.type === 'minus';
    return true;
  });

  const selectedRule = scoreRules.find((r) => r.id === selectedRuleId);

  const filteredStudents = students.filter((s) => {
    if (filterGroup === 'all') return true;
    return s.groupId === filterGroup;
  });

  const handleToggleStudent = (id: string) => {
    if (selectedStudentIds.includes(id)) {
      setSelectedStudentIds(selectedStudentIds.filter((sId) => sId !== id));
    } else {
      setSelectedStudentIds([...selectedStudentIds, id]);
    }
  };

  const handleSelectAllInGroup = () => {
    const ids = filteredStudents.map((s) => s.id);
    const allSelected = ids.every((id) => selectedStudentIds.includes(id));
    if (allSelected) {
      setSelectedStudentIds(selectedStudentIds.filter((id) => !ids.includes(id)));
    } else {
      const merged = Array.from(new Set([...selectedStudentIds, ...ids]));
      setSelectedStudentIds(merged);
    }
  };

  const handleSubmit = (ruleIdToSubmit?: string) => {
    const finalRuleId = ruleIdToSubmit || selectedRuleId;
    if (!finalRuleId) return;

    if (selectedStudentIds.length === 0) {
      return;
    }

    if (selectedStudentIds.length === 1) {
      const success = recordScore(selectedStudentIds[0], finalRuleId, targetDate, weekNumber, note);
      if (success) onClose();
    } else {
      const success = batchRecordScore(selectedStudentIds, finalRuleId, targetDate, weekNumber, note);
      if (success) onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/50 backdrop-blur-xs p-0 sm:p-4 no-print animate-fadeIn">
      <div className="bg-white w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Header Modal / Bottom Sheet Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white shrink-0">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-200" />
            <div>
              <h3 className="font-bold text-sm sm:text-base">Ghi nhận điểm thi đua & Vi phạm</h3>
              <p className="text-xs text-emerald-100 flex items-center gap-1.5">
                <Calendar className="w-3 h-3" />
                <span>Ngày: {targetDate} • Tuần {weekNumber}</span>
                {isLocked && <span className="bg-rose-500 text-white px-1.5 py-0.2 rounded font-bold">ĐÃ KHÓA</span>}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          
          {/* Target Students Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>Học sinh được ghi nhận ({selectedStudentIds.length})</span>
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsBatchMode(!isBatchMode)}
                  className="text-xs text-emerald-700 font-semibold hover:underline"
                >
                  {isBatchMode ? 'Chỉ chọn 1 bạn' : 'Chọn nhiều bạn (Hàng loạt)'}
                </button>
              </div>
            </div>

            {/* If Single student mode & already selected */}
            {!isBatchMode && selectedStudent ? (
              <div className="flex items-center justify-between p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
                <div>
                  <span className="font-bold text-slate-800 text-sm">{selectedStudent.fullName}</span>
                  <span className="text-slate-500 ml-2">
                    (STT: {selectedStudent.orderNumber} • {groups.find((g) => g.id === selectedStudent.groupId)?.name} • {selectedStudent.duty})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsBatchMode(true)}
                  className="text-xs px-2 py-1 rounded bg-white text-emerald-700 border border-emerald-300 font-medium"
                >
                  Đổi
                </button>
              </div>
            ) : (
              /* Batch or Search Selection */
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <select
                    value={filterGroup}
                    onChange={(e) => setFilterGroup(e.target.value)}
                    className="text-xs px-2.5 py-1.5 bg-slate-100 rounded-lg border border-slate-200 font-medium text-slate-700"
                  >
                    <option value="all">Tất cả các tổ</option>
                    {groups.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={handleSelectAllInGroup}
                    className="text-xs px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium border border-slate-200"
                  >
                    Chọn / Bỏ chọn cả tổ
                  </button>
                </div>

                <div className="max-h-36 overflow-y-auto border border-slate-200 rounded-xl p-2 grid grid-cols-2 sm:grid-cols-3 gap-1.5 bg-slate-50">
                  {filteredStudents.map((student) => {
                    const isSelected = selectedStudentIds.includes(student.id);
                    return (
                      <button
                        key={student.id}
                        type="button"
                        onClick={() => {
                          if (!isBatchMode) {
                            setSelectedStudentIds([student.id]);
                          } else {
                            handleToggleStudent(student.id);
                          }
                        }}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all text-left ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300'
                        }`}
                      >
                        <span className="truncate">{student.fullName}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Quick Action Chips & Rule Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Chọn sự kiện quy định (Quick Chips 1-chạm)
              </label>
              
              {/* Category Filter */}
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveCategory('all')}
                  className={`text-[11px] px-2 py-0.5 rounded-md font-medium transition-all ${
                    activeCategory === 'all' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-600'
                  }`}
                >
                  Tất cả
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCategory('plus')}
                  className={`text-[11px] px-2 py-0.5 rounded-md font-medium flex items-center gap-0.5 transition-all ${
                    activeCategory === 'plus' ? 'bg-emerald-600 text-white font-bold' : 'text-emerald-700'
                  }`}
                >
                  <PlusCircle className="w-3 h-3" />
                  <span>Điểm cộng</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCategory('minus')}
                  className={`text-[11px] px-2 py-0.5 rounded-md font-medium flex items-center gap-0.5 transition-all ${
                    activeCategory === 'minus' ? 'bg-rose-600 text-white font-bold' : 'text-rose-700'
                  }`}
                >
                  <MinusCircle className="w-3 h-3" />
                  <span>Điểm trừ</span>
                </button>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-52 overflow-y-auto p-1">
              {availableRules.map((rule) => {
                const isSelected = selectedRuleId === rule.id;
                const isPlus = rule.type === 'plus';

                return (
                  <button
                    key={rule.id}
                    type="button"
                    onClick={() => {
                      setSelectedRuleId(rule.id);
                      // Nếu chọn 1 bạn và click đúp hoặc muốn nhanh, có thể chọn và ấn gửi
                    }}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium transition-all ${
                      isSelected
                        ? isPlus
                          ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-500/20 text-emerald-900'
                          : 'bg-rose-50 border-rose-600 ring-2 ring-rose-500/20 text-rose-900'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          isPlus ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                      />
                      <span className="truncate">{rule.name}</span>
                    </div>

                    <span
                      className={`font-bold px-2 py-0.5 rounded-md shrink-0 ml-2 ${
                        isPlus
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isPlus ? `+${rule.points}` : rule.points} đ
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Note */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Ghi chú thêm (Tùy chọn):
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="VD: Phát biểu bài thơ Tây Tiến, trực nhật muộn 10p..."
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500">
            {selectedStudentIds.length === 0 ? (
              <span className="text-rose-500">Chưa chọn học sinh</span>
            ) : !selectedRuleId ? (
              <span className="text-amber-600">Vui lòng chọn 1 sự kiện</span>
            ) : (
              <span>
                Đang chọn: <strong>{selectedStudentIds.length}</strong> học sinh •{' '}
                <strong className={selectedRule?.type === 'plus' ? 'text-emerald-700' : 'text-rose-700'}>
                  {selectedRule?.type === 'plus' ? '+' : ''}{selectedRule?.points} đ
                </strong>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-200 transition-colors"
            >
              Hủy
            </button>
            <button
              type="button"
              disabled={selectedStudentIds.length === 0 || !selectedRuleId || isLocked}
              onClick={() => handleSubmit()}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white shadow-sm shadow-emerald-600/30 transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Ghi nhận ngay</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

