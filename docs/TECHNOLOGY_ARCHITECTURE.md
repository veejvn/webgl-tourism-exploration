# Kiến trúc công nghệ - Nền tảng Du lịch 3D

## Tổng quan

Mục tiêu: Xây dựng nền tảng quảng bá du lịch 3D sử dụng WebGL, cho phép
người dùng khám phá các địa điểm bằng nhân vật trong không gian 3D.

------------------------------------------------------------------------

## Frontend

  Thành phần         Công nghệ
  ------------------ -------------------------
  Framework          Next.js 15 (App Router)
  Ngôn ngữ           TypeScript
  UI                 Tailwind CSS
  Component          shadcn/ui
  Animation          Framer Motion
  State Management   Zustand
  Form               React Hook Form + Zod
  Data Fetching      TanStack Query
  HTTP Client        Axios

------------------------------------------------------------------------

## 3D & WebGL

  Thành phần            Công nghệ
  --------------------- ---------------------
  Rendering             Three.js
  React Renderer        React Three Fiber
  Helpers               @react-three/drei
  Physics               @react-three/rapier
  Model                 GLTF / GLB
  Character Animation   Mixamo
  Modeling              Blender
  Audio                 Howler.js

------------------------------------------------------------------------

## Bản đồ

  Thành phần        Công nghệ
  ----------------- ----------------------
  Interactive Map   Mapbox GL JS
  Geocoding         Mapbox Geocoding API

------------------------------------------------------------------------

## Backend

  Thành phần       Công nghệ
  ---------------- -----------------
  Framework        NestJS
  Runtime          Node.js
  HTTP Adapter     Fastify
  ORM              Prisma ORM
  Validation       class-validator
  Authentication   JWT + Passport

------------------------------------------------------------------------

## Database

  Thành phần   Công nghệ
  ------------ ------------
  Database     PostgreSQL
  GIS          PostGIS
  Cache        Redis

------------------------------------------------------------------------

## Authentication

-   JWT
-   Google OAuth 2.0
-   Facebook Login
-   GitHub OAuth
-   bcrypt

------------------------------------------------------------------------

## Storage

**Supabase Storage**

Lưu trữ: - Hình ảnh - Video - Audio - Model 3D (.glb) - Tài liệu

------------------------------------------------------------------------

## AI

**Gemini API**

Chức năng: - Hướng dẫn viên AI - Chatbot du lịch - Thuyết minh địa
điểm - Gợi ý hành trình - Hỏi đáp văn hóa

------------------------------------------------------------------------

## CMS

Tự xây bằng Next.js.

Modules: - Dashboard - Quản lý địa điểm - Quản lý bản đồ - Quản lý bài
viết - Quản lý ảnh/video - Quản lý model 3D - Quản lý NPC - Quản lý
nhiệm vụ - Quản lý người dùng - Thống kê

------------------------------------------------------------------------

## DevOps

  Thành phần        Công nghệ
  ----------------- -----------
  Version Control   Git
  Repository        GitHub
  Package Manager   pnpm
  API Testing       Postman
  Container         Docker
  Reverse Proxy     Nginx

------------------------------------------------------------------------

## Deployment

  Thành phần   Công nghệ
  ------------ ------------------
  Frontend     Vercel
  Backend      Docker + VPS
  Database     PostgreSQL (VPS)
  Storage      Supabase Storage

------------------------------------------------------------------------

## Kiến trúc tổng thể

``` text
                    User
                      │
              ┌───────▼────────┐
              │    Next.js      │
              │      Web        │
              └───────┬────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
        ▼             ▼             ▼
   Three.js      Mapbox GL      Admin CMS
        │
        ▼
 Character + NPC + Interaction
        │
        ▼
      NestJS API
        │
 ┌──────┼───────────────┐
 │      │               │
 ▼      ▼               ▼
PostgreSQL          Redis      Supabase Storage
    │
    ▼
 PostGIS
```

------------------------------------------------------------------------

## Kiến trúc module

``` text
Frontend (Next.js)
│
├── Landing
├── Explore
├── 3D Scene
├── Map
├── Destination
├── AI Guide
├── Profile
└── CMS Admin

                │

NestJS API

├── Auth
├── User
├── Destination
├── Landmark
├── Story
├── Media
├── NPC
├── Quest
├── AI
├── Analytics
└── Map

                │

PostgreSQL + PostGIS
```
