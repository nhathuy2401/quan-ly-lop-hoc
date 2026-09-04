import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ClassLogo } from '../common/ClassLogo';
import { LoginModal } from './LoginModal';
import {
  ShieldCheck,
  UserCheck,
  Eye,
  ArrowRight,
  Sparkles,
  Lock,
  Smartphone,
  Printer,
  CloudCheck,
  LogIn
} from 'lucide-react';
import { UserRole, UserProfile } from '../../types';

export const WelcomeScreen: React.FC = () => {
  const { db, loginUser, showToast } = useApp();
  const { classInfo } = db;
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleQuickEntry = (role: UserRole) => {
    const profile: UserProfile = {
      uid: `quick-${role}-${Date.now()}`,
      email:
        role === 'gvcn'
          ? 'gvcn@thpt.edu.vn'
          : role === 'bancansu'
          ? 'bancansu@lop12a1.edu.vn'
          : 'khach@thpt.edu.vn',
      displayName:
        role === 'gvcn'
          ? classInfo.teacher || 'Cô Nguyễn Thị Mai'
          : role === 'bancansu'
          ? 'Nguyễn An Bình (Lớp trưởng)'
          : 'Phụ huynh / Khách thăm quan',
      role: role,
      photoURL:
        role === 'gvcn'
          ? 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80'
          : role === 'bancansu'
          ? 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
          : undefined
    };
    loginUser(profile);
    showToast(
      'success',
      `Chào mừng bạn đến với ${classInfo.name} với vai trò ${
        role === 'gvcn' ? 'GVCN' : role === 'bancansu' ? 'Ban cán sự' : 'Khách'
      }!`
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-emerald-50/30 to-slate-100 flex flex-col justify-between text-slate-800 selection:bg-emerald-100">
      
      {/* Top Navbar */}
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ClassLogo size="sm" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-sm sm:text-base">
                  {classInfo.name}
                </span>
                <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                  {classInfo.academicYear}
                </span>
              </div>
              <span className="text-xs text-slate-500 hidden sm:inline">
                {classInfo.school}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsLoginModalOpen(true)}
              data-testid="welcome-login-btn"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all active:scale-95"
            >
              <LogIn className="w-4 h-4" />
              <span>Đăng nhập</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Hero Container */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col items-center text-center justify-center">
        
        {/* Animated Badge & Center Logo */}
        <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-900 text-xs font-bold shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
          <span>Hệ thống Quản lý Lớp học Thông minh</span>
        </div>

        {/* Custom Class Logo */}
        <div className="my-2 relative flex items-center justify-center">
          <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-2xl transform scale-125" />
          <ClassLogo size="2xl" className="relative z-10" />
        </div>

        {/* App Title & Slogan */}
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mt-4">
          QUẢN LÝ LỚP CHỦ NHIỆM
        </h1>

        <div className="mt-2.5 flex items-center justify-center gap-2 text-sm sm:text-base text-slate-600 font-medium flex-wrap">
          <span>{classInfo.name} • {classInfo.school}</span>
          <span className="text-slate-300 hidden sm:inline">•</span>
          <span>GVCN: <strong className="text-slate-800">{classInfo.teacher || 'Chưa thiết lập'}</strong></span>
        </div>

        {classInfo.slogan && (
          <p className="mt-2 text-xs sm:text-sm italic text-emerald-700 bg-emerald-50 px-4 py-1.5 rounded-xl border border-emerald-200/80 inline-block font-medium">
            "{classInfo.slogan}"
          </p>
        )}

        {/* Lock Notice */}
        <div className="mt-6 p-3 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs max-w-md flex items-center gap-2.5 shadow-2xs">
          <div className="w-8 h-8 rounded-xl bg-amber-200/70 flex items-center justify-center shrink-0 text-amber-800">
            <Lock className="w-4 h-4" />
          </div>
          <p className="text-left leading-relaxed">
            Dữ liệu điểm số và rèn luyện học sinh được bảo vệ. Vui lòng chọn vai trò hoặc đăng nhập để tiếp tục.
          </p>
        </div>

        {/* 3 Role Selection Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 w-full text-left">
          
          {/* GVCN Card */}
          <div className="bg-white p-5 rounded-3xl border-2 border-emerald-500/40 hover:border-emerald-600 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md mb-1.5 border border-emerald-200">
                Toàn quyền quản trị
              </div>
              <h2 className="text-base font-bold text-slate-900">Giáo viên chủ nhiệm</h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Cấu hình lớp, xét duyệt điểm tuần, khóa sổ nề nếp, xuất báo cáo và quản lý danh sách học sinh.
              </p>
            </div>
            <button
              onClick={() => handleQuickEntry('gvcn')}
              className="mt-5 w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm shadow-emerald-600/30"
            >
              <span>Vào vai trò GVCN</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Ban Cán Sự Card */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 hover:border-teal-500 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <UserCheck className="w-6 h-6" />
              </div>
              <div className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md mb-1.5 border border-teal-200">
                Nhập điểm & Thi đua
              </div>
              <h2 className="text-base font-bold text-slate-900">Ban cán sự lớp</h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Dành cho Lớp trưởng, Cán sự: Ghi nhận vi phạm nề nếp 15 phút đầu giờ, cập nhật điểm học tập theo tổ.
              </p>
            </div>
            <button
              onClick={() => handleQuickEntry('bancansu')}
              className="mt-5 w-full py-2.5 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm shadow-teal-600/30"
            >
              <span>Vào Ban cán sự</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Khách / Phụ huynh Card */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 hover:border-slate-400 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Eye className="w-6 h-6" />
              </div>
              <div className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md mb-1.5 border border-slate-200">
                Chế độ chỉ xem
              </div>
              <h2 className="text-base font-bold text-slate-900">Phụ huynh & Khách</h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Xem bảng xếp hạng thi đua các tổ, thời khóa biểu báo bài, tình hình học tập và phong trào lớp.
              </p>
            </div>
            <button
              onClick={() => handleQuickEntry('guest')}
              className="mt-5 w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <span>Xem bảng tin</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Feature Badges Footer */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full border-t border-slate-200/80 pt-6">
          <div className="flex items-center gap-2.5 text-left text-xs text-slate-600">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Smartphone className="w-4 h-4" />
            </div>
            <span><strong>Đa thiết bị:</strong> Tương thích điện thoại, máy tính bảng & màn hình tương tác.</span>
          </div>

          <div className="flex items-center gap-2.5 text-left text-xs text-slate-600">
            <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
              <Printer className="w-4 h-4" />
            </div>
            <span><strong>Chuẩn in A4:</strong> Tự động xuất phiếu điểm thanh lịch cho tiết sinh hoạt.</span>
          </div>

          <div className="flex items-center gap-2.5 text-left text-xs text-slate-600">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <CloudCheck className="w-4 h-4" />
            </div>
            <span><strong>Đồng bộ thời gian thực:</strong> Firebase & Google Sheets miễn phí 100%.</span>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white/50 py-4 text-center text-xs text-slate-500">
        <p>© 2026 Quản Lý Lớp Chủ Nhiệm • {classInfo.name} — {classInfo.school}</p>
      </footer>

      {/* Login Modal Popup */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
};
