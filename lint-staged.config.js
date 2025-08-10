/**
 * @type {import('lint-staged').Configuration}
 */
export default {
  "!(*.ts)": "prettier --write",
  "*.ts": ["oxlint", "prettier --write"]
};
