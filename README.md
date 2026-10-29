# Cù Lao Giêng 3D Explorer

> Cập nhật: 2026-10-29
> Giai đoạn: **Prototype kỹ thuật, nền tảng tích hợp một phần; chưa đạt MVP sản phẩm Cù Lao Giêng**. Tài liệu này tách hiện trạng có bằng chứng trong mã khỏi định hướng sản phẩm mục tiêu.

## Mục tiêu

Xây dựng nền tảng số về du lịch, văn hóa và di sản Cù Lao Giêng, kết hợp website thông tin, bản đồ tương tác và các scene 3D theo địa điểm. Phạm vi và quyết định nghiệp vụ đã xác nhận được ghi trong [Product Scope & Domain](./docs/PRODUCT_SCOPE_AND_DOMAIN.md).

## Hiện trạng đã đối chiếu với repository

Các trạng thái dưới đây được kết luận từ mã nguồn và cấu hình đã đọc. Trong lần cập nhật tài liệu này không chạy ứng dụng hoặc test suite, vì vậy đây không phải xác nhận runtime mới.

| Phần | Trạng thái hiện tại | Bằng chứng và giới hạn |
|---|---|---|
| Bản đồ và điểm đến | Đã tích hợp một phần | Trang map gọi API lấy danh sách, hiển thị marker và thẻ chi tiết. Dataset mẫu là các điểm đến An Giang/khu vực lân cận, chưa phải danh mục Cù Lao Giêng đã biên tập và xác minh. |
| Đăng ký/đăng nhập | Có luồng trong mã | API tạo tài khoản và đăng nhập, trả JWT; frontend lưu token ở localStorage. AuthGuard có trong API nhưng chưa được gắn vào các endpoint hiện có. |
| API điểm đến | Đã có đọc dữ liệu | `GET /destinations` và `GET /destinations/:id`; chưa có API quản trị CRUD. |
| Khám phá 3D | Demo cơ bản | React Three Fiber dựng cảnh và hình khối mẫu; nhân vật di chuyển WASD/Shift. Chưa tải scene hoặc mô hình riêng theo địa điểm, chưa có tương tác thuyết minh. |
| Trang chủ | Chưa hoàn thiện | `apps/web/app/page.tsx` hiện chỉ hiển thị “Hello World”. |
| AI Guide | Chưa triển khai | Có nút giao diện thông báo sẽ kết nối sau; chưa có dịch vụ hoặc endpoint AI. |
| CMS, biên tập, bản dịch, nguồn tư liệu, hành trình, tiến trình khách, đề xuất cộng đồng | Chưa thấy triển khai | Chưa tìm thấy module, route hay model tương ứng trong cấu trúc ứng dụng hiện tại. |
| Nội dung chính thức Cù Lao Giêng | Chưa xác minh | Seed hiện tại không có workflow xác minh, citation hay trạng thái xuất bản theo ngôn ngữ. |

Chi tiết kiến trúc hiện tại và khoảng trống: [System Architecture](./docs/SYSTEM_ARCHITECTURE.md), [Technology Architecture](./docs/TECHNOLOGY_ARCHITECTURE.md), [Product Scope & Domain](./docs/PRODUCT_SCOPE_AND_DOMAIN.md).

## Cấu trúc workspace hiện có

- `apps/web/`: Next.js App Router, các route đăng nhập/đăng ký, bản đồ, khám phá, state, API client và mã Three.js.
- `apps/api/`: NestJS/Fastify, các module `auth`, `users`, `destinations`, Prisma service và hai Prisma schema.
- `packages/types/`, `packages/constants/`: kiểu dữ liệu và hằng số dùng chung.
- `docker/`: Compose cho PostgreSQL/PostGIS và Redis.
- `docs/`: tài liệu dự án.

Workspace được khai báo bằng pnpm cho `apps/*` và `packages/*`. `apps/docs`, `packages/ui`, `packages/utils` và các thư mục tương tự trong tài liệu cũ không tồn tại như workspace package hiện tại.

## Công nghệ hiện tại

- Web: Next.js **16.2.10**, React 19, TypeScript, Tailwind CSS 4, Mapbox GL JS, React Three Fiber, Three.js, Zustand, TanStack Query, Axios.
- API: NestJS 11 trên Fastify, Prisma 7.8, PostgreSQL adapter hoặc Better SQLite adapter, class-validator.
- Workspace: pnpm 9 và Turborepo 2.
- Docker Compose có image PostGIS và Redis; schema hiện lưu latitude/longitude dạng số thực, chưa có kiểu hình học hoặc truy vấn PostGIS. API chưa tích hợp Redis.

Xem [Technology Architecture](./docs/TECHNOLOGY_ARCHITECTURE.md) để biết công nghệ mục tiêu nào chưa được xác nhận hoặc tích hợp.

## Chạy local

### 1. Cài dependency

Từ thư mục gốc:

```bash
pnpm install
```

### 2. Cấu hình biến môi trường

Web đọc `NEXT_PUBLIC_API_URL` và `NEXT_PUBLIC_MAPBOX_TOKEN`. Tệp `apps/web/.env.example` hiện chỉ khai báo tên biến Mapbox; tạo `apps/web/.env.local` và bổ sung URL API phù hợp.

API đọc `JWT_SECRET` (bắt buộc), `DATABASE_URL` khi dùng PostgreSQL, `PORT` (mặc định 3001) và `USE_SQLITE` (chọn SQLite khi giá trị là `true`). Đặt cấu hình trong `apps/api/.env`. Không đưa secret hoặc giá trị kết nối có mật khẩu vào Git/tài liệu.

### 3. Chuẩn bị database

Mặc định API chọn PostgreSQL. Có thể khởi động các container bằng:

```bash
docker compose -f docker/docker-compose.yml up -d
```

Compose khởi động PostgreSQL và Redis; Redis hiện chưa được API sử dụng. Trong `apps/api`, chạy `npx prisma db push` để đồng bộ schema đang được chọn bởi `prisma.config.ts`.

Khi chọn `USE_SQLITE=true`, SQLite được lưu tại `apps/api/dev.db`; service tự nạp dữ liệu mẫu khi bảng điểm đến còn trống. Seed PostgreSQL trong `prisma/seed.ts` xóa dữ liệu User, Destination và Landmark trước khi tạo dữ liệu mẫu, nên chỉ dùng trên database có thể làm mới. Không chạy seed PostgreSQL khi đang chọn SQLite.

### 4. Khởi động

Từ thư mục gốc:

```bash
pnpm dev
```

Frontend dùng cổng mặc định Next.js 3000; API mặc định cổng 3001. API chỉ cho phép CORS từ `http://localhost:3000` theo cấu hình hiện tại. Có thể chạy riêng bằng `pnpm --filter web dev` hoặc `pnpm --filter api dev`.

## Lệnh được khai báo trong package

- Build workspace: `pnpm build`
- Lint workspace: `pnpm lint` (script lint của API có cờ `--fix` và có thể sửa file).
- Unit test API: `pnpm --filter api test`
- E2E API: `pnpm --filter api test:e2e`
- E2E web: `pnpm --filter web test:e2e`

`pnpm test` ở root chạy task `test` của Turborepo; script web hiện khai báo `test:e2e`, không phải `test`. Các lệnh này có trong manifest, nhưng tài liệu này không khẳng định kết quả chạy hiện tại.

## Tài liệu

- [Product Scope & Domain](./docs/PRODUCT_SCOPE_AND_DOMAIN.md) — vision, MVP, DDD mục tiêu, vòng đời nghiệp vụ, schema hiện tại và ERD khái niệm mục tiêu.
- [System Architecture](./docs/SYSTEM_ARCHITECTURE.md) — luồng chạy hiện có và ranh giới mục tiêu.
- [Technology Architecture](./docs/TECHNOLOGY_ARCHITECTURE.md) — công nghệ đã xác minh và phần chưa tích hợp.
- [Folder Architecture](./docs/FOLDER_ARCHITECTURE.md) — cấu trúc repository thực tế.
- [API Reference](./docs/API_REFERENCE.md) — endpoint có trong controller hiện tại.
- [Security Assessment](./docs/security-assessment.md) — ảnh chụp đánh giá bảo mật ngày 2026-10-25; cần đọc như báo cáo theo thời điểm.
