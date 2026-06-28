import { createClient } from 'next-sanity';
import { createImageUrlBuilder } from '@sanity/image-url';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  // Enable CDN in production for globally distributed edge caching.
  // The CDN is bypassed in development so edits appear immediately.
  useCdn: process.env.NODE_ENV === 'production',
});


const builder = createImageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}

export async function getPosts() {
  const query = `*[_type == "post"] | order(date desc) {
    title,
    "slug": slug.current,
    date,
    description,
    topics,
    mainImage
  }`;
  return await client.fetch(query);
}
