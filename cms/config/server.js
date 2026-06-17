module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  // ใช้เมื่อรันหลัง proxy/HTTPS (เช่น GitHub Codespaces, production)
  url: env('PUBLIC_URL', undefined),
  app: { keys: env.array('APP_KEYS') },
  webhooks: { populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false) },
});
