// @bun
var __create = Object.create;
var __getProtoOf = Object.getPrototypeOf;
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __hasOwnProp = Object.prototype.hasOwnProperty;
function __accessProp(key) {
  return this[key];
}
var __toESMCache_node;
var __toESMCache_esm;
var __toESM = (mod, isNodeMode, target) => {
  var canCache = mod != null && typeof mod === "object";
  if (canCache) {
    var cache = isNodeMode ? __toESMCache_node ??= new WeakMap : __toESMCache_esm ??= new WeakMap;
    var cached = cache.get(mod);
    if (cached)
      return cached;
  }
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  if (mod && typeof mod === "object" || typeof mod === "function") {
    for (let key of __getOwnPropNames(mod))
      if (!__hasOwnProp.call(to, key))
        __defProp(to, key, {
          get: __accessProp.bind(mod, key),
          enumerable: true
        });
  }
  if (canCache)
    cache.set(mod, to);
  return to;
};
var __toCommonJS = (from) => {
  var entry = (__moduleCache ??= new WeakMap).get(from), desc;
  if (entry)
    return entry;
  entry = __defProp({}, "__esModule", { value: true });
  if (from && typeof from === "object" || typeof from === "function") {
    for (var key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(entry, key))
        __defProp(entry, key, {
          get: __accessProp.bind(from, key),
          enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
        });
  }
  __moduleCache.set(from, entry);
  return entry;
};
var __moduleCache;
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var __returnValue = (v) => v;
function __exportSetter(name, newValue) {
  this[name] = __returnValue.bind(null, newValue);
}
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: __exportSetter.bind(all, name)
    });
};
var __esm = (fn, res, err) => () => {
  if (fn)
    try {
      res = fn(fn = 0);
    } catch (e) {
      err = [e];
    }
  if (err)
    throw err[0];
  return res;
};

// natural-language/languages/en.js
var exports_en = {};
__export(exports_en, {
  default: () => en_default
});
var en_default;
var init_en = __esm(() => {
  en_default = {
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
      "places"
    ],
    conversion: {
      markers: {
        to: ["to"],
        in: ["in"],
        as: ["as"]
      },
      patterns: [["VALUE", "SOURCE_UNIT", "MARKER", "TARGET_UNIT"]]
    },
    operators: {
      plus: ["plus"],
      minus: ["minus"],
      multiply: ["times", "multiplied by"],
      divide: ["divided by", "over"]
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
      abs: ["absolute value of"]
    },
    suffixes: {
      squared: ["squared"],
      cubed: ["cubed"],
      factorial: ["factorial"]
    },
    power: ["to the power of"],
    percentage: ["percent of"],
    rounding: {
      integer: ["round"],
      decimals: ["decimal place", "decimal places", "dp"]
    },
    dynamic: {
      random: ["roll", "sample", "random"],
      dateTime: ["today", "tomorrow", "yesterday", "now"]
    },
    cleanup: {
      leadingCommands: /^(please\s+)?(calculate|compute|evaluate|work\s+out)\s+/i,
      leadingQuestions: /^what(?:'s| is)\s+/i
    },
    output: {
      locale: "en-GB",
      ui: {
        disabled: "Fend is disabled.",
        usage: "Usage: !fend <expression>",
        tooLong: "Expression is too long.",
        couldNotEvaluate: "Could not evaluate"
      }
    }
  };
});

// natural-language/vocabulary.js
var require_vocabulary = __commonJS(function(exports, module) {
  var languages = {
    en: (init_en(), __toCommonJS(exports_en))
  };
  function getLanguage(language) {
    if (!language)
      return null;
    const code = String(language).toLowerCase();
    return languages[code] || null;
  }
  function getLanguages() {
    return { ...languages };
  }
  module.exports = {
    getLanguage,
    getLanguages
  };
});

// natural-language/detector.js
var require_detector = __commonJS(function(exports, module) {
  var { getLanguages } = require_vocabulary();
  function detectLanguage(query, options = {}) {
    const text = String(query || "").trim().toLowerCase();
    if (!text)
      return null;
    const languages = getLanguages();
    let bestLanguage = null;
    let bestScore = 0;
    for (const language of Object.values(languages)) {
      let score = 0;
      for (const word of language.detection || []) {
        const escaped = escapeRegExp(word);
        const pattern = new RegExp(`(?:^|\\s)${escaped}(?=\\s|$|[?!.,])`, "i");
        if (pattern.test(text))
          score++;
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
    detectLanguage
  };
});

// natural-language/parser.js
var require_parser = __commonJS(function(exports, module) {
  var { getLanguage } = require_vocabulary();
  function parse(query, options = {}) {
    const text = String(query || "").trim();
    if (!text)
      return null;
    const languageCode = options.language || options.languageCode || null;
    const language = getLanguage(languageCode || "en");
    if (!language)
      throw new Error(`Unsupported language: ${languageCode}`);
    const cleaned = cleanup(text, language);
    const precision = parsePrecision(cleaned, language);
    if (precision) {
      return {
        type: "expression",
        language: language.code,
        expression: precision
      };
    }
    const conversion = parseConversion(cleaned, language);
    if (conversion) {
      return {
        type: "conversion",
        language: language.code,
        ...conversion
      };
    }
    const expression = parseExpression(cleaned, language);
    if (expression) {
      return {
        type: "expression",
        language: language.code,
        expression,
        cacheable: isCacheableExpression(cleaned, expression, language)
      };
    }
    return {
      type: "raw",
      language: language.code,
      value: cleaned
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
    if (!decimals.length || !toMarkers.length)
      return null;
    const decimalPattern = [...decimals].sort((a, b) => b.length - a.length).map(escapeRegExp).join("|");
    const markerPattern = [...toMarkers].sort((a, b) => b.length - a.length).map(escapeRegExp).join("|");
    const regex = new RegExp(`^(.+?)\\s+(?:${markerPattern})\\s+(\\d+)\\s+(?:${decimalPattern})$`, "i");
    const match = text.match(regex);
    if (!match)
      return null;
    return `${match[1].trim()} to ${match[2]} dp`;
  }
  function parseConversion(text, language) {
    const markers = language.conversion?.markers || {};
    const markerWords = [
      ...markers.to || [],
      ...markers.in || [],
      ...markers.as || []
    ];
    if (!markerWords.length)
      return null;
    markerWords.sort((a, b) => b.length - a.length);
    const markerPattern = markerWords.map(escapeRegExp).join("|");
    const regex = new RegExp(`^(.+?)\\s+(?:${markerPattern})\\s+(.+?)$`, "i");
    const match = text.match(regex);
    if (!match)
      return null;
    const left = match[1].trim();
    const targetUnit = match[2].trim();
    const source = parseValueAndUnit(left);
    if (!source)
      return null;
    return {
      value: source.value,
      sourceUnit: source.unit,
      targetUnit
    };
  }
  function parseValueAndUnit(text) {
    const match = text.match(/^(.+?)\s+([a-zA-Z\u00B0\u00B5\u03BC\u03A9]+(?:\/[a-zA-Z\u00B0\u00B5\u03BC\u03A9]+)?)$/i);
    if (!match)
      return null;
    return {
      value: match[1].trim(),
      unit: match[2].trim()
    };
  }
  function parseExpression(text, language) {
    let result = text;
    result = replacePhrase(result, language.operators?.multiply || [], " * ");
    result = replacePhrase(result, language.operators?.divide || [], " / ");
    result = replacePhrase(result, language.operators?.plus || [], " + ");
    result = replacePhrase(result, language.operators?.minus || [], " - ");
    result = replaceFunction(result, language.functions?.sqrt || [], "sqrt");
    result = replaceFunction(result, language.functions?.cbrt || [], "cbrt");
    result = replaceFunction(result, language.functions?.sin || [], "sin");
    result = replaceFunction(result, language.functions?.cos || [], "cos");
    result = replaceFunction(result, language.functions?.tan || [], "tan");
    result = replaceFunction(result, language.functions?.ln || [], "ln");
    result = replaceFunction(result, language.functions?.log2 || [], "log2");
    result = replaceFunction(result, language.functions?.log || [], "log");
    result = replaceFunction(result, language.functions?.abs || [], "abs");
    result = replaceSuffix(result, language.suffixes?.squared || [], (value) => `(${value})^2`);
    result = replaceSuffix(result, language.suffixes?.cubed || [], (value) => `(${value})^3`);
    result = replaceBinaryPhrase(result, language.power || [], (base, exponent) => `${base}^(${exponent})`);
    result = replaceSuffix(result, language.suffixes?.factorial || [], (value) => `${value}!`);
    result = replaceBinaryPhrase(result, language.percentage || [], (value, base) => `${value}% of ${base}`);
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
      ...language.dynamic?.random || [],
      ...language.dynamic?.dateTime || []
    ];
    return !dynamicWords.some((word) => {
      const pattern = new RegExp(`(?:^|\\s)${escapeRegExp(word)}(?=\\s|$|[?!.,])`, "i");
      return pattern.test(original);
    });
  }
  function escapeRegExp(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  module.exports = {
    parse
  };
});

// natural-language/normalise.js
var require_normalise = __commonJS(function(exports, module) {
  var { detectLanguage } = require_detector();
  var { parse } = require_parser();
  function normalise(query, options = {}) {
    const text = String(query || "").trim();
    if (!text)
      return "";
    const language = options.language || options.languageCode || detectLanguage(text, { defaultLanguage: options.defaultLanguage }) || "en";
    const result = parse(text, {
      ...options,
      language
    });
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
          cacheable: true
        };
      case "expression":
        return {
          language: result.language,
          type: result.type,
          original: text,
          expression: stripTrailingEquals(result.expression),
          cacheable: result.cacheable !== false
        };
      case "raw":
        return {
          language: result.language,
          type: result.type,
          original: text,
          expression: stripTrailingEquals(result.value),
          cacheable: true
        };
      default:
        return {
          language,
          type: "raw",
          original: text,
          expression: stripTrailingEquals(text)
        };
    }
  }
  function stripTrailingEquals(value) {
    if (typeof value !== "string") {
      return "";
    }
    return value.endsWith("=") ? value.slice(0, -1).trim() : value.trim();
  }
  module.exports = {
    normalise
  };
});

// natural-language/index.js
var require_natural_language = __commonJS(function(exports, module) {
  var { detectLanguage } = require_detector();
  var { parse } = require_parser();
  var { normalise } = require_normalise();
  module.exports = {
    detectLanguage,
    parse,
    normalise
  };
});

// node_modules/fend-wasm-web/fend_wasm.js
var exports_fend_wasm = {};
__export(exports_fend_wasm, {
  default: () => __wbg_init,
  evaluateFendWithTimeout: () => evaluateFendWithTimeout,
  evaluateFendWithTimeoutMultiple: () => evaluateFendWithTimeoutMultiple,
  evaluateFendWithVariablesJson: () => evaluateFendWithVariablesJson,
  evaluate_fend_with_timeout: () => evaluate_fend_with_timeout,
  initSync: () => initSync,
  initialiseWithHandlers: () => initialiseWithHandlers,
  substituteInlineFendExpressions: () => substituteInlineFendExpressions
});
function evaluateFendWithTimeout(input, timeout) {
  let deferred2_0;
  let deferred2_1;
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
    const ptr0 = passStringToWasm0(input, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    const len0 = WASM_VECTOR_LEN;
    wasm.evaluateFendWithTimeout(retptr, ptr0, len0, timeout);
    var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
    var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
    deferred2_0 = r0;
    deferred2_1 = r1;
    return getStringFromWasm0(r0, r1);
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16);
    wasm.__wbindgen_export4(deferred2_0, deferred2_1, 1);
  }
}
function evaluateFendWithTimeoutMultiple(inputs, timeout) {
  let deferred2_0;
  let deferred2_1;
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
    const ptr0 = passStringToWasm0(inputs, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    const len0 = WASM_VECTOR_LEN;
    wasm.evaluateFendWithTimeoutMultiple(retptr, ptr0, len0, timeout);
    var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
    var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
    deferred2_0 = r0;
    deferred2_1 = r1;
    return getStringFromWasm0(r0, r1);
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16);
    wasm.__wbindgen_export4(deferred2_0, deferred2_1, 1);
  }
}
function evaluateFendWithVariablesJson(input, timeout, variables) {
  let deferred3_0;
  let deferred3_1;
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
    const ptr0 = passStringToWasm0(input, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(variables, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    const len1 = WASM_VECTOR_LEN;
    wasm.evaluateFendWithVariablesJson(retptr, ptr0, len0, timeout, ptr1, len1);
    var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
    var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
    deferred3_0 = r0;
    deferred3_1 = r1;
    return getStringFromWasm0(r0, r1);
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16);
    wasm.__wbindgen_export4(deferred3_0, deferred3_1, 1);
  }
}
function evaluate_fend_with_timeout(input, timeout) {
  let deferred2_0;
  let deferred2_1;
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
    const ptr0 = passStringToWasm0(input, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    const len0 = WASM_VECTOR_LEN;
    wasm.evaluate_fend_with_timeout(retptr, ptr0, len0, timeout);
    var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
    var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
    deferred2_0 = r0;
    deferred2_1 = r1;
    return getStringFromWasm0(r0, r1);
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16);
    wasm.__wbindgen_export4(deferred2_0, deferred2_1, 1);
  }
}
function initialiseWithHandlers(currency_data) {
  wasm.initialiseWithHandlers(addHeapObject(currency_data));
}
function substituteInlineFendExpressions(input, timeout) {
  let deferred2_0;
  let deferred2_1;
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
    const ptr0 = passStringToWasm0(input, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    const len0 = WASM_VECTOR_LEN;
    wasm.substituteInlineFendExpressions(retptr, ptr0, len0, timeout);
    var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
    var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
    deferred2_0 = r0;
    deferred2_1 = r1;
    return getStringFromWasm0(r0, r1);
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16);
    wasm.__wbindgen_export4(deferred2_0, deferred2_1, 1);
  }
}
function __wbg_get_imports() {
  const import0 = {
    __proto__: null,
    __wbg___wbindgen_is_undefined_9e4d92534c42d778: function(arg0) {
      const ret = getObject(arg0) === undefined;
      return ret;
    },
    __wbg___wbindgen_number_get_8ff4255516ccad3e: function(arg0, arg1) {
      const obj = getObject(arg1);
      const ret = typeof obj === "number" ? obj : undefined;
      getDataViewMemory0().setFloat64(arg0 + 8 * 1, isLikeNone(ret) ? 0 : ret, true);
      getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
    },
    __wbg___wbindgen_string_get_72fb696202c56729: function(arg0, arg1) {
      const obj = getObject(arg1);
      const ret = typeof obj === "string" ? obj : undefined;
      var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_export, wasm.__wbindgen_export2);
      var len1 = WASM_VECTOR_LEN;
      getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
      getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    },
    __wbg___wbindgen_throw_be289d5034ed271b: function(arg0, arg1) {
      throw new Error(getStringFromWasm0(arg0, arg1));
    },
    __wbg_call_389efe28435a9388: function() {
      return handleError(function(arg0, arg1) {
        const ret = getObject(arg0).call(getObject(arg1));
        return addHeapObject(ret);
      }, arguments);
    },
    __wbg_forEach_415aeaf425d269a4: function(arg0, arg1, arg2) {
      try {
        var state0 = { a: arg1, b: arg2 };
        var cb0 = (arg0, arg1) => {
          const a = state0.a;
          state0.a = 0;
          try {
            return __wasm_bindgen_func_elem_2377(a, state0.b, arg0, arg1);
          } finally {
            state0.a = a;
          }
        };
        getObject(arg0).forEach(cb0);
      } finally {
        state0.a = state0.b = 0;
      }
    },
    __wbg_getTime_1e3cd1391c5c3995: function(arg0) {
      const ret = getObject(arg0).getTime();
      return ret;
    },
    __wbg_getTimezoneOffset_81776d10a4ec18a8: function(arg0) {
      const ret = getObject(arg0).getTimezoneOffset();
      return ret;
    },
    __wbg_new_0_73afc35eb544e539: function() {
      const ret = new Date;
      return addHeapObject(ret);
    },
    __wbg_new_no_args_1c7c842f08d00ebb: function(arg0, arg1) {
      const ret = new Function(getStringFromWasm0(arg0, arg1));
      return addHeapObject(ret);
    },
    __wbg_now_2c95c9de01293173: function(arg0) {
      const ret = getObject(arg0).now();
      return ret;
    },
    __wbg_performance_7a3ffd0b17f663ad: function(arg0) {
      const ret = getObject(arg0).performance;
      return addHeapObject(ret);
    },
    __wbg_random_912284dbf636f269: function() {
      const ret = Math.random();
      return ret;
    },
    __wbg_static_accessor_GLOBAL_12837167ad935116: function() {
      const ret = typeof global === "undefined" ? null : global;
      return isLikeNone(ret) ? 0 : addHeapObject(ret);
    },
    __wbg_static_accessor_GLOBAL_THIS_e628e89ab3b1c95f: function() {
      const ret = typeof globalThis === "undefined" ? null : globalThis;
      return isLikeNone(ret) ? 0 : addHeapObject(ret);
    },
    __wbg_static_accessor_SELF_a621d3dfbb60d0ce: function() {
      const ret = typeof self === "undefined" ? null : self;
      return isLikeNone(ret) ? 0 : addHeapObject(ret);
    },
    __wbg_static_accessor_WINDOW_f8727f0cf888e0bd: function() {
      const ret = typeof window === "undefined" ? null : window;
      return isLikeNone(ret) ? 0 : addHeapObject(ret);
    },
    __wbindgen_object_clone_ref: function(arg0) {
      const ret = getObject(arg0);
      return addHeapObject(ret);
    },
    __wbindgen_object_drop_ref: function(arg0) {
      takeObject(arg0);
    }
  };
  return {
    __proto__: null,
    "./fend_wasm_bg.js": import0
  };
}
function __wasm_bindgen_func_elem_2377(arg0, arg1, arg2, arg3) {
  wasm.__wasm_bindgen_func_elem_2377(arg0, arg1, addHeapObject(arg2), addHeapObject(arg3));
}
function addHeapObject(obj) {
  if (heap_next === heap.length)
    heap.push(heap.length + 1);
  const idx = heap_next;
  heap_next = heap[idx];
  heap[idx] = obj;
  return idx;
}
function dropObject(idx) {
  if (idx < 132)
    return;
  heap[idx] = heap_next;
  heap_next = idx;
}
var cachedDataViewMemory0 = null;
function getDataViewMemory0() {
  if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer) {
    cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
  }
  return cachedDataViewMemory0;
}
function getStringFromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  return decodeText(ptr, len);
}
var cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
  if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
    cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
  }
  return cachedUint8ArrayMemory0;
}
function getObject(idx) {
  return heap[idx];
}
function handleError(f, args) {
  try {
    return f.apply(this, args);
  } catch (e) {
    wasm.__wbindgen_export3(addHeapObject(e));
  }
}
var heap = new Array(128).fill(undefined);
heap.push(undefined, null, true, false);
var heap_next = heap.length;
function isLikeNone(x) {
  return x === undefined || x === null;
}
function passStringToWasm0(arg, malloc, realloc) {
  if (realloc === undefined) {
    const buf = cachedTextEncoder.encode(arg);
    const ptr = malloc(buf.length, 1) >>> 0;
    getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
    WASM_VECTOR_LEN = buf.length;
    return ptr;
  }
  let len = arg.length;
  let ptr = malloc(len, 1) >>> 0;
  const mem = getUint8ArrayMemory0();
  let offset = 0;
  for (;offset < len; offset++) {
    const code = arg.charCodeAt(offset);
    if (code > 127)
      break;
    mem[ptr + offset] = code;
  }
  if (offset !== len) {
    if (offset !== 0) {
      arg = arg.slice(offset);
    }
    ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
    const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
    const ret = cachedTextEncoder.encodeInto(arg, view);
    offset += ret.written;
    ptr = realloc(ptr, len, offset, 1) >>> 0;
  }
  WASM_VECTOR_LEN = offset;
  return ptr;
}
function takeObject(idx) {
  const ret = getObject(idx);
  dropObject(idx);
  return ret;
}
var cachedTextDecoder = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
var MAX_SAFARI_DECODE_BYTES = 2146435072;
var numBytesDecoded = 0;
function decodeText(ptr, len) {
  numBytesDecoded += len;
  if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
    cachedTextDecoder = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true });
    cachedTextDecoder.decode();
    numBytesDecoded = len;
  }
  return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}
var cachedTextEncoder = new TextEncoder;
if (!("encodeInto" in cachedTextEncoder)) {
  cachedTextEncoder.encodeInto = function(arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
      read: arg.length,
      written: buf.length
    };
  };
}
var WASM_VECTOR_LEN = 0;
var wasmModule;
var wasm;
function __wbg_finalize_init(instance, module) {
  wasm = instance.exports;
  wasmModule = module;
  cachedDataViewMemory0 = null;
  cachedUint8ArrayMemory0 = null;
  return wasm;
}
async function __wbg_load(module, imports) {
  if (typeof Response === "function" && module instanceof Response) {
    if (typeof WebAssembly.instantiateStreaming === "function") {
      try {
        return await WebAssembly.instantiateStreaming(module, imports);
      } catch (e) {
        const validResponse = module.ok && expectedResponseType(module.type);
        if (validResponse && module.headers.get("Content-Type") !== "application/wasm") {
          console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);
        } else {
          throw e;
        }
      }
    }
    const bytes = await module.arrayBuffer();
    return await WebAssembly.instantiate(bytes, imports);
  } else {
    const instance = await WebAssembly.instantiate(module, imports);
    if (instance instanceof WebAssembly.Instance) {
      return { instance, module };
    } else {
      return instance;
    }
  }
  function expectedResponseType(type) {
    switch (type) {
      case "basic":
      case "cors":
      case "default":
        return true;
    }
    return false;
  }
}
function initSync(module) {
  if (wasm !== undefined)
    return wasm;
  if (module !== undefined) {
    if (Object.getPrototypeOf(module) === Object.prototype) {
      ({ module } = module);
    } else {
      console.warn("using deprecated parameters for `initSync()`; pass a single object instead");
    }
  }
  const imports = __wbg_get_imports();
  if (!(module instanceof WebAssembly.Module)) {
    module = new WebAssembly.Module(module);
  }
  const instance = new WebAssembly.Instance(module, imports);
  return __wbg_finalize_init(instance, module);
}
async function __wbg_init(module_or_path) {
  if (wasm !== undefined)
    return wasm;
  if (module_or_path !== undefined) {
    if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
      ({ module_or_path } = module_or_path);
    } else {
      console.warn("using deprecated parameters for the initialization function; pass a single object instead");
    }
  }
  if (module_or_path === undefined) {
    module_or_path = new URL("fend_wasm_bg.wasm", import.meta.url);
  }
  const imports = __wbg_get_imports();
  if (typeof module_or_path === "string" || typeof Request === "function" && module_or_path instanceof Request || typeof URL === "function" && module_or_path instanceof URL) {
    module_or_path = fetch(module_or_path);
  }
  const { instance, module } = await __wbg_load(await module_or_path, imports);
  return __wbg_finalize_init(instance, module);
}

// src/index.js
var import_natural_language = __toESM(require_natural_language(), 1);
var import_vocabulary = __toESM(require_vocabulary(), 1);
var fendInitPromise = null;
var evalCache = null;
var fendEnabled = true;
var MAX_EXPR_LEN = 300;
var EVAL_TIMEOUT = 500;
var CALC_KEYS = [
  ["C", "(", ")", "back"],
  ["7", "8", "9", "/"],
  ["4", "5", "6", "*"],
  ["1", "2", "3", "-"],
  ["0", ".", "^", "+"],
  ["sqrt(", "%", ",", "="]
];
var KEY_LABEL = {
  "/": "\xF7",
  "*": "\xD7",
  "-": "\u2212",
  "sqrt(": "\u221A",
  back: "\u232B"
};
var _esc = (s) => {
  if (typeof s !== "string")
    return "";
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
};
var CALC_KEYS_HTML = CALC_KEYS.map((row) => {
  const keys = row.map((k) => {
    const label = KEY_LABEL[k] ?? k;
    const cls = k === "=" ? "fend-calc-key fend-calc-eq" : k === "C" || k === "back" ? "fend-calc-key fend-calc-fn" : "fend-calc-key";
    return `<button type="button" class="${cls}" data-k="${_esc(k)}">${_esc(label)}</button>`;
  }).join("");
  return `<div class="fend-calc-row">${keys}</div>`;
}).join("");
var _loadFend = async () => {
  if (!fendInitPromise) {
    fendInitPromise = (async () => {
      if (typeof __wbg_init === "function")
        await __wbg_init();
      return exports_fend_wasm;
    })();
  }
  return fendInitPromise;
};
var _getRollSides = (expression) => {
  if (typeof expression !== "string")
    return null;
  const s = expression.trim().toLowerCase();
  const dice = s.match(/(?:^|\s)(\d*)d(\d+)\b/);
  if (!dice)
    return null;
  const sides = Number(dice[2]);
  return Number.isInteger(sides) && sides > 0 ? sides : null;
};
var _getLanguage = (parsed) => {
  if (!parsed?.language)
    return import_vocabulary.getLanguage("en");
  return import_vocabulary.getLanguage(parsed.language) || import_vocabulary.getLanguage("en");
};
var _normalise = (input, language) => {
  const parsed = import_natural_language.normalise(input, { language: language || undefined });
  if (!parsed || !parsed.expression)
    return null;
  return parsed;
};
var _evaluate = async (parsed, timeout = EVAL_TIMEOUT) => {
  if (!parsed?.expression || parsed.expression.length > MAX_EXPR_LEN) {
    return { ok: false, result: "" };
  }
  const expression = parsed.expression;
  const cacheable = parsed.cacheable !== false;
  const cacheKey = `${parsed.language || "en"}:${parsed.expression}`;
  try {
    if (cacheable && evalCache) {
      const cached = await evalCache.get(cacheKey);
      if (cached !== undefined && cached !== null)
        return cached;
    }
    const fend = await _loadFend();
    const result = fend.evaluateFendWithTimeout(expression, timeout);
    if (typeof result !== "string" || !result)
      return { ok: false, result: "" };
    if (result.startsWith("Error:")) {
      return { ok: false, result: "", error: result.trim() };
    }
    const out = { ok: true, result };
    if (cacheable && evalCache)
      await evalCache.set(cacheKey, out);
    return out;
  } catch (err) {
    console.error("[fend-calculator] Fend evaluation failed:", err);
    return {
      ok: false,
      result: "",
      error: err instanceof Error ? err.message : String(err)
    };
  }
};
var _formatNumber = (result, language) => {
  if (typeof result !== "string" || !result) {
    return result || "";
  }
  const decimalSeparator = language?.output?.number?.decimalSeparator;
  if (typeof decimalSeparator !== "string" || decimalSeparator.length !== 1 || decimalSeparator === ".") {
    return result;
  }
  if (/^-?(?:\d+|\d*\.\d+)$/.test(result.trim())) {
    return result.replace(".", decimalSeparator);
  }
  return result;
};
var _formatResult = (result, parsed) => {
  if (!result || !parsed) {
    return result || "";
  }
  const language = _getLanguage(parsed);
  return _formatNumber(result, language);
};
var _getUi = (parsed) => {
  const language = _getLanguage(parsed);
  return language?.output?.ui || {
    disabled: "Fend is disabled.",
    usage: "Usage: !fend <expression>",
    tooLong: "Expression is too long.",
    couldNotEvaluate: "Could not evaluate"
  };
};
var _rollHtml = () => `
  <div class="fend-die-wrap" data-fend-die>
    <div class="fend-die" data-fend-die-value>?</div>
    <div class="fend-die-shadow"></div>
  </div>
`;
var _calcHtml = (expression, result) => {
  const isRoll = _getRollSides(expression) !== null;
  return `
  <div class="fend-calc" data-fend-calc>
    <div class="fend-calc-screen">
      <input id="fend-calc-expression" name="expression" class="fend-calc-expr" type="text" value="${_esc(expression)}" spellcheck="false" autocomplete="off" />
      <div class="fend-calc-result" data-fend-calc-result>
        ${isRoll ? _rollHtml() : result ? `= ${_esc(result)}` : ""}
      </div>
    </div>
    <div class="fend-calc-keys">${CALC_KEYS_HTML}</div>
  </div>
  `;
};
var _json = (body, status = 200) => {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" }
  });
};
var _init = (ctx) => {
  evalCache = ctx.useCache("fend-eval", 30000);
};
var _configure = (settings) => {
  fendEnabled = settings?.enabled !== "false";
};
var plugin = {
  id: "fend-calculator",
  name: "Fend Calculator",
  description: "Arbitrary-precision natural-language unit-aware calculator powered by fend.",
  settingsSchema: [
    {
      key: "enabled",
      label: "Enabled",
      type: "toggle"
    }
  ]
};
var slot = {
  isClientExposed: false,
  name: "Fend Calculator",
  description: "Arbitrary-precision natural-language unit-aware calculator powered by fend.",
  position: "at-a-glance",
  settingsSchema: [],
  init: _init,
  configure: _configure,
  async trigger(query) {
    if (!fendEnabled || query.length > MAX_EXPR_LEN)
      return false;
    const parsed = _normalise(query);
    if (!parsed?.expression) {
      return false;
    }
    const out = await _evaluate(parsed, 250);
    return out.ok;
  },
  async execute(query, context) {
    const parsed = _normalise(query, context?.lang);
    if (!parsed?.expression) {
      return {
        html: _calcHtml(typeof query === "string" ? query : "", "")
      };
    }
    const out = await _evaluate(parsed);
    const result = out.ok ? _formatResult(out.result, parsed) : "";
    return {
      html: _calcHtml(parsed.original || parsed.expression, result)
    };
  }
};
var command = {
  isClientExposed: false,
  name: "Fend Calculator",
  description: "Arbitrary-precision natural-language unit-aware calculator powered by fend.",
  trigger: "fend",
  aliases: ["calc", "calculate", "math"],
  settingsSchema: [],
  init: _init,
  configure: _configure,
  async execute(args, context) {
    if (!fendEnabled) {
      const language = import_vocabulary.getLanguage(context?.lang || "en");
      const ui = language?.output?.ui || {};
      return {
        title: "Fend Calculator",
        html: `<div class="command-result">
                 <p>${_esc(ui.disabled || "Fend is disabled.")}</p>
               </div>`
      };
    }
    const parsed = _normalise(args, context?.lang);
    const ui = _getUi(parsed);
    if (!parsed?.expression) {
      return {
        title: "Fend Calculator",
        html: `<div class="command-result">
                 <p>${_esc(ui.usage || "Usage: !fend <expression>")}</p>
               </div>`
      };
    }
    if (parsed.expression.length > MAX_EXPR_LEN) {
      return {
        title: "Fend Calculator",
        html: `<div class="command-result">
                <p>${_esc(ui.tooLong || "Expression is too long.")}</p>
              </div>`
      };
    }
    const out = await _evaluate(parsed);
    if (!out.ok) {
      return {
        title: "Fend Calculator",
        html: `<div class="command-result">
                <p>${_esc(ui.couldNotEvaluate || "Could not evaluate")}
                  <code>
                    ${_esc(parsed.original || parsed.expression)}
                  </code>
                </p>
              </div>`
      };
    }
    const result = _formatResult(out.result, parsed);
    return {
      title: "Fend Calculator",
      html: `<div class="command-result">
               <div class="fend-query">
                 ${_esc(parsed.original || parsed.expression)}
               </div>
               <div class="fend-equals">=</div>
               <div class="fend-result">
                 ${_esc(result)}
               </div>
             </div>`
    };
  }
};
var routes = [
  {
    method: "get",
    path: "/eval",
    handler: async (req) => {
      if (!fendEnabled) {
        return _json({ ok: false, error: "disabled" }, 403);
      }
      const input = new URL(req.url).searchParams.get("expr") || "";
      if (input.length > MAX_EXPR_LEN) {
        return _json({ ok: false, error: "too-long" }, 400);
      }
      const parsed = _normalise(input);
      if (!parsed?.expression) {
        return _json({ ok: false, error: "empty" }, 400);
      }
      const out = await _evaluate(parsed);
      if (!out.ok) {
        return _json({
          ok: false,
          error: "evaluation-failed",
          language: parsed.language,
          type: parsed.type,
          original: parsed.original,
          expression: parsed.expression
        });
      }
      return _json({
        ...out,
        language: parsed.language,
        type: parsed.type,
        original: parsed.original,
        expression: parsed.expression,
        result: _formatResult(out.result, parsed)
      });
    }
  }
];
export {
  command,
  plugin,
  routes,
  slot
};
