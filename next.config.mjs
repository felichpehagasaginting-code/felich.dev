import withPWAInit from "@ducanh2912/next-pwa";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // Spotify — album art displayed in SpotifyWidget
      { protocol: 'https', hostname: 'i.scdn.co' },
      // Sanity CDN — blog post images fetched via next-sanity
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      // GitHub avatars — used in dashboard / contributions widget
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      // Unsplash — potential blog/project cover images
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },

  outputFileTracingRoot: path.resolve(__dirname),
};

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

export default withPWA(nextConfig);
