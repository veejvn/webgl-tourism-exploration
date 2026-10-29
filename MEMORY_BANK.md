# Nền tảng Cù Lao Giêng 3D Explorer — Memory Bank

> Snapshot hiện hành cập nhật 2026-10-29. Các mục tổng hợp và nhật ký cũ phía dưới được giữ làm lịch sử; chúng có thể phản ánh giả định/tên sản phẩm trước đây. Dùng README.md và docs/PRODUCT_SCOPE_AND_DOMAIN.md làm nguồn sự thật hiện tại.

## Snapshot hiện hành

- Giai đoạn: Prototype tích hợp nền tảng / MVP cốt lõi.
- Có bằng chứng trong source về Mapbox → API destinations, register/login và demo Three.js điều khiển player. Lần cập nhật tài liệu này không chạy app/test suite để xác nhận runtime.
- Web là Next.js 16.2.10; backend là NestJS 11/Fastify, Prisma 7.8; workspace pnpm/Turborepo.
- Prisma hiện có User, Destination, Landmark; PostgreSQL mặc định, SQLite lưu file theo cờ USE_SQLITE. Redis/PostGIS chưa được API/schema sử dụng.
- Dataset hiện tại là mẫu An Giang/khu vực lân cận, chưa phải nội dung Cù Lao Giêng chính thức có nguồn.
- Homepage, CMS, song ngữ/nguồn tư liệu, scene 3D theo destination, itinerary, visitor progress, community moderation và AI chưa hoàn thiện/chưa thấy luồng triển khai.
- Hướng nghiệp vụ, DDD mục tiêu, lifecycle, ERD khái niệm và roadmap: docs/PRODUCT_SCOPE_AND_DOMAIN.md.

---
# Nền tảng Du lịch 3D (3D Tourism Platform) - Memory Bank

## Tổng hợp cũ — snapshot lịch sử, không phải trạng thái hiện hành
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

- **Phiên làm việc ngày 09/07/2026**:
  - **Điều chỉnh cấu hình port**: Thiết lập cổng mặc định cố định cho dự án. Ép buộc **Frontend (Next.js)** chạy cổng `3000` thông qua `"dev": "next dev -p 3000"` trong `apps/web/package.json`, và cấu hình **Backend (NestJS)** chạy cổng `3001` qua `PORT=3001` trong `apps/api/.env`.
  - **Khắc phục triệt để lỗi nạp hạt DB (Prisma Seeding) trên Windows**:
    1. Thiết lập file `prisma.config.ts` ở NestJS Backend, cấu hình đường dẫn `seed: "ts-node ./prisma/seed.ts"` khớp chuẩn cấu hình mới của Prisma v6/v7.
    2. Giải quyết lỗi không thể khởi tạo `PrismaClient` trong các file chạy trực tiếp `ts-node` trên môi trường Windows bằng việc tạo Junction Symlink thư mục ảo `.prisma/client` từ thư mục `.pnpm` gốc vào cục bộ `apps/api/node_modules/.prisma`.
    3. Nạp `dotenv/config` đồng bộ trước khi gọi constructor của `PrismaClient` giúp hạt giống dữ liệu (`npx prisma db seed`) hoạt động 100% thành công không có lỗi.
  - **Tạo tài liệu chỉ dẫn Agent (`AGENTS.md`)**: Biên soạn cẩm nang tóm tắt các lệnh quan trọng, kiến trúc di động và cách khắc phục lỗi symlink/seed nhanh gọn dành riêng cho các phiên Agent làm việc tiếp theo trong repository.
  - Kiểm thử, commit và push toàn bộ mã nguồn lên Git repository từ nhánh `main` thành công.

- **Phiên làm việc ngày 20/07/2026**:
  - **Tích hợp API Frontend-Backend toàn diện**:
    - **Phía Backend (NestJS)**:
      1. Triển khai tùy chọn cơ sở dữ liệu SQLite chạy trực tiếp trong bộ nhớ (`in-memory`) bằng cách tích hợp `@prisma/adapter-better-sqlite3` và `better-sqlite3`, cho phép chạy dev nhanh không cần khởi chạy container Docker.
      2. Tạo schema Prisma chuyên biệt `schema.sqlite.prisma` tương thích với SQLite để duy trì đồng thời với schema PostgreSQL.
      3. Phát triển `SqlitePrismaService` tự động kết nối và nạp seed dữ liệu 8 điểm du lịch nổi tiếng tại An Giang (Núi Sam - Bà Chúa Xứ, Núi Cấm, Hòn Phụ Tử, Phú Quốc, Hà Tiên, Rạch Giá, Châu Đốc, U Minh Thượng) cùng các danh lam thắng cảnh đi kèm.
      4. Đồng bộ file seed PostgreSQL `prisma/seed.ts` gốc để nạp dữ liệu An Giang nhất quán với SQLite.
      5. Thêm cờ môi trường `USE_SQLITE=true` trong `.env` để dễ dàng chuyển đổi nhanh giữa PostgreSQL và SQLite.
      6. Cấu hình CORS mở rộng trên cổng `3001` để chấp nhận mọi yêu cầu gửi từ cổng Frontend `3000`.
    - **Phía Frontend (Next.js 16)**:
      1. Cài đặt các thư viện bổ sung: `react-hook-form`, `@hookform/resolvers`, và `sonner`.
      2. Khởi tạo instance Axios kết hợp các interceptor tự động inject Header `Authorization: Bearer <token>` và bắt mã lỗi `401` để tự động dọn dẹp localStorage rồi chuyển hướng người dùng về trang đăng nhập.
      3. Thiết lập bộ quản lý token (`token.ts`) làm nhiệm vụ ghi/đọc/xóa thông tin token và thông tin người dùng trong `localStorage`.
      4. Cấu hình TanStack Query (`@tanstack/react-query`) kết hợp giao diện DevTools chỉ hiển thị trong môi trường phát triển (`development`).
      5. Xây dựng dịch vụ gọi API gồm `authApi` (login, register) và `destinationsApi` (getAll, getById).
      6. Thiết lập Zustand persistent store (`auth-storage`) quản lý trạng thái đăng nhập, người dùng, hỗ trợ đồng bộ dữ liệu sau khi tải lại trang.
      7. Phát triển các custom hooks tiện ích: `useAuth()` thực hiện đăng nhập/đăng ký qua mutations; `useDestinations()` và `useDestination(id)` truy vấn dữ liệu địa danh thông qua React Query.
      8. Thiết kế các components UI dùng chung chuẩn chỉ: `Input`, `Label`, `Form`, `Card` và cấu hình bộ thông báo nổi `Toaster` qua `sonner`.
      9. Dựng trang Đăng nhập (`/login`) và Đăng ký (`/register`) đẹp mắt với Tailwind CSS, tích hợp xác thực form chặt chẽ bằng Zod schema (`loginSchema`, `registerSchema`) và `react-hook-form`.
      10. Tạo cơ chế bảo vệ route thông qua proxy trung gian Next.js (`proxy.ts`), tự động chuyển hướng khách truy cập chưa đăng nhập khi truy cập `/explore`, `/profile`, `/dashboard` và ngăn người dùng đã đăng nhập truy cập lại trang `/login`/`/register`.
      11. Phát triển component `AuthHydration` loại bỏ hoàn toàn lỗi bất đồng bộ Hydration và nhấp nháy màn hình khi khởi chạy ứng dụng.
      12. Thay đổi trang Bản đồ (`/map`) từ mock dữ liệu tĩnh sang truy vấn danh sách địa điểm trực tiếp từ Backend API, tạo Marker Mapbox tương tác, hiển thị Card chi tiết khi click và hỗ trợ điều hướng thẳng sang không gian 3D (`/explore?id={id}`).

- **Phiên làm việc ngày 21/07/2026 (Phiên làm việc hiện tại)**:
  - **Đánh giá tổng quan dự án và đồng bộ hóa tri thức**:
    - Thực hiện kiểm tra toàn bộ mã nguồn của Monorepo, cấu trúc các tệp tin mới tích hợp (Axios, React Query, Zustand, router proxy, form validations).
    - Biên dịch và build toàn bộ Monorepo thành công 100% không gặp bất kỳ lỗi logic hay typescript nào (`pnpm build`).
  - **Thiết lập và Triển khai Kịch Bản Kiểm Thử E2E toàn diện bằng Playwright MCP**:
    1. Cài đặt `@playwright/test` và tải các bản build Chromium tương thích với kiểm thử WebGL (`swiftshader`).
    2. Viết cấu hình `playwright.config.ts` chia tách webServer chạy độc lập `api` (cổng 3001) và `web` (cổng 3000), loại bỏ xung đột treo luồng Turborepo trên môi trường Windows.
    3. Cấu hình kiểm thử chạy đơn luồng (`workers: 1`) ngăn ngừa triệt để các lỗi SQLite write lock khi ghi dữ liệu kiểm thử đồng thời.
    4. Sửa lỗi TS5103 trong `apps/api/tsconfig.json` do thuộc tính deprecated `"ignoreDeprecations": "6.0"`.
    5. Khắc phục lỗi `SQLITE_CANTOPEN` trên Windows bằng việc chuyển kết nối SQLite in-memory sang tệp tin SQLite cục bộ tự vá đường dẫn `apps/api/dev.db` độc lập với working directory (`SqlitePrismaService`).
    6. Tạo `apps/api/prisma.config.ts` liên kết động tới schema SQLite và khởi chạy thành công nạp đồng bộ cơ sở dữ liệu (`prisma db push`).
    7. Tối ưu hóa component `map/page.tsx` giúp nạp Markers ngay lập tức không cần đợi Mapbox style load hoàn thành, cải thiện đáng kể UX thực tế và độ ổn định kiểm thử.
    8. Triển khai kịch bản kiểm thử `auth.spec.ts` (validate form, đăng ký tài khoản ngẫu nhiên, đăng nhập, kiểm tra localStorage, đăng xuất) - **Đạt tỷ lệ thành công 100%**.
    9. Triển khai kịch bản kiểm thử `route-protection.spec.ts` (bảo vệ các tuyến `/explore`, tự động chuyển hướng người dùng đã login khỏi `/login`/`/register`, kiểm tra rehydrate trạng thái đăng nhập) - **Đạt tỷ lệ thành công 100%**.
    10. Triển khai kịch bản kiểm thử `map.spec.ts` (kiểm tra map container, markers đếm đủ 8 địa danh, click marker hiển thị card chi tiết, đóng card chi tiết thông qua DOM event dispatch) - **Đạt tỷ lệ thành công 100%**.
    11. Cập nhật nhật ký thực thi chi tiết vào Memory Bank (`MEMORY_BANK.md`) để làm cơ sở vững chắc cho các nhiệm vụ tiếp theo.

## Kế hoạch cũ — giữ để tham khảo lịch sử
- **Bước 1**: Tải mô hình 3D thực tế dạng `.glb`/`.gltf` từ Supabase Storage hoặc thư mục local vào WorldScene trong `apps/web/three/scene/WorldScene.tsx` thay thế cho Capsule mesh hình hộp tạm thời.
- **Bước 2**: Triển khai hệ thống NPC hội thoại thông minh (tích hợp Gemini AI để trả lời các câu hỏi về địa danh) và hệ thống nhiệm vụ (Quest) khám phá di tích.
- **Bước 3**: Thiết kế trang Hồ sơ cá nhân (`/profile`) và Bảng quản lý hành trình (`/dashboard`) hiển thị thông số tham quan, các huy hiệu di sản đã tích lũy.
