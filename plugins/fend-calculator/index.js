// @bun
var __defProp = Object.defineProperty;
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

// src/currency.js
var ECB_RATES_URL = "https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml";
var UN_RATES_URL = "https://treasury.un.org/operationalrates/xsql2XML.php";
var currencyCache = null;
var currencyRatePromise = null;
var initCurrency = (cache) => {
  currencyCache = cache;
};
var _parseEcbRates = (xml) => {
  const rates = new Map([["EUR", 1]]);
  for (const line of xml.split(/\r?\n/)) {
    const l = line.trim();
    if (!l.startsWith("<Cube currency="))
      continue;
    const match = l.match(/^<Cube currency='([A-Z]{3})' rate='([^']+)'/);
    if (!match)
      continue;
    const [, currency, rateString] = match;
    const rate = Number.parseFloat(rateString);
    if (!Number.isFinite(rate) || rate <= 0) {
      throw new Error(`Invalid ECB exchange rate for ${currency}`);
    }
    rates.set(currency, rate);
  }
  if (rates.size < 10) {
    throw new Error("ECB exchange-rate response contained too few currencies");
  }
  return rates;
};
var _parseUnRates = (xml) => {
  const rates = new Map([["USD", 1]]);
  const start = xml.indexOf("<UN_OPERATIONAL_RATES>");
  if (start === -1) {
    throw new Error("UN exchange-rate response has no operational rates");
  }
  let data = xml.slice(start);
  while (data.length > 0) {
    const currencyStart = data.indexOf("<f_curr_code>");
    if (currencyStart === -1)
      break;
    data = data.slice(currencyStart + "<f_curr_code>".length);
    const currencyEnd = data.indexOf("</f_curr_code>");
    if (currencyEnd === -1) {
      throw new Error("Malformed UN currency code");
    }
    const currency = data.slice(0, currencyEnd).trim();
    data = data.slice(currencyEnd + "</f_curr_code>".length);
    const rateStart = data.indexOf("<rate>");
    if (rateStart === -1) {
      throw new Error(`Missing UN rate for ${currency}`);
    }
    data = data.slice(rateStart + "<rate>".length);
    const rateEnd = data.indexOf("</rate>");
    if (rateEnd === -1) {
      throw new Error(`Malformed UN rate for ${currency}`);
    }
    const rateString = data.slice(0, rateEnd).trim();
    const rate = Number.parseFloat(rateString);
    data = data.slice(rateEnd + "</rate>".length);
    if (!/^[A-Z]{3}$/.test(currency))
      continue;
    if (!Number.isFinite(rate) || rate <= 0) {
      throw new Error(`Invalid UN exchange rate for ${currency}`);
    }
    rates.set(currency, rate);
  }
  if (rates.size < 2) {
    throw new Error("UN exchange-rate response contained no currencies");
  }
  return rates;
};
var _normalizeToUsd = (rates, sourceBase) => {
  const baseToUsd = rates.get("USD");
  if (sourceBase === "USD") {
    return rates;
  }
  if (!Number.isFinite(baseToUsd) || baseToUsd <= 0) {
    throw new Error("Exchange-rate source does not provide USD");
  }
  const normalized = new Map;
  for (const [currency, rate] of rates) {
    if (!Number.isFinite(rate) || rate <= 0)
      continue;
    normalized.set(currency, baseToUsd / rate);
  }
  normalized.set("USD", 1);
  return normalized;
};
var _fetchEcbRates = async (doFetch) => {
  const response = await doFetch(ECB_RATES_URL);
  if (!response.ok) {
    throw new Error(`ECB request failed: HTTP ${response.status}`);
  }
  const xml = await response.text();
  return _normalizeToUsd(_parseEcbRates(xml), "EUR");
};
var _fetchUnRates = async (doFetch) => {
  const response = await doFetch(UN_RATES_URL);
  if (!response.ok) {
    throw new Error(`UN Treasury request failed: HTTP ${response.status}`);
  }
  const xml = await response.text();
  return _parseUnRates(xml);
};
var fetchCurrencyRates = async (doFetch) => {
  if (!currencyCache) {
    throw new Error("Currency system has not been initialized");
  }
  const cached = await currencyCache.get("rates");
  if (cached !== undefined && cached !== null) {
    return new Map(Object.entries(cached));
  }
  if (currencyRatePromise) {
    return currencyRatePromise;
  }
  currencyRatePromise = (async () => {
    try {
      try {
        const rates = await _fetchEcbRates(doFetch);
        await currencyCache.set("rates", Object.fromEntries(rates));
        return rates;
      } catch (ecbError) {
        console.warn("[fend-calculator] ECB exchange rates failed; trying UN Treasury:", ecbError);
      }
      const rates = await _fetchUnRates(doFetch);
      await currencyCache.set("rates", Object.fromEntries(rates));
      return rates;
    } finally {
      currencyRatePromise = null;
    }
  })();
  return currencyRatePromise;
};

// src/date.js
var _pad2 = (n) => String(n).padStart(2, "0");
var _formatFendDate = (date) => {
  return `@${date.getFullYear()}-${_pad2(date.getMonth() + 1)}-${_pad2(date.getDate())}`;
};
var _formatFendDateTime = (date) => {
  return `${_formatFendDate(date)} ${_pad2(date.getHours())}:${_pad2(date.getMinutes())}`;
};
var _addDays = (date, days) => {
  const out = new Date(date);
  out.setDate(out.getDate() + days);
  return out;
};
var dateCommands = (expression, now = new Date) => {
  const aliases = [
    [/\b(?:@)?tomorrow\b/gi, () => _formatFendDate(_addDays(now, 1))],
    [/\b(?:@)?yesterday\b/gi, () => _formatFendDate(_addDays(now, -1))],
    [/\b(?:@)?today\b/gi, () => _formatFendDate(now)],
    [/\b(?:@)?now\b/gi, () => _formatFendDateTime(now)]
  ];
  let result = expression;
  for (const [pattern, replacement] of aliases) {
    result = result.replace(pattern, replacement);
  }
  return result;
};

// src/index.js
var fendEnabled = true;
var doFetch = null;
var fendInitPromise = null;
var evalCache = null;
var MAX_EXPR_LEN = 300;
var EVAL_TIMEOUT = 500;
var _loadFend = async () => {
  if (!fendInitPromise) {
    fendInitPromise = (async () => {
      if (typeof __wbg_init === "function")
        await __wbg_init();
      const currencyData = await fetchCurrencyRates(doFetch);
      initialiseWithHandlers(currencyData);
      return exports_fend_wasm;
    })();
  }
  return fendInitPromise;
};
var _parseLanguage = (query) => {
  let expr = String(query || "").replace(/^(please\s+)?(calculate|compute|convert|evaluate|work out)\s+/i, "").replace(/^(what(?:'s| is)\s+)/i, "").replace(/\?+$/, "").trim();
  expr = expr.replace(/^(.+?)\s+plus\s+(.+)$/i, "$1 + $2").replace(/^(.+?)\s+minus\s+(.+)$/i, "$1 - $2").replace(/^(.+?)\s+(?:times|multiplied\s+by)\s+(.+)$/i, "$1 * $2").replace(/^(.+?)\s+(?:divided\s+by|over)\s+(.+)$/i, "$1 / $2").replace(/^square\s+root\s+of\s+(.+)$/i, "sqrt($1)").replace(/^cube\s+root\s+of\s+(.+)$/i, "cbrt($1)").replace(/^(.+?)\s+squared$/i, "($1)^2").replace(/^(.+?)\s+cubed$/i, "($1)^3").replace(/^(.+?)\s+to\s+the\s+power\s+of\s+(.+)$/i, "$1^($2)").replace(/^sine\s+of\s+(.+)$/i, "sin($1)").replace(/^cosine\s+of\s+(.+)$/i, "cos($1)").replace(/^tangent\s+of\s+(.+)$/i, "tan($1)").replace(/^natural\s+log(?:arithm)?\s+of\s+(.+)$/i, "ln($1)").replace(/^log(?:arithm)?\s+of\s+(.+)$/i, "log($1)").replace(/^log(?:arithm)?\s+base\s+2\s+of\s+(.+)$/i, "log2($1)").replace(/^absolute\s+value\s+of\s+(.+)$/i, "abs($1)").replace(/^(.+?)\s+factorial$/i, "$1!").replace(/^(.+?)\s+percent\s+of\s+(.+)$/i, "$1% of $2").replace(/\bdecimal\s+places?\b/gi, "dp");
  expr = dateCommands(expr);
  expr = expr.endsWith("=") ? expr.slice(0, -1).trim() : expr;
  return { expression: expr, raw: query };
};
var _isNoCacheExpression = (expr) => {
  let type = "calc";
  if (/^\s*roll\b/i.test(expr))
    type = "roll";
  if (/^\s*sample\b/i.test(expr))
    type = "sample";
  return type === "calc";
};
var _evaluate = async (query, timeout = EVAL_TIMEOUT) => {
  if (query.length > MAX_EXPR_LEN)
    return { ok: false, result: "" };
  const intent = _parseLanguage(query);
  const expr = intent.expression;
  const isNoCache = _isNoCacheExpression(expr);
  if (!expr)
    return { ok: false, result: "" };
  try {
    if (!isNoCache) {
      const cached = await evalCache.get(expr);
      if (cached !== undefined && cached !== null)
        return cached;
    }
    const fend = await _loadFend();
    const result = fend.evaluateFendWithTimeout(expr, timeout);
    if (typeof result !== "string" || !result) {
      return { ok: false, result: "", error: "Fend evaluation failed" };
    }
    if (result.startsWith("Error:")) {
      return { ok: false, result: "", error: result.trim() };
    }
    const out = { ok: true, result };
    if (!isNoCache) {
      await evalCache.set(expr, out);
    }
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
var _esc = (s) => {
  if (typeof s !== "string")
    return "";
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
};
var _calcHtml = (intent, result) => {
  return `<div class="fend-calc" data-fend-calc>
              <div class="fend-calc-screen">
                <input id="fend-calc-expression" name="expression" class="fend-calc-expr" type="text" value="${_esc(intent.expression)}" spellcheck="false" autocomplete="off" />
                <div class="fend-calc-result">${result ? `= ${_esc(result)}` : ""}</div>
              </div>
          </div>`;
};
var _json = (body, status = 200) => {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" }
  });
};
var _init = (ctx) => {
  evalCache = ctx.useCache("fend-eval", 30000);
  const currencyCache = ctx.useCache("fend-currency-rates", 259200000);
  initCurrency(currencyCache);
  doFetch = ctx.fetch ?? fetch;
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
    const intent = _parseLanguage(query);
    if (!intent?.expression)
      return false;
    const out = await _evaluate(intent.expression, 250);
    return out.ok;
  },
  async execute(query) {
    const intent = _parseLanguage(query);
    const out = await _evaluate(intent.expression);
    return { html: _calcHtml(intent, out.ok ? out.result : "") };
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
  async execute(args) {
    if (!fendEnabled) {
      return {
        title: "Fend",
        html: `<div class="command-result"><p>Fend is disabled.</p></div>`
      };
    }
    const intent = _parseLanguage(args);
    if (!intent?.expression) {
      return {
        title: "Fend",
        html: `<div class="command-result"><p>Usage: <code>!fend &lt;expression&gt;</code></p></div>`
      };
    }
    const out = await _evaluate(intent.expression);
    if (!out.ok) {
      return {
        title: "Fend",
        html: `<div class="command-result">
                  <p>Could not evaluate <code>${_esc(intent.expression)}</code></p>
              </div>`
      };
    }
    return {
      title: `Fend: ${args}`,
      html: _calcHtml(intent, out.result)
    };
  }
};
var routes = [
  {
    method: "get",
    path: "/eval",
    handler: async (req) => {
      if (!fendEnabled)
        return _json({ ok: false, error: "disabled" }, 403);
      if (req.length > MAX_EXPR_LEN) {
        return _json({ ok: false, error: "too-long" }, 400);
      }
      const expr = _parseLanguage(new URL(req.url).searchParams.get("expr") || "");
      if (!expr)
        return _json({ ok: false, error: "empty" }, 400);
      const out = await _evaluate(expr.expression);
      return _json(out);
    }
  }
];
export {
  command,
  plugin,
  routes,
  slot
};
