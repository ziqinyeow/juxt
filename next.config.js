/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push({
      // https://github.com/vercel/next.js/issues/44273
      "utf-8-validate": "commonjs utf-8-validate",
      bufferutil: "commonjs bufferutil",
      // sharp: "commonjs sharp",
      canvas: "commonjs canvas",
    });
    return config;
  },
};

module.exports = nextConfig;
