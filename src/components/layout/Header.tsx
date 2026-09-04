import React from 'react';
import { useApp } from '../../context/AppContext';
import { academicMonths } from '../../utils/dateUtils';
import {
  GraduationCap,
  ShieldCheck,
  UserCheck,
  Eye,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  LogIn,
  LogOut
} from 'lucide-react';
import { UserRole } from '../../types';
import { LoginModal } from '../auth/LoginModal';

export const Header: React.FC = () => {
  const {
    db,
    currentMonth,
    setCurrentMonth,
    userRole,
    currentUser,
    logout,
    syncStatus
  } = useApp();
  const { classInfo } = db;
  const [isLoginOpen, setIsLoginOpen] = React.useState(false);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm no-print">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2.5">
          
          {/* Logo & School/Class Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-slate-800 text-base sm:text-lg leading-tight">
                  {classInfo.name}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                  {classInfo.academicYear}
                </span>
                <span className="text-xs text-slate-500 hidden sm:inline">• {classInfo.school}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                <span>GVCN: <strong className="text-slate-700 font-medium">{classInfo.teacher || 'Chưa thiết lập'}</strong></span>
                {classInfo.slogan && (
                  <>
                    <span className="text-slate-300">|</span>
                    <span className="italic text-emerald-600 hidden md:inline truncate max-w-xs">"{classInfo.slogan}"</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Controls: Month Selector, Sync Status & Role Switcher */}
          <div className="flex items-center justify-between md:justify-end gap-2 sm:gap-3 flex-wrap">
            {/* Bộ chọn tháng */}
            <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg p-1 border border-slate-200">
              <label htmlFor="month-select" className="text-xs text-slate-500 pl-1.5 font-medium">Tháng:</label>
              <select
                id="month-select"
                value={currentMonth}
                onChange={(e) => setCurrentMonth(Number(e.target.value))}
                className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer pr-1"
              >
                {academicMonths.map(m => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Trạng thái đồng bộ */}
            <div className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200 font-medium">
              {syncStatus === 'synced' && (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">Đã đồng bộ</span>
                </>
              )}
              {syncStatus === 'connecting' && (
                <>
                  <RefreshCw className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                  <span className="hidden sm:inline">Đang kết nối</span>
                </>
              )}
              {syncStatus === 'error' && (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                  <span className="hidden sm:inline">Mất kết nối</span>
                </>
              )}
            </div>

            {/* User Profile / Login status */}
            {currentUser ? (
              <div
                data-testid="header-user-profile"
                className="flex items-center gap-2 bg-slate-50 border border-slate-200 pl-2.5 pr-1.5 py-1 rounded-2xl shadow-2xs"
              >
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName}
                    className="w-7 h-7 rounded-full object-cover border border-emerald-300 shrink-0"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                    {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'U'}
                  </div>
                )}

                <div className="flex flex-col text-left pr-1 min-w-0">
                  <span className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[110px] sm:max-w-[180px] md:max-w-[220px]">
                    {currentUser.displayName || currentUser.email}
                  </span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span
                      className={`inline-flex items-center gap-1 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${
                        userRole === 'gvcn'
                          ? 'bg-emerald-100 text-emerald-800'
                          : userRole === 'bancansu'
                          ? 'bg-teal-100 text-teal-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {userRole === 'gvcn' && <ShieldCheck className="w-2.5 h-2.5" />}
                      {userRole === 'bancansu' && <UserCheck className="w-2.5 h-2.5" />}
                      {userRole === 'guest' && <Eye className="w-2.5 h-2.5" />}
                      <span>{userRole === 'gvcn' ? 'GVCN' : userRole === 'bancansu' ? 'Cán sự' : 'Khách'}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 border-l border-slate-200 pl-1">
                  <button
                    onClick={() => setIsLoginOpen(true)}
                    className="text-[11px] px-2 py-1 rounded-lg hover:bg-slate-200 text-slate-600 font-semibold transition-colors"
                    title="Chuyển vai trò / Đổi tài khoản"
                  >
                    Đổi
                  </button>
                  <button
                    onClick={logout}
                    className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                    title="Đăng xuất"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                data-testid="header-login-btn"
                onClick={() => setIsLoginOpen(true)}
                className="flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-xs"
                title="Đăng nhập tài khoản"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Đăng nhập</span>
              </button>
            )}

          </div>

        </div>
      </div>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </header>
  );
};

