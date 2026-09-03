const i18n = require("./i18n.js");

function navFor(lang) {
  return lang === "en"
    ? {
        home: "/en/index.html",
        prace: "/en/index.html#prace",
        atelier: "/en/atelier.html",
        kontakt: "/en/kontakt.html",
        founder: "/en/viktor-krkoska.html",
      }
    : {
        home: "/index.html",
        prace: "/index.html#prace",
        atelier: "/atelier.html",
        kontakt: "/kontakt.html",
        founder: "/viktor-krkoska.html",
      };
}

module.exports = {
  t: (data) => i18n[data.lang || "sk"],
  nav: (data) => navFor(data.lang || "sk"),
};
