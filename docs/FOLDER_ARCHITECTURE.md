# Monorepo Structure

## 3D Tourism Explorer Platform

**Monorepo Tool:** Turborepo

**Package Manager:** pnpm

---

# Mục tiêu

- Quản lý Frontend và Backend trong cùng một repository.
- Chia sẻ code (types, config, utils) giữa các ứng dụng.
- Dễ mở rộng thêm mobile app hoặc microservices trong tương lai.
- Tối ưu build và CI/CD.

---

# Cấu trúc tổng thể

```text
3d-tourism-platform/
│
├── apps/
│   ├── web/                # Next.js Application
│   ├── api/                # NestJS API
│   └── docs/               # Tài liệu dự án (tuỳ chọn)
│
├── packages/
│   ├── ui/
│   ├── types/
│   ├── constants/
│   ├── utils/
│   ├── config/
│   └── eslint-config/
│
├── scripts/
│
├── docker/
│
├── .github/
│
├── turbo.json
├── pnpm-workspace.yaml
├── package.json
└── README.md
```

---

# apps/

## web/

Ứng dụng chính dành cho người dùng và CMS.

```text
apps/web
│
├── app/
│
├── components/
││
├── features/
│
├── three/
│
├── hooks/
│
├── services/
│
├── store/
│
├── lib/
│
├── providers/
│
├── middleware.ts
│
├── public/
│
├── styles/
│
├── types/
│
└── utils/
```

---

# app/

```text
app/
│
├── (public)/
│   ├── page.tsx
│   ├── about/
│   ├── destinations/
│   └── contact/
│
├── explore/
│
├── map/
│
├── ai-guide/
│
├── auth/
│
├── dashboard/
│
├── profile/
│
├── api/
│
└── layout.tsx
```

---

# components/

Component thuần.

```text
components/
│
├── ui/
│
├── common/
│
├── layout/
│
├── navigation/
│
├── map/
│
├── destination/
│
├── character/
│
├── npc/
│
├── ai/
│
├── gallery/
│
└── quest/
```

---

# features/

Mỗi tính năng quản lý độc lập.

```text
features/
│
├── auth/
│
├── destination/
│
├── map/
│
├── explore/
│
├── ai-guide/
│
├── profile/
│
├── dashboard/
│
└── quest/
```

---

# three/

Toàn bộ logic WebGL.

```text
three/
│
├── core/
│
├── scene/
│
├── camera/
│
├── controls/
│
├── physics/
│
├── character/
│
├── npc/
│
├── interaction/
│
├── lighting/
│
├── environment/
│
├── loaders/
│
├── animations/
│
├── audio/
│
└── shaders/
```

---

# store/

```text
store/
│
├── auth.store.ts
├── destination.store.ts
├── player.store.ts
├── map.store.ts
├── ai.store.ts
└── ui.store.ts
```

---

# api/

NestJS Backend

```text
apps/api
│
├── src/
│
├── prisma/
│
├── test/
│
├── uploads/
│
└── Dockerfile
```

---

# src/

```text
src/
│
├── modules/
│
├── common/
│
├── config/
│
├── prisma/
│
├── guards/
│
├── interceptors/
│
├── filters/
│
├── decorators/
│
├── middleware/
│
├── strategies/
│
├── interfaces/
│
├── types/
│
└── main.ts
```

---

# modules/

Mỗi nghiệp vụ là một module độc lập.

```text
modules/
│
├── auth/
│
├── user/
│
├── destination/
│
├── landmark/
│
├── media/
│
├── npc/
│
├── quest/
│
├── ai/
│
├── analytics/
│
└── map/
```

Ví dụ:

```text
destination/
│
├── controllers/
├── services/
├── repositories/
├── dto/
├── entities/
├── interfaces/
├── validators/
└── destination.module.ts
```

---

# prisma/

```text
prisma/
│
├── schema.prisma
│
├── migrations/
│
└── seed.ts
```

---

# packages/

Các package dùng chung.

```text
packages/
│
├── ui/
│
├── types/
│
├── constants/
│
├── utils/
│
├── config/
│
└── eslint-config/
```

---

## ui/

Các component dùng chung giữa:

- Website
- Dashboard CMS

Ví dụ:

```text
Button
Card
Modal
Dialog
Badge
DataTable
Pagination
```

---

## types/

```text
User

Destination

Landmark

Quest

NPC

Media

Story
```

Frontend và Backend sử dụng cùng một định nghĩa TypeScript để tránh trùng lặp.

---

## constants/

```text
UserRole

DestinationCategory

QuestType

MediaType

OAuthProvider
```

---

## utils/

```text
Date Formatter

Distance Calculator

Geo Utils

String Utils

Validation Utils
```

---

## config/

```text
Axios

Mapbox

Gemini

Environment

Logger
```

---

# docker/

```text
docker/
│
├── nginx/
│
├── postgres/
│
├── redis/
│
└── compose/
```

---

# scripts/

```text
scripts/
│
├── seed.ts
├── backup.ts
├── generate-model.ts
└── import-destination.ts
```

---

# CI/CD

```text
.github/
│
└── workflows/
    ├── lint.yml
    ├── test.yml
    └── deploy.yml
```

---

# Nguyên tắc tổ chức

- **Feature-first:** Mỗi nghiệp vụ (Destination, Quest, AI...) được tổ chức thành một module độc lập.
- **Shared Packages:** Mọi kiểu dữ liệu, hằng số và tiện ích dùng chung được đặt trong `packages/`.
- **Tách biệt giao diện và logic:** `components/` chỉ chứa UI, còn `features/` chứa logic của từng chức năng.
- **3D độc lập:** Toàn bộ mã nguồn liên quan đến Three.js được cô lập trong thư mục `three/`, giúp dễ bảo trì và thay thế.
- **Backend module hóa:** NestJS tuân theo kiến trúc module chuẩn, mỗi module có controller, service, repository và DTO riêng.
- **Sẵn sàng mở rộng:** Có thể bổ sung thêm `apps/mobile` (React Native hoặc Expo), `apps/admin` (nếu tách CMS thành ứng dụng riêng) hoặc các microservice mà không cần thay đổi cấu trúc gốc.
