/* eslint-env node */

module.exports = {
  extends: [
    "stylelint-config-standard",
    "stylelint-config-recommended-vue",
    "stylelint-config-prettier",
  ],
  rules: {
    "declaration-no-important": true,
  },
  ignoreFiles: ["node_modules/**/*.css", "src/**/*.js"],
};
