import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  output: 'export',
  reactStrictMode: true,

  // Required for Static Export with Next.js Images
  images: {
    unoptimized: true,
  },

  // Ensure trailing slashes work well with GH Pages
  trailingSlash: true,
};

export default withMDX(config);
