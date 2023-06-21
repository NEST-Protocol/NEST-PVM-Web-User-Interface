module.exports = {
   locales: ["en", "pt", "ja", "ko", "ru", "vi"],
   sourceLocale: "en",
   catalogs: [{
      path: "src/locales/{locale}/messages",
      include: ['src'],
   }],
   format: "po",
   fallbackLocales: {
      default: 'en',
   },
   formatOptions: {
      lineNumbers: false,
   },
   rootDir: '.',
}