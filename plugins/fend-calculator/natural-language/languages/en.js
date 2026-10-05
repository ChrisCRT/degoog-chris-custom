export default {
  code: "en",
  name: "English",

  detection: [
    "to",
    "in",
    "as",
    "plus",
    "minus",
    "times",
    "over",
    "divided",
    "by",
    "calculate",
    "compute",
    "evaluate",
    "what",
    "is",
    "square",
    "root",
    "cube",
    "squared",
    "cubed",
    "power",
    "sine",
    "cosine",
    "tangent",
    "log",
    "logarithm",
    "natural",
    "absolute",
    "value",
    "factorial",
    "percent",
    "of",
    "round",
    "decimal",
    "places",
  ],

  conversion: {
    markers: {
      to: ["to"],
      in: ["in"],
      as: ["as"],
    },

    patterns: [["VALUE", "SOURCE_UNIT", "MARKER", "TARGET_UNIT"]],
  },

  operators: {
    plus: ["plus"],
    minus: ["minus"],
    multiply: ["times", "multiplied by"],
    divide: ["divided by", "over"],
  },

  functions: {
    sqrt: ["square root of"],
    cbrt: ["cube root of"],
    sin: ["sine of"],
    cos: ["cosine of"],
    tan: ["tangent of"],
    ln: ["natural log of", "natural logarithm of"],
    log: ["log of", "logarithm of"],
    log2: ["log base 2 of", "logarithm base 2 of"],
    abs: ["absolute value of"],
  },

  suffixes: {
    squared: ["squared"],
    cubed: ["cubed"],
    factorial: ["factorial"],
  },

  power: ["to the power of"],

  percentage: ["percent of"],

  rounding: {
    integer: ["round"],
    decimals: ["decimal place", "decimal places", "dp"],
  },

  dynamic: {
    random: ["roll", "sample", "random"],
    dateTime: ["today", "tomorrow", "yesterday", "now"],
  },

  cleanup: {
    leadingCommands: /^(please\s+)?(calculate|compute|evaluate|work\s+out)\s+/i,
    leadingQuestions: /^what(?:'s| is)\s+/i,
  },

  output: {
    locale: "en-GB",

    ui: {
      disabled: "Fend is disabled.",
      usage: "Usage: !fend <expression>",
      tooLong: "Expression is too long.",
      couldNotEvaluate: "Could not evaluate",
    },
  },
};
