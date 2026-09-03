const yaml = require("js-yaml");

module.exports = function (eleventyConfig) {
  eleventyConfig.addDataExtension("yml", (contents) => yaml.load(contents));

  eleventyConfig.addPassthroughCopy({ "src/styles.css": "styles.css" });
  eleventyConfig.addPassthroughCopy({ "src/script.js": "script.js" });
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });
  eleventyConfig.addPassthroughCopy({ "admin": "admin" });
  eleventyConfig.addPassthroughCopy({ "src/prace.html": "prace.html" });
  eleventyConfig.ignores.add("src/prace.html");

  eleventyConfig.addCollection("projects", (api) =>
    api.getFilteredByGlob("src/projects/*.md").sort((a, b) => a.data.order - b.data.order)
  );

  eleventyConfig.addCollection("projectPages", (api) => {
    // prev/next navigation follows the fixed project number sequence (0001→0002→…→circular),
    // independent of the curated gallery display `order`
    const byNumber = api
      .getFilteredByGlob("src/projects/*.md")
      .sort((a, b) => a.data.number.localeCompare(b.data.number))
      .map((p) => p.data);
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
