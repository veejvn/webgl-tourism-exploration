# Hướng dẫn dành cho agent — Cù Lao Giêng 3D Explorer

Cập nhật 2026-10-29. Mã nguồn/cấu hình là căn cứ cho hiện trạng; Product Scope xác nhận hướng nghiệp vụ mục tiêu. Chỉ mô tả tính năng là hiện hành khi tìm được bằng chứng trong code.

## 1. Khảo sát code

- Ưu tiên công cụ CodeGraph codegraph_explore để tìm symbol, luồng gọi và source trước khi dùng grep/read thủ công.
- Nếu CodeGraph không có index hoặc chưa bao phủ loại file cần xem, dùng công cụ file phù hợp.
- Đọc hướng dẫn tại apps/web/AGENTS.md trước khi sửa code Next.js 16; làm theo hướng dẫn phiên bản trong node_modules/next/dist/docs/ khi cần.
- Tài liệu nghiệp vụ: docs/PRODUCT_SCOPE_AND_DOMAIN.md. Hiện trạng API: docs/API_REFERENCE.md. Kiến trúc hiện tại: docs/SYSTEM_ARCHITECTURE.md.

## 2. Workspace và lệnh

Repository dùng pnpm 9/Turborepo 2; workspace hiện có apps/web, apps/api, packages/types, packages/constants.

- Chạy cả web và API: **pnpm dev**.
- Chạy riêng web/API: **pnpm --filter web dev**, **pnpm --filter api dev**.
- Web dùng cổng Next.js mặc định 3000 (script next dev không ghim cổng).
- API nghe PORT, mặc định 3001; CORS hiện chỉ cho http://localhost:3000.
- Build: **pnpm build**.
- Lint: **pnpm lint**. Lưu ý script lint của API có --fix và có thể sửa file.
- API unit test: **pnpm --filter api test**.
- API E2E: **pnpm --filter api test:e2e**.
- Web E2E: **pnpm --filter web test:e2e**. Root pnpm test không gọi script test:e2e này.

## 3. Biến môi trường và database

Web đọc NEXT_PUBLIC_API_URL và NEXT_PUBLIC_MAPBOX_TOKEN. apps/web/.env.example hiện chỉ có tên biến Mapbox; cấu hình URL API trong .env.local.

API cần JWT_SECRET; PostgreSQL mode đọc DATABASE_URL. PORT và USE_SQLITE là tùy chọn. Không ghi giá trị secret, password hay token vào tài liệu hoặc commit.

PostgreSQL là mặc định. Lệnh docker compose -f docker/docker-compose.yml up -d tạo PostgreSQL với image PostGIS và Redis; API hiện chưa dùng Redis và Prisma schema chưa dùng geometry/PostGIS query.

Prisma config chọn schema.prisma theo mặc định hoặc schema.sqlite.prisma khi USE_SQLITE=true. SQLite lưu tại apps/api/dev.db (file bền vững, không phải in-memory) và service tự seed điểm đến/landmark khi bảng destination rỗng. Đồng bộ schema bằng npx prisma db push từ thư mục apps/api.

### Seed PostgreSQL

apps/api/prisma/seed.ts dùng PrismaPg và xóa toàn bộ User, Destination, Landmark trước khi tạo dữ liệu mẫu. Chỉ chạy với PostgreSQL/database có thể làm mới; không chạy khi có dữ liệu cần giữ và không dùng cho SQLite mode. Seed hiện chứa dataset mẫu An Giang/khu vực lân cận, chưa phải nội dung Cù Lao Giêng đã được xác minh.

Nếu phát sinh lỗi Prisma client/Junction trên Windows, xác định đúng client trong pnpm store hiện tại trước khi tạo junction; không dùng đường dẫn chứa phiên bản pnpm store cố định từ tài liệu cũ.

## 4. Hiện trạng sản phẩm

- API hiện có register/login và đọc destination list/detail; API reference không được thêm route chưa tồn tại.
- AuthGuard chưa gắn vào controller hiện hành. AuthHydration hiện redirect khách khỏi /explore; đừng mô tả đây là bảo vệ server-side.
- WorldScene là demo hình khối; destination id chưa chọn scene riêng.
- Homepage hiện là placeholder. AI, CMS, translations/sources, itinerary, progress, community, NPC và quest chưa có luồng sản phẩm hoàn chỉnh.
- Bounded Context và ERD trong Product Scope là mục tiêu/khái niệm, không phải module hoặc Prisma schema hiện hành.
- Khi sửa packages/types hoặc packages/constants, build package liên quan để cập nhật dist.

## 5. Các lưu ý kỹ thuật đã xác minh

- JWT_SECRET thiếu sẽ làm API dừng khi load JWT helper.
- Prisma PostgreSQL và SQLite dùng schema riêng; thay đổi schema phải xét cả hai nếu tính năng cần hỗ trợ cả hai.
- WorldScene dùng Sky của drei; thuộc tính turbidity có kiểu số.
- Không chạy seed PostgreSQL chỉ để kiểm tra vì script xóa dữ liệu trước.
