import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  calculateGroupWeekScore,
  calculateGroupMonthScore,
  calculateStudentWeekScore
} from '../../services/scoreCalculations';
import {
  Trophy,
  Award,
  Sparkles,
  Plus,
  Trash2,
  Users,
  ChevronRight,
  TrendingUp,
  Gift
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const GroupCompetition: React.FC = () => {
  const { db, currentWeek, currentMonth, userRole, addGroupBonus, deleteGroupBonus } = useApp();
  const { groups, students, transactions, groupBonuses } = db;

  // View mode: Tuần hiện tại hay Cả tháng
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');

  // Thưởng điểm tổ modal
  const [bonusModalOpen, setBonusModalOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(groups[0]?.id || '');
  const [bonusPoints, setBonusPoints] = useState<number>(10);
  const [bonusReason, setBonusReason] = useState<string>('Trực nhật sạch sẽ, tham gia phong trào tốt');

  // Tính điểm theo viewMode
  const calculatedGroups = groups.map((g) => {
    const score =
      viewMode === 'week'
        ? calculateGroupWeekScore(g.id, currentWeek, students, transactions, groupBonuses)
        : calculateGroupMonthScore(g.id, currentMonth, students, transactions, groupBonuses);

    const members = students.filter((s) => s.groupId === g.id);

    return {
      group: g,
      personalTotal: score.personalTotal,
      bonusTotal: score.bonusTotal,
      total: score.total,
      members
    };
  });

  // Sắp xếp giảm dần theo tổng điểm
  calculatedGroups.sort((a, b) => b.total - a.total);

  const top1 = calculatedGroups[0];
  const top2 = calculatedGroups[1];
  const top3 = calculatedGroups[2];
  const remainingGroups = calculatedGroups.slice(3);

  // Kích hoạt pháo hoa chúc mừng
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleAddBonus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroupId || bonusPoints === 0) return;
    addGroupBonus(selectedGroupId, currentWeek, bonusPoints, bonusReason);
    setBonusModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Controls: Mode Switcher & Bonus Button */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-800">
              Thi Đua Theo Tổ
            </h1>
            <p className="text-xs text-slate-500">
              Bảng vàng vinh danh và xếp hạng thi đua tuần {currentWeek} (Tháng {currentMonth})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'week'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Theo Tuần {currentWeek}
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'month'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Theo Tháng {currentMonth}
            </button>
          </div>

          <button
            onClick={triggerConfetti}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="hidden sm:inline">Vinh danh</span>
          </button>

          {userRole === 'gvcn' && (
            <button
              onClick={() => setBonusModalOpen(true)}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs flex items-center gap-1.5 transition-all"
            >
              <Gift className="w-4 h-4" />
              <span>Thưởng điểm tổ</span>
            </button>
          )}
        </div>
      </div>

      {/* Podium Vinh Danh: Top 1, 2, 3 */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="text-center mb-6">
          <span className="text-xs px-3 py-1 rounded-full bg-white/10 text-amber-300 font-bold border border-white/10">
            🏆 BỤC VINH DANH {viewMode === 'week' ? `TUẦN ${currentWeek}` : `THÁNG ${currentMonth}`}
          </span>
        </div>

        {/* Podium Layout: Top 2 (Left) - Top 1 (Center Highest) - Top 3 (Right) */}
        <div className="flex items-end justify-center gap-3 sm:gap-6 max-w-2xl mx-auto pt-8">
          
          {/* HẠNG 2 */}
          {top2 && (
            <div className="flex-1 flex flex-col items-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-slate-400 text-slate-900 font-black text-xl flex items-center justify-center border-4 border-slate-300 shadow-lg mb-2">
                🥈
              </div>
              <div className="text-center mb-2">
                <div className="font-bold text-xs sm:text-sm text-slate-200">{top2.group.name}</div>
                <div className="font-black text-base sm:text-lg text-emerald-400">{top2.total} đ</div>
                <div className="text-[10px] text-slate-400">({top2.members.length} bạn)</div>
              </div>
              <div className="w-full bg-slate-700/80 rounded-t-2xl h-28 sm:h-36 flex flex-col items-center justify-center border-t-2 border-slate-400">
                <span className="text-xl sm:text-2xl font-black text-slate-300">#2</span>
                <span className="text-[10px] text-slate-400">Hạng Nhì</span>
              </div>
            </div>
          )}

          {/* HẠNG 1 (Cao nhất) */}
          {top1 && (
            <div className="flex-1 flex flex-col items-center">
              <div className="relative mb-2">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 text-amber-900 font-black text-2xl flex items-center justify-center border-4 border-yellow-300 shadow-xl shadow-amber-500/30 animate-pulse">
                  🥇
                </div>
                <Sparkles className="w-5 h-5 text-yellow-300 absolute -top-1 -right-1 animate-spin" />
              </div>
              <div className="text-center mb-2">
                <div className="font-extrabold text-sm sm:text-base text-yellow-300">{top1.group.name}</div>
                <div className="font-black text-lg sm:text-2xl text-emerald-400">{top1.total} đ</div>
                <div className="text-[10px] text-slate-300">
                  Cá nhân: {top1.personalTotal}đ • Thưởng: +{top1.bonusTotal}đ
                </div>
              </div>
              <div className="w-full bg-gradient-to-t from-amber-600/80 to-amber-500/80 rounded-t-2xl h-36 sm:h-48 flex flex-col items-center justify-center border-t-4 border-yellow-300 shadow-2xl">
                <span className="text-3xl sm:text-4xl font-black text-white">#1</span>
                <span className="text-xs font-bold text-yellow-100">QUÁN QUÂN</span>
              </div>
            </div>
          )}

          {/* HẠNG 3 */}
          {top3 && (
            <div className="flex-1 flex flex-col items-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-amber-800 text-white font-black text-xl flex items-center justify-center border-4 border-amber-700 shadow-lg mb-2">
                🥉
              </div>
              <div className="text-center mb-2">
                <div className="font-bold text-xs sm:text-sm text-amber-200">{top3.group.name}</div>
                <div className="font-black text-base sm:text-lg text-emerald-400">{top3.total} đ</div>
                <div className="text-[10px] text-slate-400">({top3.members.length} bạn)</div>
              </div>
              <div className="w-full bg-slate-800/90 rounded-t-2xl h-20 sm:h-28 flex flex-col items-center justify-center border-t-2 border-amber-700">
                <span className="text-lg sm:text-xl font-black text-slate-400">#3</span>
                <span className="text-[10px] text-slate-400">Hạng Ba</span>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Chi Tiết Từng Tổ: Bảng thành viên & Phân bổ điểm */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {calculatedGroups.map((gItem, idx) => {
          return (
            <div
              key={gItem.group.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                {/* Tổ Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-sm flex items-center justify-center border border-emerald-200">
                      {idx + 1}
                    </span>
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm sm:text-base">{gItem.group.name}</h3>
                      <span className="text-xs text-slate-400">{gItem.members.length} thành viên</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-black text-emerald-700">{gItem.total} đ</div>
                    <div className="text-[11px] text-slate-500">
                      Cá nhân: {gItem.personalTotal}đ | Thưởng: +{gItem.bonusTotal}đ
                    </div>
                  </div>
                </div>

                {/* Danh sách thành viên tổ */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Thành viên trong tổ:
                  </span>
                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    {gItem.members.map((mem) => {
                      const weekScore = calculateStudentWeekScore(mem.id, currentWeek, transactions);
                      return (
                        <div
                          key={mem.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs"
                        >
                          <div className="truncate">
                            <span className="font-semibold text-slate-700">{mem.fullName}</span>
                            {mem.duty && mem.duty !== 'Học sinh' && (
                              <span className="text-[10px] text-emerald-600 ml-1">({mem.duty})</span>
                            )}
                          </div>
                          <span className="font-bold text-slate-800 shrink-0 ml-1">
                            {weekScore.total}đ
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Lịch sử điểm thưởng của tổ trong tuần */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Điểm thưởng tổ (Tuần {currentWeek}):
                </span>
                {groupBonuses.filter((b) => b.groupId === gItem.group.id && b.weekNumber === currentWeek)
                  .length === 0 ? (
                  <span className="text-xs text-slate-400 italic">Chưa có điểm thưởng tuần này</span>
                ) : (
                  <div className="space-y-1">
                    {groupBonuses
                      .filter((b) => b.groupId === gItem.group.id && b.weekNumber === currentWeek)
                      .map((bonus) => (
                        <div
                          key={bonus.id}
                          className="flex items-center justify-between text-xs p-1.5 bg-amber-50 rounded-lg text-amber-900 border border-amber-200"
                        >
                          <span>{bonus.reason}</span>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <strong className="text-emerald-700">+{bonus.points}đ</strong>
                            {userRole === 'gvcn' && (
                              <button
                                onClick={() => deleteGroupBonus(bonus.id)}
                                className="text-slate-400 hover:text-rose-600 p-0.5"
                                title="Xóa điểm thưởng này"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Modal Thưởng Điểm Tổ */}
      {bonusModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 no-print">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
                <Gift className="w-5 h-5" />
                <span>Thưởng Điểm Cho Tổ (Tuần {currentWeek})</span>
              </h3>
              <button
                onClick={() => setBonusModalOpen(false)}
                className="text-white/80 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddBonus} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Chọn tổ được thưởng:</label>
                <select
                  value={selectedGroupId}
                  onChange={(e) => setSelectedGroupId(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                >
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Số điểm thưởng (+):</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={bonusPoints}
                  onChange={(e) => setBonusPoints(Number(e.target.value))}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Lý do thưởng:</label>
                <input
                  type="text"
                  value={bonusReason}
                  onChange={(e) => setBonusReason(e.target.value)}
                  placeholder="VD: Trực nhật sạch sẽ, đạt giải kéo co..."
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setBonusModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs"
                >
                  Xác nhận cộng điểm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

