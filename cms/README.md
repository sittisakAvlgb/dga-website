# DGA CMS — Strapi v5 (Headless CMS สำหรับเว็บไซต์ สพร.)

ระบบจัดการเนื้อหา (CMS) แบบ Headless ด้วย **Strapi v5** สำหรับเว็บไซต์สำนักงานพัฒนารัฐบาลดิจิทัล (สพร.)
หน้าบ้าน (static) ดึงเนื้อหาสดผ่าน REST API พร้อม **fallback** ในตัว — เดโมไม่พังแม้ยังไม่ได้สตาร์ท CMS

---

## คุณสมบัติ (ตอบ TOR ภาคผนวก ก — CMS)
- ✅ จัดการเนื้อหาแบบ WYSIWYG (Rich text) — **ข่าวสาร / ตำแหน่งงาน / บริการ / หน้าเพจ / แบนเนอร์**
- ✅ **2 ภาษา (ไทย/อังกฤษ)** ระดับเนื้อหา (i18n ในตัว)
- ✅ **Draft & Publish** (ร่าง → อนุมัติ → เผยแพร่) + ประวัติการแก้ไข
- ✅ **สิทธิ์ผู้ใช้หลายระดับ (RBAC)** — ผู้ดูแล / บรรณาธิการ / ผู้เขียน
- ✅ **Media Library** จัดการรูป/ไฟล์
- ✅ **REST + GraphQL API** + Component SEO (metaTitle/description/ogImage)
- ✅ **Admin แบรนด์ DGA** — โลโก้, favicon, สี CI (ส้ม/กรมท่า), ภาษาไทย, ฟอนต์ Kanit/Ubuntu
- ✅ Self-host ได้ (PostgreSQL) — ข้อมูลอยู่ในไทย/GDCC ตาม PDPA

---

## ความต้องการระบบ
- **Node.js 18 / 20 / 22 (LTS)** — Strapi v5 ยังไม่รองรับ Node 24
- npm ≥ 6
- ฐานข้อมูล: SQLite (dev, ใช้ได้ทันที) หรือ PostgreSQL (production)

> ⚠️ ถ้าเครื่องเป็น Node 24 ให้สลับเป็น Node 20/22 ก่อน (เช่น ใช้ `nvm use 20`)

---

## เริ่มใช้งาน (Quick start)
```bash
cd cms
cp .env.example .env          # แล้วเติมค่าสุ่มในไฟล์ .env (ดูคำสั่งในไฟล์)
npm install
npm run develop               # เปิด http://localhost:1337/admin
```
ครั้งแรกให้สร้างบัญชี Admin → ระบบจะ **seed ข้อมูลตัวอย่าง 2 ภาษา** + เปิดสิทธิ์ Public API ให้อัตโนมัติ

### ทดสอบ API
```
GET http://localhost:1337/api/articles?locale=th&populate=*
GET http://localhost:1337/api/jobs?locale=en&populate=*
GET http://localhost:1337/api/services?locale=th
```

---

## เชื่อมกับหน้าบ้าน (frontend)
หน้าบ้านอยู่คนละโฟลเดอร์ (static) — เปิดใช้ CMS โดยตั้ง URL ของ Strapi:
แก้ไฟล์ **`/assets/cms-config.js`** ของหน้าบ้าน:
```js
window.DGA_CMS_URL = 'http://localhost:1337';   // หรือโดเมน production
```
- ถ้า **ตั้งค่า** → หน้า ข่าวสาร/รับสมัครงาน ดึงสดจาก CMS (ตามภาษา th/en)
- ถ้า **เว้นว่าง / CMS ล่ม** → ใช้ข้อมูลสำรอง (`news-data.js`, `jobs-data.js`) อัตโนมัติ — เดโมไม่พัง

> อย่าลืมใส่โดเมนหน้าบ้านใน `CORS_ORIGINS` (ไฟล์ `.env`) ให้เรียก API ได้

---

## สิทธิ์ผู้ใช้ (ตั้งใน Admin → Settings → Roles)
| Role | สิทธิ์แนะนำ |
|---|---|
| **ผู้ดูแลระบบ (Super Admin)** | ทุกอย่าง |
| **บรรณาธิการ (Editor)** | สร้าง/แก้/**เผยแพร่** ทุก content-type |
| **ผู้เขียน (Author)** | สร้าง/แก้ **ฉบับร่าง** (ไม่เผยแพร่เอง) |
| **Public (API)** | อ่านอย่างเดียว (ตั้งให้อัตโนมัติแล้ว) |

---

## Deploy (production)
- ฐานข้อมูล PostgreSQL (ตั้ง `DATABASE_CLIENT=postgres` + `DATABASE_URL`)
- โฮสต์: GDCC / Render / Railway / VPS — `npm run build && npm run start`
- ไฟล์อัปโหลด: production แนะนำ upload provider (S3/GDCC object storage)
- ความปลอดภัย: ใช้ HTTPS, จำกัด `CORS_ORIGINS`, เก็บ secret ใน .env, สำรองฐานข้อมูลสม่ำเสมอ

---

## โครงสร้างโปรเจกต์
```
cms/
├── config/            server, admin, database, middlewares(CORS)
├── src/
│   ├── api/           article (ข่าว) · job (งาน) · service (บริการ) · page (หน้าเพจ) · banner (แบนเนอร์)
│   ├── components/    shared.seo
│   ├── admin/         app.js (แบรนด์ DGA), extensions/ (โลโก้+favicon)
│   └── index.js       bootstrap: locale ไทย + สิทธิ์ Public + seed
├── .env.example
└── package.json
```

> หากติดตั้งแล้วพบปัญหา ให้ลองวิธีสำรอง: `npx create-strapi-app@latest dga-cms --quickstart`
> (บน Node 20/22) แล้วคัดลอกโฟลเดอร์ `src/` และ `config/` นี้ทับ — ได้ผลลัพธ์เดียวกัน
