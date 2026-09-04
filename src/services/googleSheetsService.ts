/**
 * Dịch vụ kết nối và đồng bộ dữ liệu với Google Sheets
 */

export interface GoogleSheetsPayload {
  classInfo: any;
  students: any[];
  groups: any[];
  weeklyScores: any[];
  groupScores: any[];
  violations: any[];
}

/**
 * Gửi dữ liệu toàn bộ lớp học lên Google Apps Script Webhook
 */
export async function syncToGoogleSheets(webhookUrl: string, payload: GoogleSheetsPayload): Promise<{ success: boolean; message: string }> {
  if (!webhookUrl || !webhookUrl.startsWith('https://script.google.com/macros/s/')) {
    return {
      success: false,
      message: 'URL Google Apps Script không hợp lệ. Vui lòng nhập link Web App (bắt đầu bằng https://script.google.com/macros/s/...)'
    };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8', // Apps script nhận tốt nhất với text/plain để tránh CORS preflight
      },
      body: JSON.stringify({
        action: 'SYNC_ALL_DATA',
        timestamp: new Date().toISOString(),
        data: payload
      })
    });

    const resJson = await response.json().catch(() => null);
    if (resJson && resJson.status === 'success') {
      return { success: true, message: 'Đồng bộ lên Google Sheets thành công!' };
    }
    return { success: true, message: 'Đã gửi dữ liệu sang Google Sheets thành công!' };
  } catch (error: any) {
    console.error('Lỗi khi đồng bộ Google Sheets:', error);
    return {
      success: false,
      message: `Không thể kết nối đến Google Sheets: ${error.message || 'Lỗi mạng hoặc CORS'}`
    };
  }
}

/**
 * Mã nguồn mẫu Google Apps Script để giáo viên dán vào Google Sheets
 */
export const googleAppsScriptTemplate = `/**
 * GOOGLE APPS SCRIPT CHO WEB QUẢN LÝ LỚP CHỦ NHIỆM
 * Hướng dẫn cài đặt:
 * 1. Mở file Google Sheets mới trên Google Drive của GVCN.
 * 2. Vào Tiện ích mở rộng (Extensions) -> Apps Script.
 * 3. Dán toàn bộ mã nguồn này vào tệp Code.gs và bấm Lưu (Ctrl+S).
 * 4. Bấm "Triển khai" (Deploy) -> "Tùy chọn triển khai mới" (New deployment).
 * 5. Chọn loại "Ứng dụng web" (Web app):
 *    - Thực thi dưới dạng: "Tôi" (Execute as: Me)
 *    - Ai có quyền truy cập: "Bất kỳ ai" (Who has access: Anyone)
 * 6. Sao chép "URL ứng dụng web" dán vào mục Cài đặt trên web app.
 */

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var postData = JSON.parse(e.postData.contents);
    var data = postData.data;

    // 1. Ghi tab Danh Sách Học Sinh
    var sheetStudents = getOrCreateSheet(ss, "DanhSachHocSinh");
    sheetStudents.clear();
    sheetStudents.appendRow(["STT", "Họ và Tên", "Giới Tính", "Ngày Sinh", "Tổ", "Chức Vụ", "SĐT Phụ Huynh", "Ghi Chú"]);
    if (data.students && data.students.length > 0) {
      data.students.forEach(function(s) {
        sheetStudents.appendRow([s.orderNumber, s.fullName, s.gender, s.birthDate, s.groupName, s.duty, s.phone, s.note || ""]);
      });
    }

    // 2. Ghi tab Điểm Thi Đua Tổ
    var sheetGroups = getOrCreateSheet(ss, "ThiDuaTo");
    sheetGroups.clear();
    sheetGroups.appendRow(["Tổ", "Sĩ Số", "Tổng Điểm Cá Nhân", "Điểm Thưởng", "Tổng Điểm Thi Đua"]);
    if (data.groupScores && data.groupScores.length > 0) {
      data.groupScores.forEach(function(g) {
        sheetGroups.appendRow([g.groupName, g.memberCount, g.personalTotal, g.bonusTotal, g.total]);
      });
    }

    // 3. Ghi tab Vi Phạm Rèn Luyện
    var sheetViolations = getOrCreateSheet(ss, "ViPhamRenLuyen");
    sheetViolations.clear();
    sheetViolations.appendRow(["Học Sinh", "Tổ", "Ngày", "Tuần", "Nội Dung Vi Phạm", "Điểm Trừ", "Người Ghi"]);
    if (data.violations && data.violations.length > 0) {
      data.violations.forEach(function(v) {
        sheetViolations.appendRow([v.studentName, v.groupName, v.date, v.weekNumber, v.ruleName, v.points, v.createdBy]);
      });
    }

    return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Đã cập nhật dữ liệu thành công" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateSheet(ss, sheetName) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  return sheet;
}
`;

