const { detectLanguage } = require("./detector");
const { parse } = require("./parser");

function normalise(query, options = {}) {
  const text = String(query || "").trim();
  if (!text) return "";

  const language =
    options.language ||
    options.languageCode ||
    detectLanguage(text, { defaultLanguage: options.defaultLanguage }) ||
    "en";
  const result = parse(text, { ...options, language });

  switch (result.type) {
    case "conversion":
      return {
        language: result.language,
        type: result.type,
        original: text,
        expression: `${result.value} ${result.sourceUnit} to ${result.targetUnit}`,
        value: result.value,
        sourceUnit: result.sourceUnit,
        targetUnit: result.targetUnit,
        cacheable: true,
      };

    case "expression":
      return {
        language: result.language,
        type: result.type,
        original: text,
        expression: stripTrailingEquals(result.expression),
        cacheable: result.cacheable !== false,
      };

    case "raw":
      return {
        language: result.language,
        type: result.type,
        original: text,
        expression: stripTrailingEquals(result.value),
        cacheable: true,
      };

    default:
      return {
        language,
        type: "raw",
        original: text,
        expression: stripTrailingEquals(text),
      };
  }
}

function stripTrailingEquals(value) {
  if (typeof value !== "string") return "";
  return value.endsWith("=") ? value.slice(0, -1).trim() : value.trim();
}

module.exports = {
  normalise,
};
