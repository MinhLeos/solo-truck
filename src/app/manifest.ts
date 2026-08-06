import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Solo Truck',
    short_name: 'Solo Truck',
    description: 'Daily compliance logging for independent food trucks.',
    start_url: '/today',
    display: 'standalone',
    background_color: '#F2F4F5',
    theme_color: '#15181B',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
