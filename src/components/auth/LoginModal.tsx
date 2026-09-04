import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole, UserProfile } from '../../types';
import {
  GraduationCap,
  ShieldCheck,
  UserCheck,
  Eye,
  ArrowRight,
  Sparkles,
  Flame,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { firebaseService } from '../../services/firebaseService';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { db, userRole, loginUser, setUserRole, showToast } = useApp();
  const { classInfo } = db;

  const [selectedRole, setSelectedRole] = useState<UserRole>(userRole);
  const [email, setEmail] = useState('gvcn@thpt.edu.vn');
  const [password, setPassword] = useState('gvcn2026');
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'quick' | 'firebase'>('firebase');
  const [authError, setAuthError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleQuickLogin = (role: UserRole) => {
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
          ? (classInfo.teacher || 'Cô Nguyễn Thị Mai')
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
      `Đã đăng nhập thành công với vai trò ${
        role === 'gvcn' ? 'GVCN' : role === 'bancansu' ? 'Ban cán sự' : 'Khách'
      }!`
    );
    onClose();
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setAuthError(null);
    if (role === 'gvcn') {
      setEmail('gvcn@thpt.edu.vn');
      setPassword('gvcn2026');
    } else if (role === 'bancansu') {
      setEmail('bancansu@lop12a1.edu.vn');
      setPassword('bancansu123');
    } else {
      setEmail('phuhuynh@gmail.com');
      setPassword('khach123');
    }
  };

  const handleFirebaseLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);

    const res = await firebaseService.loginWithEmail(email, password);
    setIsLoading(false);

    if (res.success && res.user) {
      loginUser({
        uid: res.user.uid,
        email: res.user.email || email,
        displayName: res.user.displayName || email.split('@')[0],
        role: selectedRole,
        photoURL: res.user.photoURL || undefined
      });
      showToast(
        'success',
        `Đã xác thực Firebase (${res.user.email}) với vai trò ${
          selectedRole === 'gvcn' ? 'GVCN' : selectedRole === 'bancansu' ? 'Ban cán sự' : 'Khách'
        }!`
      );
      onClose();
    } else {
      if (res.message?.includes('configuration-not-found')) {
        setAuthError('Dự án mới tạo cần kích hoạt Authentication trên Firebase Console một lần đầu.');
      } else {
        // Fallback: cho phép đăng nhập vai trò nội bộ
        handleQuickLogin(selectedRole);
      }
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setAuthError(null);
    const res = await firebaseService.loginWithGoogle();
    setIsLoading(false);

    if (res.success && res.user) {
      loginUser({
        uid: res.user.uid,
        email: res.user.email || '',
        displayName: res.user.displayName || 'Google User',
        role: 'gvcn',
        photoURL: res.user.photoURL || undefined
      });
      showToast('success', `Đăng nhập Google thành công: ${res.user.displayName || res.user.email}`);
      onClose();
    } else {
      if (res.message?.includes('configuration-not-found')) {
        setAuthError('Dự án mới tạo chưa bật tính năng đăng nhập Google trên Firebase Console.');
      } else {
        showToast('error', `Lỗi đăng nhập Google: ${res.message || 'Cửa sổ bị đóng'}`);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 no-print animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Banner */}
        <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 p-6 text-white text-center relative">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-black tracking-tight">QUẢN LÝ LỚP CHỦ NHIỆM</h2>
          <div className="flex items-center justify-center gap-1.5 mt-1.5 text-xs text-emerald-100">
            <Flame className="w-3.5 h-3.5 text-amber-300" />
            <span>Dự án Firebase: <strong>web-chu-nhiem-16862</strong></span>
          </div>
        </div>

        {/* Method switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold">
          <button
            type="button"
            onClick={() => setLoginMethod('firebase')}
            className={`flex-1 py-3 flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              loginMethod === 'firebase'
                ? 'border-emerald-600 text-emerald-800 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-500" />
            <span>Đăng nhập Firebase</span>
          </button>

          <button
            type="button"
            onClick={() => setLoginMethod('quick')}
            className={`flex-1 py-3 flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              loginMethod === 'quick'
                ? 'border-emerald-600 text-emerald-800 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>Vào nhanh 1-chạm</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              1. Chọn vai trò tài khoản:
            </label>
            <div className="grid grid-cols-3 gap-2">
              
              {/* GVCN */}
              <button
                type="button"
                onClick={() => handleRoleSelect('gvcn')}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  selectedRole === 'gvcn'
                    ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-500/20 text-emerald-900'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  selectedRole === 'gvcn' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold">GVCN</span>
                <span className="text-[10px] text-slate-400">Toàn quyền</span>
              </button>

              {/* Ban cán sự */}
              <button
                type="button"
                onClick={() => handleRoleSelect('bancansu')}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  selectedRole === 'bancansu'
                    ? 'bg-teal-50 border-teal-600 ring-2 ring-teal-500/20 text-teal-900'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  selectedRole === 'bancansu' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  <UserCheck className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold">Ban cán sự</span>
                <span className="text-[10px] text-slate-400">Nhập điểm</span>
              </button>

              {/* Khách */}
              <button
                type="button"
                onClick={() => handleRoleSelect('guest')}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  selectedRole === 'guest'
                    ? 'bg-slate-100 border-slate-600 ring-2 ring-slate-500/20 text-slate-900'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  selectedRole === 'guest' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  <Eye className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold">Khách / PH</span>
                <span className="text-[10px] text-slate-400">Chỉ xem</span>
              </button>

            </div>
          </div>

          {authError && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span className="font-semibold">{authError}</span>
              </div>
              <p className="text-[11px] text-amber-800">
                Google yêu cầu chủ dự án nhấn <strong>"Get started" (Bắt đầu)</strong> và Bật <strong>Google</strong> trong Firebase Console.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <a
                  href="https://console.firebase.google.com/project/web-chu-nhiem-16862/authentication"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] inline-flex items-center gap-1 shadow-xs"
                >
                  <span>Mở Firebase Console bật Google</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
                <button
                  type="button"
                  onClick={() => handleQuickLogin(selectedRole)}
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-amber-300 text-amber-900 font-bold text-[11px] hover:bg-amber-100 transition-colors"
                >
                  Vào ngay (Nội bộ)
                </button>
              </div>
            </div>
          )}

          {loginMethod === 'firebase' ? (
            <form onSubmit={handleFirebaseLogin} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Email Firebase:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Mật khẩu:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all mt-1"
              >
                {isLoading ? (
                  <span>Đang kết nối Firebase...</span>
                ) : (
                  <>
                    <Flame className="w-4 h-4 text-amber-300" />
                    <span>Đăng nhập Firebase Authentication</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full py-2.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Đăng nhập nhanh với Google</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">
                Chế độ vào nhanh 1-chạm giúp bạn vào ngay giao diện lớp học với vai trò đã chọn mà không cần gõ tài khoản.
              </p>
              <button
                type="button"
                onClick={() => handleQuickLogin(selectedRole)}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <span>Vào ngay với vai trò {selectedRole === 'gvcn' ? 'GVCN' : selectedRole === 'bancansu' ? 'BAN CÁN SỰ' : 'KHÁCH'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>

        {/* Footer info */}
        <div className="bg-slate-50 p-3 text-center border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 px-4">
          <span className="flex items-center gap-1 text-emerald-700 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Firebase SDK Active</span>
          </span>
          <button onClick={onClose} className="hover:underline text-slate-600">Đóng</button>
        </div>

      </div>
    </div>
  );
};
