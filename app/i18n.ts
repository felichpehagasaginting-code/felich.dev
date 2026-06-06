import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // Common & Sidebar
      "home": "Home",
      "about": "About",
      "contact": "Contact",
      "dashboard": "Dashboard",
      "toggle_language": "ID",
      "sidebar": "Sidebar",
      "topbar": "Topbar",
      "hi_im": "Hi, I'm",
      "software_engineer": "Software Engineer",
      "education": "Education",
      "politeknik": "Politeknik Kelapa Sawit Citra Widya Edukasi",
      "degree": "D4 Software Engineering Technology",
      "period": "2025 - 2029",
      
      "link_home": "Home",
      "link_about": "About",
      "link_achievements": "Achievements",
      "link_projects": "Projects",
      "link_blog": "Blog",
      "link_dashboard": "Dashboard",
      "link_contact": "Contact",
      "link_guestbook": "Guestbook",
      "link_uses": "Uses",
      "link_links": "Links",
      
      "status_open_to": "Open to",
      "status_internship": "Internship",
      "status_collaborate": "Collaborate",
      "status_available_for_work": "Available for Work",
      "search_hint": "Press ⌘K to search",

      // Hero & Home
      "hero_subtitle": "Software Engineer | AI Learning Path | FinTech 🇮🇩",
      "hero_desc": "Architecting intelligent AI-driven systems and robust financial platforms. Experienced in machine learning pipelines, quantitative modeling, and production-grade software engineering.",
      "hero_typing_se": "Software Engineer",
      "hero_typing_ai": "AI Engineer",
      "hero_typing_devops": "DevOps Engineer",
      "hero_typing_fs": "Fullstack Developer",
      "hero_para_1": "Currently a Software Engineering student and BPDP Full Scholar, I work at the intersection of AI, data, and long-term thinking. My focus is on building intelligent systems using Machine Learning and Data Analytics that solve real, scalable problems.",
      "hero_para_2": "Beyond code, I'm deeply interested in capital allocation and financial independence — because the best engineers don't just build products, they build wealth.",
      "hero_skills_title": "What I bring to the table:",
      "hero_skills_1": "AI & Machine Learning development",
      "hero_skills_2": "Data-driven decision making",
      "hero_skills_3": "Systems thinking & long-term strategy",
      "hero_para_3": "Open to internships, collaborations, and conversations about tech, data, and building the future.",
      "lets_connect": "Let's connect 🔥",
      
      "location": "Based in Indonesia 🇮🇩",
      "location_tooltip": "Local Time",
      "onsite": "Available for Onsite",
      
      "stats_skills": "Skills",
      "stats_achievements": "Achievements",
      "stats_projects": "Projects",
      "stats_experience": "Years Exp.",
      
      "skills_subtitle": "My professional skills. Click to learn more.",
      "skills_filter_all": "All",
      "skills_filter_frontend": "Frontend",
      "skills_filter_backend": "Backend",
      "skills_filter_database": "Database",
      "skills_filter_tools": "Tools",
      "shortcut_hint": "Press Ctrl+K to open command palette",

      // Contact Form
      "get_in_touch": "Get In Touch",
      "email": "Email",
      "follow_me": "Follow Me",
      "send_message": "Send Message",
      "name": "Name",
      "email_address": "Email Address",
      "message": "Message",
      "sending": "Sending...",
      "success": "Message sent successfully! Thanks 🚀",

      // About
      "about_desc": "A brief introduction to who I am.",
      "about_reading_time": "min read",
      "bio_p1": "I'm Felich, an Indonesia-based Software Engineer dedicated to building impactful digital solutions. I specialize in developing scalable web platforms and mobile applications using a modern tech stack, including Next.js, TypeScript, Python, and Node.js.",
      "bio_p2": "My primary focus is crafting software architecture that doesn't just work but is well-structured, maintainable, and scalable to meet business needs. I believe that high-quality code must go hand-in-hand with system efficiency and logical clarity.",
      "bio_p3": "I blend technical expertise with proactive communication, critical thinking, and effective time management. I thrive in collaborative environments and leverage leadership skills to ensure every project delivers optimal results and a real-world impact.",
      "signature": "Digital Signature",
      "timeline_title": "Journey",
      "timeline_desc": "My career & education timeline — scroll to explore.",
      "testimonials_title": "Testimonials",
      "testimonials_desc": "What people say about working with me.",
      "testimonial_1_name": "Project Collaborator",
      "testimonial_1_role": "Senior Developer",
      "testimonial_1_text": "Felich demonstrates exceptional problem-solving skills and a deep understanding of modern web technologies. His code is always clean, well-documented, and scalable.",
      "testimonial_2_name": "Academic Mentor",
      "testimonial_2_role": "University Lecturer",
      "testimonial_2_text": "One of the most dedicated and talented students I've had. His passion for AI and software engineering is truly inspiring, consistently going above and beyond expectations.",
      "testimonial_3_name": "Client",
      "testimonial_3_role": "Startup Founder",
      "testimonial_3_text": "Working with Felich was an excellent experience. He delivered a high-quality full-stack application on time and with great attention to detail. Highly recommended!",

      // Projects
      "projects_desc": "A showcase of both private and open-source projects I've built or contributed to.",
      "projects_filter_type": "Type",
      "projects_filter_category": "Category",
      "projects_filter_all": "All",
      "projects_personal": "Personal Project",
      "projects_freelance": "Freelance",
      "projects_view_case": "View Case Study",
      "projects_featured": "Featured",
      "projects_modal_resources": "Execution & Resources",
      "projects_modal_source": "Source Code",
      "projects_modal_live": "Live System",
      "projects_modal_like": "Like this project",
      "projects_modal_liked": "Liked!",
      "projects_modal_synced": "Synced to Firebase ✓",

      // Dashboard
      "dashboard_desc": "Real-time metrics & GitHub activity index.",
      "dashboard_stats_repos": "Repositories",
      "dashboard_stats_stars": "Total Stars",
      "dashboard_stats_forks": "Total Forks",
      "dashboard_stats_languages": "Languages",
      "dashboard_contributions": "Contribution Activity",
      "dashboard_spotify_streaming": "Now Streaming",
      "dashboard_spotify_listen": "Listen",
      "dashboard_active_repos": "Active Repositories",
      "dashboard_sort": "Sort",
      "dashboard_sort_updated": "Sort: Updated",
      "dashboard_token_note": "To unlock full API performance, configure your GitHub Token in",
      "dashboard_get_token": "Get Token",
      "less": "Less",
      "more": "More",
      "spotify_listening_to": "Listening to",
      "spotify_last_played": "Last Played"
    }
  },
  id: {
    translation: {
      // Common & Sidebar
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
      
      "link_home": "Beranda",
      "link_about": "Tentang",
      "link_achievements": "Prestasi",
      "link_projects": "Proyek",
      "link_blog": "Blog",
      "link_dashboard": "Dashboard",
      "link_contact": "Kontak",
      "link_guestbook": "Buku Tamu",
      "link_uses": "Setup Kerja",
      "link_links": "Tautan",
      
      "status_open_to": "Terbuka untuk",
      "status_internship": "Magang",
      "status_collaborate": "Kolaborasi",
      "status_available_for_work": "Siap Bekerja",
      "search_hint": "Tekan ⌘K untuk mencari",

      // Hero & Home
      "hero_subtitle": "Teknik Informatika | Belajar AI | FinTech 🇮🇩",
      "hero_desc": "Merancang sistem AI cerdas dan platform keuangan yang kokoh. Berpengalaman dalam pipeline machine learning, pemodelan kuantitatif, dan rekayasa perangkat lunak produksi.",
      "hero_typing_se": "Software Engineer",
      "hero_typing_ai": "AI Engineer",
      "hero_typing_devops": "DevOps Engineer",
      "hero_typing_fs": "Fullstack Developer",
      "hero_para_1": "Saat ini saya adalah mahasiswa Teknologi Perangkat Lunak dan Penerima Beasiswa Penuh BPDP, saya bekerja di persimpangan AI, data, dan pemikiran jangka panjang. Fokus saya adalah membangun sistem cerdas menggunakan Machine Learning dan Analisis Data untuk memecahkan masalah nyata yang dapat diskalakan.",
      "hero_para_2": "Di luar kode, saya sangat tertarik pada alokasi modal dan kebebasan finansial — karena insinyur terbaik tidak hanya membangun produk, mereka juga membangun kekayaan.",
      "hero_skills_title": "Keahlian yang saya tawarkan:",
      "hero_skills_1": "Pengembangan AI & Machine Learning",
      "hero_skills_2": "Pengambilan keputusan berbasis data",
      "hero_skills_3": "Pemikiran sistem & strategi jangka panjang",
      "hero_para_3": "Terbuka untuk magang, kolaborasi, dan diskusi tentang teknologi, data, serta membangun masa depan.",
      "lets_connect": "Mari terhubung 🔥",
      
      "location": "Berbasis di Indonesia 🇮🇩",
      "location_tooltip": "Waktu Lokal",
      "onsite": "Siap untuk Onsite",
      
      "stats_skills": "Skills",
      "stats_achievements": "Prestasi",
      "stats_projects": "Proyek",
      "stats_experience": "Tahun Pengal.",
      
      "skills_subtitle": "Keterampilan profesional saya. Klik untuk mempelajari lebih lanjut.",
      "skills_filter_all": "Semua",
      "skills_filter_frontend": "Frontend",
      "skills_filter_backend": "Backend",
      "skills_filter_database": "Database",
      "skills_filter_tools": "Tools",
      "shortcut_hint": "Tekan Ctrl+K untuk membuka command palette",

      // Contact Form
      "get_in_touch": "Hubungi Saya",
      "email": "Email",
      "follow_me": "Ikuti Saya",
      "send_message": "Kirim Pesan",
      "name": "Nama",
      "email_address": "Alamat Email",
      "message": "Pesan",
      "sending": "Mengirim...",
      "success": "Pesan berhasil dikirim! Terima kasih 🚀",

      // About
      "about_desc": "Pengenalan singkat tentang siapa saya.",
      "about_reading_time": "menit baca",
      "bio_p1": "Saya Felich, seorang Software Engineer yang berbasis di Indonesia yang berdedikasi untuk membangun solusi digital yang berdampak. Saya berspesialisasi dalam mengembangkan platform web yang dapat diskalakan dan aplikasi seluler menggunakan teknologi modern, termasuk Next.js, TypeScript, Python, dan Node.js.",
      "bio_p2": "Fokus utama saya adalah membuat arsitektur perangkat lunak yang tidak hanya berfungsi tetapi juga terstruktur dengan baik, dapat dipelihara, dan dapat diskalakan untuk memenuhi kebutuhan bisnis. Saya percaya bahwa kode berkualitas tinggi harus berjalan seiring dengan efisiensi sistem dan kejelasan logis.",
      "bio_p3": "Saya memadukan keahlian teknis dengan komunikasi proaktif, pemikiran kritis, dan manajemen waktu yang efektif. Saya berkembang dalam lingkungan kolaboratif dan memanfaatkan keterampilan kepemimpinan untuk memastikan setiap proyek memberikan hasil yang optimal dan dampak nyata.",
      "signature": "Tanda Tangan Digital",
      "timeline_title": "Perjalanan",
      "timeline_desc": "Garis waktu karir & pendidikan saya — gulir untuk menjelajahi.",
      "testimonials_title": "Testimoni",
      "testimonials_desc": "Apa yang orang katakan tentang bekerja dengan saya.",
      "testimonial_1_name": "Kolaborator Proyek",
      "testimonial_1_role": "Developer Senior",
      "testimonial_1_text": "Felich menunjukkan keterampilan memecahkan masalah yang luar biasa dan pemahaman mendalam tentang teknologi web modern. Kodenya selalu bersih, terdokumentasi dengan baik, dan dapat diskalakan.",
      "testimonial_2_name": "Mentor Akademik",
      "testimonial_2_role": "Dosen Universitas",
      "testimonial_2_text": "Salah satu mahasiswa paling berdedikasi dan berbakat yang pernah saya miliki. Semangatnya terhadap AI dan rekayasa perangkat lunak benar-benar menginspirasi, secara konsisten melampaui ekspektasi.",
      "testimonial_3_name": "Klien",
      "testimonial_3_role": "Pendiri Startup",
      "testimonial_3_text": "Bekerja dengan Felich adalah pengalaman yang luar biasa. Dia memberikan aplikasi full-stack berkualitas tinggi tepat waktu dan dengan perhatian besar pada detail. Sangat direkomendasikan!",

      // Projects
      "projects_desc": "Etalase proyek pribadi dan open-source yang telah saya bangun atau kontribusikan.",
      "projects_filter_type": "Tipe",
      "projects_filter_category": "Kategori",
      "projects_filter_all": "Semua",
      "projects_personal": "Proyek Pribadi",
      "projects_freelance": "Pekerjaan Lepas",
      "projects_view_case": "Lihat Studi Kasus",
      "projects_featured": "Unggulan",
      "projects_modal_resources": "Eksekusi & Sumber Daya",
      "projects_modal_source": "Kode Sumber",
      "projects_modal_live": "Sistem Live",
      "projects_modal_like": "Sukai proyek ini",
      "projects_modal_liked": "Disukai!",
      "projects_modal_synced": "Tersinkronisasi ke Firebase ✓",

      // Dashboard
      "dashboard_desc": "Metrik waktu nyata & indeks aktivitas GitHub.",
      "dashboard_stats_repos": "Repositori",
      "dashboard_stats_stars": "Total Bintang",
      "dashboard_stats_forks": "Total Fork",
      "dashboard_stats_languages": "Bahasa",
      "dashboard_contributions": "Aktivitas Kontribusi",
      "dashboard_spotify_streaming": "Sedang Diputar",
      "dashboard_spotify_listen": "Dengarkan",
      "dashboard_active_repos": "Repositori Aktif",
      "dashboard_sort": "Urutan",
      "dashboard_sort_updated": "Urutan: Diperbarui",
      "dashboard_token_note": "Untuk membuka performa API penuh, konfigurasikan GitHub Token Anda di",
      "dashboard_get_token": "Dapatkan Token",
      "less": "Kurang",
      "more": "Lebih",
      "spotify_listening_to": "Mendengarkan",
      "spotify_last_played": "Terakhir Diputar"
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

