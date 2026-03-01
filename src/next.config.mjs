import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  output: 'export',
  reactStrictMode: true,
  // Set Base Path for GitHub Pages
  // If your repo is 'https://github.com/username/my-docs', set this to '/my-docs'
  // If your repo is 'https://github.com/username/username.github.io', set this to ''
  // FIXME: make this build-dependent: for local dev env it must be empty?
  basePath: '/florete',

  // Required for Static Export with Next.js Images
  images: {
    unoptimized: true,
  },

  // Ensure trailing slashes work well with GH Pages
  trailingSlash: true,
};

export default withMDX(config);
