import type { NextConfig } from "next";
import { config as loadEnv } from "dotenv";
import { join } from "path";

loadEnv({ path: join(process.cwd(), "..", "..", ".env") });

const nextConfig: NextConfig = {
  /* config options here */

  turbopack: {},

  experimental: {
    optimizeCss: true,
  },

  async headers() {
    if (process.env.NODE_ENV !== "production") return [];

    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
        ],
      },
    ];
  },

  // Fast Refresh va file watching
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },

  // Webpack file watching optimization
  webpack: (config, { isServer }) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
      ignored: ['**/node_modules', '**/.next'],
    };
    return config;
  },

  async redirects() {
    return [
      { source: "/home", destination: "/app/home", permanent: false },
      { source: "/dashboard", destination: "/app/home", permanent: false },
      { source: "/dashboard/:path*", destination: "/app/:path*", permanent: false },
      { source: "/text-to-speech", destination: "/app/text-to-speech", permanent: false },
      { source: "/app/voices", destination: "/app/home", permanent: false },
      { source: "/app/files", destination: "/app/home", permanent: false },
      { source: "/app/studio", destination: "/app/home", permanent: false },
      { source: "/app/audiobooks", destination: "/app/home", permanent: false },
      { source: "/app/flows", destination: "/app/home", permanent: false },
      { source: "/app/dubbing", destination: "/app/home", permanent: false },
      { source: "/app/speech-to-text", destination: "/app/home", permanent: false },
      { source: "/app/sound-effects", destination: "/app/home", permanent: false },
      { source: "/app/music", destination: "/app/home", permanent: false },
      { source: "/app/image-video", destination: "/app/home", permanent: false },
      { source: "/app/templates", destination: "/app/home", permanent: false },
      { source: "/app/voice-changer", destination: "/app/home", permanent: false },
      { source: "/app/voice-isolator", destination: "/app/home", permanent: false },
    ];
  },

  async rewrites() {
    return [
      { source: "/app/home", destination: "/dashboard" },
      { source: "/app/text-to-speech", destination: "/text-to-speech" },
    ];
  },
};

export default nextConfig;
