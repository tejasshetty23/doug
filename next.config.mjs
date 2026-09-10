/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // hero art is rendered large; 90 keeps the pixel-art detail crisp
    qualities: [75, 90],
  },
};
export default nextConfig;
