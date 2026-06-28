import type { Metadata } from 'next';

export const siteConfig = {
  name: 'Felich Portfolio',
  title: 'Felich | Software Engineer & AI Specialist',
  description:
    'Versatile Software Engineer specializing in AI Engineering, Fullstack Development, and DevOps. Building impactful digital solutions with Next.js, Python, and TypeScript.',
  url: 'https://felich.dev',
  author: 'Felich',
  twitterCreator: '@fel_comp',
  ogImage: '/og-image.png',
};

type SeoMetadataOptions = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  tags?: string[];
  noIndex?: boolean;
};

export function absoluteUrl(path = '/') {
  if (path.startsWith('http')) return path;
  return `${siteConfig.url}${path.startsWith('/') ? path : `/${path}`}`;
}

export function createMetadata({
  title,
  description = siteConfig.description,
  path = '/',
  image = siteConfig.ogImage,
  type = 'website',
  publishedTime,
  tags,
  noIndex = false,
}: SeoMetadataOptions = {}): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = image.startsWith('/api/og') ? absoluteUrl(image) : image;

  return {
    title: title ?? siteConfig.title,
    description,
    alternates: {
      canonical: url,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : undefined,
    openGraph: {
      title: title ? `${title} | Felich` : siteConfig.title,
      description,
      url,
      siteName: siteConfig.name,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title ? `${title} | Felich` : 'Felich Portfolio',
        },
      ],
      locale: 'en_US',
      type,
      publishedTime,
      tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: title ? `${title} | Felich` : siteConfig.title,
      description,
      creator: siteConfig.twitterCreator,
      images: [imageUrl],
    },
  };
}
