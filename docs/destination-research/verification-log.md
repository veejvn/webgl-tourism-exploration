# Verification Log — Cù Lao Giêng Destination Research

Ngày cập nhật: **2026-10-31** (Asia/Bangkok)
Phạm vi: nghiên cứu bàn giấy cho xã Cù Lao Giêng hiện hành.
Kết quả hiện tại: **10 ứng viên; 10 IN_SCOPE; 10 IN_REVIEW; 0 VERIFIED; 8/10 thiếu tọa độ WGS84 phù hợp để dùng trong sản phẩm.**

## Truy tìm hồ sơ địa giới hiện hành — 2026-10-31

- [Danh mục văn bản chuyên môn Sở Nội vụ An Giang](https://snv.angiang.gov.vn/van-ban?field_co_quan_ban_hanh_value=All&field_linh_value=All&field_loai_van_ban_value=All&field_nam_value=All&field_trich_yeu_value=&order=field_trich_yeu&page=0&sort=asc) liệt kê Quyết định 17566/QĐ-SNV ngày 12/06/2026 về giao dự toán cho nhiệm vụ **lập mới hồ sơ, bản đồ địa giới đơn vị hành chính các cấp tỉnh An Giang** (SRC-016). Đây là chứng cứ về nhiệm vụ/kinh phí, không chứng minh hồ sơ hoàn thành hay polygon đã phê duyệt. [PDF đính kèm](https://snv.angiang.gov.vn/sites/default/files/2026-06/175660001.pdf) mở được metadata ba trang nhưng không trích xuất được nội dung. Chưa tìm thấy lớp Cù Lao Giêng theo hồ sơ đã phê duyệt; giữ chênh 1,4359 km² và nhãn polygon bên thứ ba “tham khảo”.
- QGIS MCP ngày 2026-10-31 vẫn mở project EPSG:4326 với ba layer: polygon bản đồ tỉnh, hai POI tham chiếu và polygon bên thứ ba tắt mặc định. Không thêm perimeter hoặc nâng trạng thái xác minh.

## Bổ sung nguồn địa danh và địa chỉ lịch sử — 2026-10-31

- Đã mở trực tiếp [PDF Thông tin du lịch An Giang](https://media.angiang.gov.vn/SoVHTTDL-Portal/File-Dinh-Kem/thong_tin_du_lich_an_giang.pdf) (SRC-010) bằng bộ đọc web và đọc nội dung các trang 72–82. Truy cập PDF trước đó từng trả HTTP 502, vì vậy ghi nhận khả năng lỗi không liên tục; ngày tài liệu chính xác chưa xác minh, phần được dẫn dựa trên nguồn/khảo sát khoảng 2020. Tài liệu ghi địa chỉ **lịch sử**: DEST-001 ấp Tấn Bình (tr. 72); DEST-003 ấp Tân Bình (tr. 76); DEST-004 ấp Tân Thạnh, là vị trí sau lần dời năm 1867, không phải địa điểm thành lập ban đầu ở ấp Bình Tấn (tr. 80); DEST-005 ấp Bình Quới (tr. 81); DEST-007 ấp Tân Lợi (tr. 77); DEST-008 ấp Bình Quới (tr. 78). Giữ nguyên cách viết Tân/Tấn trong PDF; tên ấp hiện hành cần địa phương xác nhận.
- [Thông tư 17/2017/TT-BTNMT trong Công báo Chính phủ](https://congbaocdn.chinhphu.vn/CongBaoCP/CongBao/2017/8/24422/18770-1-593-594.pdf) (SRC-014; ban hành 26/07/2017, hiệu lực 15/09/2017) cho tọa độ **DMS của địa danh**, không phải tọa độ WGS84 đã chuyển hệ: DEST-001 nhà thờ Cù Lào Giêng 10°30′30″B, 105°29′46″Đ (tr. 107); DEST-004 đình Tấn Mỹ 10°28′40″B, 105°31′14″Đ (tr. 107); DEST-005 phủ thờ Nguyễn Tộc 10°27′30″B, 105°31′55″Đ (tr. 90); DEST-006 phủ thờ Dương Công Phủ 10°29′07″B, 105°33′25″Đ (tr. 102). Tr. 3–4 của Công báo xác định đây là tọa độ vị trí tương đối/trung tâm ký hiệu trên bản đồ địa hình quốc gia VN-2000 tỷ lệ 1:25.000. Trích xuất bảng PDF dạng phẳng đã đối chiếu số hàng, tên và mảnh bản đồ; cần kiểm tra trực quan trước ứng dụng đòi hỏi độ chính xác cao.
- Phép lọc điểm trong polygon bằng QGIS MCP ở chế độ đọc cho cả bốn tọa độ DMS trên đều nằm trong polygon tỉnh công bố và polygon tham khảo khi dùng các trị số độ-phút-giây như tọa độ địa lý để kiểm tra bao chứa thô. Phép này **không** chuyển hệ từ VN-2000 sang WGS84, không xác định cổng vào hay ranh khuôn viên. Các trường WGS84 `latitude`, `longitude`, `coordinate_source` của DEST-001/004/005/006 vẫn để trống; tổng cộng vẫn 8/10 ứng viên thiếu tọa độ WGS84 có nguồn phù hợp.
- Công báo tr. 107 ghi **Cồn Én tự nhiên** tại 10°32′33″B, 105°30′31″Đ; không đồng nhất với POI điểm du lịch Cồn Én của nhà vận hành. Nhà vận hành ghi 6,6 ha (SRC-012); [tham luận địa phương](https://svhtt.angiang.gov.vn/sites/default/files/2025-10/6.2%20Cac%20Tham%20luan.pdf) ghi 6,7 ha (SRC-003, tr. 211); [Báo An Giang](https://baoangiang.com.vn/xa-anh-hung-tan-my-dat-chuan-nong-thon-moi-nang-cao-a301483.html) mô tả dự án The Lugar An Giang Resort and Spa trước đây trên cồn Tấn Long có quy mô 6,6 ha (SRC-015). Chưa rõ các số liệu có cùng giai đoạn, phạm vi và phương pháp đo hay không; không dùng chúng để vẽ perimeter.
- Chưa tìm thấy tọa độ trong Công báo cho DEST-002/003/007/008. [Sở Nội vụ An Giang](https://snv.angiang.gov.vn/ban-giao-dua-vao-quan-ly-su-dung-bo-ho-so-ban-do-dia-gioi-hanh-chinh-cap-huyen-cap-xa-tren-dia-ban) mô tả bàn giao hồ sơ địa giới năm 2023, trước sắp xếp 2025. Chưa lấy được hồ sơ địa giới hiện hành đã phê duyệt của xã Cù Lao Giêng; chênh polygon 1,4359 km² vẫn chưa được giải quyết.

## Đợt xác minh vị trí và phạm vi — 2026-10-30

### Polygon hành chính công bố trên bản đồ tỉnh

- Trang [Bản đồ hành chính 102 xã, phường, đặc khu — UBND tỉnh An Giang](https://angiang.gov.vn/vi/ban-do-hanh-chinh-102-xa-phuong-dac-khu-tinh-an-giang) tải [GeoJSON AnGiang_Xa_NEW_JSON_2.json](https://angiang.gov.vn/sites/default/files/other/AnGiang_Xa_NEW_JSON_2.json). HTTP `Last-Modified` là 2025-08-15; tệp có 102 feature cấp xã.
- Feature `Cù Lao Giêng` có `MultiPolygon`, mã `CuLaoGieng`/`CLG`, thuộc tính `DienTich=68,92` và mô tả nhập Tấn Mỹ, Mỹ Hiệp, Bình Phước Xuân. Có 93 vị trí tọa độ. CRS của lớp trong ứng dụng bản đồ là EPSG:4326.
- Đây là hình học được công bố trên bản đồ hành chính chính thức của tỉnh, phù hợp làm polygon chính thức ở cấp bản đồ để đối chiếu nghiên cứu. GeoJSON không đính kèm hồ sơ kỹ thuật/tỷ lệ đo hoặc xác nhận đây là bộ hồ sơ địa giới đã phê duyệt; chưa dùng làm căn cứ địa chính/pháp lý cuối cùng khi có sai khác.
- QGIS 3.44.15 kiểm tra feature cho 1 hợp lệ, 0 không hợp lệ, 0 lỗi. Diện tích hình học đo theo WGS84 là 69,1516 km², khác thuộc tính diện tích 68,92 km².

### Polygon bên thứ ba và đối chiếu

- GeoJSON tham khảo xã Cù Lao Giêng, mã 30643, lấy từ [tinhthanhpho.com](https://www.tinhthanhpho.com/data/wards-91.geojson), dataset version 2026.10.8, 532 vị trí (531 vị trí riêng; điểm cuối đóng vòng), bbox WGS84 [105.48221, 10.428526, 105.57572, 10.547375]. Theo [tài liệu API/ghi công](https://www.tinhthanhpho.com/en/api-docs), ghi công theo CC BY 4.0. Lớp này luôn được đánh dấu tham khảo, không phải ranh chính thức.
- Đo trong QGIS bằng `native:intersection`, `native:symmetricaldifference` và `$area`/1.000.000, EPSG:4326, ellipsoid WGS84: polygon tỉnh 69,1516 km²; polygon bên thứ ba 68,7191 km²; phần giao 68,2174 km²; phần chỉ có ở polygon tỉnh 0,9342 km²; phần chỉ có ở polygon tham khảo 0,5017 km²; chênh đối xứng 1,4359 km², khoảng 2,06% diện tích hợp.
- Cả hai điểm POI DEST-009/010 nằm trong cả hai polygon. Do hai polygon có sai khác, giữ song song trong bộ dữ liệu và xin cơ quan địa phương xác nhận lớp/hồ sơ địa giới chuẩn trước khi chốt điểm sát ranh. Phép kiểm tra điểm không xác nhận phạm vi khuôn viên.

### Ứng viên ưu tiên

| ID | Địa điểm | Địa chỉ có nguồn | Tọa độ WGS84 (lat, lon) | Nguồn tọa độ | Kết quả phạm vi và giới hạn |
|---|---|---|---|---|---|
| DEST-009 | Chùa Phước Minh (Chùa Bà Vú) | Nguồn Chốn Thiêng ghi địa chỉ cũ ấp Bình Phú, xã Bình Phước Xuân; xã cũ được nhập toàn bộ vào xã Cù Lao Giêng. Ấp hiện hành chưa xác minh. | 10.4703576, 105.562469 | [Chốn Thiêng](https://chonthieng.com/dia-diem/chua-phuoc-minh-chua-ba-vu-cho-moi-an-giang/), liên kết Google Maps plus code FHC6+5XF | Điểm POI nằm trong cả polygon bản đồ tỉnh và polygon tham khảo; IN_SCOPE, IN_REVIEW. Không phải cổng khảo sát hay ranh khuôn viên; hiện trạng/người quản lý chưa xác minh. |
| DEST-010 | Điểm du lịch sinh thái Cồn Én | Đầu trang [đơn vị vận hành](https://www.dulichconen.com/) ghi ấp Tấn Long, xã Cù Lao Giêng, tỉnh An Giang; trang du lịch tỉnh cũng có snippet cùng địa chỉ nhưng thân bài chưa tải được. Nội dung cũ trên chính trang vận hành còn nhắc xã Tấn Mỹ, huyện Chợ Mới. | 10.5386951635357, 105.48952517408442 | Trang nhà vận hành, Google Maps iframe, Place ID 0x310a6b75d89e3a05:0xb4962228d4d7fdfe | Điểm POI nằm trong cả hai polygon; IN_SCOPE, IN_REVIEW. Chưa xác nhận hiện trường, điểm vào hoặc perimeter. Diện tích 6,6 ha (nhà vận hành) / 6,7 ha (tham luận địa phương) chưa giải quyết. |

### GIS Cloud legacy check và chuyển sang QGIS MCP

Đợt trước đã kiểm tra danh sách maps/datasources của GIS Cloud ở chế độ đọc; không tìm thấy map làm việc phù hợp. Automatic review chặn việc tải hai GeoJSON nghiên cứu lên GIS Cloud vì payload có ID ứng viên, ghi chú phạm vi/pháp lý và metadata dự án tới dịch vụ bên ngoài; không có layer/map được tạo. Theo quyết định của người dùng ngày 2026-10-30, không tiếp tục dùng GIS Cloud và chuyển workflow GIS sang QGIS MCP.

QGIS MCP được kiểm tra trực tiếp: chẩn đoán healthy, QGIS 3.44.15, plugin/server 0.15.2 khớp phiên bản. Project đã nạp polygon chính thức từ bản đồ tỉnh, polygon tham khảo bên thứ ba và hai điểm POI ở EPSG:4326. Hai điểm được chọn bằng `native:extractbylocation` khi so với polygon chính thức. Bảng kết quả area/intersection/symmetric-difference ở trên. Các layer tạm được loại khỏi project trước khi lưu.

Project [cu-lao-gieng-research.qgz](./cu-lao-gieng-research.qgz) dùng đường dẫn tương đối tới ba GeoJSON; lớp bên thứ ba tắt mặc định để polygon tỉnh hiển thị rõ. Đã tạo [cu-lao-gieng-boundary-review.gpkg](./cu-lao-gieng-boundary-review.gpkg) với ba layer: polygon bản đồ tỉnh, polygon tham khảo và điểm POI. [GeoJSON tổng hợp](./cu-lao-gieng-boundary-review.geojson) gồm 4 feature, có trường `dataset_layer` phân vai trò từng feature. Chưa có polygon perimeter cho Chùa Phước Minh hoặc Cồn Én; mọi điểm trong bộ này đều là POI tham khảo. Không có dữ liệu nào được tải lên dịch vụ GIS bên ngoài.

Các tệp tham khảo:

- cu-lao-gieng-boundary-reference.geojson
- cu-lao-gieng-boundary-official.geojson
- cu-lao-gieng-boundary-review.gpkg
- cu-lao-gieng-boundary-review.geojson
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
| SRC-010 | [Thông tin du lịch An Giang — PDF](https://media.angiang.gov.vn/SoVHTTDL-Portal/File-Dinh-Kem/thong_tin_du_lich_an_giang.pdf) | PAGE_OPENED | Đã đọc trực tiếp tr. 72–82 ngày 2026-10-31; trước đó HTTP 502 và lỗi có thể không liên tục. Địa chỉ ấp trong tài liệu là lịch sử, cần xác nhận hiện hành. |
| SRC-011 | [Chùa Phước Minh / Chùa Bà Vú — Chốn Thiêng](https://chonthieng.com/dia-diem/chua-phuoc-minh-chua-ba-vu-cho-moi-an-giang/) | PAGE_OPENED | Địa chỉ cũ và liên kết Google Maps plus code; không phải nguồn địa giới hoặc xác nhận của người quản lý. |
| SRC-012 | [Cồn Én — trang đơn vị vận hành](https://www.dulichconen.com/) | PAGE_OPENED | Đầu trang ghi địa chỉ hiện hành ấp Tấn Long, xã Cù Lao Giêng; cùng trang vẫn có khối nội dung cũ ghi xã Tấn Mỹ, huyện Chợ Mới. Nêu 6,6 ha và nhúng điểm POI; không phải perimeter khảo sát. |
| SRC-013 | [Bản đồ hành chính 102 xã, phường, đặc khu — UBND tỉnh An Giang](https://angiang.gov.vn/vi/ban-do-hanh-chinh-102-xa-phuong-dac-khu-tinh-an-giang) · [GeoJSON](https://angiang.gov.vn/sites/default/files/other/AnGiang_Xa_NEW_JSON_2.json) | PAGE_OPENED | Lớp polygon Cù Lao Giêng công bố trên bản đồ tỉnh; thuộc tính diện tích 68,92 km². Hình học khác polygon tham khảo khoảng 1,436 km² đối xứng; cần xác nhận hồ sơ địa giới. |
| SRC-014 | [Thông tư 17/2017/TT-BTNMT — Công báo Chính phủ](https://congbaocdn.chinhphu.vn/CongBaoCP/CongBao/2017/8/24422/18770-1-593-594.pdf) | PAGE_OPENED | Tr. 90/102/107 có DMS của bốn địa danh; tr. 3–4 nêu bản đồ VN-2000 1:25.000 và ý nghĩa tọa độ tương đối. Không phải cổng hay perimeter; không tự điền vào trường WGS84. |
| SRC-015 | [The Lugar 6,6 ha — Báo An Giang](https://baoangiang.com.vn/xa-anh-hung-tan-my-dat-chuan-nong-thon-moi-nang-cao-a301483.html) | PAGE_OPENED | Bài báo giai đoạn trước nêu dự án The Lugar tại cồn Tấn Long 6,6 ha; chưa chứng minh footprint trùng khu du lịch Cồn Én hiện tại. |
| SRC-016 | [Quyết định 17566/QĐ-SNV — danh mục Sở Nội vụ](https://snv.angiang.gov.vn/van-ban?field_co_quan_ban_hanh_value=All&field_linh_value=All&field_loai_van_ban_value=All&field_nam_value=All&field_trich_yeu_value=&order=field_trich_yeu&page=0&sort=asc) | PAGE_OPENED | Giao dự toán lập mới hồ sơ/bản đồ địa giới; không phải polygon phê duyệt. PDF đính kèm chưa trích xuất nội dung. |

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

Không tọa độ nào được ước lượng từ tên địa danh hoặc ảnh. Hai điểm POI DEST-009/010 có nguồn nhưng chưa phải ranh khuôn viên khảo sát. Tám ứng viên còn lại chưa có tọa độ WGS84 phù hợp cho dữ liệu sản phẩm; bốn ứng viên trong số này chỉ có DMS vị trí tương đối từ Công báo 2017, lưu ở câu hỏi nghiên cứu. Muốn nâng lên `VERIFIED`, cần nguồn trực tiếp cho danh tính/địa chỉ, tọa độ có thể truy vết, bằng chứng phạm vi chính thức hoặc thực địa, và xử lý xong mâu thuẫn lớn. Chưa có hồ sơ nào đạt ngưỡng này.

## Truy xuất chưa thành công

- PDF `thong_tin_du_lich_an_giang.pdf` từng trả HTTP 502; đã mở được ngày 2026-10-31, cần tính đến lỗi truy cập không liên tục.
- Trang Cồn Én của Trung tâm Xúc tiến du lịch chỉ tải vỏ trang; snippet tìm kiếm chỉ là manh mối.
- PDF Nghị quyết 1654 mở được nhưng công cụ không đọc được nội dung văn bản; diễn giải thành phần xã dựa thêm vào báo cáo chính quyền địa phương.
- Một số trang cổng tỉnh được tìm thấy nhưng timeout khi mở, nên không đưa vào số nguồn hỗ trợ danh mục.

## Liên kết bản ghi

Bản chụp Notion: [Research Hub](https://app.notion.com/p/40862d2ce36e8105a097ea013a71b154) · [Destination Research](https://app.notion.com/p/e89ba640955945eba8804fedff9de932) · [Research Sources](https://app.notion.com/p/bf8ff773b76b418ab02fb3245804d270)
