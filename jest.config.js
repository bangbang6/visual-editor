module.exports = {
  preset: "@vue/cli-plugin-unit-jest/presets/typescript-and-babel", //将vue SFC进行转化为能读懂的js ts也能转成js
  transformIgnorePatterns: ["<rootDir>/node_modules/(?!lodash-es|rgb-hex)"],
};
