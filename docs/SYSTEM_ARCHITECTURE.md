# System Architecture (C4 Model)

## 3D Tourism Explorer Platform

**Phiên bản:** 1.0
**Kiến trúc:** C4 Model
**Mục tiêu:** Xây dựng nền tảng quảng bá du lịch thông qua trải nghiệm khám phá không gian 3D trên trình duyệt.

---

# 1. Mục tiêu hệ thống

Hệ thống cho phép người dùng:

* Khám phá các địa điểm du lịch trên bản đồ.
* Điều khiển nhân vật trong môi trường 3D.
* Tương tác với các công trình, hiện vật và NPC.
* Đọc hoặc nghe thông tin lịch sử, văn hóa.
* Trao đổi với AI Guide.
* Quản trị toàn bộ dữ liệu thông qua CMS.

---

# Level 1 — System Context

## Các tác nhân

### Visitor

Người truy cập chưa đăng nhập.

Có thể:

* Xem trang chủ
* Xem bản đồ
* Khám phá địa điểm
* Xem thông tin du lịch

---

### Registered User

Có thêm quyền:

* Đăng nhập
* Lưu địa điểm yêu thích
* Theo dõi tiến trình khám phá
* Đặt câu hỏi cho AI
* Tham gia nhiệm vụ

---

### Administrator

Quản lý:

* Địa điểm
* Nội dung văn hóa
* Hình ảnh
* Video
* Audio
* Model 3D
* NPC
* Quest
* Người dùng

---

### Gemini API

Cung cấp:

* AI Tour Guide
* Hỏi đáp
* Gợi ý hành trình
* Sinh nội dung hỗ trợ

---

### Supabase Storage

Lưu:

* Images
* Videos
* Audio
* GLB Models

---

## Context Diagram

```text
                    Visitor
                       │
                       │
                       ▼
             3D Tourism Platform
                       ▲
                       │
            Registered User
                       │
                       ▼
                 Administrator

External Systems

Gemini API
Supabase Storage
Mapbox API
OAuth Providers
```

---

# Level 2 — Container Diagram

## Frontend

### Next.js Web Application

Chức năng:

* Landing Page
* Authentication
* Map
* Explore
* 3D Scene
* AI Guide
* CMS

Công nghệ:

* Next.js
* Tailwind
* Zustand
* TanStack Query

---

## Three.js Engine

Chức năng

* Render Scene
* Character
* Animation
* Physics
* Interaction
* Camera

Công nghệ

* Three.js
* React Three Fiber
* Drei
* Rapier

---

## NestJS API

Các module

* Auth
* User
* Destination
* Landmark
* Story
* Media
* NPC
* Quest
* AI
* Analytics

---

## PostgreSQL

Lưu

* Users
* Destinations
* Stories
* NPC
* Quest
* Interaction

---

## PostGIS

Quản lý dữ liệu không gian

* Latitude
* Longitude
* Nearby Search
* Route

---

## Redis

Cache

* Destination
* Session
* Ranking
* Statistics

---

## Supabase Storage

Lưu

* Image
* Video
* Audio
* Model

---

## Container Diagram

```text
+------------------------------------------------------+
|                  Next.js Application                  |
|------------------------------------------------------|
| Landing | Map | Explore | 3D | AI | CMS | Auth       |
+-----------------------------+------------------------+
                              |
                              |
                              ▼
                     NestJS REST API
                              |
      +-----------+-----------+-----------+
      |           |           |           |
      ▼           ▼           ▼           ▼
 PostgreSQL     Redis     Supabase    Gemini API
      │                     Storage
      ▼
   PostGIS
```

---

# Level 3 — Component Diagram

## Frontend

### Landing Module

* Hero
* Featured Destinations
* Categories
* Search

---

### Map Module

* Mapbox
* Marker
* Route
* Search
* Filter

---

### Explore Module

* Scene Loader
* Character Loader
* Camera
* Lighting

---

### Character Module

* Movement
* Animation
* Collision
* Interaction

---

### NPC Module

* Conversation
* Trigger
* Quest
* Audio

---

### Story Module

* Popup
* Timeline
* Gallery
* Audio Guide

---

### AI Guide Module

* Chat
* Voice
* Suggested Questions

---

### CMS Module

* Dashboard
* CRUD Destination
* CRUD Landmark
* CRUD NPC
* Upload Model
* Upload Media

---

## Backend

### Auth Module

* JWT
* OAuth
* Refresh Token

---

### User Module

* Profile
* Favorite
* Progress

---

### Destination Module

* CRUD
* Category
* Search
* Nearby

---

### Landmark Module

* Historical Information
* Story
* Gallery

---

### Media Module

* Upload
* Image
* Audio
* Video
* GLB

---

### NPC Module

* NPC
* Dialogue
* Position

---

### Quest Module

* Mission
* Reward
* Progress

---

### AI Module

* Gemini
* Prompt Builder
* Chat History

---

### Analytics Module

* Views
* Popular Destination
* Active Users

---

# Level 4 — Code Organization

## Frontend

```text
apps/web
│
├── app
│
├── components
│   ├── ui
│   ├── layout
│   ├── map
│   ├── destination
│   ├── character
│   ├── npc
│   ├── quest
│   ├── ai
│   └── cms
│
├── three
│   ├── scene
│   ├── camera
│   ├── lighting
│   ├── controls
│   ├── physics
│   ├── character
│   ├── npc
│   ├── environment
│   └── interaction
│
├── services
├── hooks
├── store
├── types
└── utils
```

---

## Backend

```text
apps/api
│
├── auth
├── users
├── destinations
├── landmarks
├── media
├── npc
├── quests
├── ai
├── analytics
├── common
└── prisma
```

---

# Luồng xử lý chính

## Khám phá địa điểm

```text
Visitor

↓

Landing Page

↓

Map

↓

Chọn địa điểm

↓

Load Scene 3D

↓

Điều khiển nhân vật

↓

Tương tác Landmark

↓

Hiển thị thông tin

↓

Lưu tiến trình
```

---

## AI Tour Guide

```text
User

↓

Chat

↓

NestJS API

↓

Gemini API

↓

Response

↓

Hiển thị trong Chat Panel
```

---

## Upload nội dung

```text
Administrator

↓

CMS

↓

NestJS

↓

Supabase Storage

↓

PostgreSQL

↓

Hoàn tất
```

---

# Nguyên tắc kiến trúc

* Frontend và Backend tách biệt hoàn toàn.
* Mọi dữ liệu được truy cập thông qua REST API.
* Mô hình 3D tải theo nhu cầu (lazy loading) để giảm thời gian tải.
* Nội dung (ảnh, video, âm thanh, mô hình 3D) được lưu ngoài hệ thống ứng dụng.
* Các module được thiết kế độc lập, dễ mở rộng và bảo trì.
* Hệ thống ưu tiên hiệu năng phía trình duyệt để đảm bảo trải nghiệm WebGL mượt mà.
