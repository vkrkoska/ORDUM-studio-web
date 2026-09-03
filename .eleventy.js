const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

function loadProjects() {
  const dir = path.join(__dirname, "src/_data/projects");
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".yml"))
    .map((f) => yaml.load(fs.readFileSync(path.join(dir, f), "utf8")));
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addDataExtension("yml", (contents) => yaml.load(contents));

  eleventyConfig.addPassthroughCopy({ "src/styles.css": "styles.css" });
  eleventyConfig.addPassthroughCopy({ "src/script.js": "script.js" });
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });
  eleventyConfig.addPassthroughCopy({ "admin": "admin" });
  eleventyConfig.addPassthroughCopy({ "src/prace.html": "prace.html" });
  eleventyConfig.ignores.add("src/prace.html");

  eleventyConfig.addCollection("projects", () =>
    loadProjects().sort((a, b) => a.order - b.order)
  );

  eleventyConfig.addCollection("projectPages", () => {
    // prev/next navigation follows the fixed project number sequence (0001→0002→…→circular),
    // independent of the curated gallery display `order`
    const byNumber = loadProjects().sort((a, b) => a.number.localeCompare(b.number));
    const pages = [];
    for (const locale of ["sk", "en"]) {
      byNumber.forEach((project, i) => {
        pages.push({
          locale,
          project,
          prev: byNumber[(i - 1 + byNumber.length) % byNumber.length],
          next: byNumber[(i + 1) % byNumber.length],
        });
      });
    }
    return pages;
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
