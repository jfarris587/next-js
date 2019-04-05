const withTypescript = require("@zeit/next-typescript");

require("dotenv").config();

const path = require("path");
const Dotenv = require("dotenv-webpack");

module.exports = withTypescript({
  distDir: "../build",
  useFileSystemPublicRoutes: false,
  webpack: config => {
    config.plugins = config.plugins || [];

    config.plugins = [
      ...config.plugins,

      // Read the .env file
      new Dotenv({
        path: path.join(__dirname, ".env"),
        systemvars: true
      })
    ];

    return config;
  }
});
