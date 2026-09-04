import React from 'react';
import {
  LayoutDashboard,
  CalendarCheck,
  Trophy,
  ShieldAlert,
  BookOpen,
  Calendar,
  UserCheck2,
  Settings,
  Menu,
  X
} from 'lucide-react';

export type NavTab =
  | 'overview'
  | 'weekly_grading'
  | 'group_competition'
  | 'conduct_violations'
  | 'study_records'
  | 'timetable'
  | 'personal_conduct'
  | 'settings';

interface NavbarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const navItems: { id: NavTab; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Tổng quan tháng', icon: LayoutDashboard },
  { id: 'weekly_grading', label: 'Nhập điểm tuần', icon: CalendarCheck },
  { id: 'group_competition', label: 'Thi đua theo tổ', icon: Trophy },
  { id: 'conduct_violations', label: 'Vi phạm rèn luyện', icon: ShieldAlert },
  { id: 'study_records', label: 'Theo dõi học tập', icon: BookOpen },
  { id: 'timetable', label: 'Báo bài', icon: Calendar },
  { id: 'personal_conduct', label: 'Rèn luyện cá nhân', icon: UserCheck2 },
  { id: 'settings', label: 'Cài đặt lớp', icon: Settings },
];

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onSelectTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-[57px] z-20 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Desktop Tabs */}
        <div className="hidden lg:flex items-center justify-between space-x-1 overflow-x-auto py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                    : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tablet & Mobile Bar */}
        <div className="flex lg:hidden items-center justify-between py-2">
          {/* Active Tab Preview */}
          <div className="flex items-center gap-2">
            {(() => {
              const cur = navItems.find((n) => n.id === activeTab);
              if (!cur) return null;
              const Icon = cur.icon;
              return (
                <div className="flex items-center gap-2 text-sm font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                  <Icon className="w-4 h-4 text-emerald-600" />
                  <span>{cur.label}</span>
                </div>
              );
            })()}
          </div>

          {/* Hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            aria-label="Mở menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 py-2 grid grid-cols-2 gap-1.5 bg-slate-50 p-2 rounded-b-xl animate-fadeIn">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-white text-slate-700 hover:bg-emerald-50 border border-slate-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-600'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        )}

      </div>
    </nav>
  );
};

