# API application

Backend dùng NestJS 11 với Fastify, Prisma 7.8 và PostgreSQL mặc định; SQLite file có thể chọn bằng USE_SQLITE=true.

## Chạy

Cấu hình JWT_SECRET bắt buộc và DATABASE_URL cho PostgreSQL trong apps/api/.env. Có thể dùng PORT để đổi cổng (mặc định 3001). Với SQLite, cấu hình USE_SQLITE=true; dữ liệu mặc định lưu ở apps/api/dev.db. SQLITE_DATABASE_FILE có thể chọn một tên file khác trong apps/api, ví dụ e2e.db.

Sau khi chọn provider, từ apps/api chạy `pnpm exec prisma generate`, sau đó sao lưu database đang dùng và chạy `pnpm exec prisma db push`. Prisma Client được sinh cho một provider tại một thời điểm; khi đổi giữa SQLite và PostgreSQL phải sinh lại client với `USE_SQLITE` tương ứng trước khi khởi động API. Không chạy `db push` hoặc seed lên database chưa được xác định và sao lưu. Có thể khởi động cả workspace bằng `pnpm dev` hoặc riêng API bằng `pnpm --filter api dev`. Docker Compose khởi động PostgreSQL/PostGIS và Redis; API hiện chưa dùng Redis hoặc truy vấn PostGIS.

Web Playwright E2E dùng `apps/api/e2e.db` qua `pnpm --filter api e2e:serve`; lệnh này sinh Prisma Client SQLite, đồng bộ schema vào database thử nghiệm và chạy API. File này tách khỏi `dev.db`, nhưng vẫn là file bền vững, được Git bỏ qua. Trước khi chạy API PostgreSQL trở lại, sinh lại Prisma Client cho PostgreSQL. Môi trường chạy test cần cho phép truy cập `localhost:3000` và `localhost:3001`.

## API hiện có

- POST /auth/register
- POST /auth/login
- GET /destinations
- GET /destinations/:id

Destination endpoint hiện là read-only và chưa gắn AuthGuard. Xem [API Reference](../../docs/API_REFERENCE.md) để biết request/response. Seed PostgreSQL xóa User, Destination và Landmark trước khi tạo lại dữ liệu mẫu; không chạy trên database có dữ liệu cần giữ.

Lệnh có trong package: pnpm --filter api test, pnpm --filter api test:e2e, pnpm --filter api build. Đây là danh sách script, không phải kết quả xác nhận lần chạy gần nhất.
