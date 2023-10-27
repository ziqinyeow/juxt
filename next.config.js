/** @type {import('next').NextConfig} */
// For building on vercel: https://github.com/Automattic/node-canvas/issues/1779
// if (
//   process.env.LD_LIBRARY_PATH == null ||
//   !process.env.LD_LIBRARY_PATH.includes(
//     `${process.env.PWD}/node_modules/canvas/build/Release:`
//   )
// ) {
//   process.env.LD_LIBRARY_PATH = `${
//     process.env.PWD
//   }/node_modules/canvas/build/Release:${process.env.LD_LIBRARY_PATH || ""}`;
// }
const nextConfig = {
  // reactStrictMode: false,
  webpack: (config) => {
    config.externals.push({
      // https://github.com/vercel/next.js/issues/44273
      "utf-8-validate": "commonjs utf-8-validate",
      bufferutil: "commonjs bufferutil",
      // sharp: "commonjs sharp",
      canvas: "commonjs canvas",
    });
    // config.infrastructureLogging = { debug: /PackFileCache/ };
    return config;
  },
  // ignoreBuildErrors: true,
};

module.exports = nextConfig;
