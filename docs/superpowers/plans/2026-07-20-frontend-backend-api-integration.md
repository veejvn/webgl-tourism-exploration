# Frontend-Backend API Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Thiết lập kết nối API giữa Frontend (Next.js 16) và Backend (NestJS) với SQLite in-memory, React Query, JWT authentication, và route protection.

**Architecture:** Backend sử dụng SQLite in-memory với toggle qua env flag. Frontend dùng Axios interceptors để inject token, React Query để cache data, Zustand để manage auth state, và proxy.ts để protect routes.

**Tech Stack:** NestJS, Prisma, SQLite, Next.js 16, React Query, Zustand, React Hook Form, Zod, Axios

---

## Phase 1: Backend SQLite Setup

### Task 1.1: Install SQLite Dependencies

**Files:**
- Modify: `apps/api/package.json`

- [ ] **Step 1: Install better-sqlite3 and adapter**

Run in `apps/api`:
```bash
pnpm add @prisma/adapter-better-sqlite3 better-sqlite3
pnpm add -D @types/better-sqlite3
```

Expected: Dependencies added to package.json

- [ ] **Step 2: Verify installation**

Run:
```bash
cd apps/api; npm list @prisma/adapter-better-sqlite3 better-sqlite3
```

Expected: Both packages listed with versions

- [ ] **Step 3: Commit**

```bash
git add apps/api/package.json pnpm-lock.yaml
git commit -m "chore(api): add SQLite dependencies for in-memory database"
```

---

### Task 1.2: Create SQLite Prisma Schema

**Files:**
- Create: `apps/api/prisma/schema.sqlite.prisma`

- [ ] **Step 1: Create SQLite schema file**

Create file `apps/api/prisma/schema.sqlite.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file::memory:?cache=shared"
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
  role      String   @default("USER")
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
  modelUrl    String?
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
  modelUrl      String?
  destination   Destination @relation(fields: [destinationId], references: [id], onDelete: Cascade)
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/api/prisma/schema.sqlite.prisma
git commit -m "feat(api): add SQLite schema for in-memory database"
```

---

### Task 1.3: Create SQLite Prisma Service with An Giang Seed Data

**Files:**
- Create: `apps/api/src/prisma/sqlite-prisma.service.ts`

- [ ] **Step 1: Create SQLite Prisma service**

Create file `apps/api/src/prisma/sqlite-prisma.service.ts`:

```typescript
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

@Injectable()
export class SqlitePrismaService
  extends PrismaClient
  implements OnModuleInit
{
  constructor() {
    const adapter = new PrismaBetterSqlite3({
      url: 'file::memory:?cache=shared',
    });
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
    await this.seedAnGiangData();
  }

  private async seedAnGiangData() {
    const count = await this.destination.count();
    if (count > 0) return;

    await this.destination.createMany({
      data: [
        {
          id: 'nui-sam',
          title: 'Núi Sam - Bà Chúa Xứ',
          description: 'Trung tâm du lịch tâm linh nổi tiếng bậc nhất miền Tây với Miếu Bà Chúa Xứ, Chùa Tây An và Lăng Tôn Đức Thắng.',
          latitude: 10.7000,
          longitude: 105.1167,
          coverImage: 'https://images.unsplash.com/photo-1555861496-0666c8981751?w=600&auto=format&fit=crop',
        },
        {
          id: 'nui-cam',
          title: 'Núi Cấm',
          description: 'Đỉnh núi cao nhất trong vùng Bảy Núi (710m) với chùa Vạn Linh và tượng Phật Di Lặc khổng lồ.',
          latitude: 10.4667,
          longitude: 105.1833,
          coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&auto=format&fit=crop',
        },
        {
          id: 'hon-phu-tu',
          title: 'Hòn Phụ Tử',
          description: 'Hai hòn đảo đá vôi sừng sững giữa biển Hà Tiên, hình dáng giống người cha bế con.',
          latitude: 10.3833,
          longitude: 104.5500,
          coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop',
        },
        {
          id: 'phu-quoc',
          title: 'Phú Quốc',
          description: 'Đảo ngọc với biển Sao trong vắt, cáp treo Hòn Thơm dài nhất thế giới và làng chài Hàm Ninh.',
          latitude: 10.2231,
          longitude: 103.9572,
          coverImage: 'https://images.unsplash.com/photo-1537956965359-7573183d1f57?w=600&auto=format&fit=crop',
        },
        {
          id: 'ha-tien',
          title: 'Hà Tiên',
          description: 'Vùng đất biên giới với Thập cảnh Hà Tiên, biển Mũi Nai và di tích lịch sử Mạc Cửu.',
          latitude: 10.3833,
          longitude: 104.4833,
          coverImage: 'https://images.unsplash.com/photo-1501436513145-30f24e197862?w=600&auto=format&fit=crop',
        },
        {
          id: 'rach-gia',
          title: 'Rạch Giá',
          description: 'Trung tâm hành chính tỉnh An Giang với cảng biển sầm uất và khu du lịch Hòn Đất.',
          latitude: 10.0125,
          longitude: 105.0800,
          coverImage: 'https://images.unsplash.com/photo-1516690561799-49d528a6e179?w=600&auto=format&fit=crop',
        },
        {
          id: 'chau-doc',
          title: 'Châu Đốc',
          description: 'Thành phố biên giới với cửa khẩu Vĩnh Xương, làng Chăm văn hóa và rừng tràm Trà Sư.',
          latitude: 10.7000,
          longitude: 105.1167,
          coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&auto=format&fit=crop',
        },
        {
          id: 'u-minh-thuong',
          title: 'Khu bảo tồn U Minh Thượng',
          description: 'Vườn quốc gia với hệ sinh thái rừng ngập mặn độc đáo, chim muông phong phú.',
          latitude: 9.9500,
          longitude: 105.0000,
          coverImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&auto=format&fit=crop',
        },
      ],
    });

    await this.landmark.createMany({
      data: [
        { id: 'ba-chua-xu', destinationId: 'nui-sam', title: 'Miếu Bà Chúa Xứ', description: 'Tượng Bà Chúa Xứ cao 2.7m trên đỉnh núi Sam.', latitude: 10.6989, longitude: 105.1131 },
        { id: 'chua-tay-an', destinationId: 'nui-sam', title: 'Chùa Tây An', description: 'Ngôi chùa cổ kính với kiến trúc đặc sắc.', latitude: 10.7012, longitude: 105.1145 },
        { id: 'dinh-nui-cam', destinationId: 'nui-cam', title: 'Đỉnh Núi Cấm', description: 'Đỉnh cao 710m với view toàn cảnh.', latitude: 10.4689, longitude: 105.1856 },
        { id: 'chua-van-linh', destinationId: 'nui-cam', title: 'Chùa Vạn Linh', description: 'Ngôi chùa lớn trên núi Cấm.', latitude: 10.4656, longitude: 105.1823 },
        { id: 'bien-sao', destinationId: 'phu-quoc', title: 'Biển Sao', description: 'Bãi biển đẹp nhất Phú Quốc với cát trắng mịn.', latitude: 10.2156, longitude: 103.9756 },
        { id: 'cap-treo-hon-thom', destinationId: 'phu-quoc', title: 'Cáp treo Hòn Thơm', description: 'Dây cáp treo dài nhất thế giới (8km).', latitude: 10.1895, longitude: 103.9234 },
        { id: 'mui-nai', destinationId: 'ha-tien', title: 'Biển Mũi Nai', description: 'Bãi biển hoang sơ với tượng cá voi khổng lồ.', latitude: 10.3723, longitude: 104.4612 },
      ],
    });
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/api/src/prisma/sqlite-prisma.service.ts
git commit -m "feat(api): create SQLite Prisma service with An Giang seed data"
```

---

### Task 1.4: Update Prisma Module to Toggle SQLite/PostgreSQL

**Files:**
- Modify: `apps/api/src/prisma/prisma.module.ts`

- [ ] **Step 1: Update prisma.module.ts to toggle services**

Replace content in `apps/api/src/prisma/prisma.module.ts`:

```typescript
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { SqlitePrismaService } from './sqlite-prisma.service';

const USE_SQLITE = process.env.USE_SQLITE === 'true';

const prismaProvider = {
  provide: 'PRISMA_SERVICE',
  useClass: USE_SQLITE ? SqlitePrismaService : PrismaService,
};

@Global()
@Module({
  providers: [prismaProvider],
  exports: [prismaProvider],
})
export class PrismaModule {}
```

- [ ] **Step 2: Update all services to use injected token**

Modify `apps/api/src/modules/users/users.service.ts` - change constructor:

```typescript
import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(@Inject('PRISMA_SERVICE') private readonly prisma: PrismaService) {}
```

Modify `apps/api/src/modules/destinations/destinations.service.ts`:

```typescript
import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DestinationsService {
  constructor(@Inject('PRISMA_SERVICE') private readonly prisma: PrismaService) {}
```

Modify `apps/api/src/modules/auth/auth.service.ts`:

```typescript
import { Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtHelper } from './jwt.helper';
import * as crypto from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject('PRISMA_SERVICE') private readonly prisma: PrismaService,
  ) {}

  async register(email: string, password: string, name: string) {
    const existing = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = this.hashPassword(password);
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    const token = JwtHelper.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const hashedPassword = this.hashPassword(password);
    if (user.password !== hashedPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = JwtHelper.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    };
  }

  private hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
  }
}
```

- [ ] **Step 3: Update auth.module.ts to remove UsersModule import**

Modify `apps/api/src/modules/auth/auth.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
```

- [ ] **Step 4: Commit**

```bash
git add apps/api/src/prisma/prisma.module.ts apps/api/src/modules/users/users.service.ts apps/api/src/modules/destinations/destinations.service.ts apps/api/src/modules/auth/auth.service.ts apps/api/src/modules/auth/auth.module.ts
git commit -m "feat(api): toggle between SQLite and PostgreSQL via env flag"
```

---

### Task 1.5: Update .env and main.ts for CORS

**Files:**
- Modify: `apps/api/.env`
- Modify: `apps/api/src/main.ts`

- [ ] **Step 1: Update .env file**

Replace `apps/api/.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/3d_tourism_db?schema=public"
PORT=3001
USE_SQLITE=true
```

- [ ] **Step 2: Update main.ts to enable CORS**

Replace `apps/api/src/main.ts`:

```typescript
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.listen(process.env.PORT ?? 3001, '0.0.0.0');
  console.log(`🚀 Backend running on http://localhost:${process.env.PORT ?? 3001}`);
}
bootstrap();
```

- [ ] **Step 3: Commit**

```bash
git add apps/api/.env apps/api/src/main.ts
git commit -m "feat(api): enable CORS for frontend and add USE_SQLITE flag"
```

---

### Task 1.6: Test Backend with SQLite

**Files:**
- None (testing only)

- [ ] **Step 1: Start backend server**

Run:
```bash
pnpm --filter api dev
```

Expected: Server starts on port 3001 with message "🚀 Backend running on http://localhost:3001"

- [ ] **Step 2: Test destinations endpoint**

Run in another terminal:
```bash
curl http://localhost:3001/destinations
```

Expected: JSON array with 8 An Giang destinations

- [ ] **Step 3: Test register endpoint**

Run:
```bash
curl -X POST http://localhost:3001/auth/register -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"password123\",\"name\":\"Test User\"}"
```

Expected: JSON with user object and token

- [ ] **Step 4: Test login endpoint**

Run:
```bash
curl -X POST http://localhost:3001/auth/login -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

Expected: JSON with user object and token

---

## Phase 2: Frontend API Client & React Query

### Task 2.1: Install Frontend Dependencies

**Files:**
- Modify: `apps/web/package.json`

- [ ] **Step 1: Install react-hook-form, resolvers, and toast library**

Run:
```bash
pnpm --filter web add react-hook-form @hookform/resolvers sonner
```

Expected: Dependencies added to package.json

- [ ] **Step 2: Commit**

```bash
git add apps/web/package.json pnpm-lock.yaml
git commit -m "chore(web): add react-hook-form, resolvers, and sonner"
```

---

### Task 2.2: Update .env.local with API URL

**Files:**
- Modify: `apps/web/.env.local`

- [ ] **Step 1: Add API URL to .env.local**

Replace `apps/web/.env.local`:

```env
NEXT_PUBLIC_MAPBOX_TOKEN= YOUR_MAPBOX_TOKEN_HERE
NEXT_PUBLIC_API_URL=http://localhost:3001
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/.env.local
git commit -m "chore(web): add NEXT_PUBLIC_API_URL for backend connection"
```

---

### Task 2.3: Create Axios Instance

**Files:**
- Create: `apps/web/lib/axios.ts`

- [ ] **Step 1: Create axios instance with interceptors**

Create file `apps/web/lib/axios.ts`:

```typescript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/lib/axios.ts
git commit -m "feat(web): create axios instance with auth interceptors"
```

---

### Task 2.4: Create Token Manager

**Files:**
- Create: `apps/web/lib/token.ts`

- [ ] **Step 1: Create token management utilities**

Create file `apps/web/lib/token.ts`:

```typescript
const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export const tokenManager = {
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, token);
  },

  removeToken: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
  },

  getUser: (): any | null => {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  setUser: (user: any): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  removeUser: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(USER_KEY);
  },

  clear: (): void => {
    tokenManager.removeToken();
    tokenManager.removeUser();
  },
};
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/lib/token.ts
git commit -m "feat(web): create token manager for localStorage"
```

---

### Task 2.5: Create React Query Provider

**Files:**
- Create: `apps/web/providers/QueryProvider.tsx`

- [ ] **Step 1: Create QueryProvider component**

Create file `apps/web/providers/QueryProvider.tsx`:

```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode, useState } from 'react';

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            gcTime: 5 * 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/providers/QueryProvider.tsx
git commit -m "feat(web): create React Query provider with devtools"
```

---

### Task 2.6: Update Root Layout with QueryProvider

**Files:**
- Modify: `apps/web/app/layout.tsx`

- [ ] **Step 1: Wrap app with QueryProvider**

Replace `apps/web/app/layout.tsx`:

```typescript
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "3D Tourism - Khám phá An Giang",
  description: "Nền tảng du lịch 3D khám phá di sản An Giang, Việt Nam",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/app/layout.tsx
git commit -m "feat(web): integrate QueryProvider in root layout"
```

---

### Task 2.7: Create API Types

**Files:**
- Create: `apps/web/types/api.types.ts`

- [ ] **Step 1: Create API type definitions**

Create file `apps/web/types/api.types.ts`:

```typescript
import { UserDTO, DestinationDTO } from '@project/types';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: UserDTO;
  token: string;
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/types/api.types.ts
git commit -m "feat(web): create API type definitions"
```

---

### Task 2.8: Create Auth API Service

**Files:**
- Create: `apps/web/services/api/auth.api.ts`

- [ ] **Step 1: Create auth API functions**

Create file `apps/web/services/api/auth.api.ts`:

```typescript
import apiClient from '@/lib/axios';
import { LoginRequest, RegisterRequest, AuthResponse } from '@/types/api.types';

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    return response.data;
  },
};
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/services/api/auth.api.ts
git commit -m "feat(web): create auth API service"
```

---

### Task 2.9: Create Destinations API Service

**Files:**
- Create: `apps/web/services/api/destinations.api.ts`

- [ ] **Step 1: Create destinations API functions**

Create file `apps/web/services/api/destinations.api.ts`:

```typescript
import apiClient from '@/lib/axios';
import { DestinationDTO } from '@project/types';

export const destinationsApi = {
  getAll: async (): Promise<DestinationDTO[]> => {
    const response = await apiClient.get<DestinationDTO[]>('/destinations');
    return response.data;
  },

  getById: async (id: string): Promise<DestinationDTO> => {
    const response = await apiClient.get<DestinationDTO>(`/destinations/${id}`);
    return response.data;
  },
};
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/services/api/destinations.api.ts
git commit -m "feat(web): create destinations API service"
```

---

### Task 2.10: Create API Index Export

**Files:**
- Create: `apps/web/services/api/index.ts`

- [ ] **Step 1: Create index file for API exports**

Create file `apps/web/services/api/index.ts`:

```typescript
export { authApi } from './auth.api';
export { destinationsApi } from './destinations.api';
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/services/api/index.ts
git commit -m "feat(web): create API services index"
```

---

## Phase 3: Auth Integration

### Task 3.1: Create Zod Validation Schemas

**Files:**
- Create: `apps/web/validations/auth.schema.ts`

- [ ] **Step 1: Create Zod schemas for auth forms**

Create file `apps/web/validations/auth.schema.ts`:

```typescript
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email là bắt buộc').email('Email không hợp lệ'),
  password: z.string().min(1, 'Mật khẩu là bắt buộc').min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

export const registerSchema = z.object({
  email: z.string().min(1, 'Email là bắt buộc').email('Email không hợp lệ'),
  password: z.string().min(1, 'Mật khẩu là bắt buộc').min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  name: z.string().min(1, 'Họ tên là bắt buộc').min(2, 'Họ tên phải có ít nhất 2 ký tự'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/validations/auth.schema.ts
git commit -m "feat(web): create Zod validation schemas for auth forms"
```

---

### Task 3.2: Create Auth Store

**Files:**
- Create: `apps/web/store/auth.store.ts`

- [ ] **Step 1: Create Zustand auth store**

Create file `apps/web/store/auth.store.ts`:

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserDTO } from '@project/types';
import { tokenManager } from '@/lib/token';

interface AuthState {
  user: UserDTO | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setUser: (user: UserDTO) => void;
  setToken: (token: string) => void;
  login: (user: UserDTO, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user) => {
        tokenManager.setUser(user);
        set({ user, isAuthenticated: true });
      },

      setToken: (token) => {
        tokenManager.setToken(token);
        set({ token });
      },

      login: (user, token) => {
        tokenManager.setToken(token);
        tokenManager.setUser(user);
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        tokenManager.clear();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      setLoading: (loading) => set({ isLoading: loading }),

      hydrate: () => {
        const token = tokenManager.getToken();
        const user = tokenManager.getUser();

        if (token && user) {
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          set({ isLoading: false });
        }
      },
    }),
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

- [ ] **Step 2: Commit**

```bash
git add apps/web/store/auth.store.ts
git commit -m "feat(web): create Zustand auth store with persistence"
```

---

### Task 3.3: Create useAuth Hook

**Files:**
- Create: `apps/web/hooks/useAuth.ts`

- [ ] **Step 1: Create useAuth hook**

Create file `apps/web/hooks/useAuth.ts`:

```typescript
import { useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { authApi } from '@/services/api';
import { useAuthStore } from '@/store/auth.store';
import { LoginRequest, RegisterRequest } from '@/types/api.types';
import { toast } from 'sonner';

export function useAuth() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, logout, user, isAuthenticated, isLoading } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (response) => {
      login(response.user, response.token);
      const redirect = searchParams.get('redirect') || '/map';
      router.push(redirect);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
      toast.error(message);
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: (response) => {
      login(response.user, response.token);
      router.push('/map');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
      toast.error(message);
    },
  });

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: handleLogout,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/hooks/useAuth.ts
git commit -m "feat(web): create useAuth hook with mutations"
```

---

### Task 3.4: Create useDestinations Hook

**Files:**
- Create: `apps/web/hooks/useDestinations.ts`

- [ ] **Step 1: Create useDestinations hook**

Create file `apps/web/hooks/useDestinations.ts`:

```typescript
import { useQuery } from '@tanstack/react-query';
import { destinationsApi } from '@/services/api';
import { toast } from 'sonner';

export function useDestinations() {
  const query = useQuery({
    queryKey: ['destinations'],
    queryFn: () => destinationsApi.getAll(),
  });

  if (query.error) {
    toast.error('Không thể tải danh sách điểm đến. Vui lòng thử lại sau.');
  }

  return query;
}

export function useDestination(id: string) {
  const query = useQuery({
    queryKey: ['destinations', id],
    queryFn: () => destinationsApi.getById(id),
    enabled: !!id,
  });

  if (query.error) {
    toast.error('Không thể tải thông tin điểm đến. Vui lòng thử lại sau.');
  }

  return query;
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/hooks/useDestinations.ts
git commit -m "feat(web): create useDestinations hook with React Query"
```

---

## Phase 4: UI Components

### Task 4.1: Create Input Component

**Files:**
- Create: `apps/web/components/ui/input.tsx`

- [ ] **Step 1: Create Input component**

Create file `apps/web/components/ui/input.tsx`:

```typescript
import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm",
          "ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/components/ui/input.tsx
git commit -m "feat(web): create Input component"
```

---

### Task 4.2: Create Label Component

**Files:**
- Create: `apps/web/components/ui/label.tsx`

- [ ] **Step 1: Create Label component**

Create file `apps/web/components/ui/label.tsx`:

```typescript
import * as React from "react"
import { cn } from "@/lib/utils"

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
          className
        )}
        {...props}
      />
    )
  }
)
Label.displayName = "Label"

export { Label }
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/components/ui/label.tsx
git commit -m "feat(web): create Label component"
```

---

### Task 4.3: Create Form Component

**Files:**
- Create: `apps/web/components/ui/form.tsx`

- [ ] **Step 1: Create Form component**

Create file `apps/web/components/ui/form.tsx`:

```typescript
import * as React from "react"
import { cn } from "@/lib/utils"

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {}

const Form = React.forwardRef<HTMLFormElement, FormProps>(
  ({ className, ...props }, ref) => {
    return (
      <form
        ref={ref}
        className={cn("space-y-4", className)}
        {...props}
      />
    )
  }
)
Form.displayName = "Form"

export { Form }
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/components/ui/form.tsx
git commit -m "feat(web): create Form component"
```

---

### Task 4.4: Create Card Components

**Files:**
- Create: `apps/web/components/ui/card.tsx`

- [ ] **Step 1: Create Card components**

Create file `apps/web/components/ui/card.tsx`:

```typescript
import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

export { Card, CardHeader, CardTitle, CardDescription, CardContent }
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/components/ui/card.tsx
git commit -m "feat(web): create Card components"
```

---

### Task 4.5: Create Toast Provider

**Files:**
- Modify: `apps/web/app/layout.tsx`

- [ ] **Step 1: Add Toaster to layout**

Update `apps/web/app/layout.tsx` to include Toaster:

```typescript
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/QueryProvider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "3D Tourism - Khám phá An Giang",
  description: "Nền tảng du lịch 3D khám phá di sản An Giang, Việt Nam",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          {children}
          <Toaster position="top-right" richColors />
        </QueryProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/app/layout.tsx
git commit -m "feat(web): add Toaster for notifications"
```

---

### Task 4.6: Create Login Page

**Files:**
- Create: `apps/web/app/login/page.tsx`

- [ ] **Step 1: Create login page with form**

Create file `apps/web/app/login/page.tsx`:

```typescript
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { loginSchema, LoginFormData } from '@/validations/auth.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form } from '@/components/ui/form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

export default function LoginPage() {
  const { login, isLoggingIn } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-indigo-900 p-4">
      <Card className="w-full max-w-md bg-gray-900/95 border-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl text-white">Đăng nhập</CardTitle>
          <CardDescription>
            Đăng nhập để khám phá di sản An Giang trong không gian 3D
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  className="bg-gray-800 border-gray-700 text-white"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="bg-gray-800 border-gray-700 text-white"
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Button>
            </div>
          </Form>

          <p className="mt-4 text-center text-sm text-gray-400">
            Chưa có tài khoản?{' '}
            <Link href="/register" className="text-blue-400 hover:underline">
              Đăng ký ngay
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/app/login/page.tsx
git commit -m "feat(web): create login page with form validation"
```

---

### Task 4.7: Create Register Page

**Files:**
- Create: `apps/web/app/register/page.tsx`

- [ ] **Step 1: Create register page with form**

Create file `apps/web/app/register/page.tsx`:

```typescript
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { registerSchema, RegisterFormData } from '@/validations/auth.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form } from '@/components/ui/form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

export default function RegisterPage() {
  const { register: registerUser, isRegistering } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    registerUser(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-indigo-900 p-4">
      <Card className="w-full max-w-md bg-gray-900/95 border-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl text-white">Đăng ký</CardTitle>
          <CardDescription>
            Tạo tài khoản để bắt đầu hành trình khám phá
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Họ và tên</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Nguyễn Văn A"
                  className="bg-gray-800 border-gray-700 text-white"
                  {...register('name')}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  className="bg-gray-800 border-gray-700 text-white"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="bg-gray-800 border-gray-700 text-white"
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isRegistering}
              >
                {isRegistering ? 'Đang đăng ký...' : 'Đăng ký'}
              </Button>
            </div>
          </Form>

          <p className="mt-4 text-center text-sm text-gray-400">
            Đã có tài khoản?{' '}
            <Link href="/login" className="text-blue-400 hover:underline">
              Đăng nhập
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/app/register/page.tsx
git commit -m "feat(web): create register page with form validation"
```

---

## Phase 5: Route Protection & Integration

### Task 5.1: Create Proxy for Route Protection

**Files:**
- Create: `apps/web/proxy.ts`

- [ ] **Step 1: Create proxy.ts for route protection**

Create file `apps/web/proxy.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = ['/explore', '/profile', '/dashboard'];
const publicRoutes = ['/', '/login', '/register', '/map'];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  const isPublicRoute = publicRoutes.includes(path);

  let token: string | null = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token');
  }

  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', req.nextUrl);
    loginUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(loginUrl);
  }

  if (token && (path === '/login' || path === '/register')) {
    return NextResponse.redirect(new URL('/map', req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/proxy.ts
git commit -m "feat(web): create proxy for route protection"
```

---

### Task 5.2: Update MapPage to Use API Data

**Files:**
- Modify: `apps/web/app/map/page.tsx`

- [ ] **Step 1: Replace mock data with API call**

Replace `apps/web/app/map/page.tsx`:

```typescript
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_DEFAULT_CENTER, MAPBOX_DEFAULT_ZOOM } from '@project/constants';
import { useDestinations } from '@/hooks/useDestinations';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { DestinationDTO } from '@project/types';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';
mapboxgl.accessToken = MAPBOX_TOKEN;

export default function MapPage() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const router = useRouter();
  const [selectedDest, setSelectedDest] = useState<DestinationDTO | null>(null);
  
  const { data: destinations, isLoading, error } = useDestinations();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!mapContainerRef.current || !destinations) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/navigation-day-v1',
      center: MAPBOX_DEFAULT_CENTER,
      zoom: MAPBOX_DEFAULT_ZOOM - 6,
    });

    mapRef.current = map;

    map.on('load', () => {
      destinations.forEach((dest) => {
        const el = document.createElement('div');
        el.className = 'w-8 h-8 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-transform';
        el.innerHTML = '📍';

        el.addEventListener('click', () => {
          setSelectedDest(dest);
          map.flyTo({
            center: [dest.longitude, dest.latitude],
            zoom: MAPBOX_DEFAULT_ZOOM - 2,
            essential: true,
          });
        });

        new mapboxgl.Marker(el)
          .setLngLat([dest.longitude, dest.latitude])
          .addTo(map);
      });
    });

    return () => map.remove();
  }, [destinations]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-white">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-red-500">Lỗi tải dữ liệu. Vui lòng thử lại sau.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden font-sans bg-gray-900 text-white">
      <div ref={mapContainerRef} className="w-full h-full" />

      {user && (
        <div className="absolute top-4 right-4 z-10 p-3 bg-gray-900/90 border border-gray-800 rounded-xl">
          <p className="text-sm">Xin chào, {user.name}</p>
          <Button
            variant="ghost"
            size="xs"
            onClick={logout}
            className="mt-2 w-full"
          >
            Đăng xuất
          </Button>
        </div>
      )}

      <div className="absolute top-4 left-4 z-10 p-4 bg-gray-900/90 border border-gray-800 rounded-xl max-w-sm shadow-2xl backdrop-blur-md">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          Bản đồ Du lịch An Giang 3D
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Khám phá vẻ đẹp An Giang trong không gian 3D tương tác. Chọn một điểm đến để bắt đầu hành trình.
        </p>
      </div>

      {selectedDest && (
        <div className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 z-10 p-5 bg-gray-900/95 border border-gray-800 rounded-2xl shadow-2xl backdrop-blur-md transition-all duration-300">
          <button
            onClick={() => setSelectedDest(null)}
            className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
          <img
            src={selectedDest.coverImage}
            alt={selectedDest.title}
            className="w-full h-40 object-cover rounded-xl mb-4"
          />
          <h2 className="text-lg font-bold text-white">{selectedDest.title}</h2>
          <p className="text-xs text-gray-400 mt-1 leading-relaxed">
            {selectedDest.description}
          </p>
          <div className="flex gap-2 mt-4">
            <Button
              onClick={() => router.push(`/explore?id=${selectedDest.id}`)}
              className="flex-1"
            >
              🚀 Khám phá 3D
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                if (mapRef.current) {
                  mapRef.current.flyTo({
                    center: [selectedDest.longitude, selectedDest.latitude],
                    zoom: MAPBOX_DEFAULT_ZOOM + 1,
                    essential: true,
                  });
                }
              }}
            >
              🔍 Phóng to
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/app/map/page.tsx
git commit -m "feat(web): integrate API data into MapPage"
```

---

### Task 5.3: Create Auth Hydration Component

**Files:**
- Create: `apps/web/components/AuthHydration.tsx`

- [ ] **Step 1: Create auth hydration component**

Create file `apps/web/components/AuthHydration.tsx`:

```typescript
'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';

export function AuthHydration() {
  const hydrate = useAuthStore((state) => state.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return null;
}
```

- [ ] **Step 2: Add to layout**

Update `apps/web/app/layout.tsx`:

```typescript
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/QueryProvider";
import { Toaster } from "sonner";
import { AuthHydration } from "@/components/AuthHydration";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "3D Tourism - Khám phá An Giang",
  description: "Nền tảng du lịch 3D khám phá di sản An Giang, Việt Nam",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <AuthHydration />
          {children}
          <Toaster position="top-right" richColors />
        </QueryProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/web/components/AuthHydration.tsx apps/web/app/layout.tsx
git commit -m "feat(web): add auth hydration on app load"
```

---

### Task 5.4: Update Memory Bank

**Files:**
- Modify: `MEMORY_BANK.md`

- [ ] **Step 1: Update memory bank with new progress**

Append to `MEMORY_BANK.md`:

```markdown
- **Phiên làm việc ngày 20/07/2026**:
  - Viết Spec và Implementation Plan cho việc kết nối Frontend-Backend API.
  - **Phase 1 - Backend SQLite**: Cấu hình SQLite in-memory với seed data 8 điểm đến du lịch An Giang (Núi Sam, Núi Cầm, Hòn Phụ Tử, Phú Quốc, Hà Tiên, Rạch Giá, Châu Đốc, U Minh Thượng). Toggle qua env flag `USE_SQLITE=true`.
  - **Phase 2 - Frontend API Client**: Tạo Axios instance với interceptors, React Query Provider, API services cho auth và destinations.
  - **Phase 3 - Auth Integration**: Tạo Zustand auth store với persistence, useAuth và useDestinations hooks, Zod validation schemas.
  - **Phase 4 - UI Components**: Tạo Input, Label, Form, Card components, trang Login và Register với form validation.
  - **Phase 5 - Route Protection**: Tạo proxy.ts cho route protection, cập nhật MapPage để dùng API data thay vì mock.
  - CORS enabled cho frontend (http://localhost:3000).
```

- [ ] **Step 2: Commit**

```bash
git add MEMORY_BANK.md
git commit -m "docs: update memory bank with API integration progress"
```

---

## Testing Checklist

After completing all tasks, verify:

### Backend Tests
- [ ] Backend starts without errors: `pnpm --filter api dev`
- [ ] GET /destinations returns 8 An Giang destinations
- [ ] POST /auth/register creates new user
- [ ] POST /auth/login authenticates user and returns token

### Frontend Tests
- [ ] Frontend starts: `pnpm --filter web dev`
- [ ] Map page loads destinations from API
- [ ] Register form validates input (empty, invalid email, short password)
- [ ] Register creates user and redirects to /map
- [ ] Login form validates input
- [ ] Login authenticates and redirects correctly
- [ ] Protected route /explore redirects to /login when not authenticated
- [ ] After login, /explore accessible
- [ ] Logout clears token and redirects to /login

### Integration Tests
- [ ] Token persists across page refresh
- [ ] API calls include Authorization header
- [ ] 401 response clears token and redirects
- [ ] Error messages display correctly (toast for API, inline for form)

---

## Notes

- SQLite data is lost on server restart - this is expected for development
- Token stored in localStorage is acceptable for testing; consider httpOnly cookies for production
- Route protection uses localStorage check; for SSR, consider server-side session validation
- All 8 destinations are in An Giang province as requested
