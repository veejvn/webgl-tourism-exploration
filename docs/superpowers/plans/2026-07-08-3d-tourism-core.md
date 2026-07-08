# 3D Tourism Explorer Platform Core Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Thiết lập nền tảng kỹ thuật vững chắc cho dự án từ Cơ sở dữ liệu (PostGIS, Redis, Prisma), Thư viện dùng chung (Packages), Backend (NestJS Auth/User/Destination), đến Frontend (Mapbox, Zustand) và 3D Engine (Three.js/React Three Fiber) tích hợp di chuyển nhân vật.

**Architecture:** Sử dụng kiến trúc Monorepo (Turborepo + pnpm workspace) để chia sẻ kiểu dữ liệu và config đồng bộ giữa Client và Server. Hệ thống sử dụng cơ sở dữ liệu quan hệ PostgreSQL với tiện ích mở rộng PostGIS để xử lý tính toán vị trí địa lý, kết hợp Redis làm caching layer, và tách biệt hoàn toàn logic 3D (R3F) ra khỏi UI thông thường.

**Tech Stack:** Next.js 15, NestJS 11, Prisma ORM, PostgreSQL (PostGIS), Redis, Mapbox GL JS, Three.js, React Three Fiber (R3F), Zustand, Tailwind CSS v4, Docker.

---

### Task 1: Thiết lập Cơ sở dữ liệu & Docker (PostGIS, Redis & Prisma Schema)

**Files:**
- Create: `docker/docker-compose.yml`
- Modify: `apps/api/prisma/schema.prisma`
- Create: `apps/api/prisma/seed.ts`
- Modify: `apps/api/.env`

- [ ] **Step 1.1: Tạo file cấu hình Docker Compose**
  Tạo `docker/docker-compose.yml` để chạy dịch vụ PostgreSQL (có PostGIS) và Redis:
  ```yaml
  version: '3.8'
  services:
    postgres:
      image: postgis/postgis:15-3.3-alpine
      container_name: 3d_tourism_postgres
      environment:
        POSTGRES_USER: postgres
        POSTGRES_PASSWORD: postgres
        POSTGRES_DB: 3d_tourism_db
      ports:
        - "5432:5432"
      volumes:
        - postgres_data:/var/lib/postgresql/data
      networks:
        - tourism_network

    redis:
      image: redis:7-alpine
      container_name: 3d_tourism_redis
      ports:
        - "6379:6379"
      volumes:
        - redis_data:/data
      networks:
        - tourism_network

  volumes:
    postgres_data:
    redis_data:

  networks:
    tourism_network:
      driver: bridge
  ```

- [ ] **Step 1.2: Thiết kế Prisma Schema**
  Cấu trúc các Model cốt lõi trong `apps/api/prisma/schema.prisma`:
  ```prisma
  generator client {
    provider = "prisma-client-js"
  }

  datasource db {
    provider = "postgresql"
    url      = env("DATABASE_URL")
  }

  enum Role {
    VISITOR
    USER
    ADMIN
  }

  model User {
    id        String   @id @default(uuid())
    email     String   @unique
    password  String
    name      String
    role      Role     @default(USER)
    avatar    String?
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
  }

  model Destination {
    id          String     @id @default(uuid())
    title       String
    description String
    latitude    Float
    longitude   Float
    coverImage  String
    modelUrl    String?    // Đường dẫn file .glb 3D Scene của địa danh
    createdAt   DateTime   @default(now())
    updatedAt   DateTime   @updatedAt
    landmarks   Landmark[]
  }

  model Landmark {
    id            String      @id @default(uuid())
    destinationId String
    title         String
    description   String
    latitude      Float
    longitude     Float
    modelUrl      String?     // Đường dẫn file .glb của riêng landmark/hiện vật này
    destination   Destination @relation(fields: [destinationId], references: [id], onDelete: Cascade)
    createdAt     DateTime    @default(now())
    updatedAt     DateTime    @updatedAt
  }
  ```

- [ ] **Step 1.3: Chạy Database & Sync Prisma**
  * Khởi động Docker container: `docker compose -f docker/docker-compose.yml up -d`
  * Chạy Prisma migration: `pnpm --filter api prisma migrate dev --name init`

- [ ] **Step 1.4: Viết File Seed dữ liệu mẫu**
  Tạo `apps/api/prisma/seed.ts` để sinh dữ liệu ban đầu cho các địa điểm du lịch (ví dụ: Hà Nội, Huế, Hội An). Sau đó cấu hình `"prisma": { "seed": "ts-node prisma/seed.ts" }` trong `apps/api/package.json` và chạy lệnh:
  `pnpm --filter api prisma db seed`

---

### Task 2: Cấu trúc thư viện dùng chung (`packages/`)

**Files:**
- Create: `packages/types/package.json`
- Create: `packages/types/tsconfig.json`
- Create: `packages/types/src/index.ts`
- Create: `packages/constants/package.json`
- Create: `packages/constants/src/index.ts`
- Modify: `apps/web/package.json`
- Modify: `apps/api/package.json`

- [ ] **Step 2.1: Tạo thư viện kiểu dữ liệu `packages/types`**
  Định nghĩa các interface chia sẻ giữa frontend và backend trong `packages/types/src/index.ts`:
  ```typescript
  export interface UserDTO {
    id: string;
    email: string;
    name: string;
    role: 'USER' | 'ADMIN';
    avatar?: string;
  }

  export interface DestinationDTO {
    id: string;
    title: string;
    description: string;
    latitude: number;
    longitude: number;
    coverImage: string;
    modelUrl?: string;
  }
  ```

- [ ] **Step 2.2: Liên kết Packages vào Workspace**
  Thêm `@project/types` và `@project/constants` vào phần `dependencies` của cả `apps/web/package.json` and `apps/api/package.json` để đồng bộ hóa mã nguồn.
  * Chạy `pnpm install` ở thư mục gốc để liên kết các local package.

---

### Task 3: Phát triển Backend Core (NestJS API Modules)

**Files:**
- Create: `apps/api/src/modules/auth/...` (AuthModule, AuthService, AuthController, JWT Strategy)
- Create: `apps/api/src/modules/users/...`
- Create: `apps/api/src/modules/destinations/...`
- Modify: `apps/api/src/app.module.ts`

- [ ] **Step 3.1: Phát triển Module Auth & User**
  * Sử dụng `@nestjs/jwt` và `@nestjs/passport` để tạo hệ thống Đăng ký, Đăng nhập.
  * Thiết lập JWT Guard bảo vệ các API riêng tư.

- [ ] **Step 3.2: Phát triển Module Destination**
  * Tạo Endpoint `GET /destinations` trả về danh sách địa điểm.
  * Tạo Endpoint `GET /destinations/:id` lấy chi tiết địa danh và các Landmark con thuộc về địa danh đó.

- [ ] **Step 3.3: Viết Unit Test & Kiểm tra API**
  * Viết bài test tích hợp đơn giản kiểm thử việc truy vấn danh sách điểm đến từ Service và Repository.
  * Chạy: `pnpm --filter api test` để đảm bảo hệ thống NestJS hoạt động đúng quy chuẩn.

---

### Task 4: Phát triển Frontend Core & Bản đồ (Next.js, Mapbox, Zustand)

**Files:**
- Create: `apps/web/app/map/page.tsx`
- Create: `apps/web/store/ui.store.ts`
- Create: `apps/web/store/player.store.ts`
- Create: `apps/web/lib/mapbox.ts`

- [ ] **Step 4.1: Cài đặt và tích hợp Mapbox**
  * Thiết lập component bản đồ Mapbox trong `apps/web/app/map/page.tsx`.
  * Đọc tọa độ từ `GET /destinations` và vẽ các Marker của các địa danh lên bản đồ 2D. Khi nhấp vào một Marker, hiển thị thông tin giới thiệu và nút "Khám phá 3D" để chuyển hướng sang trang `/explore?id=XYZ`.

- [ ] **Step 4.2: Thiết lập Global State bằng Zustand**
  Tạo `apps/web/store/player.store.ts` để lưu trữ thông tin trạng thái người chơi, vị trí hiện tại và tiến trình nhiệm vụ.

---

### Task 5: Thiết lập 3D Engine (Three.js, React Three Fiber & Di chuyển nhân vật)

**Files:**
- Create: `apps/web/app/explore/page.tsx`
- Create: `apps/web/three/scene/WorldScene.tsx`
- Create: `apps/web/three/character/PlayerController.tsx`

- [ ] **Step 5.1: Tạo màn hình 3D (R3F Canvas)**
  Xây dựng `apps/web/three/scene/WorldScene.tsx` chứa Camera, Ánh sáng (Ambient, Directional) và Mặt phẳng (Floor) để nhân vật đứng lên.

- [ ] **Step 5.2: Viết mã nguồn điều khiển nhân vật di chuyển**
  Xây dựng `apps/web/three/character/PlayerController.tsx` sử dụng sự kiện bàn phím (W, A, S, D) để dịch chuyển tọa độ một Mesh tượng trưng trong không gian 3D.

- [ ] **Step 5.3: Tích hợp vào màn hình Explore**
  Hiển thị màn hình 3D trong `apps/web/app/explore/page.tsx` và đồng bộ hóa các tài nguyên mô hình 3D.
