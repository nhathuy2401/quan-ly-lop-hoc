# 🎓 QUẢN LÝ LỚP CHỦ NHIỆM

<p align="center">
  <strong>Hệ thống quản lý lớp học chủ nhiệm thông minh, hiện đại, tối ưu cho Giáo viên chủ nhiệm & Ban cán sự lớp tại Việt Nam.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 18" />
  <img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Firebase-12.18-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
  <img src="https://img.shields.io/badge/Vitest-Passing-47A248?style=for-the-badge&logo=vitest&logoColor=white" alt="Vitest" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License" />
</p>

---

## 🌟 Điểm nổi bật (Key Highlights)

- ⚡ **100% Miễn phí & Offline-first**: Hoạt động mượt mà ngay cả khi mất mạng nhờ LocalStorage, tự động đồng bộ thời gian thực khi có kết nối.
- 🔄 **Đồng bộ thời gian thực đa thiết bị**: Hỗ trợ đồng bộ đa tab tức thì bằng `BroadcastChannel`, đồng bộ đám mây qua **Firebase Firestore** và sao lưu tự động ra **Google Sheets**.
- 📱 **Tối ưu di động (Mobile-First)**: Ban cán sự dễ dàng nhập điểm nhanh với Bottom Sheet 1-chạm, Quick Action Chips trên điện thoại trong 15 phút đầu giờ.
- 🏆 **Gamification & Trực quan sinh động**: Bục vinh danh thi đua tổ Top 1 - 2 - 3 (Podium) kèm hiệu ứng pháo hoa Confetti hào hứng trong tiết sinh hoạt lớp.
- 🖨️ **In ấn chuẩn mực A4 (Print-Ready)**: Tự động loại bỏ nút bấm, thanh điều hướng khi bấm In, định dạng đen trắng thanh lịch để nộp Ban Giám Hiệu hoặc gửi Phụ Huynh.
- 🛡️ **Phân quyền 3 cấp độ (RBAC)**: Giáo viên chủ nhiệm (toàn quyền) - Ban cán sự (nhập điểm nề nếp) - Phụ huynh / Khách (chỉ xem).

---

## 🧭 8 Phân hệ chức năng chính

| Phân hệ | Biểu tượng | Mô tả chức năng chính |
| :--- | :---: | :--- |
| **1. Tổng quan tháng** | 📊 | Dashboard tổng hợp sĩ số, tổng lỗi nề nếp, học tập, bảng xếp hạng tổ, tiến độ nhập điểm từng tuần và biểu đồ Recharts sinh động. |
| **2. Nhập điểm tuần** | 📝 | Chấm điểm học tập và rèn luyện theo từng thứ trong tuần, lọc theo tổ, khóa ngày đã chốt sổ, giao diện bảng điểm trực quan. |
| **3. Thi đua theo tổ** | 🏆 | Bục vinh danh thi đua (Top 1, 2, 3), cộng/trừ điểm thi đua tuần, hiệu ứng chúc mừng sinh hoạt lớp. |
| **4. Vi phạm rèn luyện** | ⚠️ | Ghi nhận lỗi đồng phục, trễ giờ, vệ sinh, vi phạm nội quy kèm thời gian chính xác, hỗ trợ lịch sử giao dịch và hoàn tác (Undo). |
| **5. Theo dõi học tập** | 📚 | Quản lý điểm kiểm tra bài cũ, điểm 15 phút, điểm kiểm tra định kỳ, phát biểu xây dựng bài và danh sách học sinh cần hỗ trợ. |
| **6. Thời khóa biểu & Báo bài** | 📅 | Lịch học 5-10 tiết/ngày từ Thứ Hai đến Thứ Bảy, ghi chú bài tập về nhà và dặn dò giáo viên bộ môn. |
| **7. Rèn luyện cá nhân** | 👤 | Hồ sơ chi tiết từng học sinh, biểu đồ tiến bộ cá nhân, tổng hợp điểm cộng/trừ, xuất phiếu rèn luyện nộp phụ huynh. |
| **8. Cài đặt lớp** | ⚙️ | Quản lý thông tin lớp, danh sách học sinh (thêm/sửa/xóa, import Excel), bảng quy định điểm, sao lưu & khôi phục JSON, kết nối Google Sheets & Firebase. |

---

## 👥 Cơ chế phân quyền tài khoản (RBAC)

1. **Giáo viên chủ nhiệm (GVCN)**:
   - Toàn quyền cấu hình lớp, quy định điểm số, thông tin học sinh.
   - Khóa/mở khóa ngày ghi điểm của tuần.
   - Thêm điểm thưởng thi đua, xuất file báo cáo, sao lưu và khôi phục hệ thống.
2. **Ban cán sự lớp**:
   - Được phép chấm điểm nề nếp, ghi nhận vi phạm và điểm cộng trong ngày.
   - Bị hạn chế không thể sửa ngày đã bị GVCN khóa sổ.
   - Không được thay đổi cấu hình hệ thống và danh sách học sinh.
3. **Phụ huynh / Khách**:
   - Chỉ xem báo cáo, bảng điểm, thời khóa biểu và bảng thi đua.
   - Không thể chỉnh sửa bất kỳ dữ liệu nào.

---

## 🛠️ Công nghệ sử dụng (Tech Stack)

- **Frontend Core**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6](https://vitejs.dev/) (Tốc độ khởi động miligiây, HMR tức thì)
- **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/) (Hệ thống màu Emerald - Teal - Slate chuẩn học đường)
- **Icons**: [Lucide React](https://lucide.dev/) (Bộ icon đường nét hiện đại, rõ nghĩa)
- **Charts & Effects**: [Recharts](https://recharts.org/) (Biểu đồ tiến độ thi đua), [Canvas-Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Data Export/Import**: [SheetJS (XLSX)](https://sheetjs.com/) (Nhập/xuất danh sách học sinh Excel)
- **Backend / Real-time**:
  - [Firebase v12](https://firebase.google.com/) (Authentication & Cloud Firestore)
  - Google Sheets API / Google Apps Script Sync
  - Web `BroadcastChannel` API (Đồng bộ đa tab thời gian thực không cần mạng)
- **Testing**: [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/) + JSDOM

---

## 🚀 Hướng dẫn cài đặt & Khởi chạy (Getting Started)

### Yêu cầu môi trường
- **Node.js**: Phiên bản 18.0 trở lên.
- **npm** (hoặc `yarn` / `pnpm`).

### 1. Clone repository
```bash
git clone https://github.com/your-username/web-chu-nhiem.git
cd web-chu-nhiem
```

### 2. Cài đặt các gói phụ thuộc
```bash
npm install
```

### 3. Chạy môi trường phát triển (Development)
```bash
npm run dev
```
Mở trình duyệt và truy cập: **`http://localhost:3000/`** (hoặc port hiển thị trên terminal).

### 4. Chạy bộ kiểm thử tự động (Test Suite)
```bash
npm run test
```
Toàn bộ 9/9 test cases kiểm thử luồng xác thực, Header, chuyển đổi vai trò và đồng bộ phiên làm việc sẽ được chạy tự động qua Vitest.

### 5. Đóng gói cho môi trường Production (Build)
```bash
npm run build
```
Thư mục `dist/` sẽ được tạo ra, sẵn sàng triển khai lên **Vercel, Netlify, Firebase Hosting, GitHub Pages** hoặc bất kỳ máy chủ tĩnh nào.

---

## 📁 Cấu trúc thư mục dự án (Project Structure)

```text
web-chu-nhiem/
├── public/                     # Tài nguyên tĩnh, favicon, logo
├── src/
│   ├── components/             # Các React components giao diện
│   │   ├── auth/               # Hộp thoại Đăng nhập (Firebase, Google, 1-chạm)
│   │   ├── common/             # Modal ghi điểm nhanh, ToastContainer...
│   │   ├── layout/             # Header (thông tin lớp, user badge), Navbar (8 tabs)
│   │   └── modules/            # 8 phân hệ chính (Dashboard, Weekly, Competition...)
│   ├── context/                # AppContext (Global State, Transactions, Audit Log)
│   ├── services/               # Dịch vụ ngoài
│   │   ├── firebaseConfig.ts   # Cấu hình Firebase SDK
│   │   ├── firebaseService.ts  # Xác thực & Firestore Realtime Sync
│   │   ├── googleSheetsService.ts # Tích hợp Google Sheets API
│   │   └── storageService.ts   # Quản lý LocalStorage & Demo Data
│   ├── test/                   # Bộ kiểm thử tự động Vitest
│   │   ├── auth.test.tsx       # Test cases đăng nhập, Header, vai trò
│   │   └── setup.ts            # Khởi tạo môi trường kiểm thử JSDOM
│   ├── types/                  # Định nghĩa TypeScript Interfaces & Models
│   ├── utils/                  # Hàm tiện ích tính toán ngày, điểm, định dạng
│   ├── App.tsx                 # Root Component
│   ├── index.css               # Cấu hình Tailwind CSS & CSS Print A4
│   └── main.tsx                # Entry Point
├── package.json                # Danh sách thư viện & scripts
├── tailwind.config.js          # Cấu hình Theme màu sắc & fonts
├── tsconfig.json               # Cấu hình TypeScript
├── vite.config.ts              # Cấu hình Vite & Vitest
└── README.md                   # Tài liệu hướng dẫn dự án
```

---

## 📄 Bản quyền & Đóng góp (License & Contributing)

Dự án được phát hành theo giấy phép mã nguồn mở [MIT License](LICENSE).  
Mọi đóng góp (Pull Request), báo lỗi (Issues) hoặc đề xuất tính năng mới luôn được hoan nghênh nhằm phục vụ cộng đồng giáo dục Việt Nam!

