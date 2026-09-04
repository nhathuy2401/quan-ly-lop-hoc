import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Navbar, NavTab } from './components/layout/Navbar';
import { ToastContainer } from './components/common/ToastContainer';
import { QuickGradingModal } from './components/common/QuickGradingModal';
import { formatDateISO } from './utils/dateUtils';

// Modules
import { OverviewDashboard } from './components/modules/OverviewDashboard';
import { WeeklyGrading } from './components/modules/WeeklyGrading';
import { GroupCompetition } from './components/modules/GroupCompetition';
import { ConductViolations } from './components/modules/ConductViolations';
import { StudyRecords } from './components/modules/StudyRecords';
import { TimetableModule } from './components/modules/TimetableModule';
import { PersonalConduct } from './components/modules/PersonalConduct';
import { ClassSettings } from './components/modules/ClassSettings';

const MainContent: React.FC = () => {
  const { currentWeek } = useApp();
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [quickGradingOpen, setQuickGradingOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* App Header */}
      <Header />

      {/* Main Navigation */}
      <Navbar activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Dynamic Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        {activeTab === 'overview' && (
          <OverviewDashboard
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenQuickGrading={() => setQuickGradingOpen(true)}
          />
        )}
        {activeTab === 'weekly_grading' && <WeeklyGrading />}
        {activeTab === 'group_competition' && <GroupCompetition />}
        {activeTab === 'conduct_violations' && <ConductViolations />}
        {activeTab === 'study_records' && <StudyRecords />}
        {activeTab === 'timetable' && <TimetableModule />}
        {activeTab === 'personal_conduct' && <PersonalConduct />}
        {activeTab === 'settings' && <ClassSettings />}
      </main>

      {/* Floating Quick Action Button on Mobile */}
      <div className="fixed bottom-5 right-5 z-40 sm:hidden no-print">
        <button
          onClick={() => setQuickGradingOpen(true)}
          className="w-13 h-13 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl flex items-center justify-center text-2xl font-bold transition-transform active:scale-95"
          title="Ghi nhận điểm nhanh"
        >
          +
        </button>
      </div>

      {/* Global Quick Grading Modal */}
      <QuickGradingModal
        isOpen={quickGradingOpen}
        onClose={() => setQuickGradingOpen(false)}
        targetDate={formatDateISO(new Date())}
        weekNumber={currentWeek}
      />

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
};

export default App;

