# API Reference — hiện hành

> Cập nhật: 2026-10-29
> Nguồn: controller, DTO, service và bootstrap trong `apps/api/src`. Không bao gồm API tương lai.

## Kết nối

- Base URL local mặc định: `http://localhost:3001` (`PORT` có thể thay đổi).
- Không có global `/api` prefix trong bootstrap hiện tại.
- CORS hiện cho phép origin `http://localhost:3000`.
- Web API base URL đọc từ `NEXT_PUBLIC_API_URL`.
- API đọc JSON; Nest global `ValidationPipe` bật `whitelist` và `transform`.

## Authentication

### `POST /auth/register`

Tạo user và trả token ngay sau khi đăng ký.

Request:

```json
{
  "name": "Nguyen Van A",
  "email": "a@example.com",
  "password": "at-least-6-characters"
}
```

Validation hiện tại: `name` là string dài 2–100 ký tự; `email` phải hợp lệ; `password` là string dài 6–128 ký tự.

Success: mặc định Nest `201 Created`.

```json
{
  "user": {
    "id": "user-id",
    "email": "a@example.com",
    "name": "Nguyen Van A",
    "role": "USER"
  },
  "token": "JWT"
}
```

Email đã tồn tại trả `409 Conflict`. Response không trả password hash.

### `POST /auth/login`

Request:

```json
{
  "email": "a@example.com",
  "password": "at-least-6-characters"
}
```

Validation: email hợp lệ; password dài 6–128 ký tự. Success trả `200 OK` cùng cấu trúc user/token như register. Sai thông tin xác thực trả `401 Unauthorized`.

JWT dùng HS256, mặc định hết hạn sau 24 giờ. API yêu cầu `JWT_SECRET` khi khởi động.

## Destinations

Hai endpoint đọc dữ liệu hiện hành không gắn `AuthGuard`, vì vậy không yêu cầu Bearer token.

### `GET /destinations`

Trả danh sách destination có `verificationStatus = VERIFIED` và `publicationStatus = PUBLISHED`; service include `landmarks` cho từng destination. Danh sách có thể rỗng khi chưa có hồ sơ đủ điều kiện. Không có query/filter/pagination trong controller.

### `GET /destinations/:id`

Trả một destination theo id, kèm landmarks, khi đã `VERIFIED` và `PUBLISHED`. ID không tồn tại hoặc hồ sơ chưa đủ điều kiện đều trả `404 Not Found`.

Các trường hiện có theo Prisma/DTO: `id`, `title`, `description`, `latitude`, `longitude`, `coverImage`, `modelUrl` và `sourceUrl` tùy chọn, `verificationStatus`, `publicationStatus`, `createdAt`, `updatedAt`; `landmarks` là danh sách tùy chọn trong DTO. Hai trạng thái là chuỗi trong schema, mặc định `UNVERIFIED` và `DRAFT`; hiện chưa có endpoint duyệt/xuất bản. Landmark có `destinationId`, nội dung, tọa độ, `modelUrl` tùy chọn và timestamps. Mỗi database đích cần được sao lưu và đồng bộ schema trước khi chạy API dùng client mới; SQLite và PostgreSQL sinh Prisma Client theo provider tương ứng.

## Auth header và endpoint chưa có

Frontend Axios tự gửi `Authorization: Bearer <token>` nếu localStorage có token và chuyển về `/login` khi nhận 401. `AuthGuard` có thể xác minh Bearer JWT nhưng chưa được gắn vào các controller hiện có; hiện không có endpoint business nào cần token.

Không có `GET /auth/me` controller trong API hiện tại, dù có hằng số `API_ROUTES.AUTH.ME` trong shared constants. Chưa có endpoint CRUD destination, itinerary, progress, CMS, community submission, AI, scene/model upload hoặc translation.

## Error/validation behavior

- Validation DTO sai: Nest validation response `400 Bad Request`.
- Email trùng register: `409 Conflict`.
- Login sai: `401 Unauthorized`.
- Destination id không tồn tại: `404 Not Found`.
- Các response runtime chưa được tái kiểm thử khi viết tài liệu; payload mẫu ở trên phản ánh kiểu dữ liệu/return object trong source.
