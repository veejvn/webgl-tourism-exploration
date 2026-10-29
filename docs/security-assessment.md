# Báo cáo đánh giá bảo mật — Hệ thống Authentication

> Đánh giá ngày 25/10/2026 — phạm vi: module Auth của `apps/api`, luồng token/phiên trên `apps/web`.
> Trạng thái: đây là báo cáo theo thời điểm 2026-10-25. Mã nguồn auth có một số bằng chứng tương ứng với các mục **[ĐÃ SỬA]**; các khuyến nghị chưa được tái đánh giá trong lần đồng bộ tài liệu 2026-10-29. Không xem đây là chứng nhận bảo mật hoặc kết quả kiểm thử mới.

## Tóm tắt điều hành

Hệ thống auth trước đây có 5 lỗ hổng mức nghiêm trọng (hash mật khẩu SHA-256 không salt, JWT secret hardcode, so sánh không timing-safe, không validate đầu vào, token không có hạn có thể sống mãi). Tất cả đã được sửa trong đợt này. Các khuyến nghị còn lại (rate-limit, security headers, httpOnly cookie, refresh token) nên thực hiện trước khi triển khai production.

## Phát hiện & trạng thái

### 1. [ĐÃ SỬA — Critical] Mật khẩu hash bằng SHA-256 không salt
- **Trước đây:** `auth.service.ts` lưu mật khẩu bằng `crypto.createHash('sha256')` một vòng, không salt — dễ bị rainbow-table / brute-force GPU.
- **Đã sửa:** Chuyển sang **scrypt** (module `crypto` của Node, không thêm dependency): format `scrypt:<saltHex>:<hashHex>` với N=16384, r=8, p=1, keylen=64 (`password.helper.ts`). Tài khoản cũ (hash SHA-256 trong `dev.db`) được **tự động nâng cấp**: lần login đầu tiên xác thực theo cách cũ, re-hash bằng scrypt và ghi lại DB. So sánh hash dùng `crypto.timingSafeEqual`.

### 2. [ĐÃ SỬA — Critical] JWT secret có fallback hardcode
- **Trước đây:** `jwt.helper.ts` dùng `'tourism-3d-secret-key-super-secure'` khi thiếu `JWT_SECRET` — ai đọc source đều có thể ký token hợp lệ cho bất kỳ user nào.
- **Đã sửa:** Server **từ chối khởi động** nếu `process.env.JWT_SECRET` chưa set; secret ngẫu nhiên (48 byte) đã sinh và thêm vào `apps/api/.env`.

### 3. [ĐÃ SỬA — High] So sánh không timing-safe
- **Trước đây:** So sánh chữ ký JWT (`signature !== expectedSignature`) và so sánh hash mật khẩu bằng `!==` — mở cơ hội timing attack.
- **Đã sửa:** So sánh bằng `crypto.timingSafeEqual` ở cả `jwt.helper.ts` (chữ ký) và `password.helper.ts` (hash), có kiểm tra độ dài buffer trước.

### 4. [ĐÃ SỬA — High] Không validate đầu vào (`body: any`)
- **Trước đây:** `POST /auth/register` và `POST /auth/login` nhận `@Body() body: any` — mọi JSON đều được chấp nhận, field thiếu/quá dài/không đúng kiểu đi thẳng vào service.
- **Đã sửa:** Thêm `LoginDto` / `RegisterDto` (`class-validator`: email chuẩn, password 6–128 ký tự, name 2–100 ký tự) + global `ValidationPipe({ whitelist: true, transform: true })` trong `main.ts`. Field lạ bị tự động strip.

### 5. [ĐÃ SỬA — Medium] Token không có `exp` sống mãi
- **Trước đây:** `verify()` chỉ hết hạn token khi `payload.exp` tồn tại (`if (payload.exp && ...)`).
- **Đã sửa:** `verify()` **từ chối** token thiếu `exp` hoặc `exp` không phải number.

### 6. [KHUYẾN NGHỊ — High] JWT lưu trong localStorage
- **Hiện trạng:** Token nằm ở 2 key localStorage (`token` từ `tokenManager` và `auth-storage` của Zustand persist). Bất kỳ XSS nào cũng đọc được token; không có cơ chế httpOnly.
- **Khuyến nghị:** Chuyển sang httpOnly, Secure, SameSite=Lax cookie, hoặc ít nhất gộp về 1 nơi lưu duy nhất. Trade-off: cần middleware/proxy đổi token giữa FE–BE, thay đổi lớn cả hai đầu; nên làm khi làm tính năng refresh token.

### 7. [KHUYẾN NGHỊ — High] Không có rate limiting
- **Hiện trạng:** `/auth/login` và `/auth/register` không giới hạn số request — brute-force mật khẩu và spam đăng ký không bị chặn.
- **Khuyến nghị:** `@nestjs/throttler` với guard riêng cho `AuthController` (ví dụ 5 lần/phút/IP cho login). Chi phí thấp, nên làm sớm.

### 8. [KHUYẾN NGHỊ — Medium] Thiếu security headers
- **Hiện trạng:** `main.ts` không cài helmet/fastify-helmet — thiếu `X-Content-Type-Options`, `X-Frame-Options`, CSP...
- **Khuyến nghị:** `@fastify/helmet` 2 dòng config.

### 9. [KHUYẾN NGHỊ — Medium] Không có refresh token / thu hồi phiên
- **Hiện trạng:** Token HS256 24h, không thể thu hồi trước khi hết hạn (đổi mật khẩu/kick user không có tác dụng với token đã cấp).
- **Khuyến nghị:** Khi có nhu cầu production, thêm refresh token ngắn hạn lưu DB (cho phép revocation) + access token ngắn hạn.

### 10. [KHUYẾN NGHỊ — Medium] Role tin từ token, không re-check DB
- **Hiện trạng:** `AuthGuard` gắn nguyên payload (gồm `role`) vào `request['user']` mà không tra DB. Vì secret hiện chỉ có server giữ (sau fix #2) nên rủi ro thấp, nhưng role của user bị khóa sau khi token cấp — thăng quyền/hạ quyền chỉ có hiệu lực sau 24h.
- **Khuyến nghị:** Khi xây route ADMIN, tra lại user trong guard, hoặc giảm TTL access token.

### 11. [KHUYẾN NGHỊ — Low] Email enumeration qua register
- **Hiện trạng:** `POST /auth/register` trả `409 Email already in use` — có thể dò email nào đã đăng ký. Login đã dùng thông báo chung "Invalid credentials" (tốt).
- **Khuyến nghị:** Chấp nhận được cho UX thông thường; nếu cần chặt, trả thông báo chung và gửi email thông báo riêng.

### 12. [KHUYẾN NGHỊ — Low] Password policy mỏng
- **Hiện trạng:** Client và API đều chỉ yêu cầu tối thiểu 6 ký tự, không kiểm tra phức tạp.
- **Khuyến nghị:** Nâng tối thiểu 8 ký tự + kiểm tra mật khẩu phổ biến (zxcvbn hoặc denylist) khi xây profile/đổi mật khẩu.

## Điểm tích cực (đã đúng ngay từ đầu)

- API response (`register`/`login`) trả về object user rút gọn, **không bao giờ lộ hash mật khẩu**; `UserDTO` trong `@project/types` cũng không chứa `password`.
- Login dùng thông báo lỗi chung "Invalid credentials", không lộ email có tồn tại hay không.
- Token truyền qua header `Authorization: Bearer` (không dùng cookie) → bề mặt CSRF gần như không có.
- CORS chỉ mở cho `http://localhost:3000` với `credentials` — dải hẹp, đúng mục đích dev.
- `AuthGuard` đã sẵn sàng trong code (verify JWT chuẩn) cho các route riêng tư tương lai; `/destinations` hiện giữ public theo thiết kế (dữ liệu marketing công khai).

## Cấu hình môi trường cần nhớ

- `apps/api/.env` bắt buộc có `JWT_SECRET` — server crash khi thiếu.
- Khi deploy production: secret mới riêng, không tái dùng secret dev; bật HTTPS trước cookie Secure/`credentials`.
