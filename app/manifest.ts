import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Felich Portfolio',
    short_name: 'Felich',
    description: 'Software Engineer specializing in AI Engineering and FinTech solutions.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0F0F0F',
    theme_color: '#0F0F0F',
    icons: [
      {
        src: '/icon',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  };
}
