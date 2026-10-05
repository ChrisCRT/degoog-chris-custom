const languages = {
  en: require("./languages/en"),
};

function getLanguage(language) {
  if (!language) return null;
  const code = String(language).toLowerCase();
  return languages[code] || null;
}

function getLanguages() {
  return { ...languages };
}

module.exports = {
  getLanguage,
  getLanguages,
};
