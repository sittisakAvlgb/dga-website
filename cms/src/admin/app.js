/* =====================================================================
   DGA CMS — Admin customization (Branding ระดับ 1+2)
   • โลโก้ + favicon แบรนด์ DGA  • สี CI (ส้ม #EE5020 / กรมท่า #16294A)
   • ภาษาไทย (locales th/en + คำแปล)  • ฟอนต์ Kanit (ไทย) + Ubuntu (อังกฤษ)
   • ปรับหน้า Login ให้เป็นแบรนด์ DGA
   ===================================================================== */
import DgaLogo from './extensions/dga-logo.svg';
import Favicon from './extensions/favicon.svg';

const config = {
  locales: ['th', 'en'],

  // ---- คำแปลภาษาไทยของ Admin (ชุดหลัก) ----
  translations: {
    th: {
      'app.components.LeftMenu.navbrand.title': 'DGA CMS',
      'app.components.LeftMenu.navbrand.workplace': 'ระบบจัดการเนื้อหา สพร.',
      'Auth.form.welcome.title': 'ยินดีต้อนรับสู่ DGA CMS',
      'Auth.form.welcome.subtitle': 'เข้าสู่ระบบจัดการเนื้อหาเว็บไซต์ สพร.',
      'Auth.form.button.login.strapi': 'เข้าสู่ระบบ',
      'Auth.link.signin': 'เข้าสู่ระบบ',
      'Settings.application.title': 'ภาพรวมระบบ',
      'global.documentation': 'คู่มือการใช้งาน',
      'global.content-manager': 'จัดการเนื้อหา',
      'content-manager.containers.List.draft': 'ฉบับร่าง',
      'content-manager.containers.List.published': 'เผยแพร่แล้ว',
      'content-manager.containers.Edit.information.lastUpdate': 'แก้ไขล่าสุด',
    },
  },

  // ---- ธีมสี CI ของ DGA (ส้ม = แอคชัน, กรมท่า = secondary) ----
  theme: {
    light: {
      colors: {
        primary100: '#FFF3EC',
        primary200: '#FFE0D0',
        primary500: '#FF7A45',
        primary600: '#EE5020',
        primary700: '#C2410C',
        buttonPrimary500: '#EE5020',
        buttonPrimary600: '#C2410C',
        secondary100: '#EAF0F9',
        secondary500: '#274472',
        secondary600: '#16294A',
        secondary700: '#0F1F3A',
      },
    },
    dark: {
      colors: {
        primary100: '#2A1A12',
        primary200: '#3A2417',
        primary500: '#FF7A45',
        primary600: '#FF8A5C',
        primary700: '#FFA472',
        buttonPrimary500: '#EE5020',
        buttonPrimary600: '#FF7A45',
        secondary500: '#3B82F6',
        secondary600: '#274472',
        secondary700: '#16294A',
      },
    },
  },

  // ---- โลโก้ + favicon แบรนด์ ----
  menu: { logo: DgaLogo },
  auth: { logo: DgaLogo },
  head: { favicon: Favicon },

  tutorials: false,
  notifications: { releases: false },
};

const bootstrap = (app) => {
  try {
    // ฟอนต์: ไทย = Kanit, อังกฤษ = Ubuntu
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&family=Ubuntu:wght@400;500;700&display=swap';
    document.head.appendChild(link);

    // ปรับฟอนต์ทั้ง Admin + แต่งหน้า Login ให้เป็นแบรนด์ DGA
    const style = document.createElement('style');
    style.setAttribute('data-dga', 'true');
    style.innerHTML = `
      :root, body, button, input, select, textarea { font-family: 'Kanit','Ubuntu',system-ui,sans-serif !important; }
      /* แถบแบรนด์ด้านบนของ Admin */
      nav[aria-label] a[href="/admin"] { position: relative; }
      /* หน้า Login — พื้นหลังไล่เฉดแบรนด์ DGA */
      main:has(form) { background:
        radial-gradient(120% 90% at 100% 0%, rgba(238,80,32,.10), transparent 55%),
        linear-gradient(160deg, #FAFAF8 0%, #FFF3EC 100%) !important; }
    `;
    document.head.appendChild(style);
  } catch (e) {
    /* ไม่ทำให้ Admin ล่มหากแต่งสไตล์ไม่ได้ */
  }
};

export default { config, bootstrap };
