module.exports = ({ env }) => ([
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      // โดเมนหน้าบ้านที่อนุญาตให้เรียก API (เพิ่ม/แก้ผ่าน .env: CORS_ORIGINS)
      origin: env.array('CORS_ORIGINS', [
        'http://localhost:8123',
        'http://localhost:3000',
        'http://127.0.0.1:5500',
        'https://www.dga.or.th',
      ]),
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
]);
