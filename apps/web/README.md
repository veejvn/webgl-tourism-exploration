# Web application

Ứng dụng web của Cù Lao Giêng 3D Explorer dùng Next.js 16 App Router.

## Routes hiện có

- /: placeholder hiện tại.
- /login, /register: luồng đăng nhập/đăng ký.
- /map: Mapbox lấy điểm đến từ API.
- /explore: demo scene 3D hiện có.

## Chạy

Từ thư mục gốc cài dependency bằng pnpm install, sau đó cấu hình NEXT_PUBLIC_API_URL và NEXT_PUBLIC_MAPBOX_TOKEN trong apps/web/.env.local. Khởi động cả workspace bằng pnpm dev hoặc riêng web bằng pnpm --filter web dev. Next dev mặc định dùng cổng 3000; script hiện tại không ghim cổng.

Build production dùng `pnpm --filter web build` (Next.js với webpack). Font hệ thống được dùng để build không cần truy cập Google Fonts. Script kiểm thử E2E là `pnpm --filter web test:e2e`: nó build web trước rồi Playwright chạy server production và API với `apps/api/e2e.db` riêng, không dùng `dev.db`. Không có script unit test riêng ở package web.

Xem [README gốc](../../README.md), [Product Scope & Domain](../../docs/PRODUCT_SCOPE_AND_DOMAIN.md) và [API Reference](../../docs/API_REFERENCE.md) để biết trạng thái, cấu hình và giới hạn tích hợp.
