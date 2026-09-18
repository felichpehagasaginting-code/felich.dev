import Image from 'next/image';
import { toYouTubeEmbed, toYouTubeThumbnail } from '@/lib/projects';

export interface MediaProject {
  title: string;
  coverImage?: string;
  gallery?: string[];
  demoVideo?: string;
}

/** Cover kartu: coverImage, fallback thumbnail YouTube. */
export function ProjectCover({ project, tall }: { project: MediaProject; tall?: boolean }) {
  const src: string = project.coverImage || (project.demoVideo ? toYouTubeThumbnail(project.demoVideo) || '' : '');
  if (!src) return null;
  return (
    <div className={`relative w-full overflow-hidden border-b border-[var(--border-default)] ${tall ? 'aspect-[16/8]' : 'aspect-[16/7]'}`}>
      <Image
        src={src}
        alt={`${project.title} cover`}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
        loading="lazy"
      />
    </div>
  );
}

/** Embed YouTube (nocookie) atau link mentah bila bukan URL YouTube. */
export function ProjectVideo({ url, title }: { url: string; title: string }) {
  const embed = url ? toYouTubeEmbed(url) : null;
  if (!url) return null;
  if (!embed) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-[var(--brand)] underline break-all">
        {url}
      </a>
    );
  }
  return (
    <div className="aspect-video w-full overflow-hidden rounded-xl border border-[var(--border-default)] bg-black">
      <iframe
        src={embed}
        title={`${title} demo video`}
        className="w-full h-full"
        loading="lazy"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

/** Grid galeri (maks 8). */
export function ProjectGallery({ project }: { project: MediaProject }) {
  const gallery: string[] = Array.isArray(project.gallery) ? project.gallery.filter(Boolean) : [];
  if (gallery.length === 0) return null;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {gallery.slice(0, 8).map((g: string, i: number) => (
        <a key={`${g}-${i}`} href={g} target="_blank" rel="noopener noreferrer" className="relative aspect-[4/3] overflow-hidden rounded-lg border border-[var(--border-default)] hover:border-[var(--brand)] transition-colors">
          <Image src={g} alt={`${project.title} screenshot ${i + 1}`} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" loading="lazy" />
        </a>
      ))}
    </div>
  );
}
