const { getLanguage } = require("./vocabulary");

function parse(query, options = {}) {
  const text = String(query || "").trim();
  if (!text) return null;

  const languageCode = options.language || options.languageCode || null;
  const language = getLanguage(languageCode || "en");
  if (!language) throw new Error(`Unsupported language: ${languageCode}`);

  const cleaned = cleanup(text, language);

  const precision = parsePrecision(cleaned, language);
  if (precision) {
    return {
      type: "expression",
      language: language.code,
      expression: precision,
    };
  }

  const conversion = parseConversion(cleaned, language);
  if (conversion) {
    return {
      type: "conversion",
      language: language.code,
      ...conversion,
    };
  }

  const expression = parseExpression(cleaned, language);
  if (expression) {
    return {
      type: "expression",
      language: language.code,
      expression,
      cacheable: isCacheableExpression(cleaned, expression, language),
    };
  }

  return {
    type: "raw",
    language: language.code,
    value: cleaned,
  };
}

function cleanup(text, language) {
  let result = text.trim();
  if (language.cleanup?.leadingCommands) {
    result = result.replace(language.cleanup.leadingCommands, "");
  }
  if (language.cleanup?.leadingQuestions) {
    result = result.replace(language.cleanup.leadingQuestions, "");
  }
  result = result.replace(/\?+$/, "").trim();

  return result;
}

function parsePrecision(text, language) {
  const decimals = language.rounding?.decimals || [];
  const toMarkers = language.conversion?.markers?.to || [];
  if (!decimals.length || !toMarkers.length) return null;

  const decimalPattern = [...decimals]
    .sort((a, b) => b.length - a.length)
    .map(escapeRegExp)
    .join("|");
  const markerPattern = [...toMarkers]
    .sort((a, b) => b.length - a.length)
    .map(escapeRegExp)
    .join("|");
  const regex = new RegExp(
    `^(.+?)\\s+(?:${markerPattern})\\s+(\\d+)\\s+(?:${decimalPattern})$`,
    "i",
  );

  const match = text.match(regex);
  if (!match) return null;

  return `${match[1].trim()} to ${match[2]} dp`;
}

function parseConversion(text, language) {
  const markers = language.conversion?.markers || {};
  const markerWords = [
    ...(markers.to || []),
    ...(markers.in || []),
    ...(markers.as || []),
  ];
  if (!markerWords.length) return null;
  markerWords.sort((a, b) => b.length - a.length);

  const markerPattern = markerWords.map(escapeRegExp).join("|");
  const regex = new RegExp(`^(.+?)\\s+(?:${markerPattern})\\s+(.+?)$`, "i");

  const match = text.match(regex);
  if (!match) return null;

  const left = match[1].trim();
  const targetUnit = match[2].trim();

  const source = parseValueAndUnit(left);
  if (!source) return null;

  return {
    value: source.value,
    sourceUnit: source.unit,
    targetUnit,
  };
}

function parseValueAndUnit(text) {
  const match = text.match(/^(.+?)\s+([a-zA-Z°µμΩ]+(?:\/[a-zA-Z°µμΩ]+)?)$/i);
  if (!match) return null;

  return {
    value: match[1].trim(),
    unit: match[2].trim(),
  };
}

function parseExpression(text, language) {
  let result = text;

  // operators
  result = replacePhrase(result, language.operators?.multiply || [], " * ");
  result = replacePhrase(result, language.operators?.divide || [], " / ");
  result = replacePhrase(result, language.operators?.plus || [], " + ");
  result = replacePhrase(result, language.operators?.minus || [], " - ");

  // functions
  result = replaceFunction(result, language.functions?.sqrt || [], "sqrt");
  result = replaceFunction(result, language.functions?.cbrt || [], "cbrt");
  result = replaceFunction(result, language.functions?.sin || [], "sin");
  result = replaceFunction(result, language.functions?.cos || [], "cos");
  result = replaceFunction(result, language.functions?.tan || [], "tan");
  result = replaceFunction(result, language.functions?.ln || [], "ln");
  result = replaceFunction(result, language.functions?.log2 || [], "log2");
  result = replaceFunction(result, language.functions?.log || [], "log");
  result = replaceFunction(result, language.functions?.abs || [], "abs");

  // powers
  result = replaceSuffix(
    result,
    language.suffixes?.squared || [],
    (value) => `(${value})^2`,
  );
  result = replaceSuffix(
    result,
    language.suffixes?.cubed || [],
    (value) => `(${value})^3`,
  );
  result = replaceBinaryPhrase(
    result,
    language.power || [],
    (base, exponent) => `${base}^(${exponent})`,
  );

  // factorial
  result = replaceSuffix(
    result,
    language.suffixes?.factorial || [],
    (value) => `${value}!`,
  );

  // percentages
  result = replaceBinaryPhrase(
    result,
    language.percentage || [],
    (value, base) => `${value}% of ${base}`,
  );

  return result.trim();
}

function replaceSuffix(text, phrases, replacement) {
  const sorted = [...phrases].sort((a, b) => b.length - a.length);
  for (const phrase of sorted) {
    const regex = new RegExp(`^(.+?)\\s+${escapeRegExp(phrase)}$`, "i");
    const match = text.match(regex);
    if (match) {
      return replacement(match[1].trim());
    }
  }

  return text;
}

function replaceBinaryPhrase(text, phrases, replacer) {
  const sorted = [...phrases].sort((a, b) => b.length - a.length);
  for (const phrase of sorted) {
    const regex = new RegExp(`^(.+?)\\s+${escapeRegExp(phrase)}\\s+(.+)$`, "i");
    const match = text.match(regex);
    if (match) {
      return replacer(match[1].trim(), match[2].trim());
    }
  }

  return text;
}

function replacePhrase(text, phrases, replacement) {
  const sorted = [...phrases].sort((a, b) => b.length - a.length);
  for (const phrase of sorted) {
    const regex = new RegExp(`\\b${escapeRegExp(phrase)}\\b`, "gi");
    text = text.replace(regex, replacement);
  }

  return text;
}

function replaceFunction(text, phrases, functionName) {
  const sorted = [...phrases].sort((a, b) => b.length - a.length);
  for (const phrase of sorted) {
    const regex = new RegExp(`^${escapeRegExp(phrase)}\\s+(.+)$`, "i");
    const match = text.match(regex);
    if (match) {
      return `${functionName}(${match[1]})`;
    }
  }

  return text;
}

function isCacheableExpression(original, expression, language) {
  if (/\b\d*d\d+\b/i.test(expression)) {
    return false;
  }

  const dynamicWords = [
    ...(language.dynamic?.random || []),
    ...(language.dynamic?.dateTime || []),
  ];

  return !dynamicWords.some((word) => {
    const pattern = new RegExp(
      `(?:^|\\s)${escapeRegExp(word)}(?=\\s|$|[?!.,])`,
      "i",
    );
    return pattern.test(original);
  });
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

module.exports = {
  parse,
};
