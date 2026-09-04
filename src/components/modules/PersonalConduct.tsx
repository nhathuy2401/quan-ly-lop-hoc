import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import {
  calculateStudentMonthScore,
  calculateStudentWeekScore,
  evaluateRating,
  getStudentConductViolations,
  getStudentStudyRecords
} from '../../services/scoreCalculations';
import { formatDateVN } from '../../utils/dateUtils';
import {
  UserCheck2,
  Printer,
  Eye,
  Search,
  Filter,
  Award,
  ShieldAlert,
  BookOpen,
  CheckCircle2,
  FileText,
  X
} from 'lucide-react';

export const PersonalConduct: React.FC = () => {
  const { db, currentMonth, currentWeek } = useApp();
  const { classInfo, students, groups, transactions } = db;

  const [selectedGroupId, setSelectedGroupId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal hồ sơ học sinh
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [teacherComment, setTeacherComment] = useState<string>('');
  const [reminders, setReminders] = useState<string>('');

  // Print mode: in 1 học sinh hoặc toàn bộ lớp
  const [printStudents, setPrintStudents] = useState<Student[]>([]);
  const [isPrintPreview, setIsPrintPreview] = useState<boolean>(false);

  const filteredStudents = students.filter((s) => {
    if (selectedGroupId !== 'all' && s.groupId !== selectedGroupId) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return s.fullName.toLowerCase().includes(q) || s.orderNumber.toString().includes(q);
    }
    return true;
  });

  const handleOpenProfile = (student: Student) => {
    setViewingStudent(student);
    setTeacherComment('Em luôn có tinh thần học tập nghiêm túc, tham gia nhiệt tình phong trào của lớp.');
    setReminders('Cần tiếp tục phát huy, ôn tập kỹ trước các bài kiểm tra.');
  };

  const handlePrintSingle = (student: Student) => {
    setPrintStudents([student]);
    setIsPrintPreview(true);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const handlePrintAll = () => {
    setPrintStudents(filteredStudents);
    setIsPrintPreview(true);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <div className="space-y-4 pb-16">
      
      {/* Top Header & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <UserCheck2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-800">
              Rèn Luyện Cá Nhân & Báo Cáo Phụ Huynh
            </h1>
            <p className="text-xs text-slate-500">
              Tổng hợp điểm số, xếp loại rèn luyện và xuất phiếu báo cáo A4 gửi gia đình (Tháng {currentMonth})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handlePrintAll}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>In báo cáo cả lớp (Khổ A4)</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 no-print">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <button
              onClick={() => setSelectedGroupId('all')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedGroupId === 'all'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tất cả lớp
            </button>
            {groups.map((g) => (
              <button
                key={g.id}
                onClick={() => setSelectedGroupId(g.id)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  selectedGroupId === g.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {g.name}
              </button>
            ))}
          </div>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm tên hoặc STT..."
            className="w-full text-xs pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
      </div>

      {/* Main Student List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden no-print">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3 w-12 text-center">STT</th>
                <th className="p-3 min-w-[160px]">Họ và tên</th>
                <th className="p-3 w-28">Tổ & Chức vụ</th>
                <th className="p-3 w-24 text-center">Điểm Tuần {currentWeek}</th>
                <th className="p-3 w-24 text-center">Tổng Điểm Tháng</th>
                <th className="p-3 w-24 text-center">Xếp Loại</th>
                <th className="p-3 w-20 text-center">Lỗi Kỷ Luật</th>
                <th className="p-3 w-20 text-center">Lỗi Học Tập</th>
                <th className="p-3 w-28 text-center">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((student) => {
                const group = groups.find((g) => g.id === student.groupId);
                const weekScore = calculateStudentWeekScore(student.id, currentWeek, transactions);
                const monthScore = calculateStudentMonthScore(student.id, currentMonth, transactions);
                const violations = getStudentConductViolations(student.id, currentMonth, transactions);
                const studyIssues = getStudentStudyRecords(student.id, currentMonth, transactions);

                const rating = evaluateRating(monthScore.total, monthScore.count > 0, {
                  good: classInfo.thresholdGood,
                  fair: classInfo.thresholdFair,
                  pass: classInfo.thresholdPass
                });

                return (
                  <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 text-center font-medium text-slate-500">
                      {student.orderNumber}
                    </td>

                    <td className="p-3 font-bold text-slate-800">
                      {student.fullName}
                    </td>

                    <td className="p-3 text-slate-600">
                      <div>{group?.name}</div>
                      {student.duty && student.duty !== 'Học sinh' && (
                        <span className="text-[10px] text-emerald-700 font-medium">
                          {student.duty}
                        </span>
                      )}
                    </td>

                    <td className="p-3 text-center font-bold text-slate-700">
                      {weekScore.total} đ
                    </td>

                    <td className="p-3 text-center font-black text-emerald-700 text-sm">
                      {monthScore.total} đ
                    </td>

                    <td className="p-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          rating === 'Tốt'
                            ? 'bg-emerald-100 text-emerald-800'
                            : rating === 'Khá'
                            ? 'bg-teal-100 text-teal-800'
                            : rating === 'Đạt'
                            ? 'bg-amber-100 text-amber-800'
                            : rating === 'Chưa đạt'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {rating}
                      </span>
                    </td>

                    <td className="p-3 text-center">
                      <span className={violations.totalCount > 0 ? 'text-rose-600 font-bold' : 'text-slate-400'}>
                        {violations.totalCount}
                      </span>
                    </td>

                    <td className="p-3 text-center">
                      <span className={studyIssues.totalCount > 0 ? 'text-amber-600 font-bold' : 'text-slate-400'}>
                        {studyIssues.totalCount}
                      </span>
                    </td>

                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenProfile(student)}
                          className="p-1.5 hover:bg-emerald-50 text-emerald-700 rounded-lg transition-colors"
                          title="Xem hồ sơ chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handlePrintSingle(student)}
                          className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors"
                          title="In báo cáo cho học sinh này"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Xem Hồ Sơ Chi Tiết Học Sinh */}
      {viewingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 no-print">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-5 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-200" />
                <h3 className="font-bold text-sm sm:text-base">
                  Hồ sơ rèn luyện: {viewingStudent.fullName}
                </h3>
              </div>
              <button
                onClick={() => setViewingStudent(null)}
                className="text-white hover:bg-white/10 p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
              {/* Info Card */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block">STT:</span>
                  <strong className="text-slate-800">{viewingStudent.orderNumber}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Tổ:</span>
                  <strong className="text-slate-800">
                    {groups.find((g) => g.id === viewingStudent.groupId)?.name}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Chức vụ:</span>
                  <strong className="text-emerald-700">{viewingStudent.duty}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">SĐT Phụ huynh:</span>
                  <strong className="text-slate-800">{viewingStudent.phone}</strong>
                </div>
              </div>

              {/* Transactions List */}
              <div>
                <h4 className="font-bold text-slate-800 mb-2">Lịch sử sự kiện điểm trong tháng:</h4>
                <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 bg-slate-50 p-2">
                  {transactions
                    .filter(
                      (t) =>
                        t.studentId === viewingStudent.id &&
                        new Date(t.date).getMonth() + 1 === currentMonth
                    )
                    .map((tx) => (
                      <div key={tx.id} className="py-1.5 flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-slate-800">{tx.ruleName}</span>
                          <span className="text-slate-400 ml-2">({tx.date})</span>
                        </div>
                        <span
                          className={`font-bold ${
                            tx.points > 0 ? 'text-emerald-600' : 'text-rose-600'
                          }`}
                        >
                          {tx.points > 0 ? `+${tx.points}` : tx.points} đ
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Teacher Comments */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">Nhận xét của GVCN:</label>
                <textarea
                  value={teacherComment}
                  onChange={(e) => setTeacherComment(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Dặn dò về nhà:</label>
                <textarea
                  value={reminders}
                  onChange={(e) => setReminders(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none"
                />
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => setViewingStudent(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  handlePrintSingle(viewingStudent);
                  setViewingStudent(null);
                }}
                className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>In phiếu báo cáo này</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRINT-ONLY SECTION (Bản in A4 chuẩn mực ngắt trang) */}
      <div className="print-only">
        {printStudents.map((std, idx) => {
          const group = groups.find((g) => g.id === std.groupId);
          const monthScore = calculateStudentMonthScore(std.id, currentMonth, transactions);
          const rating = evaluateRating(monthScore.total, monthScore.count > 0, {
            good: classInfo.thresholdGood,
            fair: classInfo.thresholdFair,
            pass: classInfo.thresholdPass
          });

          const stdTxs = transactions.filter(
            (t) => t.studentId === std.id && new Date(t.date).getMonth() + 1 === currentMonth
          );
          const plusTxs = stdTxs.filter((t) => t.points > 0);
          const minusTxs = stdTxs.filter((t) => t.points < 0);

          return (
            <div key={std.id} className="page-break p-8 border-2 border-black mb-8 min-h-[900px] flex flex-col justify-between">
              <div>
                {/* Header Trường & Lớp */}
                <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-6">
                  <div>
                    <div className="font-bold text-sm uppercase">{classInfo.school}</div>
                    <div className="text-xs">LỚP: {classInfo.name}</div>
                    <div className="text-xs">Năm học: {classInfo.academicYear}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-xs uppercase">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                    <div className="text-[11px] italic">Độc lập - Tự do - Hạnh phúc</div>
                    <div className="text-xs mt-1">Ngày in: {formatDateVN(new Date())}</div>
                  </div>
                </div>

                {/* Tiêu đề Báo Cáo */}
                <div className="text-center my-6">
                  <h2 className="text-2xl font-black uppercase tracking-wide">
                    PHIẾU BÁO CÁO KẾT QUẢ RÈN LUYỆN
                  </h2>
                  <div className="text-sm font-semibold mt-1">
                    Tháng {currentMonth} - Học kỳ I (Năm học {classInfo.academicYear})
                  </div>
                </div>

                {/* Thông tin học sinh */}
                <table className="w-full text-sm mb-6 border border-black">
                  <tbody>
                    <tr>
                      <td className="w-1/4 font-bold bg-slate-100">Họ và tên học sinh:</td>
                      <td className="w-1/4 font-black uppercase text-base">{std.fullName}</td>
                      <td className="w-1/4 font-bold bg-slate-100">STT / Tổ:</td>
                      <td className="w-1/4">STT {std.orderNumber} - {group?.name}</td>
                    </tr>
                    <tr>
                      <td className="font-bold bg-slate-100">Chức vụ trong lớp:</td>
                      <td>{std.duty || 'Học sinh'}</td>
                      <td className="font-bold bg-slate-100">Giáo viên chủ nhiệm:</td>
                      <td>{classInfo.teacher}</td>
                    </tr>
                    <tr>
                      <td className="font-bold bg-slate-100">Tổng điểm rèn luyện:</td>
                      <td className="font-black text-lg">{monthScore.total} điểm</td>
                      <td className="font-bold bg-slate-100">Xếp loại tháng:</td>
                      <td className="font-black text-base">{rating}</td>
                    </tr>
                  </tbody>
                </table>

                {/* Chi tiết thành tích và vi phạm */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {/* Điểm cộng */}
                  <div className="border border-black p-3">
                    <div className="font-bold text-xs uppercase mb-2 border-b border-black pb-1">
                      Thành tích & Điểm cộng (+):
                    </div>
                    {plusTxs.length === 0 ? (
                      <div className="text-xs italic text-slate-500">Chưa có ghi nhận</div>
                    ) : (
                      <ul className="list-disc list-inside text-xs space-y-1">
                        {plusTxs.slice(0, 5).map((t) => (
                          <li key={t.id}>
                            {t.ruleName} ({t.date}): <strong>+{t.points}đ</strong>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Điểm trừ */}
                  <div className="border border-black p-3">
                    <div className="font-bold text-xs uppercase mb-2 border-b border-black pb-1">
                      Các khuyết điểm cần khắc phục (-):
                    </div>
                    {minusTxs.length === 0 ? (
                      <div className="text-xs italic text-slate-500">Không có vi phạm</div>
                    ) : (
                      <ul className="list-disc list-inside text-xs space-y-1">
                        {minusTxs.slice(0, 5).map((t) => (
                          <li key={t.id}>
                            {t.ruleName} ({t.date}): <strong>{t.points}đ</strong>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Nhận xét của GVCN */}
                <div className="border border-black p-3 mb-6">
                  <div className="font-bold text-xs uppercase mb-1">Nhận xét của Giáo viên chủ nhiệm:</div>
                  <p className="text-xs italic leading-relaxed min-h-[40px]">
                    {teacherComment || 'Em có tinh thần học tập tốt, chấp hành nghiêm túc nội quy của nhà trường và tập thể lớp.'}
                  </p>
                  <div className="font-bold text-xs uppercase mt-2 mb-1">Dặn dò phụ huynh & học sinh:</div>
                  <p className="text-xs italic leading-relaxed">
                    {reminders || 'Kính mong quý phụ huynh tiếp tục đôn đốc việc tự học tại nhà của con em.'}
                  </p>
                </div>
              </div>

              {/* Chữ ký xác nhận */}
              <div className="grid grid-cols-2 text-center text-xs mt-8">
                <div>
                  <div className="font-bold uppercase">Ý KIẾN CỦA PHỤ HUYNH</div>
                  <div className="italic text-[11px] mb-16">(Ký và ghi rõ họ tên)</div>
                </div>
                <div>
                  <div className="font-bold uppercase">GIÁO VIÊN CHỦ NHIỆM</div>
                  <div className="italic text-[11px] mb-16">(Ký và ghi rõ họ tên)</div>
                  <div className="font-bold text-sm uppercase">{classInfo.teacher}</div>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};

