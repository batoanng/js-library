import createBundleAnalyzer from '@next/bundle-analyzer'
import path from 'path'
import { fileURLToPath } from 'url'

const withBundleAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const projectDirectory = path.dirname(fileURLToPath(import.meta.url))

/** @type{import('next').NextConfig} */
const config = {
  experimental: {
    outputFileTracingRoot: path.join(projectDirectory, '../..'),
  },
  reactStrictMode: true,
  swcMinify: true,
}

export default withBundleAnalyzer(config)
