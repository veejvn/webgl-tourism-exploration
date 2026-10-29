# API application

Backend dùng NestJS 11 với Fastify, Prisma 7.8 và PostgreSQL mặc định; SQLite file có thể chọn bằng USE_SQLITE=true.

## Chạy

Cấu hình JWT_SECRET bắt buộc và DATABASE_URL cho PostgreSQL trong apps/api/.env. Có thể dùng PORT để đổi cổng (mặc định 3001). Với SQLite, cấu hình USE_SQLITE=true; dữ liệu lưu ở apps/api/dev.db.

Sau khi chọn database, chạy npx prisma db push từ apps/api, rồi khởi động cả workspace bằng pnpm dev hoặc riêng API bằng pnpm --filter api dev. Docker Compose khởi động PostgreSQL/PostGIS và Redis; API hiện chưa dùng Redis hoặc truy vấn PostGIS.

## API hiện có

- POST /auth/register
- POST /auth/login
- GET /destinations
- GET /destinations/:id

Destination endpoint hiện là read-only và chưa gắn AuthGuard. Xem [API Reference](../../docs/API_REFERENCE.md) để biết request/response. Seed PostgreSQL xóa User, Destination và Landmark trước khi tạo lại dữ liệu mẫu; không chạy trên database có dữ liệu cần giữ.

Lệnh có trong package: pnpm --filter api test, pnpm --filter api test:e2e, pnpm --filter api build. Đây là danh sách script, không phải kết quả xác nhận lần chạy gần nhất.
