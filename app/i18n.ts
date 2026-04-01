import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // Common
      "home": "Home",
      "about": "About",
      "contact": "Contact",
      "dashboard": "Dashboard",
      "toggle_language": "ID",

      "sidebar": "Sidebar",
      "topbar": "Topbar",

      "hi_im": "Hi, I'm",
      "software_engineer": "Software Engineer",

      // Education
      "education": "Education",
      "politeknik": "Politeknik Kelapa Sawit Citra Widya Edukasi",
      "degree": "D4 Software Engineering Technology",
      "period": "2025 - 2029",

      // Hero
      "hero_subtitle": "Software Engineer | AI Learning Path | FinTech 🇮🇩",
      "hero_desc": "Architecting intelligent AI-driven systems and robust financial platforms. Experienced in machine learning pipelines, quantitative modeling, and production-grade software engineering.",

      // Contact
      "get_in_touch": "Get In Touch",
      "email": "Email",
      "follow_me": "Follow Me",
      "send_message": "Send Message",
      "name": "Name",
      "email_address": "Email Address",
      "message": "Message",
      "sending": "Sending...",
      "success": "Message sent successfully! Thanks 🚀"
    }
  },
  id: {
    translation: {
      "home": "Beranda",
      "about": "Tentang",
      "contact": "Kontak",
      "dashboard": "Dashboard",
      "toggle_language": "EN",

      "sidebar": "Sidebar",
      "topbar": "Topbar",

      "hi_im": "Halo, saya",
      "software_engineer": "Teknik Informatika",

      "education": "Pendidikan",
      "politeknik": "Politeknik Kelapa Sawit Citra Widya Edukasi",
      "degree": "D4 Teknologi Rekayasa Perangkat Lunak",
      "period": "2025 - 2029",

      "hero_subtitle": "Teknik Informatika | Belajar AI | FinTech 🇮🇩",
      "hero_desc": "Merancang sistem AI cerdas dan platform keuangan yang kokoh. Berpengalaman dalam pipeline machine learning, pemodelan kuantitatif, dan rekayasa perangkat lunak produksi.",

      "get_in_touch": "Hubungi Saya",
      "email": "Email",
      "follow_me": "Ikuti Saya",
      "send_message": "Kirim Pesan",
      "name": "Nama",
      "email_address": "Alamat Email",
      "message": "Pesan",
      "sending": "Mengirim...",
      "success": "Pesan berhasil dikirim! Terima kasih 🚀"
    }
  }
};

i18n
  .use(initReactI18next)
  // .use(LanguageDetector)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;

