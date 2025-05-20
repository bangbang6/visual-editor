const path = require("path");
const isProduction = process.env.NODE_ENV === "production";
module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        vue: path.resolve("./node_modules/vue"),
      },
    },
  },
  publicPath: isProduction ? "/" : "/",
};
