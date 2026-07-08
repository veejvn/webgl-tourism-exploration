# 🤖 Hướng dẫn dành cho OpenCode Agent (OpenCode Agent Guide)

Nội dung dưới đây đúc kết các điểm mấu chốt, cấu trúc đặc thù, và các lỗi dễ gặp nhất (Gotchas) của dự án này nhằm giúp các AI Session sau không mắc sai lầm và tăng tốc công việc ngay lập tức.

---

## 🚀 0. Nguyên Tắc Điều Tra Code Siêu Tốc (Code Investigation Priority)
*   **Sử Dụng CodeGraph MCP Đầu Tiên**: Dự án đã được thiết lập chỉ mục tri thức hoàn chỉnh. Khi cần tìm hiểu logic, cấu trúc code, hoặc tìm file/symbol, **BẮT BUỘC ưu tiên sử dụng công cụ `codegraph_explore`** thay vì thực hiện các vòng lặp `glob`, `grep`, `read` thủ công một cách tốn token và thời gian.
*   Một lượt gọi `codegraph_explore` có khả năng phân tích AST, hiển thị mã nguồn trực tiếp cùng sơ đồ liên kết động đầy đủ (được xem như đã `Read` tệp tin đó, không cần dùng tool `Read` lại).

---

## 🛠️ 1. Lệnh Phát Triển & Kiểm Thử Quan Trọng (Developer Commands)

Dự án là một Monorepo quản lý bởi **pnpm workspaces** và **Turborepo**. Tuyệt đối không giả định các lệnh chạy tiêu chuẩn của npm/yarn.

### 🚀 Khởi động (Development)
*   **Chạy toàn bộ Monorepo** (từ thư mục gốc): `pnpm dev`
    *   **Frontend (FE)**: cổng `3000` (được cấu hình cứng `next dev -p 3000` trong `apps/web/package.json`).
    *   **Backend (BE)**: cổng `3001` (định nghĩa qua `PORT=3001` trong `apps/api/.env`).
*   **Chạy riêng lẻ từng app**:
    *   Chỉ Frontend: `pnpm --filter web dev`
    *   Chỉ Backend: `pnpm --filter api dev`

### 🗄️ Database & Prisma (Trọng Tâm Dễ Lỗi)
*   **Khởi động Postgres & Redis (Docker)**: `docker compose -f docker/docker-compose.yml up -d`
*   **Đồng bộ DB Schema**: `npx prisma db push` (chạy bên trong `apps/api`).
*   **Nạp dữ liệu mẫu (Seeding)**: Do Prisma v7 trong Monorepo này không dùng cấu hình `seed` trong `package.json` mà quản lý tập trung, quy trình seed chuẩn như sau:
    1. Chuyển vào thư mục backend: `cd apps/api`
    2. Chạy lệnh seed trực tiếp qua ts-node với module CommonJS để tránh xung đột ES Modules:
       ```powershell
       npx ts-node -O '{\"module\":\"commonjs\"}' prisma/seed.ts
       ```
    3. *(Lưu ý: Nếu gặp lỗi Symlink của `@prisma/client` trong môi trường Windows pnpm, chạy lệnh trên để nạp CommonJS trực tiếp)*.

### 🧪 Biên dịch & Kiểm thử (Build & Verification)
*   **Biên dịch toàn bộ Monorepo** (luôn chạy trước khi commit thay đổi): `pnpm build`
*   **Chạy Linter**: `pnpm lint`
*   **Chạy Jest Unit Tests (Backend)**: `pnpm --filter api test`
*   **Chạy NestJS E2E Tests**: Do cấu hình Jest E2E cần nạp Prisma Client, hãy tạo liên kết Junction của thư mục `.prisma` trong Windows nếu gặp lỗi khởi tạo Prisma Client:
    ```powershell
    node -e "const fs = require('fs'); const path = require('path'); const target = path.resolve('node_modules/.pnpm/@prisma+client@7.8.0_prisma@7.8.0_@types+react-dom@19.2.3_@types+react@19.2.17__@types+react@_o5aw2iyjagqoc3ivcm7v2hblvq/node_modules/.prisma'); const link = path.resolve('apps/api/node_modules/.prisma'); if(!fs.existsSync(link)) fs.symlinkSync(target, link, 'junction');"
    pnpm --filter api test:e2e
    ```

---

## 🏗️ 2. Kiến Trúc Dự Án (System Architecture)

*   **`apps/web` (Next.js 15 - App Router)**:
    *   Cần đặc biệt lưu ý quy tắc Next.js 15 (Agent Rules): có nhiều thay đổi lớn so với Next.js cũ.
    *   Môi trường 3D (`WorldScene.tsx`) được import động (`dynamic` với `ssr: false`) để tránh lỗi Hydration WebGL.
    *   Tọa độ nhân vật 3D được đồng bộ thời gian thực qua Zustand store (`apps/web/store/player.store.ts`).
*   **`apps/api` (NestJS)**:
    *   Dùng **Fastify** làm Adapter nền tảng thay vì Express truyền thống để tối ưu hiệu năng.
    *   Module `Auth` xác thực bằng JWT tự sinh chữ ký bảo mật (chuẩn mã hóa HS256 sử dụng module `crypto` thuần của Node.js, không phụ thuộc vào thư viện ngoài).
*   **`packages/` (Shared Modules)**:
    *   `@project/types` và `@project/constants` là các local workspace packages được chia sẻ chung. Khi thay đổi thuộc tính, bắt buộc phải chạy `pnpm build` để cập nhật lại file khai báo `dist/index.d.ts`.

---

## ⚠️ 3. Những Điểm Đặc Thù & Cạm Bẫy (Gotchas & Quirks)

*   **Lỗi Khởi Tạo PrismaClient trên Windows (pnpm v9)**: Do pnpm cài đặt các gói trong thư mục ảo `.pnpm`, đường dẫn tương đối tới `.prisma/client` trong `apps/api/node_modules` có thể bị hỏng trên Windows. Luôn tạo Junction Symlink từ thư mục `.prisma/client` của thư mục `.pnpm` gốc vào `apps/api/node_modules/.prisma` khi thiết lập môi trường mới.
*   **Lỗi TypeScript của `@react-three/drei` (Sky Component)**: Thuộc tính `turbidity` trong component `<Sky>` nhận giá trị số, tuyệt đối không chỉnh sửa cấu hình gây lỗi ép kiểu TypeScript.
*   **Môi Trường Biến (Environment Variables)**: File `.env` của NestJS nằm trong `apps/api/.env`, cần khai báo chính xác `DATABASE_URL` dạng PostGIS `postgresql://postgres:postgres@localhost:5432/3d_tourism_db?schema=public` và `PORT=3001`.
