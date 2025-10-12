import path from "path";

export default {
  // eslint-disable-next-line no-unused-vars
  process(sourceText, sourcePath, options) {
    return {
      code: `module.exports = ${JSON.stringify(path.basename(sourcePath))};`,
    };
  },
};
