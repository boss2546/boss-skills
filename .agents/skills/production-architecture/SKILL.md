---
name: production-architecture
description: มาตรฐานการยกระดับโปรเจกต์เว็บ Full-Stack สู่ Production ระดับองค์กรสมบูรณ์ 100% พร้อม NGINX Gateway, Log Rotation, Auto-Restart, Firewall (UFW), Cloudflare และ Custom Domain สากล
---

# 🏭 Enterprise Production Architecture Skill (ฉบับองค์กรสมบูรณ์ 100%)

คู่มือมาตรฐานระดับสากลสำหรับ AI ในการร่วมงานกับผู้ใช้เพื่อออกแบบ ยกระดับความปลอดภัย และ Deploy ระบบ Full-Stack ด้วย Docker สู่ระดับใช้งานจริงในองค์กร (Production) อย่างมีเสถียรภาพสูงสุด

---

## 🔗 ความต่อเนื่องและเชื่อมโยงกับ `docker-workflow` (From Dev to Production)

สกิล **`production-architecture`** นี้คือ **"ขั้นที่ 2 (Phase 2)"** ที่รับไม้ต่อโดยตรงจาก **`docker-workflow` (Phase 1)**:
* **🌱 Phase 1 (Development ด้วย `docker-workflow`):** พัฒนาโค้ด 3 ตู้ (Frontend :3000, Backend :3001, Database :3307) ในเครื่อง Mac โดยมี Live Reload แก้โค้ดสด และ Adminer (:8085) ดูตารางผ่านเว็บ อำนวยความสะดวกให้เขียนโค้ดได้คล่องตัว
* **🏭 Phase 2 (Production ด้วย `production-architecture`):** เมื่อทดสอบในเครื่องเสร็จสมบูรณ์ 100% และพร้อมนำขึ้นเซิร์ฟเวอร์จริง (VPS / Cloud เช่น Ubuntu) หรือผูกกับชื่อโดเมน (เช่น `meuu.live`) ให้ใช้สกิลนี้เพื่อ **"สวมเกราะป้องกันระดับองค์กร"**:
  1. เพิ่ม **NGINX Gateway (Tier 0)** ทำหน้าที่เป็น Reverse Proxy รับแขกหน้าสุดที่พอร์ต 80 และ 443
  2. ปิดพอร์ต 3000 และ 3001 ภายในมิดชิด ผู้ใช้ภายนอกเข้าผ่าน NGINX เท่านั้น
  3. ถอด Live Reload Bind Mounts ออกเพื่อใช้ Container Image ถาวรที่มีความนิ่ง เสถียร และปลอดภัยสูงสุด
  4. เพิ่ม Log Rotation (10MB x 3), Auto-Restart, Dynamic RAM, UFW Firewall และ Cloudflare Proxied 🟠
  5. ตั้งระบบ Auto Backup ฐานข้อมูลหมุนเวียน 7 วัน ป้องกันข้อมูลสูญหาย 100%

---

## 🎯 1. สถาปัตยกรรมหลัก: สถาปัตยกรรม 4 ชั้น + NGINX Gateway ด่านหน้า

ในการนำระบบขึ้นสู่ Production ให้ยึดโครงสร้าง **4 บทบาทหลัก** เสมอ (ปิดพอร์ตภายในมิดชิด ห้ามเปิดให้คนภายนอกเข้าถึงตรงๆ):

| ตู้ / Service | บทบาทในร้านอาหาร | หน้าที่ในระบบจริง | พอร์ตภายนอก (Production) |
| :--- | :--- | :--- | :--- |
| **🛡️ 0. NGINX Gateway** | **รปภ. & พนักงานต้อนรับหน้าประตู** | รับแขกหน้าสุด ตรวจความปลอดภัย (HTTPS/SSL), บีบอัดข้อมูล, และกระจายคนเข้าถูกห้อง | `80` (HTTP) และ `443` (HTTPS) |
| **🎨 1. Frontend** | **หน้าร้าน & เล่มเมนูอาหาร** | หน้าจอเว็บ UI ปุ่มกด ฟอร์มกรอกข้อมูล (Next.js, React, Vue, Vite, HTML/CSS) | ปิดพอร์ตภายนอก (ให้ NGINX คุยข้างในผ่านพอร์ต 3000) |
| **🧠 2. Backend API** | **ห้องครัว & พ่อครัวปรุงอาหาร** | ตรรกะ คิดคำนวณ ตรวจสิทธิ์ และสั่งบันทึกข้อมูล (Python FastAPI, Node.js, Go) | ปิดพอร์ตภายนอก (ให้ NGINX คุยข้างในผ่านพอร์ต 3000) |
| **🗄️ 3. Database** | **ตู้เย็นแช่ของ & โกดังวัตถุดิบ** | จัดเก็บข้อมูลถาวรลงฮาร์ดดิสก์ ปิดเครื่องข้อมูลไม่หาย (MySQL 8.4, PostgreSQL) | `127.0.0.1:3307:3306` (เฉพาะภายในโฮสต์) |
| **💾 4. DB Backup (เสริม)** | **ตู้เซฟสำรองฉุกเฉิน** | แอบดัมป์ข้อมูลฐานข้อมูลเก็บไว้ทุกเที่ยงคืน ย้อนหลัง 7 วัน ป้องกันข้อมูลสูญหาย | รันทำงานเบื้องหลังอัตโนมัติ |

---

## 🔄 2. กลไกการไหลของข้อมูลระดับ Production (Reverse Proxy Data Flow)

```text
 👤 ผู้ใช้งานทั่วโลก (เปิดเว็บ https://your-domain.com)
      │
      ▼
 ☁️ [ Cloudflare Edge & CDN ] ── กรองบอท/DDoS, ซ่อน IP จริง, ทำ HTTPS กุญแจเขียวอัตโนมัติ
      │
      ▼ (ส่งต่อเข้ามายังเครื่องเซิร์ฟเวอร์อย่างปลอดภัย)
 🧱 [ Host Firewall (UFW) : พอร์ต 80 / 443 ] ── รั้วกำแพงด่านแรกของเครื่อง Ubuntu
      │
      ▼
 🛡️ [ NGINX Gateway : พอร์ต 80 / 443 ] ── จัดการ Reverse Proxy ส่งเข้าตู้ภายใน
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
        condition: service_healthy
    logging: *default-logging

  # 🗄️ 3. Database
  db:
    image: mysql:8.4
    container_name: app_db
    restart: unless-stopped
    command: --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD:-secret123}
      MYSQL_DATABASE: ${DB_NAME:-mydb}
    ports:
      - "127.0.0.1:3307:3306" # ป้องกันแฮกเกอร์: เข้าถึงได้เฉพาะคนในเครื่องเซิร์ฟเวอร์เท่านั้น
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
            proxy_set_header CF-Connecting-IP $http_cf_connecting_ip; # IP ลูกค้าจริงจาก Cloudflare
        }

        # คำสั่งอื่นๆ ส่งไปหาตู้หน้าบ้าน Frontend
        location / {
            proxy_pass http://frontend_service;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_set_header CF-Connecting-IP $http_cf_connecting_ip; # IP ลูกค้าจริงจาก Cloudflare
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

### 📄 4.4 การตั้งค่าไฟร์วอลล์เครื่องเซิร์ฟเวอร์ (Host Firewall / UFW Checklist)

```bash
# บน Ubuntu Server ให้เปิดเฉพาะพอร์ตที่จำเป็นเท่านั้น:
sudo ufw default deny incoming       # ปิดทุกพอร์ตขาเข้า ป้องกันการสแกนหาช่องโหว่
sudo ufw default allow outgoing      # ยอมให้เครื่องเซิร์ฟเวอร์ต่อเน็ตออกไปดาวน์โหลดของได้
sudo ufw allow 22/tcp                # 🔑 เปิดให้ Admin รีโมทเข้าเครื่องผ่าน SSH
sudo ufw allow 80/tcp                # 🌐 เปิดให้คนเข้าเว็บทั่วไป (HTTP) ผ่าน NGINX
sudo ufw allow 443/tcp               # 🔒 เปิดให้คนเข้าเว็บปลอดภัย (HTTPS) ผ่าน NGINX
sudo ufw enable                      # สั่งเปิดใช้งานรั้วกำแพงทันที (พิมพ์ y แล้ว Enter)
```

---

### 📄 4.5 การเชื่อมต่อ Cloudflare & ชื่อโดเมนมาตรฐานสากล (Universal Cloudflare Standard)

เมื่อต้องการเปิดให้คนทั้งโลกเข้าใช้งานผ่านชื่อโดเมนของตนเอง:

#### 🌐 ทางเลือกที่ 1: ชี้ DNS ตรงผ่าน Cloudflare (สำหรับเซิร์ฟเวอร์ที่มี Public IP)
1. จดชื่อโดเมน (Domain Name) จากผู้ให้บริการใดๆ ในโลก
2. นำโดเมนไปผูกกับ Cloudflare (ใช้งานฟรี) โดยเปลี่ยน Nameservers ตามที่ Cloudflare แนะนำ
3. สร้าง **DNS Records (A Record)**:
   * **Type:** `A` | **Name:** `@` (หรือ `www`) | **IPv4 address:** `[IP เซิร์ฟเวอร์จริงของคุณ]`
   * **Proxy status:** **เปิดเป็น "Proxied (ก้อนเมฆสีส้ม 🟠)" เสมอ** เพื่อซ่อน IP เซิร์ฟเวอร์จริง ป้องกัน DDoS และรับ HTTPS กุญแจเขียวฟรี
4. **การตั้งค่า SSL/TLS ป้องกันบั๊ก (Universal SSL Standard):**
   * ในเมนู **SSL/TLS ➔ Overview**: ให้เลือกโหมด **"Full"** (หรือ "Full (strict)") เสมอ **ห้ามใช้ Flexible** เพื่อป้องกันข้อผิดพลาดหน้าเว็บหมุนวนไม่รู้จบ (`ERR_TOO_MANY_REDIRECTS`)
   * ในเมนู **SSL/TLS ➔ Edge Certificates**: เปิดสวิตช์ **"Always Use HTTPS"** เป็น ON
5. ในไฟล์ `nginx/nginx.conf` ให้ตั้งค่า `server_name` ให้ตรงกับโดเมน และส่งต่อ Header `CF-Connecting-IP` เพื่อให้ Backend รู้ IP ลูกค้าจริง

#### 🚇 ทางเลือกที่ 2: ใช้ Cloudflare Tunnel (สำหรับเซิร์ฟเวอร์ที่ไม่มี Public IP / อยู่หลังเราเตอร์)
ไม่ต้องขอ Public IP ไม่ต้องเปิดพอร์ตเราเตอร์ เพียงเพิ่มตู้ `cloudflared` เข้าไปใน `compose.yaml`:

```yaml
  # 🚇 Cloudflare Tunnel เจาะท่อปลอดภัยออกสู่อินเทอร์เน็ต
  tunnel:
    image: cloudflare/cloudflared:latest
    container_name: app_tunnel
    restart: unless-stopped
    command: tunnel run
    environment:
      - TUNNEL_TOKEN=${CLOUDFLARE_TUNNEL_TOKEN}
    depends_on:
      - nginx
    logging: *default-logging
```
> 💡 **ข้อดีของ Tunnel:** ปลอดภัยที่สุดในโลก ไม่ต้องเปิดพอร์ต 80/443 รับคนแปลกหน้าเข้าเครื่องเลย เพราะตู้จะเจาะท่อออกจากในเซิร์ฟเวอร์ไปหา Cloudflare เอง

---

## 🛡️ 5. กฎเหล็ก 6 ข้อระดับ Production (Enterprise Golden Rules)

1. **🔒 ห้ามเปิดพอร์ต DB และ Backend ออกสู่อินเทอร์เน็ตตรงๆ:** ต้องผ่าน NGINX Gateway เสมอ
2. **🧹 ต้องมี Log Rotation เสมอ (`max-size: 10m`):** ป้องกันไม่ให้ไฟล์ล็อกแอบสูบพื้นที่ 264 GB บนเซิร์ฟเวอร์จนเต็ม
3. **🔄 ใส่ `restart: unless-stopped` ทุกตู้:** เมื่อเครื่องเซิร์ฟเวอร์รีสตาร์ท ทุกตู้ต้องฟื้นขึ้นมาทำงานต่อทันที
4. **🇹🇭 ฐานข้อมูลต้องใช้ `utf8mb4` เสมอ:** ข้อมูลภาษาไทยต้องไม่แสดงผลเป็น `???`
5. **🧱 เปิด Firewall เฉพาะพอร์ตจำเป็น:** บนเครื่องเซิร์ฟเวอร์ (Ubuntu UFW) เปิดเฉพาะพอร์ต 22 (SSH), 80 (HTTP), 443 (HTTPS) เท่านั้น เพื่อป้องกันไม่ให้ผู้ไม่ประสงค์ดีแฮกผ่านพอร์ตอื่น
6. **☁️ ปกป้องเซิร์ฟเวอร์ด้วย Cloudflare เสมอ:** ไม่เปิดเผย IP จริงของเซิร์ฟเวอร์สู่อินเทอร์เน็ต เปิด Proxy (เมฆสีส้ม ☁️) หรือใช้ Cloudflare Tunnel เพื่อป้องกันการโดนยิงเว็บล่ม (DDoS) และรับกุญแจเขียว HTTPS ฟรี

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
* **1.1 ยกระดับจาก `docker-workflow` สู่ Production (Handover):**
  > "ฉันพัฒนาโปรเจกต์ 3 ตู้ด้วยสกิล docker-workflow ในเครื่องเสร็จสมบูรณ์แล้ว ตอนนี้พร้อมขึ้นเซิร์ฟเวอร์จริง ช่วยนำโครงสร้างและโค้ดเดิมมายกระดับขึ้น Production ตามสกิล production-architecture ให้หน่อย: ใส่ NGINX Gateway, ปิดพอร์ตตรง, ปลด Live Reload ออก, ตั้ง Log Rotation, ใส่ Auto-Restart, และแนะนำการตั้ง UFW Firewall กับ Cloudflare ให้ครบถ้วน"
* **1.2 เพิ่ม NGINX Gateway ด่านหน้า:**
  > "ช่วยเพิ่มตู้ NGINX Gateway รับพอร์ต 80/443 และสร้างไฟล์ nginx/nginx.conf เพื่อเชื่อมต่อ Frontend และ Backend ตามมาตรฐานสกิล production-architecture ให้หน่อย"
* **1.3 ตั้งค่าระบบป้องกันดิสก์เต็มและ Auto-Restart:**
  > "ช่วยปรับ compose.yaml ในโปรเจกต์นี้ให้มี Log Rotation (10MB/3files) และตั้งค่า restart: unless-stopped ให้ครบทุกตู้ตามมาตรฐาน Production ให้หน่อย"

### 💾 หมวดที่ 2: การสำรองข้อมูลและกู้คืน (Backup & Restore)
* **2.1 สั่ง Backup ฐานข้อมูลด่วนทันที:**
  > "ช่วยเขียนคำสั่ง docker exec สำหรับดัมป์ข้อมูล MySQL ทั้งหมดออกมาเป็นไฟล์ .sql.gz เก็บไว้ในโฟลเดอร์ backups/ พร้อมคำสั่งลบของเก่าเกิน 7 วันให้หน่อย"
* **2.2 กู้คืนข้อมูลจากไฟล์ Backup:**
  > "ฉันมีไฟล์สำรอง database_backup.sql.gz ช่วยเขียนคำสั่งและวิธีนำข้อมูลนี้กลับเข้าไปใส่ในตู้ MySQL ให้หน่อย"

### 🚀 หมวดที่ 3: เตรียมขึ้นเซิร์ฟเวอร์จริง (Deploy to Server)
* **3.1 เตรียมไฟล์พร้อมรันบน Ubuntu Server:**
  > "โปรเจกต์นี้กำลังจะนำไป Deploy บน Ubuntu Server ช่วยตรวจเช็ค compose.yaml, .dockerignore และ .env.example ให้พร้อมรันด้วย docker compose up -d --build ในคำสั่งเดียวให้หน่อย"
* **3.2 ตั้งค่า Firewall (UFW) บน Ubuntu:**
  > "ช่วยเขียนคำสั่งตั้งค่าไฟร์วอลล์ ufw บน Ubuntu ให้เปิดเฉพาะพอร์ต 22, 80, 443 ตามมาตรฐานความปลอดภัยของสกิล production-architecture ให้หน่อย"

### 🌐 หมวดที่ 4: เชื่อมต่อ Cloudflare และชื่อโดเมน (Domain & Cloudflare)
* **4.1 แนะนำการผูกโดเมนเข้ากับ Cloudflare:**
  > "ฉันเพิ่งซื้อชื่อโดเมนเนมมา ช่วยแนะนำขั้นตอนนำโดเมนไปผูกกับ Cloudflare และตั้งค่า DNS ชี้มาที่เซิร์ฟเวอร์ NGINX พร้อมเปิดก้อนเมฆสีส้มทีละสเต็ปหน่อย"
* **4.2 เพิ่ม Cloudflare Tunnel ใน compose.yaml:**
  > "เซิร์ฟเวอร์ของฉันไม่มี Public IP ช่วยเขียนคอนฟิกเพิ่มตู้ cloudflared เข้าไปใน compose.yaml ของโปรเจกต์นี้ เพื่อให้คนภายนอกเข้าเว็บผ่านชื่อโดเมนได้โดยไม่ต้องเปิดพอร์ตเราเตอร์ให้หน่อย"
