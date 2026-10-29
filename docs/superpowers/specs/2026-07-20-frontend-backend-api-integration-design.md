# Frontend-Backend API Integration Design

**Created:** 2026-07-20
**Author:** OpenCode Agent
**Status:** Draft

> **Lưu ý trạng thái (2026-10-29):** Đây là bản nháp lịch sử về tích hợp frontend/backend tại thời điểm 2026-07-20, không phải mô tả hiện trạng. Tài liệu từng giả định SQLite in-memory và proxy bảo vệ /profile, /dashboard; mã hiện lưu SQLite vào file apps/api/dev.db, không có proxy file, và frontend chỉ redirect khách khỏi /explore. Dùng ../../PRODUCT_SCOPE_AND_DOMAIN.md, ../../SYSTEM_ARCHITECTURE.md và ../../API_REFERENCE.md để xem trạng thái hiện tại.


---

## 1. Overview

### 1.1 Purpose

Thiết lập kết nối giữa Frontend (Next.js 16) và Backend (NestJS) cho nền tảng du lịch 3D An Giang, bao gồm:

- Kết nối API với React Query
- Xác thực người dùng với JWT
- Bảo vệ routes
- Quản lý token với localStorage

### 1.2 Goals

- ✅ Backend chạy được với SQLite in-memory (không cần Docker)
- ✅ Seed dữ liệu du lịch An Giang (6-8 destinations)
- ✅ Frontend gọi API qua React Query
- ✅ Auth flow: Register → Login → Token Storage
- ✅ Route protection cho `/explore`, `/profile`, `/dashboard`
- ✅ Error handling: Inline cho form, Toast cho system errors

### 1.3 Non-Goals

- OAuth (Google, Facebook) - Phase sau
- Refresh token mechanism - Phase sau
- Role-based access control chi tiết - Phase sau
- Real production database - Chỉ SQLite cho testing

---

## 2. Architecture

### 2.1 System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Port 3000)                     │
│                                                                   │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────────────┐│
│  │   Pages      │──>│   Hooks      │──>│   API Services       ││
│  │              │   │              │   │                      ││
│  │ /login       │   │ useAuth()    │   │ authApi.login()      ││
│  │ /register    │   │ useQuery()   │   │ authApi.register()   ││
│  │ /map         │   │ useMutation()│   │ destinationsApi()    ││
│  │ /explore     │   │              │   │                      ││
│  └──────────────┘   └──────────────┘   └──────────┬───────────┘│
│                                                    │             │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────▼───────────┐│
│  │  Zustand     │<──│ React Query  │   │   Axios Instance     ││
│  │  Auth Store  │   │   Provider   │   │   + Interceptors     ││
│  │              │   │              │   │   - Inject token     ││
│  │ - user       │   │ - QueryClient│   │   - Handle 401      ││
│  │ - token      │   │ - Devtools   │   │   - Error handling  ││
│  │ - login()    │   │              │   │                      ││
│  │ - logout()   │   └──────────────┘   └──────────┬───────────┘│
│  └──────────────┘                                  │             │
│                                                    │             │
│  ┌──────────────────────────────────────────────────▼──────────┐│
│  │              proxy.ts (Route Protection)                    ││
│  │  - Check token in localStorage                              ││
│  │  - Redirect to /login if unauthenticated                    ││
│  │  - Protected routes: /explore, /profile, /dashboard         ││
│  └─────────────────────────────────────────────────────────────┘│
└───────────────────────────────────────────────────────────────────┘
                               │
                               │ HTTP Requests
                               │ Authorization: Bearer <token>
                               │
┌──────────────────────────────▼───────────────────────────────────┐
│                         BACKEND (Port 3001)                      │
│                                                                   │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────────────┐│
│  │ Controllers  │──>│  Services    │──>│   SQLite In-Memory   ││
│  │              │   │              │   │                      ││
│  │ /auth/login  │   │ AuthService  │   │  - Destinations      ││
│  │ /auth/regist │   │ UsersService │   │    (An Giang:        ││
│  │ /destination │   │ DestinationsS│   │     Núi Sam,         ││
│  │              │   │              │   │     Núi Cấm,         ││
│  └──────────────┘   └──────────────┘   │     Phú Quốc...)     ││
│                                        │  - Users (dynamic)   ││
│  ┌──────────────────────────────────┐  └──────────────────────┘│
│  │         CORS Configuration      │                           │
│  │  origin: http://localhost:3000  │                           │
│  │  credentials: true              │                           │
│  └──────────────────────────────────┘                           │
└───────────────────────────────────────────────────────────────────┘
```

### 2.2 Data Flow

**Destinations Query Flow:**
```
Component → useDestinations() → React Query Cache?
                                    ↓ No
                            destinationsApi.getAll()
                                    ↓
                            Axios GET /destinations
                                    ↓
                            Backend Controller
                                    ↓
                            SQLite Database
                                    ↓
                            Response → Cache → Component
```

**Auth Mutation Flow:**
```
Form Submit → useAuth().login(data)
                    ↓
            React Hook Form validates (Zod)
                    ↓ Valid
            authApi.login({ email, password })
                    ↓
            Axios POST /auth/login
                    ↓
            Backend validates credentials
                    ↓ Success
            Response { user, token }
                    ↓
            authStore.login(user, token)
                    ↓
            localStorage.setItem('token', token)
                    ↓
            Redirect to /map (or redirect param)
```

---

## 3. Backend Design

### 3.1 SQLite Configuration

**File Structure:**
```
apps/api/
├── prisma/
│   ├── schema.sqlite.prisma    # SQLite schema
│   └── seed-sqlite.ts          # Seed An Giang data
├── src/prisma/
│   ├── prisma.service.ts       # PostgreSQL (existing)
│   ├── sqlite-prisma.service.ts # SQLite + seeding
│   └── prisma.module.ts        # Toggle service
└── .env
    └── USE_SQLITE=true
```

**SQLite Schema (schema.sqlite.prisma):**
- Provider: `sqlite`
- URL: `file::memory:?cache=shared`
- Types: `Float` → `Real` (SQLite không hỗ trợ Float)
- Enum: Map to `String`

**Toggle Mechanism:**
```typescript
// prisma.module.ts
const USE_SQLITE = process.env.USE_SQLITE === 'true';

@Global()
@Module({
  providers: [USE_SQLITE ? SqlitePrismaService : PrismaService],
  exports: [USE_SQLITE ? SqlitePrismaService : PrismaService],
})
export class PrismaModule {}
```

### 3.2 An Giang Destinations Data

**Destinations (8 điểm):**

| # | Name | Type | Latitude | Longitude | Description |
|---|------|------|----------|-----------|-------------|
| 1 | Núi Sam - Bà Chúa Xứ | Tâm linh | 10.7000 | 105.1167 | Miếu Bà Chúa Xứ, chùa Tây An, Lăng Tôn Đức Thắng |
| 2 | Núi Cấm | Thiên nhiên | 10.4667 | 105.1833 | Đỉnh cao nhất Bảy Núi (710m), chùa Vạn Linh |
| 3 | Hòn Phụ Tử | Thiên nhiên | 10.3833 | 104.5500 | Hai hòn đảo đá sừng sững giữa biển |
| 4 | Phú Quốc | Biển đảo | 10.2231 | 103.9572 | Đảo ngọc, biển Sao, cáp treo Hòn Thơm |
| 5 | Hà Tiên | Văn hóa | 10.3833 | 104.4833 | Thập cảnh Hà Tiên, biển Mũi Nai |
| 6 | Rạch Giá | Đô thị | 10.0125 | 105.0800 | Trung tâm hành chính, cảng biển |
| 7 | Châu Đốc | Biên giới | 10.7000 | 105.1167 | Cửa khẩu Vĩnh Xương, làng Chăm |
| 8 | Khu bảo tồn U Minh Thượng | Thiên nhiên | 9.9500 | 105.0000 | Rừng ngập mặn, sinh thái |

**Landmarks (mỗi destination 1-3 landmarks):**
- Núi Sam: Miếu Bà Chúa Xứ, Chùa Tây An, Lăng Tôn Đức Thắng
- Núi Cấm: Đỉnh Núi Cấm, Chùa Vạn Linh, Tượng Phật Di Lặc
- Phú Quốc: Biển Sao, Cáp treo Hòn Thơm, Làng chài Hàm Ninh
- (v.v.)

### 3.3 CORS Configuration

```typescript
// main.ts
app.enableCors({
  origin: ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

---

## 4. Frontend Design

### 4.1 Axios Instance

**File:** `apps/web/lib/axios.ts`

**Features:**
- Base URL from `NEXT_PUBLIC_API_URL`
- Request interceptor: Inject `Authorization: Bearer <token>`
- Response interceptor:
  - 401 → Clear token, redirect `/login`
  - Other errors → Reject with error message

**Error Handling:**
```typescript
// Extract backend error message
const errorMessage = error.response?.data?.message || 'Đã xảy ra lỗi';
```

### 4.2 Token Management

**File:** `apps/web/lib/token.ts`

**Methods:**
- `getToken(): string | null`
- `setToken(token: string): void`
- `removeToken(): void`
- `getUser(): UserDTO | null`
- `setUser(user: UserDTO): void`
- `removeUser(): void`
- `clear(): void` - Clear all auth data

**Storage Keys:**
- `token` - JWT token
- `user` - User JSON object

### 4.3 React Query Provider

**File:** `apps/web/providers/QueryProvider.tsx`

**Configuration:**
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,        // 1 minute
      gcTime: 5 * 60 * 1000,       // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

**Devtools:** Show only in `process.env.NODE_ENV === 'development'`

### 4.4 API Services

**auth.api.ts:**
```typescript
export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse>
  register: async (data: RegisterRequest): Promise<AuthResponse>
};
```

**destinations.api.ts:**
```typescript
export const destinationsApi = {
  getAll: async (): Promise<DestinationDTO[]>
  getById: async (id: string): Promise<DestinationDTO>
};
```

### 4.5 Custom Hooks

**useAuth Hook:**
```typescript
export function useAuth() {
  return {
    user: UserDTO | null,
    isAuthenticated: boolean,
    isLoading: boolean,
    login: (data: LoginRequest) => void,
    register: (data: RegisterRequest) => void,
    logout: () => void,
    loginError: Error | null,
    registerError: Error | null,
    isLoggingIn: boolean,
    isRegistering: boolean,
  };
}
```

**useDestinations Hook:**
```typescript
export function useDestinations() {
  return useQuery({
    queryKey: ['destinations'],
    queryFn: () => destinationsApi.getAll(),
  });
}

export function useDestination(id: string) {
  return useQuery({
    queryKey: ['destinations', id],
    queryFn: () => destinationsApi.getById(id),
    enabled: !!id,
  });
}
```

---

## 5. Auth Integration

### 5.1 Auth Store (Zustand)

**File:** `apps/web/store/auth.store.ts`

**State:**
```typescript
interface AuthState {
  user: UserDTO | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  login: (user: UserDTO, token: string) => void;
  logout: () => void;
  hydrate: () => void;
}
```

**Persistence:**
```typescript
import { persist } from 'zustand/middleware';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({ /* state and actions */ }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
```

### 5.2 Route Protection

**File:** `apps/web/proxy.ts`

**Protected Routes:**
- `/explore` - Khám phá 3D
- `/profile` - Thông tin cá nhân
- `/dashboard` - Quản lý

**Public Routes:**
- `/` - Trang chủ
- `/login` - Đăng nhập
- `/register` - Đăng ký
- `/map` - Bản đồ (public)

**Logic:**
```typescript
export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  
  const isProtectedRoute = protectedRoutes.some(route => 
    path.startsWith(route)
  );
  
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;
  
  // Protected route + not authenticated → redirect to login
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', req.nextUrl);
    loginUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(loginUrl);
  }
  
  // Authenticated + accessing login/register → redirect to map
  if (isAuthenticated && (path === '/login' || path === '/register')) {
    return NextResponse.redirect(new URL('/map', req.nextUrl));
  }
  
  return NextResponse.next();
}
```

### 5.3 Login/Register Forms

**Validation Schema (Zod):**
```typescript
export const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

export const registerSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
});
```

**Form Structure:**
- React Hook Form với `zodResolver`
- Inline error messages dưới mỗi field
- Submit button với loading state
- Link chuyển giữa login/register

---

## 6. Error Handling

### 6.1 Form Validation Errors

**Display:** Inline dưới mỗi field

**Example:**
```
┌─────────────────────────────────────┐
│ Email                               │
│ ┌─────────────────────────────────┐ │
│ │ test@invalid                    │ │
│ └─────────────────────────────────┘ │
│ ⚠ Email không hợp lệ               │
└─────────────────────────────────────┘
```

**Implementation:**
```tsx
{errors.email && (
  <p className="text-sm text-red-500 mt-1">
    {errors.email.message}
  </p>
)}
```

### 6.2 API Errors

**Display:** Toast/Snackbar

**Error Types:**
| HTTP Status | Message | Action |
|-------------|---------|--------|
| 400 | Bad request | Show toast |
| 401 | Unauthorized | Clear token, redirect |
| 409 | Email exists | Show inline error |
| 500 | Server error | Show toast |

**Toast Component:** Sử dụng sonner hoặc custom toast component

### 6.3 Network Errors

**Display:** Toast với message "Không thể kết nối đến server. Vui lòng thử lại sau."

**Retry:** User tự F5 hoặc click retry button

---

## 7. UI Components

### 7.1 Required Components

| Component | File | Usage |
|-----------|------|-------|
| Button | `components/ui/button.tsx` | ✅ Already exists |
| Input | `components/ui/input.tsx` | New - Form fields |
| Label | `components/ui/label.tsx` | New - Form labels |
| Form | `components/ui/form.tsx` | New - Form wrapper |
| Card | `components/ui/card.tsx` | New - Auth pages layout |
| Toast | `components/ui/toast.tsx` | New - Error notifications |

### 7.2 Component Structure

**Input Component:**
```tsx
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm",
          "focus-visible:ring-2 focus-visible:ring-ring",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
```

**Card Component:**
```tsx
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("rounded-xl border bg-card shadow-sm", className)}
      {...props}
    />
  )
);
```

---

## 8. File Changes Summary

### 8.1 Backend Files

| File | Action | Description |
|------|--------|-------------|
| `prisma/schema.sqlite.prisma` | CREATE | SQLite schema |
| `prisma/seed-sqlite.ts` | CREATE | Seed An Giang data |
| `src/prisma/sqlite-prisma.service.ts` | CREATE | SQLite client with seeding |
| `src/prisma/prisma.module.ts` | MODIFY | Toggle between PostgreSQL/SQLite |
| `src/main.ts` | MODIFY | Add CORS configuration |
| `.env` | MODIFY | Add `USE_SQLITE=true` |
| `package.json` | MODIFY | Add SQLite dependencies |

### 8.2 Frontend Files

| File | Action | Description |
|------|--------|-------------|
| `lib/axios.ts` | CREATE | Axios instance |
| `lib/token.ts` | CREATE | Token management |
| `lib/toast.ts` | CREATE | Toast helper |
| `providers/QueryProvider.tsx` | CREATE | React Query provider |
| `services/api/auth.api.ts` | CREATE | Auth endpoints |
| `services/api/destinations.api.ts` | CREATE | Destinations endpoints |
| `services/api/index.ts` | CREATE | API exports |
| `hooks/useAuth.ts` | CREATE | Auth hook |
| `hooks/useDestinations.ts` | CREATE | Destinations hook |
| `store/auth.store.ts` | CREATE | Auth state |
| `validations/auth.schema.ts` | CREATE | Zod schemas |
| `components/ui/input.tsx` | CREATE | Input component |
| `components/ui/label.tsx` | CREATE | Label component |
| `components/ui/form.tsx` | CREATE | Form component |
| `components/ui/card.tsx` | CREATE | Card components |
| `components/ui/toast.tsx` | CREATE | Toast component |
| `app/login/page.tsx` | CREATE | Login page |
| `app/register/page.tsx` | CREATE | Register page |
| `proxy.ts` | CREATE | Route protection |
| `app/layout.tsx` | MODIFY | Add QueryProvider |
| `app/map/page.tsx` | MODIFY | Use API data |
| `.env.local` | MODIFY | Add `NEXT_PUBLIC_API_URL` |
| `package.json` | MODIFY | Add react-hook-form, resolvers |

---

## 9. Testing Strategy

### 9.1 Backend Testing

```bash
# 1. Start backend with SQLite
pnpm --filter api dev

# 2. Test destinations endpoint
curl http://localhost:3001/destinations

# 3. Test register
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# 4. Test login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 9.2 Frontend Testing

**Test Cases:**
1. ✅ Destinations load from API (check Network tab)
2. ✅ Register form validates input
3. ✅ Register creates user and saves token
4. ✅ Login form validates input
5. ✅ Login saves token and redirects
6. ✅ Protected route redirects to login
7. ✅ Authenticated user can access /explore
8. ✅ Logout clears token and redirects

### 9.3 Integration Testing

**Flow:**
```
1. Clear localStorage
2. Navigate to /explore
3. Verify redirect to /login?redirect=/explore
4. Click "Register" link
5. Fill form with valid data
6. Submit and verify redirect to /map
7. Navigate to /explore
8. Verify access granted
9. Click logout
10. Verify redirect to /login
```

---

## 10. Dependencies

### 10.1 Backend Dependencies

```bash
pnpm --filter api add @prisma/adapter-better-sqlite3 better-sqlite3
pnpm --filter api add -D @types/better-sqlite3
```

### 10.2 Frontend Dependencies

```bash
pnpm --filter web add react-hook-form @hookform/resolvers sonner
```

**Note:** `zod` already exists (v3.25.76)

---

## 11. Success Criteria

| # | Criteria | Verification |
|---|----------|--------------|
| 1 | Backend starts without Docker | `pnpm --filter api dev` succeeds |
| 2 | SQLite seed data persists during session | API returns 8 An Giang destinations |
| 3 | CORS allows frontend requests | Network tab shows 200 responses |
| 4 | Login/Register forms validate correctly | Inline errors appear |
| 5 | Token saved to localStorage | DevTools shows token |
| 6 | Protected routes redirect | Access /explore without token → /login |
| 7 | Authenticated user accesses protected routes | After login → /explore works |
| 8 | Map shows API destinations | Markers appear on map |
| 9 | Logout clears session | Token removed, redirect to /login |
| 10 | Error messages display correctly | Toast for network, inline for form |

---

## 12. Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| SQLite loses data on restart | High | Document as test-only; production uses PostgreSQL |
| Token exposed in localStorage | Medium | Accept for simplicity; Phase 2: httpOnly cookies |
| CORS issues in development | Low | Properly configured in main.ts |
| Hydration mismatch with localStorage | Medium | Use `typeof window !== 'undefined'` checks |
| React Query cache stale | Low | Set appropriate `staleTime`, manual refetch option |

---

## 13. Future Considerations

### Phase 2 Enhancements
- Refresh token mechanism
- OAuth (Google, Facebook)
- Role-based access control
- Switch to PostgreSQL for production
- httpOnly cookies for token storage
- Profile page with avatar upload
- Dashboard with user stats

### Performance Optimizations
- React Query prefetching
- Image lazy loading for destinations
- Map marker clustering
- 3D model progressive loading

---

## 14. References

- [Next.js 16 Proxy Documentation](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [React Query Best Practices](https://tanstack.com/query/latest/docs/react/guides/important-defaults)
- [Zustand Persistence](https://zustand-demo.pmnd.rs/docs/integrations/persisting-store-data)
- [React Hook Form with Zod](https://react-hook-form.com/get-started#SchemaValidation)
- [Prisma SQLite](https://www.prisma.io/docs/concepts/database-connectors/sqlite)
