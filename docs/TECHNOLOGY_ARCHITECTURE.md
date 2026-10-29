# Kiến trúc công nghệ

> Cập nhật: 2026-10-29
> Quy ước: **Current** là công nghệ có trong manifest/cấu hình và được dùng trong mã; **Target/Unverified** là định hướng hoặc tích hợp chưa có bằng chứng. Việc xuất hiện trong dependency chưa chứng minh một tính năng sản phẩm hoàn chỉnh.

## Current — công nghệ trong repository

| Vùng | Công nghệ và bằng chứng |
|---|---|
| Monorepo | pnpm 9 workspace (`apps/*`, `packages/*`) và Turborepo 2. |
| Web | Next.js 16.2.10 App Router, React 19, TypeScript, Tailwind CSS 4. |
| Data/UI web | TanStack Query, Axios, Zustand, React Hook Form, Zod, Sonner. |
| Bản đồ | Mapbox GL JS; token đọc từ `NEXT_PUBLIC_MAPBOX_TOKEN`. Trang bản đồ lấy điểm đến qua hook/API service. |
| 3D | Three.js, React Three Fiber, `@react-three/drei`. Scene hiện dựng hình học cơ bản; chưa thấy loader model GLB/GLTF, physics engine hay bộ animation. |
| API | NestJS 11, Fastify adapter, TypeScript, class-validator. |
| Data access | Prisma 7.8; `PrismaPg` cho PostgreSQL và `PrismaBetterSqlite3` khi `USE_SQLITE=true`. |
| Database | PostgreSQL là provider mặc định; schema thay thế dùng SQLite. Docker Compose khai báo image PostGIS. Prisma lưu `latitude`/`longitude` dạng `Float`; chưa thấy cột geometry, extension/migration PostGIS hay truy vấn không gian. |
| Auth | JWT HS256 tự ký/kiểm tra bằng Node `crypto`; mật khẩu mới dùng scrypt, có nhánh xác minh hash SHA-256 cũ. Frontend lưu token qua localStorage. |
| Shared code | `@project/types`, `@project/constants` là hai package workspace hiện có. |

Cấu hình phiên bản nằm trong `apps/web/package.json`, `apps/api/package.json`, `package.json`, `pnpm-workspace.yaml`, `apps/api/prisma.config.ts` và `docker/docker-compose.yml`.

## Tích hợp chưa có bằng chứng triển khai

- **PostGIS:** chỉ xác minh được image PostGIS trong Docker Compose; schema và query hiện dùng tọa độ số thông thường.
- **Redis:** có service trong Compose nhưng API chưa có client/module sử dụng.
- **OAuth/Passport:** không có provider hoặc luồng OAuth hiện hành.
- **Gemini/AI Guide:** nút UI có thông báo sẽ kết nối sau; chưa có dịch vụ gọi model hoặc API AI.
- **Supabase Storage, Nginx, Vercel và GitHub Actions:** chưa tìm thấy tích hợp cấu hình trong phạm vi repository đã kiểm tra.
- **Rapier, Howler, Mixamo/Blender pipeline:** chưa thấy tích hợp runtime trong mã hiện tại.
- `AI_TOUR_GUIDE_PROMPT` và `API_ROUTES.AUTH.ME` trong package constants là hằng số; chúng không chứng minh đã có endpoint AI hoặc `/auth/me`.

## Target — chưa phải quyết định công nghệ hoàn tất

Các quyết định nghiệp vụ về Cù Lao Giêng, biên tập song ngữ, nguồn tư liệu, phiên bản scene, hành trình, tiến trình và đề xuất cộng đồng đã được ghi trong [Product Scope & Domain](./PRODUCT_SCOPE_AND_DOMAIN.md). Việc chọn nhà cung cấp AI/storage, mô hình lưu dữ liệu không gian và chi tiết triển khai CMS vẫn **chưa xác minh/chưa được chốt trong mã**.

Tổ chức thành modular monolith theo Bounded Context là hướng kiến trúc mục tiêu để xem xét; cấu trúc NestJS hiện tại mới có `auth`, `users`, `destinations`, chưa phản ánh đầy đủ các context mục tiêu. Không có bằng chứng cho microservices.
