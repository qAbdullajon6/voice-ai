import type { NextConfig } from "next";
import { config as loadEnv } from "dotenv";
import { join } from "path";

loadEnv({ path: join(process.cwd(), "..", "..", ".env") });

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
