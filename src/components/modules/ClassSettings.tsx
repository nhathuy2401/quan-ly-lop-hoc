import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Student, ScoreRule, Group } from '../../types';
import {
  Settings,
  Users,
  Award,
  Database,
  FileSpreadsheet,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  Plus,
  Edit2,
  Save,
  Check,
  Link,
  Shield,
  Copy
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { syncToGoogleSheets, googleAppsScriptTemplate } from '../../services/googleSheetsService';
import { storageService } from '../../services/storageService';

export const ClassSettings: React.FC = () => {
  const {
    db,
    userRole,
    updateClassInfo,
    addStudent,
    updateStudent,
    deleteStudent,
    addGroup,
    updateGroup,
    deleteGroup,
    addScoreRule,
    updateScoreRule,
    deleteScoreRule,
    resetDemoData,
    clearAllData,
    importBackup,
    showToast
  } = useApp();

  const { classInfo, students, groups, scoreRules, transactions, groupBonuses } = db;

  // Active setting tab
  const [activeTab, setActiveTab] = useState<'info' | 'students' | 'rules' | 'sheets' | 'backup'>('info');

  // Class Info form state
  const [infoForm, setInfoForm] = useState(classInfo);

  // Student form modal
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [studentForm, setStudentForm] = useState<Omit<Student, 'id'>>({
    orderNumber: students.length + 1,
    fullName: '',
    birthDate: '2009-01-01',
    gender: 'Nam',
    groupId: groups[0]?.id || '',
    duty: 'Học sinh',
    phone: '',
    note: ''
  });

  // Group form
  const [newGroupName, setNewGroupName] = useState('');

  // Rule form modal
  const [editingRule, setEditingRule] = useState<ScoreRule | null>(null);
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [ruleForm, setRuleForm] = useState<Omit<ScoreRule, 'id'>>({
    name: '',
    type: 'plus',
    category: 'hoc_tap',
    points: 5,
    color: 'emerald',
    allowOfficer: true,
    isViolation: false,
    isActive: true
  });

  // Google Sheets state
  const [sheetUrl, setSheetUrl] = useState(classInfo.googleSheetUrl || '');
  const [isSyncing, setIsSyncing] = useState(false);

  // Handle Save Class Info
  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (userRole !== 'gvcn') {
      showToast('error', 'Chỉ GVCN mới có quyền thay đổi thông tin lớp!');
      return;
    }
    updateClassInfo(infoForm);
  };

  // Student Actions
  const handleOpenAddStudent = () => {
    setEditingStudent(null);
    setStudentForm({
      orderNumber: students.length + 1,
      fullName: '',
      birthDate: '2009-01-01',
      gender: 'Nam',
      groupId: groups[0]?.id || '',
      duty: 'Học sinh',
      phone: '',
      note: ''
    });
    setIsStudentModalOpen(true);
  };

  const handleOpenEditStudent = (s: Student) => {
    setEditingStudent(s);
    setStudentForm({
      orderNumber: s.orderNumber,
      fullName: s.fullName,
      birthDate: s.birthDate,
      gender: s.gender,
      groupId: s.groupId,
      duty: s.duty,
      phone: s.phone,
      note: s.note || ''
    });
    setIsStudentModalOpen(true);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentForm.fullName.trim()) return;

    if (editingStudent) {
      updateStudent(editingStudent.id, studentForm);
    } else {
      addStudent(studentForm);
    }
    setIsStudentModalOpen(false);
  };

  // Excel Export Student List
  const handleExportExcel = () => {
    const data = students.map((s) => ({
      'STT': s.orderNumber,
      'Họ và tên': s.fullName,
      'Giới tính': s.gender,
      'Ngày sinh': s.birthDate,
      'Tổ': groups.find((g) => g.id === s.groupId)?.name || '',
      'Chức vụ': s.duty,
      'SĐT Phụ huynh': s.phone,
      'Ghi chú': s.note || ''
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'DanhSachHocSinh');
    XLSX.writeFile(wb, `DanhSachLop_${classInfo.name}.xlsx`);
    showToast('success', 'Đã tải xuống file Excel danh sách học sinh!');
  };

  // Excel Import Student List
  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const rawData: any[] = XLSX.utils.sheet_to_json(ws);

        if (rawData.length === 0) {
          showToast('error', 'File không có dữ liệu');
          return;
        }

        let count = 0;
        rawData.forEach((row, idx) => {
          const fullName = row['Họ và tên'] || row['fullName'] || row['Ho va ten'];
          if (fullName) {
            const groupName = row['Tổ'] || row['group'];
            const matchedGroup = groups.find((g) => g.name === groupName) || groups[0];

            addStudent({
              orderNumber: row['STT'] || idx + 1,
              fullName: String(fullName).trim(),
              gender: row['Giới tính'] === 'Nữ' ? 'Nữ' : 'Nam',
              birthDate: row['Ngày sinh'] || '2009-01-01',
              groupId: matchedGroup ? matchedGroup.id : groups[0].id,
              duty: row['Chức vụ'] || 'Học sinh',
              phone: String(row['SĐT Phụ huynh'] || row['phone'] || ''),
              note: String(row['Ghi chú'] || '')
            });
            count++;
          }
        });

        showToast('success', `Đã nhập thành công ${count} học sinh từ file Excel!`);
      } catch (err: any) {
        showToast('error', `Lỗi khi đọc file Excel: ${err.message}`);
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = '';
  };

  // Rule Actions
  const handleOpenAddRule = () => {
    setEditingRule(null);
    setRuleForm({
      name: '',
      type: 'plus',
      category: 'hoc_tap',
      points: 5,
      color: 'emerald',
      allowOfficer: true,
      isViolation: false,
      isActive: true
    });
    setIsRuleModalOpen(true);
  };

  const handleOpenEditRule = (r: ScoreRule) => {
    setEditingRule(r);
    setRuleForm({
      name: r.name,
      type: r.type,
      category: r.category,
      points: r.points,
      color: r.color,
      allowOfficer: r.allowOfficer,
      isViolation: r.isViolation,
      isActive: r.isActive
    });
    setIsRuleModalOpen(true);
  };

  const handleSaveRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleForm.name.trim()) return;

    if (editingRule) {
      updateScoreRule(editingRule.id, ruleForm);
    } else {
      addScoreRule(ruleForm);
    }
    setIsRuleModalOpen(false);
  };

  // Google Sheets Sync
  const handleSyncSheets = async () => {
    if (!sheetUrl) {
      showToast('error', 'Vui lòng dán link Web App Google Apps Script');
      return;
    }

    setIsSyncing(true);
    updateClassInfo({ googleSheetUrl: sheetUrl });

    // Chuẩn bị payload
    const payload = {
      classInfo,
      students: students.map((s) => ({
        ...s,
        groupName: groups.find((g) => g.id === s.groupId)?.name || ''
      })),
      groups,
      weeklyScores: [],
      groupScores: groups.map((g) => ({
        groupName: g.name,
        memberCount: students.filter((s) => s.groupId === g.id).length,
        personalTotal: 0,
        bonusTotal: 0,
        total: 0
      })),
      violations: transactions.filter((t) => t.isViolation).map((t) => ({
        studentName: students.find((s) => s.id === t.studentId)?.fullName || '',
        groupName: groups.find((g) => g.id === students.find((s) => s.id === t.studentId)?.groupId)?.name || '',
        date: t.date,
        weekNumber: t.weekNumber,
        ruleName: t.ruleName,
        points: t.points,
        createdBy: t.createdBy
      }))
    };

    const res = await syncToGoogleSheets(sheetUrl, payload);
    setIsSyncing(false);
    if (res.success) {
      showToast('success', res.message);
    } else {
      showToast('error', res.message);
    }
  };

  return (
    <div className="space-y-6 pb-20 no-print">
      
      {/* Top Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-800">
              Cài Đặt & Quản Trị Lớp
            </h1>
            <p className="text-xs text-slate-500">
              Cấu hình thông tin lớp, danh sách học sinh, quy định điểm và đồng bộ Google Sheets
            </p>
          </div>
        </div>

        {/* Warning if not GVCN */}
        {userRole !== 'gvcn' && (
          <div className="text-xs px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1.5 font-medium">
            <Shield className="w-4 h-4 text-amber-600" />
            <span>Bạn đang ở chế độ xem. Chuyển vai trò sang GVCN ở thanh trên cùng để chỉnh sửa.</span>
          </div>
        )}
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('info')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
            activeTab === 'info'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Thông tin lớp</span>
        </button>

        <button
          onClick={() => setActiveTab('students')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
            activeTab === 'students'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Danh sách học sinh & Tổ ({students.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('rules')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
            activeTab === 'rules'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Quy định điểm ({scoreRules.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('sheets')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
            activeTab === 'sheets'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Đồng bộ Google Sheets</span>
        </button>

        <button
          onClick={() => setActiveTab('backup')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
            activeTab === 'backup'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Sao lưu & Dữ liệu mẫu</span>
        </button>
      </div>

      {/* TAB 1: THÔNG TIN LỚP */}
      {activeTab === 'info' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs max-w-4xl">
          <form onSubmit={handleSaveInfo} className="space-y-4">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">
              1. Thông tin chung của lớp
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tên trường:</label>
                <input
                  type="text"
                  value={infoForm.school}
                  onChange={(e) => setInfoForm({ ...infoForm, school: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tên lớp:</label>
                <input
                  type="text"
                  value={infoForm.name}
                  onChange={(e) => setInfoForm({ ...infoForm, name: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Giáo viên chủ nhiệm:</label>
                <input
                  type="text"
                  value={infoForm.teacher}
                  onChange={(e) => setInfoForm({ ...infoForm, teacher: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Năm học:</label>
                <input
                  type="text"
                  value={infoForm.academicYear}
                  onChange={(e) => setInfoForm({ ...infoForm, academicYear: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ngày bắt đầu Tuần 1 (DD/MM/YYYY):</label>
                <input
                  type="date"
                  value={infoForm.startDate}
                  onChange={(e) => setInfoForm({ ...infoForm, startDate: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tổng số tuần học (mặc định 38):</label>
                <input
                  type="number"
                  min="20"
                  max="45"
                  value={infoForm.totalWeeks}
                  onChange={(e) => setInfoForm({ ...infoForm, totalWeeks: Number(e.target.value) })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Số tiết mỗi ngày (5 - 10 tiết):</label>
                <input
                  type="number"
                  min="5"
                  max="10"
                  value={infoForm.periodsPerDay}
                  onChange={(e) => setInfoForm({ ...infoForm, periodsPerDay: Number(e.target.value) })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Khẩu hiệu của lớp:</label>
                <input
                  type="text"
                  value={infoForm.slogan}
                  onChange={(e) => setInfoForm({ ...infoForm, slogan: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                />
              </div>
            </div>

            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider pt-4 mb-2 border-t border-slate-100">
              2. Ngưỡng điểm xếp loại rèn luyện
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Mức "Tốt" (≥ điểm):</label>
                <input
                  type="number"
                  value={infoForm.thresholdGood}
                  onChange={(e) => setInfoForm({ ...infoForm, thresholdGood: Number(e.target.value) })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Mức "Khá" (≥ điểm):</label>
                <input
                  type="number"
                  value={infoForm.thresholdFair}
                  onChange={(e) => setInfoForm({ ...infoForm, thresholdFair: Number(e.target.value) })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Mức "Đạt" (≥ điểm):</label>
                <input
                  type="number"
                  value={infoForm.thresholdPass}
                  onChange={(e) => setInfoForm({ ...infoForm, thresholdPass: Number(e.target.value) })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={userRole !== 'gvcn'}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>Lưu thay đổi cài đặt</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: QUẢN LÝ HỌC SINH VÀ TỔ */}
      {activeTab === 'students' && (
        <div className="space-y-4">
          {/* Header Action Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenAddStudent}
                disabled={userRole !== 'gvcn'}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm học sinh</span>
              </button>

              <button
                onClick={handleExportExcel}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Xuất Excel</span>
              </button>

              {userRole === 'gvcn' && (
                <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors">
                  <Upload className="w-4 h-4" />
                  <span>Nhập từ Excel/CSV</span>
                  <input
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    onChange={handleImportExcel}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Tạo tổ mới */}
            {userRole === 'gvcn' && (
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Tên tổ mới (VD: Tổ 5)..."
                  className="text-xs px-3 py-2 border border-slate-300 rounded-xl"
                />
                <button
                  onClick={() => {
                    if (newGroupName.trim()) {
                      addGroup(newGroupName.trim());
                      setNewGroupName('');
                    }
                  }}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl"
                >
                  + Tổ
                </button>
              </div>
            )}
          </div>

          {/* Groups Pill Overview */}
          <div className="flex items-center gap-2 flex-wrap">
            {groups.map((g) => {
              const count = students.filter((s) => s.groupId === g.id).length;
              return (
                <div
                  key={g.id}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs flex items-center gap-2 shadow-2xs"
                >
                  <strong className="text-slate-800">{g.name}</strong>
                  <span className="text-slate-400">({count} bạn)</span>
                  {userRole === 'gvcn' && (
                    <button
                      onClick={() => deleteGroup(g.id)}
                      className="text-slate-300 hover:text-rose-600 p-0.5"
                      title="Xóa tổ"
                    >
                      ×
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Student Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3 w-12 text-center">STT</th>
                    <th className="p-3">Họ và tên</th>
                    <th className="p-3">Giới tính</th>
                    <th className="p-3">Ngày sinh</th>
                    <th className="p-3">Tổ</th>
                    <th className="p-3">Chức vụ</th>
                    <th className="p-3">SĐT Phụ huynh</th>
                    <th className="p-3 text-center w-24">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map((s) => {
                    const group = groups.find((g) => g.id === s.groupId);
                    return (
                      <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 text-center font-bold text-slate-500">{s.orderNumber}</td>
                        <td className="p-3 font-bold text-slate-800">{s.fullName}</td>
                        <td className="p-3 text-slate-600">{s.gender}</td>
                        <td className="p-3 text-slate-600">{s.birthDate}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-slate-100 font-medium text-slate-700">
                            {group?.name}
                          </span>
                        </td>
                        <td className="p-3 font-semibold text-emerald-700">{s.duty}</td>
                        <td className="p-3 text-slate-600">{s.phone}</td>
                        <td className="p-3 text-center">
                          {userRole === 'gvcn' && (
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => handleOpenEditStudent(s)}
                                className="p-1 hover:bg-slate-100 text-slate-600 rounded"
                                title="Sửa học sinh"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => deleteStudent(s.id)}
                                className="p-1 hover:bg-rose-50 text-rose-600 rounded"
                                title="Xóa học sinh"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: QUY ĐỊNH ĐIỂM */}
      {activeTab === 'rules' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800">Danh sách quy định điểm cộng & điểm trừ</h2>
            {userRole === 'gvcn' && (
              <button
                onClick={handleOpenAddRule}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm quy định mới</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {scoreRules.map((rule) => {
              const isPlus = rule.type === 'plus';
              return (
                <div
                  key={rule.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    rule.isActive ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-200 opacity-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${isPlus ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      <h3 className="font-bold text-slate-800 text-xs sm:text-sm">{rule.name}</h3>
                    </div>
                    <span
                      className={`font-black text-xs px-2 py-0.5 rounded-md ${
                        isPlus ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isPlus ? `+${rule.points}` : rule.points} đ
                    </span>
                  </div>

                  <div className="mt-2 text-[11px] text-slate-500 space-y-1">
                    <div>Nhóm: <strong className="capitalize">{rule.category.replace('_', ' ')}</strong></div>
                    <div>Ban cán sự dùng: <strong>{rule.allowOfficer ? 'Cho phép' : 'Chỉ GVCN'}</strong></div>
                    <div>Tính vi phạm: <strong>{rule.isViolation ? 'Có' : 'Không'}</strong></div>
                  </div>

                  {userRole === 'gvcn' && (
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => updateScoreRule(rule.id, { isActive: !rule.isActive })}
                        className="text-[11px] font-semibold text-slate-600 hover:underline"
                      >
                        {rule.isActive ? 'Tạm ngưng' : 'Bật lại'}
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditRule(rule)}
                          className="p-1 hover:bg-slate-100 text-slate-600 rounded"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteScoreRule(rule.id)}
                          className="p-1 hover:bg-rose-50 text-rose-600 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: ĐỒNG BỘ GOOGLE SHEETS */}
      {activeTab === 'sheets' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs max-w-3xl space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-800">
                Tích hợp & Đồng bộ Google Sheets (Miễn phí 100%)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Đẩy toàn bộ dữ liệu danh sách học sinh, điểm thi đua tổ, vi phạm rèn luyện sang Google Drive của giáo viên.
            </p>
          </div>

          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <label className="block text-xs font-bold text-slate-700">
              URL Ứng dụng Web Google Apps Script:
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={sheetUrl}
                onChange={(e) => setSheetUrl(e.target.value)}
                placeholder="https://script.google.com/macros/s/.../exec"
                className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl"
              />
              <button
                onClick={handleSyncSheets}
                disabled={isSyncing || !sheetUrl}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 shrink-0 disabled:opacity-50"
              >
                {isSyncing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                <span>Đồng bộ ngay</span>
              </button>
            </div>
          </div>

          {/* Script template */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase">
                Mã Google Apps Script (Copy vào Google Sheets):
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(googleAppsScriptTemplate);
                  showToast('success', 'Đã sao chép mã Apps Script vào clipboard!');
                }}
                className="text-xs text-emerald-700 hover:underline flex items-center gap-1 font-semibold"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Sao chép mã</span>
              </button>
            </div>
            <pre className="bg-slate-900 text-emerald-300 p-4 rounded-xl text-[11px] font-mono overflow-x-auto max-h-56">
              {googleAppsScriptTemplate}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 5: SAO LƯU & DỮ LIỆU MẪU */}
      {activeTab === 'backup' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs max-w-3xl space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-800 mb-1">Sao lưu & Khôi phục dữ liệu</h2>
            <p className="text-xs text-slate-500">
              Lưu trữ toàn bộ lớp học vào file JSON an toàn trên máy tính hoặc khôi phục dữ liệu khi đổi thiết bị.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <h3 className="font-bold text-xs text-slate-800">1. Tải bản sao lưu (JSON)</h3>
              <p className="text-[11px] text-slate-500">
                Xuất toàn bộ học sinh, quy tắc điểm và lịch sử giao dịch thành 1 file .json.
              </p>
              <button
                onClick={() => {
                  const json = storageService.exportJSON(db);
                  const blob = new Blob([json], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `Backup_Lop_${classInfo.name}_${new Date().toISOString().slice(0, 10)}.json`;
                  a.click();
                  showToast('success', 'Đã tải file sao lưu JSON về máy tính!');
                }}
                className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Tải file JSON</span>
              </button>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <h3 className="font-bold text-xs text-slate-800">2. Khôi phục từ JSON</h3>
              <p className="text-[11px] text-slate-500">
                Đọc và kiểm tra cấu trúc dữ liệu trước khi khôi phục vào ứng dụng.
              </p>
              <label className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer">
                <Upload className="w-4 h-4" />
                <span>Chọn file JSON khôi phục</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (evt) => {
                        const content = evt.target?.result as string;
                        importBackup(content);
                      };
                      reader.readAsText(file);
                    }
                    e.target.value = '';
                  }}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Dữ liệu mẫu Reset */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h3 className="text-sm font-bold text-slate-800">Quản lý Dữ liệu Minh họa (Mục 19)</h3>
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={resetDemoData}
                className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold rounded-xl flex items-center gap-1.5"
              >
                <RefreshCw className="w-4 h-4 text-amber-600" />
                <span>Nạp lại dữ liệu mẫu (12 học sinh, 4 tổ)</span>
              </button>

              <button
                onClick={clearAllData}
                className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 text-xs font-bold rounded-xl flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4 text-rose-600" />
                <span>Xóa sạch dữ liệu mẫu (Bắt đầu lớp mới)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Thêm/Sửa Học Sinh */}
      {isStudentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">
                {editingStudent ? 'Chỉnh sửa thông tin học sinh' : 'Thêm học sinh mới'}
              </h3>
              <button onClick={() => setIsStudentModalOpen(false)} className="text-white font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveStudent} className="p-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">STT:</label>
                  <input
                    type="number"
                    value={studentForm.orderNumber}
                    onChange={(e) => setStudentForm({ ...studentForm, orderNumber: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Giới tính:</label>
                  <select
                    value={studentForm.gender}
                    onChange={(e) => setStudentForm({ ...studentForm, gender: e.target.value as any })}
                    className="w-full p-2 border border-slate-300 rounded-xl"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Họ và tên học sinh:</label>
                <input
                  type="text"
                  value={studentForm.fullName}
                  onChange={(e) => setStudentForm({ ...studentForm, fullName: e.target.value })}
                  placeholder="VD: Nguyễn Văn A..."
                  className="w-full p-2 border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tổ:</label>
                  <select
                    value={studentForm.groupId}
                    onChange={(e) => setStudentForm({ ...studentForm, groupId: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-xl"
                  >
                    {groups.map((g) => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Chức vụ:</label>
                  <input
                    type="text"
                    value={studentForm.duty}
                    onChange={(e) => setStudentForm({ ...studentForm, duty: e.target.value })}
                    placeholder="Học sinh / Lớp trưởng / Tổ trưởng..."
                    className="w-full p-2 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Số điện thoại phụ huynh:</label>
                <input
                  type="tel"
                  value={studentForm.phone}
                  onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })}
                  placeholder="0912345678"
                  className="w-full p-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsStudentModalOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-xs"
                >
                  Lưu học sinh
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Thêm/Sửa Quy Định Điểm */}
      {isRuleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">
                {editingRule ? 'Chỉnh sửa quy định điểm' : 'Thêm quy định điểm mới'}
              </h3>
              <button onClick={() => setIsRuleModalOpen(false)} className="text-white font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveRule} className="p-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên sự kiện / Quy định:</label>
                <input
                  type="text"
                  value={ruleForm.name}
                  onChange={(e) => setRuleForm({ ...ruleForm, name: e.target.value })}
                  placeholder="VD: Đi học chuyên cần, Trả lời bài tốt..."
                  className="w-full p-2 border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Loại:</label>
                  <select
                    value={ruleForm.type}
                    onChange={(e) => {
                      const t = e.target.value as 'plus' | 'minus';
                      setRuleForm({
                        ...ruleForm,
                        type: t,
                        points: t === 'plus' ? Math.abs(ruleForm.points) : -Math.abs(ruleForm.points)
                      });
                    }}
                    className="w-full p-2 border border-slate-300 rounded-xl"
                  >
                    <option value="plus">Điểm cộng (+)</option>
                    <option value="minus">Điểm trừ (-)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Số điểm:</label>
                  <input
                    type="number"
                    value={ruleForm.points}
                    onChange={(e) => setRuleForm({ ...ruleForm, points: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phân loại:</label>
                  <select
                    value={ruleForm.category}
                    onChange={(e) => setRuleForm({ ...ruleForm, category: e.target.value as any })}
                    className="w-full p-2 border border-slate-300 rounded-xl"
                  >
                    <option value="hoc_tap">Học tập</option>
                    <option value="ren_luyen">Rèn luyện</option>
                    <option value="chuyen_can">Chuyên cần</option>
                    <option value="phong_trao">Phong trào</option>
                    <option value="khac">Khác</option>
                  </select>
                </div>

                <div className="flex flex-col justify-center space-y-1 pt-3">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ruleForm.allowOfficer}
                      onChange={(e) => setRuleForm({ ...ruleForm, allowOfficer: e.target.checked })}
                      className="rounded text-emerald-600"
                    />
                    <span>Cho cán sự dùng</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ruleForm.isViolation}
                      onChange={(e) => setRuleForm({ ...ruleForm, isViolation: e.target.checked })}
                      className="rounded text-rose-600"
                    />
                    <span>Tính vào lỗi vi phạm</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRuleModalOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-xs"
                >
                  Lưu quy định
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

