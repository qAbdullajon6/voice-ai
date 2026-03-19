import type { NextConfig } from "next";
import { config as loadEnv } from "dotenv";
import { join } from "path";

loadEnv({ path: join(process.cwd(), "..", "..", ".env") });

const nextConfig: NextConfig = {
  /* config options here */

  turbopack: {},

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
    ];
  },

  async rewrites() {
    return [
      { source: "/app/home", destination: "/dashboard" },
      { source: "/app/text-to-speech", destination: "/text-to-speech" },
      { source: "/app/voices", destination: "/dashboard/voices" },
      { source: "/app/files", destination: "/dashboard/files" },
      { source: "/app/studio", destination: "/dashboard/studio" },
      { source: "/app/audiobooks", destination: "/dashboard/audiobooks" },
      { source: "/app/flows", destination: "/dashboard/flows" },
      { source: "/app/dubbing", destination: "/dashboard/dubbing" },
      { source: "/app/speech-to-text", destination: "/dashboard/speech-to-text" },
      { source: "/app/sound-effects", destination: "/dashboard/sound-effects" },
      { source: "/app/music", destination: "/dashboard/music" },
      { source: "/app/image-video", destination: "/dashboard/image-video" },
      { source: "/app/templates", destination: "/dashboard/templates" },
      { source: "/app/voice-changer", destination: "/dashboard/voice-changer" },
      { source: "/app/voice-isolator", destination: "/dashboard/voice-isolator" },
    ];
  },
};

export default nextConfig;
