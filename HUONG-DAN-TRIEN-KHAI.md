# HƯỚNG DẪN TRIỂN KHAI VÀ VẬN HÀNH HỆ THỐNG
## ỨNG DỤNG “QUẢN LÝ LỚP CHỦ NHIỆM”

---

### 1. HƯỚNG DẪN CHẠY TRÊN MÁY TÍNH CÁ NHÂN (LOCAL)

1. Mở Terminal tại thư mục dự án:
   ```bash
   cd /Users/ccvn/Desktop/web-chu-nhiem
   ```
2. Khởi động máy chủ phát triển:
   ```bash
   npm run dev
   ```
3. Mở trình duyệt truy cập: `http://localhost:3000` (hoặc cổng hiển thị trên Terminal).
4. Dữ liệu mẫu (12 học sinh, 4 tổ, thời khóa biểu và quy tắc điểm chuẩn) sẽ được tự động nạp sẵn vào bộ nhớ của trình duyệt để bạn trải nghiệm ngay mà không cần cấu hình phức tạp.

---

### 2. HƯỚNG DẪN CẤU HÌNH ĐỒNG BỘ GOOGLE SHEETS (100% MIỄN PHÍ)

1. Mở **Google Drive** của GVCN -> Tạo một bảng tính mới có tên: `So_Chu_Nhiem_Lop_12A1`.
2. Trên thanh menu Google Sheets: Chọn **Tiện ích mở rộng (Extensions)** -> **Apps Script**.
3. Xóa nội dung mặc định trong tệp `Code.gs` và dán toàn bộ đoạn mã trong mục **Cài đặt lớp -> Đồng bộ Google Sheets** (hoặc trong tệp [src/services/googleSheetsService.ts](file:///Users/ccvn/Desktop/web-chu-nhiem/src/services/googleSheetsService.ts)).
4. Nhấn **Lưu** (Ctrl + S hoặc Command + S).
5. Nhấn nút **Triển khai (Deploy)** -> Chọn **Tùy chọn triển khai mới (New deployment)**:
   * **Chọn loại:** Nhấn biểu tượng bánh răng ⚙️ -> Chọn **Ứng dụng web (Web app)**.
   * **Mô tả:** Đồng bộ điểm lớp chủ nhiệm.
   * **Thực thi dưới dạng:** **Tôi** (Execute as: Me).
   * **Ai có quyền truy cập:** **Bất kỳ ai** (Who has access: Anyone) - *Quan trọng để ứng dụng có thể gửi dữ liệu lên sheet*.
6. Nhấn **Triển khai (Deploy)** -> Cấp quyền cho script khi Google hỏi -> Sao chép đường dẫn **URL ứng dụng web (Web app URL)**.
7. Mở web app -> Vào menu **Cài đặt lớp** -> Tab **Đồng bộ Google Sheets** -> Dán URL vào và nhấn **"Đồng bộ ngay"**.
8. Kết quả: Toàn bộ danh sách học sinh, điểm tổ, danh sách vi phạm rèn luyện sẽ tự động xuất hiện thành các tab trang tính chuyên nghiệp trên Google Sheets.

---

### 3. HƯỚNG DẪN CẤU HÌNH FIREBASE (REALTIME CLOUD FIRESTORE)

Nếu bạn muốn nhiều thiết bị (Điện thoại ban cán sự + Máy tính GVCN + Smart TV) đồng bộ thời gian thực qua Firebase:

#### Bước 1: Tạo dự án Firebase Free (Spark Plan)
1. Truy cập [https://console.firebase.google.com/](https://console.firebase.google.com/) và đăng nhập bằng tài khoản Google.
2. Nhấn **Add project** -> Đặt tên dự án (VD: `quan-ly-lop-chunhiem`).
3. Tắt Google Analytics (để khởi tạo nhanh nhất) -> Nhấn **Create project**.

#### Bước 2: Bật Cloud Firestore Database
1. Trong menu bên trái, chọn **Build** -> **Firestore Database** -> Nhấn **Create database**.
2. Chọn vị trí lưu trữ (ví dụ: `asia-southeast1` tại Singapore để tốc độ nhanh nhất ở Việt Nam).
3. Chọn **Start in test mode** -> Nhấn **Enable**.

#### Bước 3: Thiết lập Firestore Security Rules
Vào tab **Rules** của Firestore và dán nội dung sau để đảm bảo an toàn dữ liệu:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Hàm kiểm tra vai trò
    function isGVCN() {
      return request.auth != null && request.auth.token.role == 'gvcn';
    }
    function isBanCanSu() {
      return request.auth != null && request.auth.token.role == 'bancansu';
    }

    // 1. Bảng lớp học và cấu hình: Chỉ GVCN được sửa
    match /classes/{classId} {
      allow read: if true;
      allow write: if isGVCN();
    }

    // 2. Danh sách học sinh: Khách chỉ đọc, GVCN có quyền sửa
    match /students/{studentId} {
      allow read: if true;
      allow write: if isGVCN();
    }

    // 3. Giao dịch điểm: GVCN toàn quyền, Ban cán sự chỉ được thêm nếu tuần chưa khóa
    match /scoreTransactions/{txId} {
      allow read: if true;
      allow create: if isGVCN() || isBanCanSu();
      allow update, delete: if isGVCN();
    }

    // 4. Khóa sổ tuần/ngày: Chỉ GVCN có quyền
    match /weeklyLocks/{lockId} {
      allow read: if true;
      allow write: if isGVCN();
    }
  }
}
```

---

### 4. HƯỚNG DẪN XUẤT BẢN MIỄN PHÍ LÊN VERCEL / FIREBASE HOSTING

#### Xuất bản lên Vercel (Khuyên dùng - 1 click):
1. Đẩy mã nguồn lên tài khoản GitHub của bạn:
   ```bash
   git init
   git add .
   git commit -m "Khoi tao he thong quan ly lop chu nhiem"
   git branch -M main
   # Thêm remote và push lên repo GitHub cá nhân
   ```
2. Truy cập [https://vercel.com/](https://vercel.com/) -> Đăng nhập bằng GitHub.
3. Nhấn **Add New...** -> **Project** -> Chọn kho mã nguồn vừa đẩy lên.
4. Framework Preset sẽ tự động nhận diện là **Vite**.
5. Nhấn **Deploy**. Sau khoảng 30 giây, bạn sẽ nhận được đường link web miễn phí có dạng `https://quan-ly-lop-chunhiem.vercel.app` có sẵn chứng chỉ bảo mật HTTPS.

---

### 5. HƯỚNG DẪN SỬ DỤNG CHO GIÁO VIÊN & BAN CÁN SỰ

1. **Giáo viên chủ nhiệm (GVCN):**
   * Quản lý thông tin lớp, thêm học sinh, chuyển tổ, phân quyền chức vụ.
   * Cấu hình thang điểm và các tiêu chí thi đua.
   * Khóa sổ tuần vào cuối tuần để ngăn sửa đổi điểm.
   * Mở chức năng *In báo cáo phụ huynh* để in phiếu điểm A4 ngắt trang tự động gửi gia đình.
   * Sử dụng nút *Đồng bộ Google Sheets* để lưu trữ vào Google Drive.

2. **Ban cán sự lớp (Sử dụng trên điện thoại):**
   * Chuyển vai trò sang **"Cán sự"** (hoặc đăng nhập tài khoản cán sự).
   * Tại màn hình **Nhập điểm tuần** hoặc nút **(+) nổi trên điện thoại**, bấm **Ghi nhận**.
   * Chạm vào thẻ chọn nhanh (Quick Chips): `[+5 Chuyên cần]`, `[+2 Phát biểu]`, `[-5 Không thuộc bài]`,...
   * Nhấn **Ghi nhận ngay** -> Điểm số tự động cộng trừ và cập nhật trực tiếp vào bảng xếp hạng tổ mà không cần gõ công thức.
   * Nếu bấm nhầm, bấm ngay nút **"Hoàn tác"** ở thông báo góc màn hình trong vòng 5 giây.

