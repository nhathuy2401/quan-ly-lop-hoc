Hãy xây dựng một web app hoàn chỉnh có tên “QUẢN LÝ LỚP CHỦ NHIỆM”, tham khảo mô hình chức năng của website:
Không sao chép dữ liệu cá nhân của website mẫu. Hãy tạo ứng dụng mới để giáo viên có thể tự nhập thông tin lớp, danh sách học sinh, quy định điểm và thời khóa biểu.
1. MỤC TIÊU
Xây dựng một ứng dụng quản lý lớp chủ nhiệm dùng được trên máy tính, điện thoại, máy tính bảng và màn hình tương tác.
Ứng dụng phải hỗ trợ:
Giáo viên chủ nhiệm quản trị toàn bộ hệ thống.
Ban cán sự nhập dữ liệu theo quyền được cấp.
Phụ huynh hoặc người xem chỉ được xem báo cáo, không được sửa dữ liệu.
Dữ liệu đồng bộ thời gian thực trên mọi thiết bị.
Khi một người nhập hoặc sửa dữ liệu, thiết bị khác nhìn thấy thay đổi mà không cần tải lại trang.
Dữ liệu không bị mất khi đổi thiết bị, xóa bộ nhớ trình duyệt hoặc cập nhật ứng dụng.
2. THÔNG TIN KHỞI TẠO
Tạo màn hình thiết lập ban đầu để giáo viên nhập:
Tên trường: [NHẬP TÊN TRƯỜNG]
Tên lớp: [NHẬP TÊN LỚP]
Giáo viên chủ nhiệm: [NHẬP TÊN GVCN]
Năm học: [2026 – 2027]
Ngày bắt đầu tuần 1: [DD/MM/YYYY]
Tổng số tuần học: mặc định 38 tuần, cho phép thay đổi.
Số tiết mỗi ngày: từ 5 đến 10 tiết.
Số tổ trong lớp: cho phép tùy chỉnh.
Khẩu hiệu của lớp.
Ảnh đại diện hoặc logo lớp.
Các thông tin trên phải được phép chỉnh sửa sau này trong “Cài đặt lớp” và tự động cập nhật ở tất cả màn hình, báo cáo và bản in.
3. GIAO DIỆN CHUNG
Thiết kế giao diện hiện đại, tươi sáng, thân thiện với giáo viên và học sinh:
Tông màu xanh lá – xanh ngọc – trắng.
Header hiển thị tên lớp, năm học, trường, GVCN, khẩu hiệu và trạng thái đồng bộ.
Có bộ chọn tháng từ tháng 8 năm bắt đầu đến tháng 5 năm sau.
Thanh chức năng hiển thị rõ trên máy tính và chuyển thành menu gọn trên điện thoại.
Bảng dữ liệu có tiêu đề cố định, tìm kiếm, bộ lọc và cuộn ngang trên màn hình nhỏ.
Không để chữ, nút hoặc bảng bị tràn khỏi màn hình.
Có loading, thông báo thành công, cảnh báo lỗi và xác nhận trước thao tác quan trọng.
Toàn bộ nội dung hiển thị bằng tiếng Việt, đúng chính tả.
Thanh menu gồm 8 mục:
Tổng quan tháng
Nhập điểm tuần
Thi đua theo tổ
Vi phạm rèn luyện
Theo dõi học tập
Báo bài
Rèn luyện cá nhân
Cài đặt lớp
4. TỔNG QUAN THÁNG
Hiển thị:
Sĩ số học sinh.
Tổng lỗi vi phạm rèn luyện trong tháng.
Tổng lỗi học tập trong tháng.
Xếp hạng thi đua các tổ.
Tổng điểm cá nhân và điểm thưởng của từng tổ.
Tiến độ nhập dữ liệu của từng tuần: số học sinh đã nhập/tổng sĩ số và phần trăm hoàn thành.
Các nút truy cập nhanh.
Danh sách cảnh báo học sinh có nhiều lỗi, điểm thấp hoặc chưa được nhập dữ liệu.
Biểu đồ diễn biến thi đua theo tuần.
Tất cả số liệu phải tính tự động từ các phân hệ khác, không nhập lại thủ công.
5. QUẢN LÝ DANH SÁCH HỌC SINH
Trong “Rèn luyện cá nhân” và “Cài đặt lớp”, cho phép giáo viên:
Thêm, sửa, xóa học sinh.
Nhập STT, họ tên, ngày sinh, giới tính, tổ, chức vụ, số điện thoại phụ huynh và ghi chú.
Tải danh sách học sinh từ Excel/CSV.
Tải xuống file Excel mẫu.
Chuyển học sinh từ tổ này sang tổ khác.
Tạo, đổi tên hoặc xóa tổ.
Sắp xếp học sinh theo STT, họ tên hoặc tổ.
Tìm kiếm học sinh.
Chọn lớp trưởng, lớp phó học tập, lớp phó kỷ luật, bí thư, thủ quỹ, tổ trưởng và các chức vụ tùy chỉnh.
Cho phép bỏ chức vụ để học sinh trở lại trạng thái không làm ban cán sự.
Không xóa lịch sử của học sinh khi chỉ thay đổi tổ hoặc chức vụ.
6. NHẬP ĐIỂM TUẦN
Có bộ chọn từ tuần 1 đến tổng số tuần đã cài đặt. Khi chọn tuần, tự động hiện ngày bắt đầu và kết thúc của tuần.
Mỗi tuần có các ngày từ thứ Hai đến thứ Bảy. Mỗi ngày hiển thị tổng điểm cộng và tổng điểm trừ.
Cho phép lọc theo:
Tất cả lớp.
Từng tổ.
Tên hoặc STT học sinh.
Mỗi học sinh có:
Điểm cộng trong ngày.
Điểm trừ trong ngày.
Tổng điểm ngày.
Tổng điểm tuần.
Xếp loại tuần.
Nút “Ghi nhận”.
Khi nhấn “Ghi nhận”, mở cửa sổ chọn nhanh các sự kiện đã quy định. Ban cán sự không phải tự nhập phép tính. Chỉ cần chọn vi phạm hoặc thành tích, hệ thống tự cộng/trừ đúng số điểm.
Một lần ghi nhận gồm:
Học sinh.
Ngày.
Tuần.
Loại sự kiện.
Số điểm.
Người nhập.
Thời gian nhập.
Ghi chú tùy chọn.
Có các chức năng:
Ghi nhận sự kiện cho một học sinh.
Ghi nhận hàng loạt nhiều học sinh.
Cộng điểm chuyên cần hàng loạt.
Hoàn tác giao dịch vừa nhập.
Xem lịch sử giao dịch.
Lọc lịch sử theo học sinh, ngày, tuần, người nhập và loại sự kiện.
Khóa từng ngày.
Khóa toàn bộ tuần.
Mở khóa chỉ dành cho GVCN.
Sau khi khóa, ban cán sự không được sửa hoặc xóa dữ liệu.
Không lưu một con số tổng đơn lẻ. Phải lưu từng giao dịch để có thể truy xuất, kiểm tra và hoàn tác.
7. QUY ĐỊNH ĐIỂM
Tạo trang cấu hình để GVCN tự thêm, sửa, xóa hoặc bật/tắt từng quy định.
Mỗi quy định gồm:
Tên sự kiện.
Nhóm: điểm cộng, điểm trừ, chuyên cần, học tập hoặc rèn luyện.
Số điểm.
Màu và biểu tượng.
Có cho ban cán sự sử dụng hay không.
Có tính vào thống kê vi phạm hay không.
Trạng thái đang áp dụng/ngừng áp dụng.
Tạo sẵn dữ liệu mẫu để giáo viên chỉnh sửa, ví dụ:
Điểm cộng:
Đi học chuyên cần: +5 điểm/buổi hoặc +10 điểm/ngày.
Giơ tay phát biểu.
Trả lời tốt hoặc xuất sắc.
Làm việc tốt.
Tham gia phong trào.
Trực nhật tốt.
Ban cán sự hoàn thành nhiệm vụ.
Điểm trừ:
Vắng có phép.
Vắng không phép.
Đi trễ.
Ngủ trong giờ.
Mất trật tự.
Vi phạm tác phong hoặc sai đồng phục.
Không thuộc bài.
Không mang tài liệu.
Không hoàn thành nhiệm vụ.
Viết bản kiểm điểm.
Ban cán sự không hoàn thành nhiệm vụ.
Không cố định số điểm trong mã nguồn. GVCN phải tự chỉnh được toàn bộ mức điểm.
8. THI ĐUA THEO TỔ
Công thức:
Điểm thi đua tổ theo tuần = Tổng điểm cá nhân của thành viên trong tổ + Điểm thưởng tổ của tuần.
Điểm thi đua tháng = Tổng điểm các tuần thuộc tháng.
Hiển thị:
Bục xếp hạng hạng nhất, nhì, ba.
Xếp hạng các tổ còn lại.
Tổng điểm tháng.
Điểm cá nhân và điểm thưởng được tách riêng.
Chi tiết từng tuần.
Sĩ số từng tổ.
Danh sách thành viên.
Biểu đồ so sánh điểm các tổ.
GVCN có thể nhập điểm thưởng riêng cho từng tổ theo từng tuần. Mỗi thay đổi phải có lịch sử người nhập và thời gian cập nhật.
Nếu hai tổ bằng điểm, sử dụng tiêu chí phụ do GVCN cấu hình, ví dụ: ít lỗi vi phạm hơn, điểm chuyên cần cao hơn hoặc đồng hạng.
9. VI PHẠM RÈN LUYỆN
Theo dõi riêng các nhóm:
Ngủ trong giờ.
Vắng học.
Đi trễ.
Mất trật tự.
Vi phạm tác phong.
Viết bản kiểm điểm.
Các loại vi phạm khác do GVCN tự tạo.
Hiển thị tổng số từng loại trong tháng và bảng từng học sinh.
Có nút tăng/giảm số lần vi phạm, nhưng khi thao tác phải tạo giao dịch liên kết với “Nhập điểm tuần”. Không tạo dữ liệu rời.
Cho phép lọc theo tháng và tổ.
Khi ghi nhận vi phạm tại đây:
Điểm trừ tương ứng tự động cập nhật vào điểm ngày, điểm tuần, điểm tháng.
Cập nhật tổng lỗi của học sinh.
Cập nhật điểm tổ.
Cập nhật bảng xếp hạng.
Cập nhật báo cáo phụ huynh.
10. THEO DÕI HỌC TẬP
Theo dõi theo từng tuần:
Không thuộc bài.
Không mang tài liệu.
Không làm bài tập.
Các lỗi học tập khác do GVCN tạo.
Có bảng học sinh, bộ lọc tổ, tuần và tháng.
Khi tăng/giảm một lỗi học tập, hệ thống phải đồng bộ với điểm tuần và báo cáo cá nhân. Không được cộng trùng khi người dùng thao tác ở nhiều phân hệ.
11. BÁO BÀI VÀ THỜI KHÓA BIỂU
Hiển thị thời khóa biểu dạng bảng:
Cột là thứ Hai đến thứ Bảy.
Hàng là các tiết học.
Phân biệt buổi sáng và buổi chiều.
Tự động hiển thị ngày tương ứng với tuần đang chọn.
Cho phép:
GVCN chỉnh sửa môn học từng tiết.
Sao chép thời khóa biểu từ tuần trước.
Dán thời khóa biểu cho tuần mới.
Thêm bài tập, nội dung chuẩn bị, lịch kiểm tra, thông báo và việc cần nhớ.
Mỗi nội dung có môn học, hạn hoàn thành và ghi chú.
Đánh dấu mức độ quan trọng.
In hoặc lưu PDF.
Bản in phải là khổ A4, chữ rõ, không bị cắt bảng, không hiển thị menu hoặc nút điều khiển.
12. RÈN LUYỆN CÁ NHÂN VÀ BÁO CÁO PHỤ HUYNH
Hiển thị bảng:
STT.
Họ và tên.
Tổ và chức vụ.
Điểm từng tuần.
Trung bình hoặc tổng điểm tháng.
Xếp loại rèn luyện.
Số lỗi vi phạm.
Số lỗi học tập.
Nút “Xem”.
Nút in báo cáo riêng.
Khi nhấn “Xem”, mở hồ sơ chi tiết của học sinh:
Thông tin học sinh.
Điểm từng tuần.
Danh sách điểm cộng.
Danh sách điểm trừ.
Vi phạm rèn luyện.
Lỗi học tập.
Nhận xét của GVCN.
Dặn dò về nhà.
Xếp loại tạm thời hoặc chính thức.
Có chức năng “IN BÁO CÁO PHỤ HUYNH”:
Chọn một học sinh, nhiều học sinh hoặc toàn bộ lớp.
Bản in A4 riêng cho từng học sinh.
Có tên trường, lớp, GVCN, tháng, họ tên học sinh, tổ và chức vụ.
Có bảng điểm tuần, tổng điểm, xếp loại, thành tích, vi phạm, nhận xét và dặn dò.
Có dòng ký tên GVCN và phụ huynh.
Có ngày lập báo cáo.
Dùng CSS @media print và window.print().
Khi in nhiều học sinh, mỗi học sinh bắt đầu ở một trang mới bằng page-break.
Không in menu, nút bấm hoặc thành phần quản trị.
Không dùng ảnh chụp màn hình để thay thế bản in.
13. XẾP LOẠI RÈN LUYỆN
Cho phép GVCN tự cấu hình ngưỡng điểm cho:
Tốt.
Khá.
Đạt.
Chưa đạt.
Phân biệt:
Xếp loại “Tạm” khi tháng hoặc tuần chưa khóa.
Xếp loại “Chính thức” sau khi GVCN khóa dữ liệu.
Nếu chưa nhập đủ dữ liệu, phải hiện “Chưa đủ dữ liệu”, không tự mặc định học sinh ở mức thấp nhất.
14. PHÂN QUYỀN VÀ BẢO MẬT
Có 3 vai trò:
Khách/người xem
Chỉ xem dữ liệu được công khai.
Không được nhập, sửa, xóa, mở khóa hoặc truy cập cài đặt nhạy cảm.
Ban cán sự
Đăng nhập bằng tài khoản riêng.
Chỉ được nhập những phân hệ GVCN cấp quyền.
Có thể giới hạn theo chức vụ hoặc theo tổ.
Không được sửa quy định điểm, danh sách lớp, phân quyền hoặc dữ liệu đã khóa.
Mọi thao tác đều lưu người nhập và thời gian.
Giáo viên chủ nhiệm
Toàn quyền quản trị.
Quản lý tài khoản và quyền ban cán sự.
Sửa danh sách lớp, quy định điểm, thời khóa biểu và cài đặt.
Khóa/mở khóa dữ liệu.
Xem nhật ký hoạt động.
Sao lưu và khôi phục dữ liệu.
Không lưu mật khẩu dạng văn bản trong mã nguồn, localStorage hoặc giao diện. Không dùng một mật khẩu chung viết cứng trong JavaScript.
15. ĐỒNG BỘ DỮ LIỆU THỜI GIAN THỰC
Bắt buộc sử dụng Firebase:
Firebase Authentication để đăng nhập.
Cloud Firestore để lưu dữ liệu.
Firebase Storage để lưu logo hoặc ảnh.
Firestore onSnapshot để đồng bộ thời gian thực.
Firestore Security Rules để kiểm soát quyền truy cập.
Dùng Firebase transaction hoặc batched write cho thao tác liên quan nhiều bảng dữ liệu.
Thiết kế dữ liệu theo từng lớp với classId riêng để dữ liệu các lớp không bị trộn.
Gợi ý các collection:
classes
users
classMembers
students
groups
roles
scoreRules
scoreTransactions
weeklyLocks
groupBonuses
conductRecords
studyRecords
timetables
assignments
monthlyComments
auditLogs
Mọi bản ghi phải có:
classId.
studentId nếu liên quan học sinh.
weekNumber.
date.
createdAt.
createdBy.
updatedAt.
updatedBy.
Không dùng localStorage làm nơi lưu dữ liệu chính. LocalStorage chỉ được dùng để lưu lựa chọn giao diện hoặc bộ nhớ tạm khi mất mạng.
Có trạng thái:
Đang kết nối.
Đã đồng bộ.
Mất kết nối.
Đang chờ đồng bộ.
Đồng bộ thất bại.
16. CHỐNG SAI VÀ TRÙNG DỮ LIỆU
Mỗi giao dịch có ID duy nhất.
Không cho bấm liên tục tạo hai giao dịch giống nhau.
Khi ghi nhận lỗi ở phân hệ vi phạm hoặc học tập, chỉ tạo một giao dịch gốc.
Các màn hình khác đọc và tính từ giao dịch đó.
Dùng cập nhật nguyên tử khi thay đổi điểm, thống kê và lịch sử.
Khi hai người cùng chỉnh sửa, phải ưu tiên dữ liệu mới nhất và cảnh báo nếu có xung đột.
Không cho sửa tuần hoặc ngày đã khóa.
Có nhật ký hoạt động để kiểm tra và phục hồi khi nhập sai.
17. SAO LƯU VÀ XUẤT DỮ LIỆU
GVCN có thể:
Xuất danh sách học sinh ra Excel.
Xuất điểm tuần/tháng ra Excel.
Xuất lịch sử giao dịch.
In báo cáo lớp và báo cáo cá nhân.
Sao lưu toàn bộ dữ liệu lớp thành JSON.
Nhập lại file JSON để khôi phục, có kiểm tra cấu trúc trước khi nhập.
Không ghi đè dữ liệu hiện có nếu giáo viên chưa xác nhận.
Tích hợp Google Sheets để lưu trữ & đồng bộ báo cáo:
- Cấu hình URL Web App Google Apps Script hoặc Google Sheets API / Sheet ID trong phần Cài đặt lớp.
- Cho phép xuất/đồng bộ tự động hoặc thủ công một chạm toàn bộ dữ liệu (Học sinh, Điểm tuần, Thi đua tổ, Vi phạm) sang trang tính Google Sheets cá nhân của GVCN.
- Các sheet được tự động phân tab chuẩn hóa: `DanhSachHocSinh`, `DiemTuan`, `ThiDuaTo`, `ViPhamRenLuyen`, `BaoBai`.
- Hỗ trợ nhập (import) nhanh danh sách học sinh trực tiếp từ link Google Sheet của giáo viên.
18. YÊU CẦU KỸ THUẬT
Sử dụng React + TypeScript.
Giao diện responsive.
Có thể dùng Tailwind CSS.
Tách component, service, hook và kiểu dữ liệu rõ ràng.
Không viết toàn bộ ứng dụng vào một component duy nhất.
Không để dữ liệu mẫu nằm cố định trong giao diện.
Mọi phép tính điểm phải nằm trong các hàm dùng chung.
Có xử lý lỗi Firebase rõ ràng.
Không để lộ Firebase Admin SDK, service account hoặc khóa bí mật phía máy chủ trong frontend.
Có tệp hướng dẫn cấu hình Firebase và triển khai ứng dụng.
Nếu chưa có Firebase config, vẫn dựng đầy đủ giao diện nhưng phải hiện màn hình “Chưa kết nối cơ sở dữ liệu”; không giả vờ đã đồng bộ thành công.
19. DỮ LIỆU MINH HỌA
Tạo một lớp mẫu với:
4 tổ.
12 học sinh giả lập.
Tên học sinh là dữ liệu giả, không lấy tên từ website tham khảo.
Một số chức vụ mẫu.
Quy định điểm mẫu.
Thời khóa biểu mẫu.
Dữ liệu mẫu phải có nút “Xóa dữ liệu minh họa”.
20. KIỂM THỬ BẮT BUỘC
Trước khi báo hoàn thành, hãy kiểm tra:
Thêm, sửa, xóa học sinh hoạt động.
Chuyển tổ và thay đổi chức vụ hoạt động.
Ban cán sự chỉ nhập được phần đã cấp quyền.
Khách không sửa được dữ liệu.
Ghi nhận sự kiện tự tính đúng điểm.
Dữ liệu vi phạm không bị cộng trùng.
Điểm ngày cập nhật sang tuần, tháng, tổ và báo cáo.
Khóa ngày/tuần ngăn sửa dữ liệu.
GVCN mở khóa được và có nhật ký.
Hai thiết bị nhìn thấy dữ liệu mới theo thời gian thực.
Bộ lọc tháng, tuần, tổ và tìm học sinh hoạt động.
Thời khóa biểu tự tính đúng ngày.
Bản in A4 không bị cắt nội dung.
Mỗi học sinh nằm trên một trang khi in hàng loạt.
Giao diện không tràn ngang ở 360 px, 768 px, 1024 px và 1440 px.
Không có lỗi console nghiêm trọng.
Tải lại trang không làm mất dữ liệu.
Không hiển thị “đồng bộ thành công” khi Firebase chưa kết nối.
21. CÁCH THỰC HIỆN
Hãy xây dựng ứng dụng hoàn chỉnh, không chỉ tạo bản minh họa giao diện.
Thực hiện theo thứ tự:
Tạo cấu trúc dữ liệu và kiểu TypeScript.
Tạo giao diện responsive.
Kết nối Firebase.
Thiết lập Authentication và phân quyền.
Hoàn thiện các phép tính và đồng bộ liên phân hệ.
Hoàn thiện chức năng in A4.
Viết Firestore Security Rules.
Kiểm thử toàn bộ chức năng.
Sửa hết lỗi trước khi bàn giao.
Nếu nội dung quá dài, hãy chủ động chia quá trình xây dựng thành nhiều bước nhưng phải giữ nguyên cấu trúc dự án hiện tại và tiếp tục hoàn thiện trên cùng một ứng dụng.
Sau khi hoàn thành, hãy cung cấp:
Toàn bộ mã nguồn.
File hướng dẫn cấu hình Firebase từng bước.
Firestore Security Rules.
Danh sách collection và trường dữ liệu.
Hướng dẫn tạo tài khoản GVCN và Ban cán sự.
Hướng dẫn triển khai và xuất bản.
Danh sách các chức năng đã kiểm thử.
Không tự ý bỏ bớt chức năng. Nếu có điểm chưa rõ, hãy hỏi tôi trước khi thay đổi cấu trúc hoặc quy tắc tính điểm.

22. ĐÁNH GIÁ CÔNG NGHỆ LƯU TRỮ MIỄN PHÍ VÀ KHUYẾN NGHỊ (TECH STACK & GOOGLE SHEETS)

A. PHÂN TÍCH VIỆC SỬ DỤNG GOOGLE SHEETS LÀM CƠ SỞ DỮ LIỆU CHÍNH:
- Ưu điểm:
  + 100% Miễn phí, nằm trực tiếp trên Google Drive cá nhân của giáo viên.
  + Dễ xem, sửa trực tiếp trên giao diện bảng tính quen thuộc, dễ chia sẻ cho Ban giám hiệu.
- Nhược điểm & Rủi ro kỹ thuật đối với hệ thống này:
  + Không có Real-time Push tự nhiên: Google Sheets API không hỗ trợ WebSocket listener như Firebase onSnapshot. Phải dùng cơ chế Polling (gửi request liên tục), gây tốn băng thông và chậm chễ.
  + Giới hạn Rate Limit ngặt nghèo: Giới hạn 60 write requests/phút và 300 read requests/phút. Khi nhiều ban cán sự cùng chấm điểm đồng thời vào đầu giờ hoặc tiết sinh hoạt, hệ thống sẽ gặp lỗi HTTP 429 (Too Many Requests).
  + Thiếu Transaction nguyên tử (ACID Concurrency): Không có cơ chế khóa hàng khi hai người cùng sửa điểm cùng một giây, rất dễ xảy ra hiện tượng ghi đè (Race Condition) và sai lệch tổng điểm thi đua tổ.
  + Độ trễ cao: Thời gian đọc/ghi qua Google Apps Script hoặc Google Sheets API từ 1.5s - 3s mỗi thao tác, không mang lại trải nghiệm mượt mà tức thì.
  + Khó phân quyền bảo mật cấp trường dữ liệu: Không có cơ chế bảo mật dòng (Row Level Security) hay Security Rules để ngăn ban cán sự xem/sửa các cột nhạy cảm hoặc tuần đã khóa.

B. SO SÁNH CÁC CÔNG NGHỆ BACKEND / DATABASE MIỄN PHÍ 100% (FREE TIER):
1. Firebase (Spark Plan - Miễn phí):
   - Dung lượng & Hạn mức: 50.000 lượt đọc/ngày, 20.000 lượt ghi/ngày, 1GB Firestore, 10GB Hosting (1 lớp học dùng tối đa khoảng 1.000 lượt đọc/ghi mỗi ngày -> hoàn toàn không lo chạm trần).
   - Ưu điểm: Tốc độ đồng bộ thời gian thực siêu nhanh (< 100ms), Firebase Auth có sẵn, Firestore Security Rules bảo mật vai trò GVCN/Ban cán sự, hỗ trợ lưu trữ ngoại tuyến (Offline Persistence).
2. Supabase (Free Tier - Miễn phí):
   - Dung lượng & Hạn mức: 500MB PostgreSQL, 50.000 Monthly Active Users, hỗ trợ Realtime qua WebSocket.
   - Ưu điểm: Cơ sở dữ liệu quan hệ SQL cực kỳ chặt chẽ cho mô hình điểm số, có giao diện quản lý Table Editor trực quan như Excel/Google Sheets, Row Level Security (RLS) bảo mật tuyệt đối.
3. Google Sheets + Google Apps Script Webhook (Miễn phí):
   - Dung lượng theo Google Drive (15GB free).
   - Phù hợp nhất để làm kênh lưu trữ báo cáo, xuất dữ liệu và sao lưu thứ cấp (Secondary Backup).

C. KHUYẾN NGHỊ KIẾN TRÚC TỐI ƯU (RECOMMENDED ARCHITECTURE):
Đề xuất triển khai theo MÔ HÌNH HYBRID (Kết hợp tối ưu, 100% Chi phí 0đ):
- Frontend & Hosting: React + TypeScript + Tailwind CSS (triển khai miễn phí trên Vercel hoặc Firebase Hosting với SSL tự động).
- Primary Database & Auth: Sử dụng Firebase Firestore (Spark Plan) hoặc Supabase Free Tier làm database chính để đảm bảo:
  + Đồng bộ thời gian thực tức thì (< 100ms) giữa máy tính GVCN và điện thoại ban cán sự.
  + Chống gian lận, chống ghi đè điểm (Batched Write / Atomic Transactions) khi nhiều cán sự cùng chấm.
  + Phân quyền nghiêm ngặt theo vai trò và hỗ trợ khóa tuần/ngày.
- Tích hợp Google Sheets (Đồng bộ 1-chạm & Nhập xuất):
  + Hệ thống cung cấp nút bấm hoặc tự động kích hoạt Webhook Apps Script để đẩy dữ liệu điểm tuần, thi đua tổ, vi phạm lên trang tính Google Sheets cá nhân của GVCN.
  + Cho phép GVCN nhập (import) nhanh danh sách học sinh ban đầu từ link Google Sheets.
  + Kết quả: Ứng dụng hoạt động mượt mà, chuyên nghiệp chuẩn real-time nhưng GVCN vẫn toàn quyền sở hữu và theo dõi dữ liệu trên Google Sheets quen thuộc mà không tốn bất kỳ chi phí nào.
