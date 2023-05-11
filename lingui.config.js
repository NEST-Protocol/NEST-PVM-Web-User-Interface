module.exports = {
    locales: ["en", "pt", "ja", "ko", "ru"],
    sourceLocale: "en",
    catalogs: [{
       path: "src/locales/{locale}/messages",
       include: ["src"]
    }],
    format: "po"
 }