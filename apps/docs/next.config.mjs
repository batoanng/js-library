import createBundleAnalyzer from '@next/bundle-analyzer';
import path from 'path';
import { fileURLToPath } from 'url';

const withBundleAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const projectDirectory = path.dirname(fileURLToPath(import.meta.url));
const isStaticExport = process.env.NEXT_STATIC_EXPORT === 'true';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.replace(/\/$/, '') ?? '';

/** @type{import('next').NextConfig} */
const config = {
  outputFileTracingRoot: path.join(projectDirectory, '../..'),
  ...(isStaticExport
    ? {
        output: 'export',
        trailingSlash: true,
        basePath: basePath || undefined,
        images: {
          unoptimized: true,
        },
      }
    : {}),
  reactStrictMode: true,
};

export default withBundleAnalyzer(config);
