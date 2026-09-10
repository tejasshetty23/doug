/** @type {import('next').NextConfig} */
const nextConfig = {
  // hide the Next.js dev badge in the corner (dev-only; never shipped in a build)
  devIndicators: false,
  images: {
    // hero art is rendered large; 90 keeps the pixel-art detail crisp
    qualities: [75, 90],
  },
};
export default nextConfig;
