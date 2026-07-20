# Nền tảng Du lịch 3D (3D Tourism Platform) - Memory Bank

## 1. Tổng hợp tài liệu dự án
Dự án được xây dựng dưới dạng Monorepo sử dụng **Turborepo** và **pnpm**, cho phép quản lý Frontend và Backend trong cùng một repository. Mục tiêu là xây dựng nền tảng quảng bá du lịch 3D bằng WebGL.

### Kiến trúc thư mục (Monorepo)
- **`apps/web`**: Frontend Next.js 15 (App Router). Chứa UI tương tác người dùng, 3D WebGL (Three.js), và CMS Dashboard.
- **`apps/api`**: Backend NestJS. Xử lý API, tích hợp PostgreSQL, Redis, Authentication và AI.
- **`apps/docs`**: Tài liệu dự án.
- **`packages/*`**: Các thư viện mã nguồn chia sẻ chung giữa frontend và backend (`@project/types`, `@project/constants`).
- **`docker/`**, **`.github/`**: Cấu hình triển khai, DevOps và CI/CD.

### Kiến trúc công nghệ chính
- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, Zustand, TanStack Query.
- **3D & Bản đồ**: Three.js, React Three Fiber, Mixamo, Mapbox GL JS.
- **Backend**: NestJS, Fastify, Prisma ORM, PostgreSQL + PostGIS, Redis.
- **AI**: Gemini API (dùng cho Hướng dẫn viên AI, Chatbot).
- **Storage & Auth**: Supabase Storage, JWT, OAuth 2.0 (Google, Facebook, GitHub).

## 2. Nhật ký thực thi
- **Phiên làm việc ngày 02/07/2026**:
  - Đọc và phân tích kiến trúc từ `FOLDER_ARCHITECTURE.md` và `TECHNOLOGY_ARCHITECTURE.md`.
  - Khởi tạo toàn bộ cấu trúc cây thư mục rỗng cho `apps/*`, `packages/*`, `docker`, `scripts`, và `.github/workflows` dựa trên thiết kế Monorepo.
  - Thiết lập cấu hình pnpm workspace: tạo file `pnpm-workspace.yaml`.
  - Thiết lập package gốc và Turborepo: tạo file `package.json` và `turbo.json`.
  - Chạy `pnpm install` ở thư mục gốc để cài đặt `turbo` và `prettier`, thiết lập thành công `pnpm-lock.yaml`.

- **Phiên làm việc ngày 08/07/2026**:
  - Viết Spec và Implementation Plan cho 5 bước phát triển cốt lõi của dự án và lưu vào `docs/superpowers/plans/2026-07-08-3d-tourism-core.md`.
  - **Task 1**: Tạo `docker/docker-compose.yml` tích hợp PostGIS & Redis. Định nghĩa Schema Prisma với các model `User`, `Destination`, và `Landmark`. Viết seed logic cho dữ liệu mẫu Hà Nội, Huế, Hội An và cấu hình prisma seed script.
  - **Task 2**: Khởi tạo 2 shared packages dùng chung `@project/types` và `@project/constants` trong `packages/` và đồng bộ hóa làm việc trong Monorepo bằng pnpm workspace.
  - **Task 3**: Triển khai Backend Core với NestJS: Tích hợp `PrismaModule` toàn cục, viết module `Users`, `Destinations`, và Module `Auth` (sử dụng mật mã `crypto` tạo mã băm mật khẩu và tự sinh chữ ký mã hóa JWT Token HS256 chuẩn không phụ thuộc thư viện ngoài).
  - **Task 4**: Triển khai Frontend Core: Tích hợp Mapbox GL JS vào trang `/map` hiển thị bản đồ di sản 2D, bay mượt mà đến các địa điểm và hiển thị mô tả tương tác. Dựng Zustand Store (`player.store`, `ui.store`) để quản lý tọa độ 3D và giao diện.
  - **Task 5**: Thiết lập 3D Engine: Phát triển `WorldScene.tsx` dựa trên React Three Fiber và `@react-three/drei` (với Grid, Sky, Ánh sáng, mô phỏng chướng ngại vật di tích). Viết component `PlayerController.tsx` bắt sự kiện bàn phím (W, A, S, D, Shift chạy nhanh) để điều khiển, di chuyển, xoay mượt mà Mesh nhân vật và lưu tọa độ thời gian thực vào Zustand Store. 
  - Khắc phục lỗi TypeScript Sky turbidity và Next.js Static render Suspense trên route `/explore`.
  - Toàn bộ monorepo (`@project/types`, `@project/constants`, `apps/api`, `apps/web`) biên dịch (build) thành công 100% không có cảnh báo hay lỗi.

- **Phiên làm việc ngày 09/07/2026 (Phiên làm việc hiện tại)**:
  - **Điều chỉnh cấu hình port**: Thiết lập cổng mặc định cố định cho dự án. Ép buộc **Frontend (Next.js)** chạy cổng `3000` thông qua `"dev": "next dev -p 3000"` trong `apps/web/package.json`, và cấu hình **Backend (NestJS)** chạy cổng `3001` qua `PORT=3001` trong `apps/api/.env`.
  - **Khắc phục triệt để lỗi nạp hạt DB (Prisma Seeding) trên Windows**:
    1. Thiết lập file `prisma.config.ts` ở NestJS Backend, cấu hình đường dẫn `seed: "ts-node ./prisma/seed.ts"` khớp chuẩn cấu hình mới của Prisma v6/v7.
    2. Giải quyết lỗi không thể khởi tạo `PrismaClient` trong các file chạy trực tiếp `ts-node` trên môi trường Windows bằng việc tạo Junction Symlink thư mục ảo `.prisma/client` từ thư mục `.pnpm` gốc vào cục bộ `apps/api/node_modules/.prisma`.
    3. Nạp `dotenv/config` đồng bộ trước khi gọi constructor của `PrismaClient` giúp hạt giống dữ liệu (`npx prisma db seed`) hoạt động 100% thành công không có lỗi.
  - **Tạo tài liệu chỉ dẫn Agent (`AGENTS.md`)**: Biên soạn cẩm nang tóm tắt các lệnh quan trọng, kiến trúc di động và cách khắc phục lỗi symlink/seed nhanh gọn dành riêng cho các phiên Agent làm việc tiếp theo trong repository.
  - Kiểm thử, commit và push toàn bộ mã nguồn lên Git repository từ nhánh `main` thành công.

## 3. Kế hoạch cho phiên làm việc tiếp theo
- **Bước 1**: Kết nối API Next.js frontend với NestJS backend qua Axios/TanStack Query thay vì dùng dữ liệu Mock tĩnh hoàn toàn.
- **Bước 2**: Tải mô hình 3D thực tế dạng `.glb`/`.gltf` từ Supabase Storage vào WorldScene thay thế cho Mesh Capsule hình hộp tượng trưng.
- **Bước 3**: Triển khai hệ thống NPC hội thoại và Quest nhiệm vụ du lịch hoàn chỉnh.
