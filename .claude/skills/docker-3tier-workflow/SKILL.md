---
name: docker-3tier-workflow
description: มาตรฐานการสร้าง จัดการ และแก้ปัญหาโปรเจกต์เว็บ Full-Stack (Frontend, Backend, Database) พร้อม NGINX Gateway, Log Rotation, Auto-Restart และระบบสำรองข้อมูลระดับ Production สมบูรณ์แบบ 100%
---

# 🐳 Docker Full-Stack & Production Architecture Skill (ฉบับองค์กรสมบูรณ์ 100%)

คู่มือมาตรฐานระดับสากลสำหรับ AI ในการร่วมงานกับผู้ใช้เพื่อสร้าง ออกแบบ ดูแล และ Deploy ระบบ Full-Stack ด้วย Docker ตั้งแต่ระดับพัฒนา (Development) จนถึงระดับใช้งานจริงในองค์กร (Production)

---

## 🎯 1. สถาปัตยกรรมหลัก: ร้านอาหารโมเดล + ด่านหน้า NGINX

ในการสร้างระบบระดับมืออาชีพ ให้ยึดโครงสร้าง **4 บทบาทหลัก** เสมอ (ห้ามยัดรวมในตู้เดียวเด็ดขาด):

| ตู้ / Service | บทบาทในร้านอาหาร | หน้าที่ในระบบจริง | พอร์ตภายนอก (Dev) | พอร์ตภายนอก (Production) |
| :--- | :--- | :--- | :--- | :--- |
| **🛡️ 0. NGINX Gateway** | **รปภ. & พนักงานต้อนรับหน้าประตู** | รับแขกหน้าสุด ตรวจความปลอดภัย (HTTPS/SSL), บีบอัดข้อมูล, และกระจายคนเข้าถูกห้อง | *(ไม่จำเป็นต้องเปิดใน Dev)* | `80` (HTTP) และ `443` (HTTPS) |
| **🎨 1. Frontend** | **หน้าร้าน & เล่มเมนูอาหาร** | หน้าจอเว็บ UI ปุ่มกด ฟอร์มกรอกข้อมูล (Next.js, React, Vue, Vite, HTML/CSS) | `3000` | ปิดพอร์ตภายนอก (ให้ NGINX คุยข้างใน) |
| **🧠 2. Backend API** | **ห้องครัว & พ่อครัวปรุงอาหาร** | ตรรกะ คิดคำนวณ ตรวจสิทธิ์ และสั่งบันทึกข้อมูล (Python FastAPI, Node.js, Go) | `3001` | ปิดพอร์ตภายนอก (ให้ NGINX คุยข้างใน) |
| **🗄️ 3. Database** | **ตู้เย็นแช่ของ & โกดังวัตถุดิบ** | จัดเก็บข้อมูลถาวรลงฮาร์ดดิสก์ ปิดเครื่องข้อมูลไม่หาย (MySQL 8.4, PostgreSQL) | `3307` | ปิดพอร์ตภายนอก หรือเปิดเฉพาะให้ Admin |
| **💾 4. DB Backup (เสริม)** | **ตู้เซฟสำรองฉุกเฉิน** | แอบดัมป์ข้อมูลฐานข้อมูลเก็บไว้ทุกเที่ยงคืน ย้อนหลัง 7 วัน ป้องกันข้อมูลสูญหาย | — | รันทำงานเบื้องหลังอัตโนมัติ |

---

## 🔄 2. กลไกการไหลของข้อมูลระดับ Production (Reverse Proxy Data Flow)

```text
 👤 ผู้ใช้งานภายนอก (เปิดเว็บ https://my-system.com)
      │
      ▼
 🛡️ [ NGINX Gateway : พอร์ต 80 / 443 ] ── กรองความปลอดภัย + ทำ HTTPS กุญแจเขียว
      ├── (ถ้าขอหน้าเว็บปกติ /) ────────▶ 🎨 Frontend Container (พอร์ต 3000 ภายใน)
      └── (ถ้าเรียกข้อมูล /api/) ────────▶ 🧠 Backend Container (พอร์ต 3000 ภายใน)
                                                │
                                                ▼ (สั่งงานผ่าน Network ภายใน)
                                          🗄️ Database Container (MySQL 3306 ภายใน)
                                                ▲
                                                │ (แอบสำรองข้อมูลทุกคืน หมุนเวียนลบของเก่าเกิน 7 วัน)
                                          💾 Backup Service (เก็บย้อนหลัง 7 วัน)
```

---

## 📁 3. โครงสร้างโฟลเดอร์มาตรฐานระดับ Production

```text
my-project/
├── compose.yaml              # โครงสร้างเปิดรันทุกตู้พร้อมกัน
├── .env.example              # ตัวอย่างตัวแปรคอนฟิก (ห้ามใส่รหัสจริง)
├── .env                      # รหัสจริงของเครื่องนั้น (ห้ามดันขึ้น Git เด็ดขาด)
├── .dockerignore             # ป้องกันไฟล์ขยะหลุดเข้าตู้
├── nginx/                    # คอนฟิกด่านหน้า NGINX
│   └── nginx.conf            # กฎการแจกจ่ายงานและ HTTPS
├── frontend/                 # ตู้หน้าบ้าน
│   ├── Dockerfile
│   └── (source code)
├── backend/                  # ตู้หลังบ้าน
│   ├── Dockerfile
│   └── (source code)
└── backups/                  # โฟลเดอร์เก็บไฟล์สำรองฐานข้อมูลอัตโนมัติ (ลบของเก่าเกิน 7 วันอัตโนมัติ)
```

---

## 📋 4. แม่แบบไฟล์มาตรฐานระดับ Production (The Golden Templates)

### 📄 4.1 แม่แบบ `compose.yaml` ระดับ Production (พร้อม NGINX, Log Rotation และ Auto-Restart)

```yaml
services:
  # 🛡️ 0. NGINX Gateway ด่านหน้ารับแขก
  nginx:
    image: nginx:alpine
    container_name: app_gateway
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - frontend
      - backend
    logging: &default-logging
      driver: "json-file"
      options:
        max-size: "10m"       # 🧹 กันดิสก์เต็ม: ไฟล์ Log ห้ามเกิน 10MB
        max-file: "3"         # หมุนเวียนเก็บแค่ 3 ไฟล์เก่า

  # 🎨 1. Frontend
  frontend:
    build: ./frontend
    container_name: app_frontend
    restart: unless-stopped
    expose:
      - "3000"                # เปิดให้เฉพาะ NGINX คุยข้างใน ไม่เปิดออกนอกเครื่อง
    logging: *default-logging

  # 🧠 2. Backend API
  backend:
    build: ./backend
    container_name: app_backend
    restart: unless-stopped
    expose:
      - "3000"
    environment:
      DB_HOST: db
      DB_PORT: 3306
      DB_NAME: ${DB_NAME:-mydb}
      DB_USER: ${DB_USER:-root}
      DB_PASSWORD: ${DB_PASSWORD:-secret123}
    depends_on:
      db:
        condition: service_healthy   # ⏱️ รอจนกว่า MySQL จะวอร์มเครื่องเสร็จ 100%
    logging: *default-logging

  # 🗄️ 3. Database (MySQL 8.4)
  db:
    image: mysql:8.4
    container_name: app_db
    restart: unless-stopped
    command: --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD:-secret123}
      MYSQL_DATABASE: ${DB_NAME:-mydb}
    ports:
      - "127.0.0.1:3307:3306" # ล็อกให้ต่อได้เฉพาะจากในเครื่องเซิร์ฟเวอร์เท่านั้น
    volumes:
      - db_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-u", "root", "-p${DB_PASSWORD:-secret123}"]
      interval: 5s
      timeout: 5s
      retries: 10
    logging: *default-logging

volumes:
  db_data:
```

---

### 📄 4.2 แม่แบบคอนฟิก `nginx/nginx.conf`

```nginx
events { worker_connections 1024; }

http {
    include mime.types;
    sendfile on;

    # อัปโหลดไฟล์ได้สูงสุด 50MB
    client_max_body_size 50M;

    upstream frontend_service {
        server frontend:3000;
    }

    upstream backend_service {
        server backend:3000;
    }

    server {
        listen 80;
        server_name localhost;

        # ส่งคำสั่ง /api/ ไปหาตู้หลังบ้าน Backend
        location /api/ {
            proxy_pass http://backend_service/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # คำสั่งอื่นๆ ส่งไปหาตู้หน้าบ้าน Frontend
        location / {
            proxy_pass http://frontend_service;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

---

### 📄 4.3 แม่แบบคำสั่งสำรองข้อมูลอัตโนมัติ (Rolling 7-Day Backup)

```bash
# 1. ดัมป์ฐานข้อมูลแล้วบีบอัดเป็น .gz (ประหยัดพื้นที่ดิสก์)
docker exec app_db mysqldump -u root -psecret123 mydb | gzip > ./backups/db_$(date +%F_%H%M%S).sql.gz

# 2. 🧹 ลบไฟล์สำรองที่เก่ากว่า 7 วันอัตโนมัติ (ดิสก์ไม่มีวันเต็ม)
find ./backups -type f -name "*.sql.gz" -mtime +7 -delete
```

---

## 🛡️ 5. กฎเหล็ก 4 ข้อระดับ Production (Enterprise Golden Rules)

1. **🔒 ห้ามเปิดพอร์ต DB และ Backend ออกสู่อินเทอร์เน็ตตรงๆ:** ต้องผ่าน NGINX Gateway เสมอ
2. **🧹 ต้องมี Log Rotation เสมอ (`max-size: 10m`):** ป้องกันไม่ให้ไฟล์ล็อกแอบสูบพื้นที่ 264 GB บนเซิร์ฟเวอร์จนเต็ม
3. **🔄 ใส่ `restart: unless-stopped` ทุกตู้:** เมื่อเครื่องเซิร์ฟเวอร์รีสตาร์ท ทุกตู้ต้องฟื้นขึ้นมาทำงานต่อทันที
4. **🇹🇭 ฐานข้อมูลต้องใช้ `utf8mb4` เสมอ:** ข้อมูลภาษาไทยต้องไม่แสดงผลเป็น `???`

---

## 🔍 6. คู่มือแก้ปัญหาด่วนระดับ Production (Enterprise Troubleshooting)

* **502 Bad Gateway จาก NGINX:** ตู้ข้างใน (Frontend หรือ Backend) กำลังดับ หรือยังสตาร์ทไม่เสร็จ ให้สั่ง `docker logs app_backend` ดูสาเหตุ
* **ฮาร์ดดิสก์เซิร์ฟเวอร์เต็ม (`No space left on device`):** สั่งรันคำสั่งล้างภาพและ Cache ขยะ:
  ```bash
  docker system prune -a --volumes=false
  ```
  *(คำสั่งนี้ปลอดภัย ไม่ลบข้อมูลใน Volume ฐานข้อมูลครับ)*
* **DBeaver ต่อ MySQL 8+ ในเซิร์ฟเวอร์ไม่ได้:** ตั้งค่า Driver Properties: `allowPublicKeyRetrieval=true`

---

## 💬 7. คลังคำสั่งสำเร็จรูปสำหรับผู้ใช้ (Production Magic Prompts)

ผู้ใช้สามารถก๊อปปี้ข้อความเหล่านี้ไปสั่ง AI ได้ทันที:

### 🌟 หมวดที่ 1: ยกระดับระบบสู่ Production (Enterprise Upgrade)
* **1.1 เพิ่ม NGINX Gateway ด่านหน้า:**
  > "ช่วยเพิ่มตู้ NGINX Gateway รับพอร์ต 80/443 และสร้างไฟล์ nginx/nginx.conf เพื่อเชื่อมต่อ Frontend และ Backend ตามมาตรฐานสกิล docker-3tier-workflow ให้หน่อย"
* **1.2 ตั้งค่าระบบป้องกันดิสก์เต็มและ Auto-Restart:**
  > "ช่วยปรับ compose.yaml ในโปรเจกต์นี้ให้มี Log Rotation (10MB/3files) และตั้งค่า restart: unless-stopped ให้ครบทุกตู้ตามมาตรฐาน Production ให้หน่อย"

### 💾 หมวดที่ 2: การสำรองข้อมูลและกู้คืน (Backup & Restore)
* **2.1 สั่ง Backup ฐานข้อมูลด่วนทันที:**
  > "ช่วยเขียนคำสั่ง docker exec สำหรับดัมป์ข้อมูล MySQL ทั้งหมดออกมาเป็นไฟล์ .sql.gz เก็บไว้ในโฟลเดอร์ backups/ พร้อมคำสั่งลบของเก่าเกิน 7 วันให้หน่อย"
* **2.2 กู้คืนข้อมูลจากไฟล์ Backup:**
  > "ฉันมีไฟล์สำรอง database_backup.sql.gz ช่วยเขียนคำสั่งและวิธีนำข้อมูลนี้กลับเข้าไปใส่ในตู้ MySQL ให้หน่อย"

### 🚀 หมวดที่ 3: เตรียมขึ้นเซิร์ฟเวอร์จริง (Deploy to Server)
* **3.1 เตรียมไฟล์พร้อมรันบน Ubuntu Server:**
  > "โปรเจกต์นี้กำลังจะนำไป Deploy บน Ubuntu Server ช่วยตรวจเช็ค compose.yaml, .dockerignore และ .env.example ให้พร้อมรันด้วย docker compose up -d --build ในคำสั่งเดียวให้หน่อย"
