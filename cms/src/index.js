'use strict';

/* =====================================================================
   bootstrap — รันตอนสตาร์ท Strapi
   1) เปิด locale ไทย (th) + ตั้งเป็นค่าเริ่มต้น
   2) ให้สิทธิ์ Public อ่าน API (find/findOne) ของ article/job/service
   3) seed ข้อมูลตัวอย่าง 2 ภาษา ถ้ายังว่าง (เดโมพร้อมใช้ทันที)
   ===================================================================== */

const PUBLIC_ACTIONS = [
  'api::article.article.find', 'api::article.article.findOne',
  'api::job.job.find', 'api::job.job.findOne',
  'api::service.service.find', 'api::service.service.findOne',
  'api::page.page.find', 'api::page.page.findOne',
  'api::banner.banner.find', 'api::banner.banner.findOne',
];

async function ensureLocales(strapi) {
  try {
    const localesService = strapi.plugin('i18n').service('locales');
    const existing = await localesService.find();
    const codes = existing.map((l) => l.code);
    if (!codes.includes('th')) {
      await localesService.create({ code: 'th', name: 'ไทย (th)' });
    }
    // ตั้งไทยเป็นค่าเริ่มต้น (best effort)
    try { await localesService.setDefaultLocale({ code: 'th' }); } catch (e) {}
  } catch (e) {
    strapi.log.warn('DGA seed: ตั้งค่า locale ไม่สำเร็จ — ' + e.message);
  }
}

async function setPublicPermissions(strapi) {
  try {
    const publicRole = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'public' } });
    if (!publicRole) return;

    for (const action of PUBLIC_ACTIONS) {
      const existing = await strapi
        .query('plugin::users-permissions.permission')
        .findOne({ where: { action, role: publicRole.id } });
      if (!existing) {
        await strapi
          .query('plugin::users-permissions.permission')
          .create({ data: { action, role: publicRole.id } });
      }
    }
    strapi.log.info('DGA seed: ตั้งสิทธิ์ Public อ่าน API เรียบร้อย');
  } catch (e) {
    strapi.log.warn('DGA seed: ตั้งสิทธิ์ Public ไม่สำเร็จ — ' + e.message);
  }
}

async function createBilingual(strapi, uid, th, en) {
  const docs = strapi.documents(uid);
  const created = await docs.create({ data: th, locale: 'th', status: 'published' });
  await docs.update({ documentId: created.documentId, locale: 'en', data: en, status: 'published' });
}

async function seed(strapi) {
  try {
    const count = await strapi.documents('api::article.article').count();
    if (count > 0) return; // มีข้อมูลแล้ว ไม่ seed ซ้ำ

    // ---- ข่าวสาร ----
    await createBilingual(strapi, 'api::article.article',
      { title: 'ป.ป.ท. จับมือ DGA ลงนาม MOU ยกระดับการป้องกันการทุจริตด้วยระบบดิจิทัล', slug: 'pacc-dga-mou', category: 'MOU', excerpt: 'ความร่วมมือนำเทคโนโลยีดิจิทัลเพิ่มความโปร่งใสในการป้องกันการทุจริต', icon: 'i-doc', swatch: 'n2', views: 41, publishedDate: '2026-06-12' },
      { title: 'PACC and DGA sign MOU to strengthen anti-corruption with digital systems', slug: 'pacc-dga-mou', category: 'MOU', excerpt: 'A partnership applying digital technology for transparency in anti-corruption.', views: 41, publishedDate: '2026-06-12' });

    await createBilingual(strapi, 'api::article.article',
      { title: 'DGA เปิดศูนย์ข้อมูลเปิดภาครัฐ Open Data Hub ครบ 10,000 ชุดข้อมูล', slug: 'open-data-10000', category: 'ข้อมูลเปิด', excerpt: 'ศูนย์กลางข้อมูลเปิดที่ใหญ่ที่สุด พร้อม API ให้นำไปต่อยอด', icon: 'i-data', swatch: 'n3', views: 256, publishedDate: '2026-04-02' },
      { title: 'DGA Open Data Hub reaches 10,000 datasets', slug: 'open-data-10000', category: 'Open Data', excerpt: 'The largest open government data hub, with APIs to build on.', views: 256, publishedDate: '2026-04-02' });

    await createBilingual(strapi, 'api::article.article',
      { title: 'กระทรวง DE และ DGA ยกระดับแอปฯ “ทางรัฐ” ให้บริการประชาชนสะดวกขึ้น', slug: 'tangrath-upgrade', category: 'ทางรัฐ', excerpt: 'พัฒนาแอปทางรัฐเป็นพอร์ทัลกลางรวมบริการภาครัฐในที่เดียว', icon: 'i-grid', swatch: 'n1', views: 145, publishedDate: '2026-05-08' },
      { title: 'MDES and DGA upgrade the “Tang Rath” app for easier citizen services', slug: 'tangrath-upgrade', category: 'Tang Rath', excerpt: 'Developing Tang Rath into a central portal for public services.', views: 145, publishedDate: '2026-05-08' });

    // ---- ตำแหน่งงาน ----
    await createBilingual(strapi, 'api::job.job',
      { title: 'นักพัฒนาระบบ (Full-stack Developer)', slug: 'fullstack-developer', department: 'ฝ่ายพัฒนาระบบดิจิทัล', employmentType: 'พนักงานประจำ', location: 'กรุงเทพฯ (ไฮบริด)', salary: '45,000–75,000 บาท/เดือน', deadline: '31 ก.ค. 2569', openings: 2, deptKey: 'tech', typeKey: 'fulltime', summary: 'พัฒนาและดูแลแพลตฟอร์มบริการภาครัฐที่มีผู้ใช้งานหลายล้านคน', responsibilities: ['ออกแบบและพัฒนาเว็บแอปทั้ง front-end และ back-end', 'พัฒนาและเชื่อมต่อ REST API กับระบบกลางภาครัฐ', 'ดูแลคุณภาพโค้ดและทำ code review'], qualifications: ['ปริญญาตรีสาขาที่เกี่ยวข้อง', 'ประสบการณ์พัฒนาเว็บอย่างน้อย 2 ปี', 'คุ้นเคย React/Vue และ Node.js'], benefits: ['ประกันสุขภาพและประกันชีวิตกลุ่ม', 'ทำงานแบบไฮบริด', 'กองทุนสำรองเลี้ยงชีพ'] },
      { title: 'Full-stack Developer', slug: 'fullstack-developer', department: 'Digital Systems', employmentType: 'Full-time', location: 'Bangkok (Hybrid)', salary: 'THB 45,000–75,000 /month', deadline: '31 Jul 2026', openings: 2, deptKey: 'tech', typeKey: 'fulltime', summary: 'Build and maintain government service platforms used by millions.', responsibilities: ['Design and build web apps across front-end and back-end', 'Develop and integrate REST APIs with central government systems', 'Maintain code quality and do code reviews'], qualifications: ['Bachelor’s in a related field', 'At least 2 years of web development', 'Familiar with React/Vue and Node.js'], benefits: ['Group health & life insurance', 'Hybrid work', 'Provident fund'] });

    await createBilingual(strapi, 'api::job.job',
      { title: 'นักวิทยาศาสตร์ข้อมูล (Data Scientist)', slug: 'data-scientist', department: 'ฝ่ายข้อมูลและปัญญาประดิษฐ์', employmentType: 'พนักงานประจำ', location: 'กรุงเทพฯ', salary: '50,000–85,000 บาท/เดือน', deadline: '15 ส.ค. 2569', openings: 1, deptKey: 'data', typeKey: 'fulltime', summary: 'วิเคราะห์ข้อมูลภาครัฐขนาดใหญ่เพื่อสนับสนุนการตัดสินใจเชิงนโยบาย', responsibilities: ['วิเคราะห์และสร้างโมเดลจากข้อมูลภาครัฐ', 'จัดทำ dashboard และรายงานเชิงลึก'], qualifications: ['ปริญญาตรี/โทสาขาที่เกี่ยวข้อง', 'ใช้ Python และ SQL ได้ดี'], benefits: ['ประกันสุขภาพ', 'งบพัฒนาทักษะ'] },
      { title: 'Data Scientist', slug: 'data-scientist', department: 'Data & AI', employmentType: 'Full-time', location: 'Bangkok', salary: 'THB 50,000–85,000 /month', deadline: '15 Aug 2026', openings: 1, deptKey: 'data', typeKey: 'fulltime', summary: 'Analyze large government datasets to support policy decisions.', responsibilities: ['Build models from government data', 'Create dashboards and in-depth reports'], qualifications: ['Bachelor’s/Master’s in a related field', 'Strong Python and SQL'], benefits: ['Health insurance', 'Learning budget'] });

    // ---- บริการ ----
    const services = [
      [{ name: 'แอปพลิเคชัน “ทางรัฐ”', subtitle: 'ระบบพอร์ทัลกลางเพื่อประชาชน', description: 'รวมบริการภาครัฐกว่า 150 บริการไว้ในแอปเดียว', group: 'citizen', icon: 'i-grid', linkLabel: 'เปิดบริการ ทางรัฐ', order: 1 },
       { name: '“Tang Rath” App', subtitle: 'National citizen portal', description: 'Over 150 government services in a single app.', group: 'citizen', icon: 'i-grid', linkLabel: 'Open Tang Rath', order: 1 }],
      [{ name: 'ศูนย์แลกเปลี่ยนข้อมูลกลาง (GDX)', subtitle: 'เชื่อมโยงข้อมูลระหว่างหน่วยงาน', description: 'แลกเปลี่ยนข้อมูลระหว่างหน่วยงานรัฐแบบบูรณาการ', group: 'gov', icon: 'i-map', url: 'https://gdx.dga.or.th', linkLabel: 'gdx.dga.or.th', order: 1 },
       { name: 'Government Data Exchange (GDX)', subtitle: 'Cross-agency data sharing', description: 'Exchanges data between agencies in an integrated way.', group: 'gov', icon: 'i-map', url: 'https://gdx.dga.or.th', linkLabel: 'gdx.dga.or.th', order: 1 }],
      [{ name: 'BizPortal เริ่มต้นธุรกิจ', subtitle: 'ศูนย์กลางบริการเพื่อภาคธุรกิจ', description: 'ขอใบอนุญาตและจดทะเบียนกว่า 70 รายการในที่เดียว', group: 'biz', icon: 'i-briefcase', url: 'https://bizportal.go.th', linkLabel: 'bizportal.go.th', tag: 'ยอดนิยม', order: 1 },
       { name: 'BizPortal', subtitle: 'One-stop hub for business', description: 'Apply for 70+ licenses and registrations in one place.', group: 'biz', icon: 'i-briefcase', url: 'https://bizportal.go.th', linkLabel: 'bizportal.go.th', tag: 'Popular', order: 1 }],
    ];
    for (const [th, en] of services) {
      await createBilingual(strapi, 'api::service.service', th, en);
    }

    // ---- หน้าเพจ ----
    await createBilingual(strapi, 'api::page.page',
      { title: 'เกี่ยวกับ สพร.', slug: 'about', excerpt: 'สำนักงานพัฒนารัฐบาลดิจิทัล (องค์การมหาชน)', body: 'สพร. มีบทบาทในการขับเคลื่อนรัฐบาลดิจิทัลของประเทศไทย ส่งเสริมและสนับสนุนหน่วยงานภาครัฐในการให้บริการประชาชนผ่านเทคโนโลยีดิจิทัล', showInMenu: true, order: 1 },
      { title: 'About DGA', slug: 'about', excerpt: 'Digital Government Development Agency (Public Organization)', body: 'DGA drives Thailand’s digital government, supporting public agencies to serve citizens through digital technology.', showInMenu: true, order: 1 });

    // ---- แบนเนอร์หน้าแรก ----
    await createBilingual(strapi, 'api::banner.banner',
      { title: 'บริการรัฐบาลดิจิทัล เพื่อประชาชนทุกคน', subtitle: 'ค้นหาบริการ เอกสาร และข้อมูลภาครัฐได้ในที่เดียว', ctaLabel: 'ดูบริการทั้งหมด', ctaUrl: '/services.html', position: 'hero', order: 1 },
      { title: 'Digital government services for everyone', subtitle: 'Find services, documents and government data in one place', ctaLabel: 'See all services', ctaUrl: '/en/services.html', position: 'hero', order: 1 });

    strapi.log.info('DGA seed: เพิ่มข้อมูลตัวอย่าง 2 ภาษาเรียบร้อย');
  } catch (e) {
    strapi.log.warn('DGA seed: seed ข้อมูลไม่สำเร็จ — ' + e.message);
  }
}

module.exports = {
  register() {},
  async bootstrap({ strapi }) {
    await ensureLocales(strapi);
    await setPublicPermissions(strapi);
    await seed(strapi);
  },
};
