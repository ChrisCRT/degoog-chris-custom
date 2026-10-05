const { getLanguages } = require("./vocabulary");

function detectLanguage(query, options = {}) {
  const text = String(query || "")
    .trim()
    .toLowerCase();
  if (!text) return null;

  const languages = getLanguages();
  let bestLanguage = null;
  let bestScore = 0;

  for (const language of Object.values(languages)) {
    let score = 0;
    for (const word of language.detection || []) {
      const escaped = escapeRegExp(word);
      const pattern = new RegExp(`(?:^|\\s)${escaped}(?=\\s|$|[?!.,])`, "i");
      if (pattern.test(text)) score++;
    }

    if (score > bestScore) {
      bestScore = score;
      bestLanguage = language.code;
    }
  }

  if (!bestLanguage) {
    return options.defaultLanguage || null;
  }

  return bestLanguage;
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

module.exports = {
  detectLanguage,
};
