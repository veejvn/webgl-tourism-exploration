# Cấu trúc repository hiện tại

> Cập nhật: 2026-10-29
> Phạm vi: cây thư mục và package có trong repository. Đây không phải cấu trúc kiến trúc mục tiêu.

## Workspace

`pnpm-workspace.yaml` khai báo `apps/*` và `packages/*`; Turborepo điều phối build, dev, lint và test.

```text
repository/
├── apps/
│   ├── web/
│   └── api/
├── packages/
│   ├── types/
│   └── constants/
├── docker/
├── docs/
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

## Web — `apps/web`

```text
apps/web/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (protected)/
│   │   ├── map/page.tsx
│   │   └── explore/page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── AuthHydration.tsx
│   └── ui/
├── hooks/
│   ├── useAuth.ts
│   └── useDestinations.ts
├── lib/
│   ├── axios.ts
│   └── token.ts
├── providers/
├── services/api/
├── store/
├── three/
│   ├── character/PlayerController.tsx
│   └── scene/WorldScene.tsx
├── types/
├── validations/
├── e2e/
└── package.json
```

Tên route group trong ngoặc không tạo segment URL: các route tương ứng là `/login`, `/register`, `/map`, `/explore`. Tên `(protected)` không tự tạo bảo vệ route; kiểm tra hiện tại nằm trong `AuthHydration` và chỉ chuyển khách chưa đăng nhập khỏi `/explore`.

## API — `apps/api`

```text
apps/api/
├── prisma/
│   ├── schema.prisma
│   ├── schema.sqlite.prisma
│   └── seed.ts
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   └── destinations/
│   ├── prisma/
│   ├── app.module.ts
│   └── main.ts
├── test/
├── prisma.config.ts
└── package.json
```

`AuthGuard` có trong module auth nhưng các controller hiện có chưa gắn guard. `UsersModule` có service truy vấn/tạo user, nhưng chưa có users controller. Prisma migration directory hiện không có file migration; schema được quản lý từ hai file Prisma nêu trên.

## Shared packages và hạ tầng

- `packages/types/`: `Role`, `UserDTO`, `DestinationDTO`, `LandmarkDTO`.
- `packages/constants/`: tâm/zoom mặc định Mapbox, prompt AI mẫu và hằng số đường dẫn API.
- `docker/docker-compose.yml`: service PostgreSQL/PostGIS và Redis. Việc khai báo Redis trong Compose chưa đồng nghĩa API đã dùng Redis.

## Không có trong cây hiện tại

Các đường dẫn từng được mô tả trong tài liệu thiết kế cũ như `apps/docs`, `packages/ui`, `packages/utils`, `apps/web/features`, middleware/proxy, các module `ai`, `npc`, `quest`, `media` và CMS chưa tồn tại trong workspace hiện tại. Có thể bổ sung nếu được triển khai; không xem đây là cấu trúc code hiện hành.
