#!/usr/bin/env bash
# =====================================================================
# DGA CMS — ตั้งค่าอัตโนมัติเมื่อสร้าง Codespace
# 1) สร้าง cms/.env จากตัวอย่าง + เติม secret สุ่มให้ครบ
# 2) npm install (Strapi)
# =====================================================================
set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/cms"

echo "==> เตรียม DGA CMS (Strapi v5) บน Node $(node -v)"

if [ ! -f .env ]; then
  cp .env.example .env
  node -e '
    const fs = require("fs"), c = require("crypto");
    const rnd = () => c.randomBytes(16).toString("base64");
    let s = fs.readFileSync(".env", "utf8");
    s = s.replace("key1==,key2==,key3==,key4==", Array.from({length:4}, rnd).join(","));
    s = s.replace(/^API_TOKEN_SALT=.*$/m,    "API_TOKEN_SALT="    + rnd());
    s = s.replace(/^ADMIN_JWT_SECRET=.*$/m,  "ADMIN_JWT_SECRET="  + rnd());
    s = s.replace(/^TRANSFER_TOKEN_SALT=.*$/m,"TRANSFER_TOKEN_SALT=" + rnd());
    s = s.replace(/^JWT_SECRET=.*$/m,        "JWT_SECRET="        + rnd());
    fs.writeFileSync(".env", s);
    console.log("==> สร้าง cms/.env พร้อม secret สุ่มเรียบร้อย");
  '
else
  echo "==> มี cms/.env อยู่แล้ว — ข้ามการสร้าง"
fi

# ---- ตั้งค่าเฉพาะ GitHub Codespaces (URL หลัง proxy + CORS หน้าบ้าน) ----
if [ -n "$CODESPACE_NAME" ] && [ -n "$GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN" ]; then
  CMS_URL="https://${CODESPACE_NAME}-1337.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}"
  FE_URL="https://${CODESPACE_NAME}-8080.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}"
  # ลบของเดิม (กันซ้ำเมื่อ rebuild) แล้วเติมใหม่
  sed -i '/^PUBLIC_URL=/d;/^CORS_ORIGINS=/d' .env
  {
    echo "PUBLIC_URL=${CMS_URL}"
    echo "CORS_ORIGINS=${FE_URL},http://localhost:8080,http://localhost:8123,https://www.dga.or.th"
  } >> .env
  echo "==> ตั้งค่า Codespaces: CMS=${CMS_URL}"
fi

echo "==> npm install (อาจใช้เวลา 1-3 นาที)…"
npm install

cat <<'EOF'

=====================================================================
  ✅ DGA CMS พร้อมใช้งานบน Codespaces แล้ว

  เปิด CMS:
     cd cms && npm run develop
  → รอจน "Welcome back" แล้วแท็บ Ports จะเด้งพอร์ต 1337 (กด Open in Browser)
  → ต่อท้าย /admin  เช่น  https://<your-codespace>-1337.app.github.dev/admin
  → ครั้งแรกสร้างบัญชีผู้ดูแล (ระบบ seed ข้อมูล + เปิดสิทธิ์ API ให้อัตโนมัติ)

  เปิดหน้าบ้าน (อีกเทอร์มินัล):
     npx serve -l 8080 .
  → ตั้ง window.DGA_CMS_URL ใน assets/cms-config.js เป็น URL ของพอร์ต 1337
=====================================================================

EOF
