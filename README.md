# Video Management & Content Moderation Platform

A full-stack multi-tenant video management platform with secure authentication, role-based access control, real-time processing updates, video streaming, and sensitivity classification.

---

# Features

- Full-stack MERN architecture
- Video upload & secure storage
- HTTP range video streaming
- Real-time processing updates using Socket.io
- Multi-tenant architecture
- Role-based access control (RBAC)
- Admin dashboard
- Video sensitivity classification
- FFmpeg frame extraction pipeline

---

# Tech Stack

## Frontend
- React
- Vite
- Tailwind CSS
- Axios
- Socket.io Client

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.io
- JWT Authentication
- Multer
- FFmpeg

---

# Project Structure

```bash
video-platform/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── uploads/
│   │   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── api/
│   │   └── App.jsx
│
└── README.md
```

---

# Installation & Setup Guide

# 1. Clone Repository

```bash
git clone https://github.com/bhumigargg/video-platform.git
```

```bash
cd video-platform
```

---

# 2. Backend Setup

## Navigate to Backend

```bash
cd backend
```

## Install Dependencies

```bash
npm install
```

---

# 3. Create Environment File

Create:

```bash
backend/.env
```

Add:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

# 4. Install FFmpeg

Download FFmpeg from:

https://ffmpeg.org/download.html

Add FFmpeg to system PATH.

Verify installation:

```bash
ffmpeg -version
```

---

# 5. Start Backend Server

```bash
npm run dev
```

Backend runs on:

```bash
http://localhost:5000
```

---

# 6. Frontend Setup

Open new terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start frontend:

```bash
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

# API Documentation

# Authentication APIs

## Register User

### Endpoint

```http
POST /api/auth/register
```

### Request Body

```json
{
  "name": "Bhumi",
  "email": "bhumi@gmail.com",
  "password": "123456",
  "role": "viewer",
  "tenantId": "companyA"
}
```

### Response

```json
{
  "success": true,
  "token": "jwt_token"
}
```

---

## Login User

### Endpoint

```http
POST /api/auth/login
```

### Request Body

```json
{
  "email": "bhumi@gmail.com",
  "password": "123456"
}
```

---

# Video APIs

## Upload Video

### Endpoint

```http
POST /api/videos/upload
```

### Form Data

| Field | Type |
|---|---|
| video | file |
| title | string |

### Authorization

```text
Bearer Token Required
```

---

## Get All Videos

### Endpoint

```http
GET /api/videos
```

---

## Stream Video

### Endpoint

```http
GET /api/videos/stream/:id
```

Supports HTTP range requests for efficient streaming.

---

## Delete Video

### Endpoint

```http
DELETE /api/videos/:id
```

---

# Admin APIs

## Get Users

```http
GET /api/admin/users
```

---

## Change User Role

```http
PUT /api/admin/users/:id/role
```

### Request Body

```json
{
  "role": "editor"
}
```

---

## Delete User

```http
DELETE /api/admin/users/:id
```

---

# User Manual

# User Roles

| Role | Permissions |
|---|---|
| Viewer | Read-only access to videos |
| Editor | Upload and manage videos |
| Admin | Full user and role management |

---

# Uploading Videos

1. Login as editor/admin
2. Open dashboard
3. Click Upload Video
4. Select video
5. Wait for processing completion

---

# Video Processing Workflow

Uploaded videos go through:
- video upload
- frame extraction using FFmpeg
- sensitivity classification
- processing progress updates
- database storage
- streaming availability

---

# Admin Panel

Admins can:
- view users
- change roles
- delete users
- manage tenant users

---

# Architecture Overview

```text
Frontend (React + Vite)
        ↓
Backend API (Node.js + Express)
        ↓
MongoDB Database
        ↓
Socket.io Real-Time Updates
        ↓
FFmpeg Video Processing
```

---

# Backend Architecture

| Layer | Responsibility |
|---|---|
| Routes | API endpoints |
| Controllers | Business logic |
| Middleware | Authentication & RBAC |
| Models | MongoDB schemas |
| Services | Video processing & moderation |

---

# Real-Time Processing

Socket.io is used for:
- upload progress
- live processing updates
- frontend synchronization

---

# Multi-Tenant Architecture

Each user belongs to a tenant.

Users can only access:
- videos
- users
- resources

within their own tenant.

---

# Assumptions & Design Decisions

# Assumptions

- Videos are uploaded in MP4 format
- JWT authentication is used
- MongoDB stores all metadata
- FFmpeg is installed locally

---

# Design Decisions

## 1. Role-Based Access Control (RBAC)

Separate access permissions for:
- viewer
- editor
- admin

---

## 2. Modular Backend Architecture

Backend divided into:
- controllers
- routes
- services
- middlewares

for maintainability and scalability.

---

## 3. Video Streaming

Implemented using HTTP range requests for:
- efficient loading
- large video support
- browser compatibility

---

## 4. Simulated AI Moderation

Current moderation pipeline:
- extracts frames using FFmpeg
- performs simulated sensitivity classification

Architecture can be extended using:
- TensorFlow
- NudeNet
- external moderation APIs

---

# Deployment Architecture

| Service | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Render |
| Database | MongoDB Atlas |

---

# Future Improvements

- Real AI moderation using NudeNet/TensorFlow
- Cloud video storage (AWS S3/Cloudinary)
- Video thumbnails
- Search & filters
- Video analytics
- Notifications system
- Advanced admin controls

---

# Author

Bhumi Garg  
IIT Patna
