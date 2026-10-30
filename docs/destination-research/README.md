# Cù Lao Giêng — Destination Research

Tập dữ liệu này là **bản chụp nghiên cứu ngày 2026-10-30** để con người rà soát. Đây không phải danh mục du lịch đã xác minh, dữ liệu sản phẩm, API contract hay nội dung để nhập vào ứng dụng.

## Phạm vi hành chính

Đơn vị nghiên cứu là **xã Cù Lao Giêng hiện hành, tỉnh An Giang**. Nghị quyết 1654/NQ-UBTVQH15 là căn cứ sắp xếp xã năm 2025; báo cáo địa phương nêu xã được hình thành từ toàn bộ Tấn Mỹ, Mỹ Hiệp và Bình Phước Xuân. UBND xã mô tả xã là cù lao trên sông Tiền, diện tích 68,92 km². Đã lấy được polygon tham khảo bên thứ ba từ tinhthanhpho.com; polygon này không thay thế hồ sơ địa giới chính thức.

- [Nghị quyết 1654/NQ-UBTVQH15](https://vanban.chinhphu.vn/?docid=214010&pageid=27160)
- [Giới thiệu chung — UBND xã Cù Lao Giêng](https://culaogieng.angiang.gov.vn/gioi-thieu-chung)
- [Tài liệu tham luận của Đảng ủy xã trên cổng Sở VHTT An Giang](https://svhtt.angiang.gov.vn/sites/default/files/2025-10/6.2%20Cac%20Tham%20luan.pdf)

## Tình trạng bản chụp

- 10 ứng viên: 10 `IN_REVIEW`, 0 `SCOPE_UNCLEAR`.
- Cả 10 hồ sơ được gán `IN_SCOPE`; vị trí đại diện của Chùa Phước Minh và Cồn Én nằm trong polygon tham khảo. Cần dùng nguồn địa giới chính thức và xác minh thực địa trước khi chốt phạm vi khuôn viên.
- 0 hồ sơ `VERIFIED`; 8/10 ứng viên còn thiếu tọa độ có nguồn.
- 12 nguồn được đăng ký: 10 trang/PDF mở được, 1 kết quả tìm kiếm chưa mở được trang gốc, 1 lỗi truy xuất. Polygon hành chính là dataset bên thứ ba, được ghi attribution riêng trong tệp GeoJSON.
- Tên tiếng Anh chính thức để trống; không dịch tên địa điểm thành tên chính thức.

## Tệp

- [destination-catalog.csv](./destination-catalog.csv): bảng phẳng; `source_ids` là danh sách mã nguồn phân tách bằng dấu chấm phẩy.
- [destinations.json](./destinations.json): bản xuất có metadata, nguồn, trạng thái phạm vi và hồ sơ địa điểm.
- [verification-log.md](./verification-log.md): nhật ký nguồn, phạm vi và các điểm chưa xác minh.
- [cu-lao-gieng-boundary-reference.geojson](./cu-lao-gieng-boundary-reference.geojson): polygon xã Cù Lao Giêng bên thứ ba, mã 30643, dataset version 2026.10.8; không phải hồ sơ địa giới chính thức.
- [priority-candidates-reference.geojson](./priority-candidates-reference.geojson): hai điểm POI có tọa độ nguồn cho DEST-009 và DEST-010; không phải điểm khảo sát ranh khuôn viên.
- [cu-lao-gieng-research.qgz](./cu-lao-gieng-research.qgz): project QGIS MCP cục bộ, hai layer EPSG:4326, tham chiếu GeoJSON bằng đường dẫn tương đối.

## Trạng thái

- `IN_REVIEW`: có nguồn cho tên/ứng viên nhưng còn thiếu xác minh trực tiếp, tọa độ, địa chỉ hoặc quyền tiếp cận.
- `SCOPE_UNCLEAR`: chưa chứng minh địa điểm nằm trong xã hiện hành.
- `VERIFIED`: chỉ dùng khi danh tính, phạm vi, nguồn trực tiếp, tọa độ có nguồn và các mâu thuẫn quan trọng đã được xử lý.
- `UNVERIFIED`/ `REJECTED`: dành cho manh mối chưa đủ bằng chứng hoặc bị loại sau khi kiểm tra.

## Quy tắc dữ liệu

- Không suy đoán tọa độ, địa chỉ cấp ấp, giờ mở cửa, giá vé, quyền tham quan, danh hiệu di tích, tên tiếng Anh hoặc lịch sử.
- Mốc lịch sử/xếp hạng do báo chí nêu được ghi rõ là claim cần đối chiếu hồ sơ gốc.
- `3D Priority` là đề xuất cho thứ tự nghiên cứu, không xác nhận giá trị di sản, sự đồng ý của cơ sở, hay quyền chụp/scan.
- Với cơ sở tôn giáo và phủ thờ, phải xác nhận người quản lý, khu vực được tiếp cận và quy tắc ghi hình trước khi khảo sát.
- Giữ ổn định ID `DEST-###` và `SRC-###`; cập nhật bản ghi hiện có thay vì nhân đôi.
- Không đồng bộ các trạng thái đang nghiên cứu vào website, API, Prisma, Mapbox hay seed dữ liệu.

## Rules for AI Agents

1. Luôn đọc danh mục trước khi đề xuất địa điểm mới.
2. Tìm ID và tên tương đương để tránh trùng lặp.
3. Phân biệt dữ liệu nguồn, dữ liệu suy luận và giả thuyết.
4. Không tự đổi `verificationStatus` thành `VERIFIED` nếu chưa có bằng chứng.
5. Không tự bịa tọa độ, niên đại, nguồn hoặc bản dịch tên chính thức.
6. Giữ ID ổn định.
7. Không dùng dữ liệu chưa xác minh làm nội dung lịch sử chính thức.
8. Không tự thay thế dữ liệu hiện tại của Mapbox, API hoặc Prisma.
9. Khi cập nhật dữ liệu, nêu rõ các bản ghi được thêm, sửa, loại bỏ hoặc còn nghi vấn.
10. Trước khi đưa dữ liệu vào ứng dụng, cần có bước review và kiểm tra schema riêng.

## Notion

- [Cù Lao Giêng — Research Hub](https://app.notion.com/p/40862d2ce36e8105a097ea013a71b154)
- [Cù Lao Giêng — Destination Research](https://app.notion.com/p/e89ba640955945eba8804fedff9de932)
- [Cù Lao Giêng — Research Sources](https://app.notion.com/p/bf8ff773b76b418ab02fb3245804d270)

Bảng Destination Research có các view: All Candidates, Needs Research, Verified, Scope Unclear, Missing Coordinates, Missing Sources, và 3D Candidates.
