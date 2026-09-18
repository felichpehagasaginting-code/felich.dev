export type ProjectType = 'Web' | 'Mobile' | 'IoT' | string;
export type ProjectCategory = 'Personal Project' | 'Freelance' | string;
export type ProjectStatus = 'published' | 'draft';

export interface Project {
  slug: string;
  title: string;
  description: string;
  type: ProjectType;
  category: ProjectCategory;
  featured: boolean;
  techStack: string[];
  features: string[];
  github: string;
  live: string;
  date: string;
  /** URL-only media (gratis): jsDelivr / ImageKit / Cloudinary / Unsplash / Sanity CDN */
  coverImage: string;
  gallery: string[];
  /** YouTube watch / share / embed / nocookie URL — tidak self-host video */
  demoVideo: string;
  content: string;
  status: ProjectStatus;
  order: number;
  createdAt?: string;
  updatedAt?: string;
  /** 'mdx' = dari file lokal, 'firestore' = dari admin */
  source?: 'mdx' | 'firestore';
}

/** Nilai form admin (tanpa field server-managed). */
export type ProjectFormValue = Omit<Project, 'slug' | 'source' | 'createdAt' | 'updatedAt'>;

export const EMPTY_PROJECT: Omit<Project, 'slug'> = {
  title: '',
  description: '',
  type: 'Web',
  category: 'Personal Project',
  featured: false,
  techStack: [],
  features: [],
  github: '',
  live: '',
  date: new Date().toISOString().slice(0, 10),
  coverImage: '',
  gallery: [],
  demoVideo: '',
  content: '',
  status: 'draft',
  order: 0,
};

const SLUG_CLEANUP = /[^a-z0-9]+/g;

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(SLUG_CLEANUP, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100);
}

/** Ambil YouTube video ID dari berbagai format URL. Return null bila bukan URL YouTube valid. */
export function parseYouTubeId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const patterns = [
    /(?:youtube\.com\/watch\?.*v=)([\w-]{11})/,
    /(?:youtu\.be\/)([\w-]{11})/,
    /(?:youtube\.com\/embed\/)([\w-]{11})/,
    /(?:youtube-nocookie\.com\/embed\/)([\w-]{11})/,
    /(?:youtube\.com\/shorts\/)([\w-]{11})/,
    /(?:youtube\.com\/live\/)([\w-]{11})/,
  ];
  for (const re of patterns) {
    const m = trimmed.match(re);
    if (m) return m[1];
  }
  return null;
}

export function toYouTubeEmbed(url: string): string | null {
  const id = parseYouTubeId(url);
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
}

export function toYouTubeThumbnail(url: string): string | null {
  const id = parseYouTubeId(url);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
}

const IMAGE_EXT_RE = /\.(avif|webp|png|jpe?g|gif|svg)$/i;

/** Domain gratis yang diizinkan untuk gambar project. */
export const ALLOWED_IMAGE_HOSTS = [
  'cdn.jsdelivr.net',
  'cdn.statically.io',
  'ik.imagekit.io',
  'res.cloudinary.com',
  'images.unsplash.com',
  'cdn.sanity.io',
  'avatars.githubusercontent.com',
  'i.scdn.co',
  'i.ytimg.com',
  'img.youtube.com',
  'raw.githubusercontent.com',
  'github.com',
] as const;

/** Host CDN gambar yang menyajikan image tanpa ekstensi file (via path/params). */
const EXTENSIONLESS_CDN_HOSTS = [
  'images.unsplash.com',
  'ik.imagekit.io',
  'res.cloudinary.com',
  'cdn.sanity.io',
  'i.ytimg.com',
  'img.youtube.com',
  'youtube.com',
];

export function isAllowedImageUrl(url: string): boolean {
  if (!url) return true; // kosong = opsional, valid
  try {
    const u = new URL(url.trim());
    if (u.protocol !== 'https:') return false;
    const host = u.hostname.toLowerCase();
    const hostOk =
      ALLOWED_IMAGE_HOSTS.some((h) => host === h || host.endsWith(`.${h}`)) ||
      host.endsWith('.github.io');
    if (!hostOk) return false;
    // CDN gambar + YouTube thumbnail: path tanpa ekstensi tetap valid
    if (EXTENSIONLESS_CDN_HOSTS.some((h) => host === h || host.endsWith(`.${h}`))) return true;
    return IMAGE_EXT_RE.test(u.pathname) || u.search.length > 0;
  } catch {
    return false;
  }
}

export function isValidProjectUrl(url: string): boolean {
  if (!url) return true; // opsional
  try {
    const u = new URL(url.trim());
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

export interface ProjectValidationError {
  field: string;
  message: string;
}

export function validateProject(input: Partial<Project>): ProjectValidationError[] {
  const errors: ProjectValidationError[] = [];
  if (!input.title?.trim()) errors.push({ field: 'title', message: 'Title wajib diisi.' });
  else if (input.title.trim().length > 120) errors.push({ field: 'title', message: 'Title maksimal 120 karakter.' });
  if (!input.description?.trim()) errors.push({ field: 'description', message: 'Description wajib diisi.' });
  else if (input.description.trim().length > 500) errors.push({ field: 'description', message: 'Description maksimal 500 karakter.' });
  if (input.github && !isValidProjectUrl(input.github)) errors.push({ field: 'github', message: 'GitHub harus URL valid.' });
  if (input.live && !isValidProjectUrl(input.live)) errors.push({ field: 'live', message: 'Live URL harus URL valid.' });
  if (input.coverImage && !isAllowedImageUrl(input.coverImage))
    errors.push({
      field: 'coverImage',
      message: 'Cover harus URL https dari host gratis (jsDelivr, ImageKit, Cloudinary, Unsplash, Sanity, YouTube thumbnail).',
    });
  if (input.gallery) {
    if (input.gallery.length > 8) errors.push({ field: 'gallery', message: 'Galeri maksimal 8 foto.' });
    input.gallery.forEach((g, i) => {
      if (g && !isAllowedImageUrl(g))
        errors.push({ field: `gallery[${i}]`, message: `Galeri #${i + 1} bukan URL gambar yang diizinkan.` });
    });
  }
  if (input.demoVideo) {
    const yt = parseYouTubeId(input.demoVideo);
    const plain = isValidProjectUrl(input.demoVideo);
    if (!yt && !plain)
      errors.push({ field: 'demoVideo', message: 'Video harus URL YouTube valid (disarankan) atau URL https.' });
  }
  if (input.date && Number.isNaN(new Date(input.date).getTime()))
    errors.push({ field: 'date', message: 'Date tidak valid.' });
  if (input.order !== undefined && (!Number.isFinite(input.order) || input.order < 0 || input.order > 9999))
    errors.push({ field: 'order', message: 'Order harus angka 0–9999.' });
  return errors;
}

/** Normalisasi payload dari form/API menjadi dokumen Firestore yang bersih. */
export function normalizeProject(input: Partial<Project> & { title: string }): Omit<Project, 'slug' | 'source' | 'createdAt' | 'updatedAt'> {
  const list = (v: unknown): string[] =>
    Array.isArray(v) ? v.map((s) => String(s).trim()).filter(Boolean) : [];
  return {
    title: input.title.trim().slice(0, 120),
    description: (input.description ?? '').trim().slice(0, 500),
    type: (input.type ?? 'Web') as ProjectType,
    category: (input.category ?? 'Personal Project') as ProjectCategory,
    featured: Boolean(input.featured),
    techStack: list(input.techStack).slice(0, 20),
    features: list(input.features).slice(0, 20),
    github: (input.github ?? '').trim(),
    live: (input.live ?? '').trim(),
    date: input.date ?? new Date().toISOString().slice(0, 10),
    coverImage: (input.coverImage ?? '').trim(),
    gallery: list(input.gallery).slice(0, 8),
    demoVideo: (input.demoVideo ?? '').trim(),
    content: (input.content ?? '').trim(),
    status: input.status === 'published' ? 'published' : 'draft',
    order: typeof input.order === 'number' && Number.isFinite(input.order) ? Math.min(9999, Math.max(0, Math.floor(input.order))) : 0,
  };
}

/** Sort: order kecil dulu (0 = tanpa prioritas, taruh belakang), lalu featured, lalu date terbaru. */
export function sortProjects<T extends Pick<Project, 'order' | 'featured' | 'date'>>(projects: T[]): T[] {
  return [...projects].sort((a, b) => {
    const ao = a.order > 0 ? a.order : Number.MAX_SAFE_INTEGER;
    const bo = b.order > 0 ? b.order : Number.MAX_SAFE_INTEGER;
    if (ao !== bo) return ao - bo;
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
  });
}
