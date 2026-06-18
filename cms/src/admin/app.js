/* =====================================================================
   DGA CMS — Admin customization (Branding ระดับ 1+2 · เวอร์ชันเข้มขึ้น)
   • โลโก้ + favicon แบรนด์ DGA  • สี CI (ส้ม #EE5020 / กรมท่า #16294A) เข้มชัด
   • ภาษาไทย (locales th/en + คำแปลครอบคลุมขึ้น)  • ฟอนต์ Kanit + Ubuntu
   • หน้า Login พรีเมียม + ซ่อนป้ายโปรโมต Strapi (ลิงก์ strapi.io)
   ===================================================================== */
import DgaLogo from './extensions/dga-logo.svg';
import Favicon from './extensions/favicon.svg';

const config = {
  locales: ['th', 'en'],

  // ---- คำแปลภาษาไทยของ Admin ----
  translations: {
    th: {
      'app.components.LeftMenu.navbrand.title': 'DGA CMS',
      'app.components.LeftMenu.navbrand.workplace': 'ระบบจัดการเนื้อหา สพร.',
      'app.components.HomePage.welcome': 'ยินดีต้อนรับสู่ระบบจัดการเนื้อหา สพร.',
      'app.components.HomePage.welcome.again': 'ยินดีต้อนรับกลับสู่ DGA CMS',
      'app.components.HomePage.welcomeBlock.content.again.v2': 'ยินดีต้อนรับกลับสู่ระบบจัดการเนื้อหาเว็บไซต์ สพร.',
      'HomePage.head.title': 'ภาพรวม | DGA CMS',
      'Auth.form.welcome.title': 'ยินดีต้อนรับสู่ DGA CMS',
      'Auth.form.welcome.subtitle': 'เข้าสู่ระบบจัดการเนื้อหาเว็บไซต์ สพร.',
      'Auth.form.button.login.strapi': 'เข้าสู่ระบบ',
      'Auth.link.signin': 'เข้าสู่ระบบ',
      'Auth.form.email.label': 'อีเมล',
      'Auth.form.password.label': 'รหัสผ่าน',
      'global.content-manager': 'จัดการเนื้อหา',
      'global.plugins.content-manager': 'จัดการเนื้อหา',
      'global.plugins.content-type-builder': 'สร้างชนิดเนื้อหา',
      'global.plugins.media-library': 'คลังสื่อ',
      'global.settings': 'ตั้งค่า',
      'global.profile': 'โปรไฟล์',
      'content-manager.containers.List.draft': 'ฉบับร่าง',
      'content-manager.containers.List.published': 'เผยแพร่แล้ว',
      'content-manager.containers.Edit.information.lastUpdate': 'แก้ไขล่าสุด',
      'content-manager.containers.Edit.action.publish': 'เผยแพร่',
      'content-manager.containers.Edit.action.unpublish': 'ยกเลิกเผยแพร่',
      'content-manager.containers.Edit.action.save': 'บันทึก',
    },
  },

  // ---- ธีมสี CI ของ DGA (ส้ม = หลัก, กรมท่า = secondary) ----
  theme: {
    light: {
      colors: {
        primary100: '#FFF3EC',
        primary200: '#FFD9C5',
        primary300: '#FFB48C',
        primary400: '#FF8A5C',
        primary500: '#FF6A3D',
        primary600: '#EE5020',
        primary700: '#C2410C',
        buttonPrimary500: '#EE5020',
        buttonPrimary600: '#C2410C',
        secondary100: '#E7EEF8',
        secondary200: '#C5D6EE',
        secondary500: '#2A4D86',
        secondary600: '#16294A',
        secondary700: '#0F1F3A',
        danger600: '#B3261E',
        success600: '#1E7B34',
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

    const style = document.createElement('style');
    style.setAttribute('data-dga', 'true');
    style.innerHTML = `
      /* ฟอนต์ทั้งระบบ */
      :root, body, button, input, select, textarea, h1, h2, h3, h4 {
        font-family: 'Kanit','Ubuntu',system-ui,sans-serif !important;
      }
      /* ปุ่มมุมโค้งนุ่มขึ้น = ดูพรีเมียม */
      button { border-radius: 8px; }

      /* ===== หน้า Login — พรีเมียมแบรนด์ DGA ===== */
      main:has(form) {
        background:
          radial-gradient(120% 80% at 100% 0%, rgba(238,80,32,.13), transparent 55%),
          radial-gradient(90% 80% at 0% 100%, rgba(22,41,74,.10), transparent 55%),
          linear-gradient(160deg,#FAFAF8 0%, #FFF3EC 100%) !important;
      }
      main:has(form) form {
        box-shadow: 0 30px 70px -25px rgba(22,41,74,.30) !important;
        border-radius: 18px !important;
      }

      /* ===== ซ่อนป้าย/ลิงก์โปรโมตของ Strapi (ลด clutter) ===== */
      a[href*="strapi.io"],
      a[href*="strapi.io/cloud"],
      a[href*="cloud.strapi.io"] { display: none !important; }
    `;
    document.head.appendChild(style);

    /* ซ่อน widget โปรโมตบนหน้าแรก (Deploy / Discover / Strapi Cloud) แบบปลอดภัย
       ใช้การค้นข้อความหัวข้อ แล้วซ่อนกล่องที่ครอบอยู่ — ไม่พังถ้าไม่เจอ */
    const KILL = ['Strapi Cloud', 'Ready to go live', 'Deploy with Strapi'];
    const hideClutter = () => {
      try {
        document.querySelectorAll('h2, h3, span, p').forEach((el) => {
          const t = (el.textContent || '').trim();
          if (KILL.some((k) => t.indexOf(k) !== -1) && t.length < 60) {
            let n = el;
            for (let i = 0; i < 6 && n && n.parentElement; i++) {
              n = n.parentElement;
              const r = n.getBoundingClientRect();
              if (r.height > 140 && r.height < 700) { n.style.display = 'none'; break; }
            }
          }
        });
      } catch (e) {}
    };
    let ticks = 0;
    const timer = setInterval(() => { hideClutter(); if (++ticks > 12) clearInterval(timer); }, 800);
  } catch (e) {
    /* ไม่ทำให้ Admin ล่มหากแต่งสไตล์ไม่ได้ */
  }
};

export default { config, bootstrap };
