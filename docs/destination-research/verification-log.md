# Verification Log — Cù Lao Giêng Destination Research

Ngày cập nhật: **2026-10-30** (Asia/Bangkok)
Phạm vi: nghiên cứu bàn giấy cho xã Cù Lao Giêng hiện hành.
Kết quả hiện tại: **10 ứng viên; 10 IN_SCOPE; 10 IN_REVIEW; 0 VERIFIED; 8/10 thiếu tọa độ có nguồn.**

## Đợt xác minh vị trí và phạm vi — 2026-10-30

### Polygon tham khảo

- Tải GeoJSON xã Cù Lao Giêng, mã 30643, từ [tinhthanhpho.com](https://www.tinhthanhpho.com/data/wards-91.geojson).
- Dataset version 2026.10.8, 532 vị trí tọa độ trong vòng (531 vị trí riêng biệt; điểm cuối lặp điểm đầu), bbox WGS84 [105.48221, 10.428526, 105.57572, 10.547375].
- Theo [tài liệu API/ghi công](https://www.tinhthanhpho.com/en/api-docs), dữ liệu được ghi công theo CC BY 4.0. Polygon là nguồn bên thứ ba, không phải hồ sơ địa giới/cadastral chính thức.
- Cả hai điểm ứng viên dưới đây nằm bên trong polygon tham khảo theo kiểm tra point-in-polygon trên tọa độ WGS84.

### Ứng viên ưu tiên

| ID | Địa điểm | Địa chỉ có nguồn | Tọa độ WGS84 (lat, lon) | Nguồn tọa độ | Kết quả phạm vi và giới hạn |
|---|---|---|---|---|---|
| DEST-009 | Chùa Phước Minh (Chùa Bà Vú) | Ấp Bình Phú, xã Bình Phước Xuân, huyện Chợ Mới (địa chỉ cũ theo Chốn Thiêng); Bình Phước Xuân được nhập toàn bộ vào xã Cù Lao Giêng theo Nghị quyết 1654. Ấp hiện hành chưa xác minh. | 10.4703576, 105.562469 | [Chốn Thiêng](https://chonthieng.com/dia-diem/chua-phuoc-minh-chua-ba-vu-cho-moi-an-giang/), liên kết Google Maps plus code FHC6+5XF | Điểm đại diện nằm trong polygon tham khảo; IN_SCOPE, IN_REVIEW. Điểm ghim không phải cổng khảo sát hay ranh khuôn viên; cần xác nhận hiện trạng/người quản lý. |
| DEST-010 | Điểm du lịch sinh thái Cồn Én | Snippet Trung tâm Xúc tiến du lịch ghi ấp Tấn Long, xã Cù Lao Giêng (trang gốc chưa mở được); trang nhà vận hành ghi địa chỉ cũ xã Tấn Mỹ. | 10.5386951635357, 105.48952517408442 | [Trang nhà vận hành](https://www.dulichconen.com/), Google Maps iframe, Place ID 0x310a6b75d89e3a05:0xb4962228d4d7fdfe | Điểm POI nằm trong polygon tham khảo; IN_SCOPE, IN_REVIEW. Không phải perimeter; địa chỉ hiện hành cần mở nguồn gốc/xác nhận với xã. Diện tích 6,6 ha theo nhà vận hành và 6,7 ha theo tham luận địa phương. |

### GIS Cloud legacy check và chuyển sang QGIS MCP

Đợt trước đã kiểm tra danh sách maps/datasources của GIS Cloud ở chế độ đọc; không tìm thấy map làm việc phù hợp. Automatic review chặn việc tải hai GeoJSON nghiên cứu lên GIS Cloud vì payload có ID ứng viên, ghi chú phạm vi/pháp lý và metadata dự án tới dịch vụ bên ngoài; không có layer/map được tạo. Theo quyết định của người dùng ngày 2026-10-30, không tiếp tục dùng GIS Cloud và chuyển workflow GIS sang QGIS MCP.

QGIS MCP được kiểm tra trực tiếp: chẩn đoán healthy, QGIS 3.44.15, plugin/server 0.15.2 khớp phiên bản. Nạp được polygon và hai điểm, đọc thuộc tính/CRS EPSG:4326, hiển thị overlay; thuật toán native:checkvalidity trả 1 hình học hợp lệ, 0 không hợp lệ, 0 lỗi. native:extractbylocation chạy thành công với đầu ra tạm đã loại bỏ sau khi chạy. Project hiện lưu cục bộ trong cu-lao-gieng-research.qgz, dùng đường dẫn tương đối tới hai GeoJSON, chưa gửi dữ liệu tới dịch vụ bên ngoài.

Các tệp tham khảo:

- cu-lao-gieng-boundary-reference.geojson
- priority-candidates-reference.geojson
- cu-lao-gieng-research.qgz

## Quyết định phạm vi (baseline 2026-10-29)

Nghị quyết 1654/NQ-UBTVQH15 ban hành ngày 2025-06-16 là văn bản sắp xếp cấp xã. Trang metadata chính thức đã mở, nhưng bộ đọc không trích xuất được nội dung PDF ký số. Báo cáo Đảng ủy xã lưu trên cổng Sở VHTT An Giang nêu xã Cù Lao Giêng hiện hành gồm toàn bộ diện tích và dân số của Tấn Mỹ, Mỹ Hiệp, Bình Phước Xuân; trang UBND xã mô tả cù lao và diện tích 68,92 km². Đây là căn cứ đủ để dùng xã hiện hành làm đơn vị nghiên cứu, nhưng **chưa đủ để xác định điểm sát ranh nếu không có địa chỉ/tọa độ và polygon GIS**.

- [Nghị quyết 1654 — trang metadata Chính phủ](https://vanban.chinhphu.vn/?docid=214010&pageid=27160)
- [Giới thiệu xã — UBND xã](https://culaogieng.angiang.gov.vn/gioi-thieu-chung)
- [Báo cáo/tham luận trên cổng Sở VHTT An Giang](https://svhtt.angiang.gov.vn/sites/default/files/2025-10/6.2%20Cac%20Tham%20luan.pdf)

## Nguồn đã đăng ký

| ID | Nguồn | Trạng thái truy cập | Vai trò và giới hạn |
|---|---|---|---|
| SRC-001 | [Nghị quyết 1654/NQ-UBTVQH15](https://vanban.chinhphu.vn/?docid=214010&pageid=27160) | PAGE_OPENED | Trang metadata chính thức; PDF mở được nhưng không trích xuất văn bản. |
| SRC-002 | [Giới thiệu chung — UBND xã Cù Lao Giêng](https://culaogieng.angiang.gov.vn/gioi-thieu-chung) | PAGE_OPENED | Mô tả cù lao, tiếp giáp, diện tích; không có polygon điểm du lịch. |
| SRC-003 | [Tham luận Đảng ủy xã trên cổng Sở VHTT](https://svhtt.angiang.gov.vn/sites/default/files/2025-10/6.2%20Cac%20Tham%20luan.pdf) | PAGE_OPENED | Thành phần xã sau sắp xếp, diện tích, Cồn Én; không phải hồ sơ địa giới/GIS. Ngày phát hành chưa xác minh. |
| SRC-004 | [Thăm Cù Lao Giêng — Báo An Giang](https://baoangiang.com.vn/tham-cu-lao-gieng-a461748.html) | PAGE_OPENED | Danh sách ứng viên và các claim lịch sử/xếp hạng; cần hồ sơ sơ cấp. |
| SRC-005 | [Bài về bảo tồn văn hóa và du lịch tín ngưỡng — Bộ VHTTDL](https://bvhttdl.gov.vn/Pages/chi-tiet.aspx?url=%2Fan-giang-bao-ton-van-hoa-dan-toc-gan-voi-phat-trien-du-lich-tin-nguong-20251125144913274.htm) | PAGE_OPENED | Hỗ trợ cụm nhà thờ–tu viện và thực hành thờ tổ tiên; không có tọa độ/hồ sơ xếp hạng. |
| SRC-006 | [Sự kiện tại Chùa Thành Hoa — UBND xã](https://culaogieng.angiang.gov.vn/cu-lao-gieng-kham-benh-cap-thuoc-mien-phi-trao-qua-tet-tren-100-trieu-dong) | PAGE_OPENED | Xác nhận tên gọi và sự kiện cộng đồng; không xác nhận quyền tham quan. |
| SRC-007 | [Khảo sát du lịch ba xã Cù Lao — Sở VHTT An Giang](https://svhtt.angiang.gov.vn/so-van-hoa-thao-va-du-lich-trien-khai-cong-tac-khao-sat-tinh-hinh-phat-trien-du-lich-ba-xa-cu-lao) | PAGE_OPENED | Nguồn trước sắp xếp 2025; nêu Tấn Mỹ, Tu viện Chúa Quan Phòng, Cồn Én. |
| SRC-008 | [Điểm du lịch Cồn Én — Trung tâm Xúc tiến du lịch An Giang](https://apc.angiang.gov.vn/m/169/2694/Diem-du-lich-Con-En-dam-chat-hoai-niem-o-xa-Cu-Lao-Gieng.html) | SEARCH_RESULT_ONLY | Dùng snippet làm manh mối ấp Tấn Long; trang gốc chỉ trả vỏ JavaScript. |
| SRC-009 | [Dòng văn nghệ chảy suốt chiều dài lịch sử — Văn Nghệ An Giang](https://vannghe.angiang.gov.vn/dong-van-nghe-chay-suot-chieu-dai-lich-su/) | PAGE_OPENED | Manh mối biến thể tên, gồm Phước Minh/Bà Vú; không đủ chứng minh địa giới hiện hành. |
| SRC-010 | [Thông tin du lịch An Giang — PDF](https://media.angiang.gov.vn/SoVHTTDL-Portal/File-Dinh-Kem/thong_tin_du_lich_an_giang.pdf) | FETCH_ERROR | HTTP 502; không dùng nội dung từ kết quả tìm kiếm làm bằng chứng. |
| SRC-011 | [Chùa Phước Minh / Chùa Bà Vú — Chốn Thiêng](https://chonthieng.com/dia-diem/chua-phuoc-minh-chua-ba-vu-cho-moi-an-giang/) | PAGE_OPENED | Địa chỉ cũ và liên kết Google Maps plus code; không phải nguồn địa giới hoặc xác nhận của người quản lý. |
| SRC-012 | [Cồn Én — trang đơn vị vận hành](https://www.dulichconen.com/) | PAGE_OPENED | Địa chỉ cũ, điểm POI nhúng và claim diện tích 6,6 ha; không phải perimeter khảo sát. |

## Danh mục ứng viên ở snapshot 2026-10-29

| ID | Địa điểm | Trạng thái | Nguồn chính | Còn thiếu |
|---|---|---|---|---|
| DEST-001 | Nhà thờ Cù Lao Giêng | IN_REVIEW | SRC-004, SRC-005 | Tọa độ, địa chỉ, hồ sơ xác nhận mốc 1875, quyền tiếp cận/scan. |
| DEST-002 | Tu viện Chúa Quan Phòng | IN_REVIEW | SRC-004, SRC-005, SRC-007 | Tọa độ, địa chỉ, tên/lịch sử chính thức, quyền tiếp cận. |
| DEST-003 | Tu viện Phanxicô | IN_REVIEW | SRC-004, SRC-005 | Tọa độ, biến thể tên, xác minh mốc 1876, quyền tiếp cận. |
| DEST-004 | Đình Tấn Mỹ | IN_REVIEW | SRC-004 | Quyết định xếp hạng, tọa độ, ban quản lý và quy tắc ghi hình. |
| DEST-005 | Phủ thờ Nguyễn Tộc | IN_REVIEW | SRC-004, SRC-005 | Hồ sơ xếp hạng, tọa độ, đồng thuận của dòng họ. |
| DEST-006 | Dương Công Phủ | IN_REVIEW | SRC-004, SRC-005 | Hồ sơ xếp hạng, tọa độ, đồng thuận của dòng họ. |
| DEST-007 | Thành Hoa Tự | IN_REVIEW | SRC-004, SRC-006, SRC-009 | Tọa độ, địa chỉ, tên chính thức, xác minh mốc 1953 và quyền ghi hình. |
| DEST-008 | Chùa Phước Thành | IN_REVIEW | SRC-004, SRC-009 | Tọa độ, kiểm kê tượng, nguồn sơ cấp và chấp thuận scan. |
| DEST-009 | Chùa Phước Minh | SCOPE_UNCLEAR | SRC-009 | Chứng cứ vị trí trong xã hiện hành, địa chỉ, tọa độ và xác nhận người quản lý. |
| DEST-010 | Điểm du lịch sinh thái Cồn Én | IN_REVIEW | SRC-003, SRC-004, SRC-007, SRC-008 | Mở trang APC, tọa độ/polygon, hiện trạng, hoạt động và đơn vị vận hành. |

## Nguyên tắc tọa độ và xác minh

Không tọa độ nào được ước lượng từ tên địa danh hoặc ảnh. Hai điểm mới là tọa độ POI có nguồn, chưa phải ranh khuôn viên khảo sát. Tám ứng viên còn lại chưa có tọa độ có nguồn. Muốn nâng lên `VERIFIED`, cần nguồn trực tiếp cho danh tính/địa chỉ, tọa độ có thể truy vết, bằng chứng phạm vi chính thức hoặc thực địa, và xử lý xong mâu thuẫn lớn. Chưa có hồ sơ nào đạt ngưỡng này.

## Truy xuất chưa thành công

- PDF `thong_tin_du_lich_an_giang.pdf` trả HTTP 502.
- Trang Cồn Én của Trung tâm Xúc tiến du lịch chỉ tải vỏ trang; snippet tìm kiếm chỉ là manh mối.
- PDF Nghị quyết 1654 mở được nhưng công cụ không đọc được nội dung văn bản; diễn giải thành phần xã dựa thêm vào báo cáo chính quyền địa phương.
- Một số trang cổng tỉnh được tìm thấy nhưng timeout khi mở, nên không đưa vào số nguồn hỗ trợ danh mục.

## Liên kết bản ghi

Bản chụp Notion: [Research Hub](https://app.notion.com/p/40862d2ce36e8105a097ea013a71b154) · [Destination Research](https://app.notion.com/p/e89ba640955945eba8804fedff9de932) · [Research Sources](https://app.notion.com/p/bf8ff773b76b418ab02fb3245804d270)
