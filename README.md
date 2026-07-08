# 3D Tourism Explorer Platform 🌍

Chào mừng bạn đến với **3D Tourism Explorer Platform** - Nền tảng quảng bá du lịch 3D sử dụng WebGL, cho phép người dùng khám phá các địa điểm bằng nhân vật trong không gian 3D tương tác.

Dự án được tổ chức theo kiến trúc **Monorepo** sử dụng **Turborepo** và quản lý gói bằng **pnpm**, giúp đồng bộ hóa giữa Frontend và Backend một cách dễ dàng và tối ưu build CI/CD.

## 🚀 Công nghệ sử dụng

### Frontend (Web, 3D & Map)
- **Framework**: Next.js 15 (App Router)
- **Ngôn ngữ**: TypeScript
- **3D & WebGL**: Three.js, React Three Fiber, Mixamo, Blender (Modeling)
- **Bản đồ**: Mapbox GL JS
- **Styling**: Tailwind CSS, shadcn/ui, Framer Motion
- **State Management & Data**: Zustand, TanStack Query, Axios

### Backend (API)
- **Framework**: NestJS (với Fastify)
- **Cơ sở dữ liệu**: PostgreSQL + PostGIS (Hỗ trợ truy vấn không gian GIS)
- **ORM**: Prisma
- **Cache**: Redis
- **Authentication**: JWT, Passport, OAuth 2.0 (Google, Facebook, GitHub)

### AI & Storage
- **AI**: Gemini API (Tạo chatbot, hướng dẫn viên du lịch AI, thuyết minh điểm đến)
- **Storage**: Supabase Storage (Lưu trữ ảnh, model 3D, âm thanh)

### DevOps
- **Công cụ**: Docker, Nginx, GitHub Actions

## 📁 Cấu trúc thư mục (Monorepo)

Dự án sử dụng [Turborepo](https://turbo.build/) với thiết kế như sau:

- `apps/web/`: Ứng dụng Frontend Next.js (Dành cho người dùng và CMS Admin).
- `apps/api/`: Backend API NestJS.
- `apps/docs/`: Tài liệu dự án.
- `packages/ui/`: Các component giao diện dùng chung.
- `packages/types/`: Khai báo TypeScript chia sẻ giữa FE và BE.
- `packages/constants/`: Các hằng số định nghĩa chung.
- `packages/utils/`: Các hàm hỗ trợ tiện ích.
- `packages/config/`: File cấu hình chung.
- `packages/eslint-config/`: Cấu hình lint code.
- `docker/`: Cấu hình chạy các service ảo (Postgres, Redis, Nginx).

## 🛠 Hướng dẫn cài đặt và khởi chạy

### 1. Yêu cầu hệ thống
- **Node.js**: v18+ hoặc v20+
- **pnpm**: `npm install -g pnpm`
- **Docker** (nếu muốn chạy database qua container)

### 2. Cài đặt Dependencies
```bash
# Cài đặt tại thư mục gốc của dự án
pnpm install
```

### 3. Chạy môi trường Dev (Development)
Turborepo sẽ chạy đồng thời tất cả các ứng dụng trong không gian làm việc (apps):
```bash
pnpm run dev
```

### 4. Build và kiểm tra
```bash
# Build tất cả các ứng dụng
pnpm run build

# Kiểm tra code (Lint)
pnpm run lint
```

## 📖 Tài liệu liên quan
Để hiểu rõ hơn về các quyết định thiết kế của hệ thống, vui lòng tham khảo các file trong thư mục `docs/`:
- [Kiến trúc thư mục (FOLDER_ARCHITECTURE.md)](./docs/FOLDER_ARCHITECTURE.md)
- [Kiến trúc công nghệ (TECHNOLOGY_ARCHITECTURE.md)](./docs/TECHNOLOGY_ARCHITECTURE.md)
- [Kiến trúc hệ thống (SYSTEM_ARCHITECTURE.md)](./docs/SYSTEM_ARCHITECTURE.md)
