# Cù Lao Giêng — Destination Research

Tập dữ liệu này là **bản chụp nghiên cứu ngày 2026-10-31** để con người rà soát. Đây không phải danh mục du lịch đã xác minh, dữ liệu sản phẩm, API contract hay nội dung để nhập vào ứng dụng.

## Phạm vi hành chính

Đơn vị nghiên cứu là **xã Cù Lao Giêng hiện hành, tỉnh An Giang**. Nghị quyết 1654/NQ-UBTVQH15 là căn cứ sắp xếp xã năm 2025. Đã trích polygon MultiPolygon Cù Lao Giêng từ GeoJSON 102 đơn vị trên bản đồ hành chính cổng UBND tỉnh An Giang; tệp nguồn có `Last-Modified: 2025-08-15`. Đây là polygon được công bố trong bản đồ hành chính chính thức của tỉnh, nhưng chưa được đối chiếu với bộ hồ sơ địa giới đã phê duyệt. Polygon tham khảo bên thứ ba vẫn được giữ riêng: QGIS đo chênh đối xứng khoảng 1,436 km² giữa hai lớp.

- [Nghị quyết 1654/NQ-UBTVQH15](https://vanban.chinhphu.vn/?docid=214010&pageid=27160)
- [Giới thiệu chung — UBND xã Cù Lao Giêng](https://culaogieng.angiang.gov.vn/gioi-thieu-chung)
- [Tài liệu tham luận của Đảng ủy xã trên cổng Sở VHTT An Giang](https://svhtt.angiang.gov.vn/sites/default/files/2025-10/6.2%20Cac%20Tham%20luan.pdf)
- [Bản đồ hành chính 102 xã, phường, đặc khu — UBND tỉnh An Giang](https://angiang.gov.vn/vi/ban-do-hanh-chinh-102-xa-phuong-dac-khu-tinh-an-giang) · [GeoJSON của bản đồ](https://angiang.gov.vn/sites/default/files/other/AnGiang_Xa_NEW_JSON_2.json)

## Tình trạng bản chụp

- 10 ứng viên: 10 `IN_REVIEW`, 0 `SCOPE_UNCLEAR`.
- Cả 10 hồ sơ được gán `IN_SCOPE`; hai điểm POI DEST-009/010 nằm trong polygon bản đồ tỉnh và polygon bên thứ ba. Hai polygon xã sai khác hình học khoảng 1,436 km²; cần cơ quan địa phương xác nhận hồ sơ địa giới chuẩn. Không polygon nào mô tả perimeter khuôn viên hai địa điểm.
- 0 hồ sơ `VERIFIED`; 8/10 ứng viên còn thiếu tọa độ WGS84 có nguồn phù hợp. Công báo năm 2017 có vị trí địa danh tương đối VN-2000 cho 4 ứng viên trong nhóm này; chưa chuyển chúng thành điểm WGS84, cổng vào hoặc perimeter.
- 15 nguồn được đăng ký: 14 trang/PDF/GeoJSON mở được, 1 nguồn chỉ có kết quả tìm kiếm. PDF SRC-010 mở được ngày 2026-10-31 nhưng vẫn có lúc trả HTTP 502.
- Tên tiếng Anh chính thức để trống; không dịch tên địa điểm thành tên chính thức.

## Tệp

- [destination-catalog.csv](./destination-catalog.csv): bảng phẳng; `source_ids` là danh sách mã nguồn phân tách bằng dấu chấm phẩy.
- [destinations.json](./destinations.json): bản xuất có metadata, nguồn, trạng thái phạm vi và hồ sơ địa điểm.
- [verification-log.md](./verification-log.md): nhật ký nguồn, phạm vi và các điểm chưa xác minh.
- [cu-lao-gieng-boundary-official.geojson](./cu-lao-gieng-boundary-official.geojson): feature Cù Lao Giêng trích từ GeoJSON bản đồ hành chính của UBND tỉnh An Giang; source/date/status được ghi trong metadata và thuộc tính.
- [cu-lao-gieng-boundary-reference.geojson](./cu-lao-gieng-boundary-reference.geojson): polygon xã Cù Lao Giêng bên thứ ba, mã 30643, dataset version 2026.10.8; không phải hồ sơ địa giới chính thức.
- [priority-candidates-reference.geojson](./priority-candidates-reference.geojson): hai điểm POI có tọa độ nguồn cho DEST-009 và DEST-010; không phải điểm khảo sát ranh khuôn viên.
- [cu-lao-gieng-boundary-review.gpkg](./cu-lao-gieng-boundary-review.gpkg): GeoPackage có ba layer `Cù Lao Giêng — official provincial map 2025`, `Third-party boundary — reference only`, `DEST-009/010 — sourced POI reference points`.
- [cu-lao-gieng-boundary-review.geojson](./cu-lao-gieng-boundary-review.geojson): GeoJSON FeatureCollection gộp 1 polygon bản đồ tỉnh, 1 polygon tham khảo và 2 điểm POI; `dataset_layer` phân biệt vai trò.
- [field-verification-template.csv](./field-verification-template.csv): hai dòng DEST-009/010 đã điền ID và tên; các trường địa chỉ, điểm vào, perimeter, diện tích/cách tính, ngày khảo sát và từng loại cho phép để trống. Chưa có quan sát thực địa nào được ghi.
- [cu-lao-gieng-research.qgz](./cu-lao-gieng-research.qgz): project QGIS MCP cục bộ với ba layer EPSG:4326; lớp bên thứ ba tắt mặc định để không che polygon tỉnh.

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
