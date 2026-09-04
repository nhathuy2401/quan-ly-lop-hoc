# HƯỚNG DẪN THIẾT KẾ VÀ QUY CHUẨN GIAO DIỆN (UI/UX DESIGN SYSTEM)
## DỰ ÁN: QUẢN LÝ LỚP CHỦ NHIỆM

---

### 1. NGUYÊN TẮC THIẾT KẾ CỐT LÕI (CORE PRINCIPLES)

1. **Thân thiện & Tự nhiên (Zero Learning Curve):**
   * Thiết kế trực quan, dễ hiểu cho mọi lứa tuổi: từ giáo viên lớn tuổi đến học sinh trong ban cán sự.
   * Người dùng nhìn vào các nút bấm, nhãn hiển thị là hiểu ngay công dụng mà không cần đọc tài liệu hướng dẫn.

2. **Tối ưu thao tác một tay trên Điện thoại (Mobile-First for Students):**
   * Ban cán sự lớp chủ yếu chấm điểm bằng điện thoại thông minh vào 15 phút đầu giờ hoặc giờ ra chơi.
   * Sử dụng ngăn kéo trượt từ dưới lên (Bottom Sheet) và các thẻ chọn nhanh (Quick Action Chips), hạn chế tối đa việc phải gõ phím ảo.

3. **Trực quan sinh động trên màn hình lớp học (Gamification on Large Screens):**
   * Màn hình *Thi đua theo tổ* thiết kế bục vinh danh (Podium) Top 1 - 2 - 3 với biểu tượng cúp vàng, bạc, đồng vui tươi, tạo không khí hào hứng trong tiết sinh hoạt lớp.

4. **Chuẩn mực sư phạm khi in ấn (Print-Friendly A4):**
   * Khi in phiếu điểm hoặc báo cáo phụ huynh, hệ thống tự động loại bỏ toàn bộ nút bấm, thanh điều hướng, chuyển sang định dạng trang in A4 trắng đen thanh lịch, rõ nét.

---

### 2. HỆ THỐNG MÀU SẮC (COLOR SYSTEM)

Sử dụng phong cách màu tươi sáng, hiện đại, mang hơi thở học đường (Tông xanh ngọc - xanh lá - trắng sứ):

| Vai trò màu | Tên mã màu Tailwind | Giá trị HEX mẫu | Ý nghĩa & Vị trí ứng dụng |
| :--- | :--- | :--- | :--- |
| **Primary (Chủ đạo)** | `teal-600` / `emerald-600` | `#0d9488` / `#059669` | Thanh tiêu đề, nút bấm chính, tab đang hoạt động |
| **Primary Light** | `emerald-50` / `teal-50` | `#ecfdf5` / `#f0fdfa` | Nền các khối được chọn, trạng thái active nhẹ |
| **Background (Nền app)** | `slate-50` / `zinc-50` | `#f8fafc` / `#fafafa` | Màu nền chung toàn bộ ứng dụng, dịu mắt, chống chói |
| **Card / Surface** | `white` | `#ffffff` | Màu nền các thẻ chức năng, bảng dữ liệu, hộp thoại |
| **Thành tích / Điểm cộng** | `emerald-500` / `emerald-50` | `#10b981` | Nhãn điểm cộng (+5, +10), viền học sinh xuất sắc |
| **Vi phạm / Điểm trừ** | `rose-500` / `rose-50` | `#f43f5e` | Nhãn lỗi vi phạm, cảnh báo điểm trừ, nút xóa |
| **Nhắc nhở / Cảnh báo** | `amber-500` / `amber-50` | `#f59e0b` | Học sinh cần lưu ý, trạng thái đang chờ, chưa khóa sổ |
| **Text chính** | `slate-800` | `#1e293b` | Tiêu đề, chữ số, tên học sinh (tương phản cao, dễ đọc) |
| **Text phụ** | `slate-500` | `#64748b` | Ghi chú, chức vụ, ngày tháng, thời gian giao dịch |

---

### 3. TYPOGRAPHY & ICONOGRAPHY

* **Font chữ Tiếng Việt:**
  * Khuyên dùng: **Be Vietnam Pro** (hoặc **Inter**, **Plus Jakarta Sans**).
  * Ưu điểm: Hiển thị đầy đủ dấu tiếng Việt cực chuẩn, bo tròn nhẹ hiện đại, khoảng cách ký tự thoáng, không bị lem chữ trên màn hình độ phân giải thấp.
* **Quy chuẩn kích thước chữ:**
  * Tiêu đề màn hình: `text-2xl` hoặc `text-xl` (In đậm - `font-bold`).
  * Tên học sinh, số điểm lớn: `text-base` hoặc `text-lg` (`font-semibold`).
  * Nhãn dữ liệu, bảng điểm: `text-sm` (14px) – cỡ chữ tiêu chuẩn, không gây mỏi mắt.
  * Thông tin phụ, thời gian: `text-xs` (12px).
* **Bộ Icon (Lucide React):**
  * Sử dụng icon dạng nét mảnh (stroke width 1.75 - 2px).
  * Quy ước icon trực quan:
    * 👥 `Users`: Sĩ số lớp / Tổ.
    * 🏆 `Trophy`: Bảng xếp hạng thi đua.
    * ⭐ `Star`: Điểm thưởng / Thành tích tốt.
    * ⚠️ `AlertTriangle`: Vi phạm rèn luyện / Lỗi học tập.
    * 📅 `Calendar`: Thời khóa biểu / Báo bài.
    * 🔒 `Lock` / 🔓 `Unlock`: Trạng thái khóa dữ liệu tuần/ngày.
    * 🟢 `CheckCircle2`: Trạng thái đồng bộ thời gian thực thành công.

---

### 4. THÀNH PHẦN GIAO DIỆN CHI TIẾT (UI COMPONENTS)

#### A. Header & Trạng thái kết nối:
* Thiết kế thanh thoát, hiển thị rõ ràng:
  * Logo lớp + Tên trường + Tên lớp (Ví dụ: `THPT Nguyễn Trãi - Lớp 12A1`).
  * Tên GVCN & Khẩu hiệu lớp.
  * **Huy hiệu đồng bộ thời gian thực (Real-time Badge):**
    * `🟢 Đã đồng bộ` (Xanh lá)
    * `🟡 Đang kết nối...` (Vàng)
    * `🔴 Mất mạng (Chế độ xem)` (Đỏ)

#### B. Màn hình "Tổng quan tháng" (Bento-Grid Layout):
* Bố cục các ô thẻ (Grid) hiển thị số liệu tức thì:
  * Thẻ Sĩ số & Cơ cấu Nam/Nữ.
  * Thẻ Tổ đang dẫn đầu thi đua (kèm điểm số).
  * Thẻ Tổng lượt vi phạm trong tháng.
  * Thẻ Tiến độ nhập điểm của tuần hiện tại (thanh tiến trình ProgressBar %).
  * Biểu đồ cột / đường thể hiện xu hướng thi đua qua từng tuần (Recharts).

#### C. Màn hình "Nhập điểm tuần" & Bảng điểm (Sticky Data Table):
* **Bảng điểm thông minh:**
  * Cột 1 & 2 (STT, Họ và tên học sinh) luôn **cố định bên trái (Sticky column)** khi cuộn màn hình ngang sang thứ 2 -> thứ 7.
  * Hàng tiêu đề các thứ luôn **cố định trên cùng (Sticky header)** khi cuộn dọc qua danh sách 40-45 học sinh.
* **Cửa sổ ghi nhận điểm nhanh (Bottom Sheet / Modal):**
  * Trên di động: Mở ngăn kéo trượt mượt mà từ đáy màn hình lên.
  * Chứa danh sách **Quick Chips** (chỉ cần bấm 1 chạm):
    * `[ +10 Đi học chuyên cần ]`
    * `[ +5 Giơ tay phát biểu ]`
    * `[ +5 Trả lời bài tốt ]`
    * `[ -5 Không thuộc bài ]`
    * `[ -2 Đi trễ ]`
    * `[ -5 Không đồng phục ]`
  * Cho phép chọn 1 học sinh hoặc chọn hàng loạt nhiều học sinh (Multi-select).
  * Sau khi bấm ghi nhận: Tự động đóng và kích hoạt Toast thông báo kèm nút **"Hoàn tác"** (Undo trong 5 giây).

#### D. Màn hình "Thi đua theo tổ":
* **Bục vinh danh (Top 3 Podium):**
  * Hạng 1: Bục vàng cao nhất ở giữa (Huy hiệu Vàng 🥇 / Cúp).
  * Hạng 2: Bục bạc bên trái (Huy hiệu Bạc 🥈).
  * Hạng 3: Bục đồng bên phải (Huy hiệu Đồng 🥉).
  * Các tổ tiếp theo: Hiển thị dạng danh sách thẻ ngang bên dưới với thanh điểm so sánh.

#### E. Màn hình "Báo bài & Thời khóa biểu":
* Lưới lịch học Thứ 2 - Thứ 7, phân biệt rõ Buổi Sáng (Tiết 1-5) và Buổi Chiều (Tiết 6-10).
* Mỗi tiết học có thể gán nhãn bài tập hoặc thông báo kiểm tra với chấm màu cảnh báo (Đỏ: Quan trọng / Vàng: Bài tập về nhà).

#### F. Định dạng In ấn (Print Mode A4):
* Tích hợp `@media print` chuẩn hóa:
  * Tự động ẩn: Thanh Menu, Nút thêm/sửa/xóa, Nút in, Header hệ thống.
  * Căn lề khổ A4 tiêu chuẩn (Margin 15mm - 20mm).
  * Bảng điểm có viền mảnh thanh lịch (`border border-black`), độ tương phản cao, font chữ sắc nét.
  * Hỗ trợ `page-break-after: always`: Khi in danh sách nhiều học sinh, mỗi học sinh tự động ngắt sang trang mới riêng biệt.

---

### 5. CÔNG NGHỆ VÀ THƯ VIỆN ĐỀ XUẤT

* **Framework UI:** React 18+ với TypeScript.
* **CSS Framework:** Tailwind CSS.
* **Component Primitives:** **shadcn/ui** (dựa trên Radix UI – hỗ trợ trợ năng Accessibility chuẩn, hiệu ứng mượt).
* **Quản lý Popup / Sheet:** `@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`.
* **Thông báo Toast:** **Sonner** (Toast thông báo thanh lịch, hỗ trợ nút Undo tức thì).
* **Biểu đồ:** **Recharts** (Nhẹ, tương thích React tốt, màu sắc tùy biến theo theme xanh ngọc).
* **Icon:** **lucide-react**.

