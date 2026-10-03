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

// node_modules/fend-wasm/fend_wasm_bg.wasm
var exports_fend_wasm_bg = {};
__export(exports_fend_wasm_bg, {
  default: () => fend_wasm_bg_default
});
var fend_wasm_bg_default = "./fend_wasm_bg-bd06cps5.wasm";
var init_fend_wasm_bg = () => {};

// node_modules/fend-wasm/fend_wasm_bg.js
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
function addHeapObject(obj) {
  if (heap_next === heap.length)
    heap.push(heap.length + 1);
  const idx = heap_next;
  heap_next = heap[idx];
  heap[idx] = obj;
  return idx;
}
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
function getUint8ArrayMemory0() {
  if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
    cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
  }
  return cachedUint8ArrayMemory0;
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
function decodeText(ptr, len) {
  numBytesDecoded += len;
  if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
    cachedTextDecoder = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true });
    cachedTextDecoder.decode();
    numBytesDecoded = len;
  }
  return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}
function __wbg_set_wasm(val) {
  wasm = val;
}
var cachedDataViewMemory0 = null, cachedUint8ArrayMemory0 = null, heap, heap_next, cachedTextDecoder, MAX_SAFARI_DECODE_BYTES = 2146435072, numBytesDecoded = 0, cachedTextEncoder, WASM_VECTOR_LEN = 0, wasm;
var init_fend_wasm_bg2 = __esm(() => {
  heap = new Array(128).fill(undefined);
  heap.push(undefined, null, true, false);
  heap_next = heap.length;
  cachedTextDecoder = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true });
  cachedTextDecoder.decode();
  cachedTextEncoder = new TextEncoder;
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
});

// node_modules/fend-wasm/fend_wasm.js
var exports_fend_wasm = {};
__export(exports_fend_wasm, {
  evaluateFendWithTimeout: () => evaluateFendWithTimeout,
  evaluateFendWithTimeoutMultiple: () => evaluateFendWithTimeoutMultiple,
  evaluateFendWithVariablesJson: () => evaluateFendWithVariablesJson,
  evaluate_fend_with_timeout: () => evaluate_fend_with_timeout,
  initialiseWithHandlers: () => initialiseWithHandlers,
  substituteInlineFendExpressions: () => substituteInlineFendExpressions
});
var init_fend_wasm = __esm(() => {
  init_fend_wasm_bg();
  init_fend_wasm_bg2();
  init_fend_wasm_bg2();
  __wbg_set_wasm(exports_fend_wasm_bg);
});

// src/index.js
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
    fendInitPromise = Promise.resolve().then(() => (init_fend_wasm(), exports_fend_wasm));
  }
  return fendInitPromise;
};
var _normalise = (expr) => {
  const input = String(expr || "").trim();
  if (!input)
    return "";
  return input.endsWith("=") ? input.slice(0, -1).trim() : input;
};
var _evaluate = async (expr, timeout = EVAL_TIMEOUT) => {
  if (!expr || expr.length > MAX_EXPR_LEN)
    return { ok: false, result: "" };
  const cached = await evalCache.get(expr);
  if (cached !== undefined && cached !== null)
    return cached;
  const fend = await _loadFend();
  const result = fend.evaluateFendWithTimeout(expr, timeout);
  if (typeof result !== "string" || !result)
    return { ok: false, result: "" };
  if (result.startsWith("Error:")) {
    return { ok: false, result: "", error: result.trim() };
  }
  const out = { ok: true, result };
  await evalCache.set(expr, out);
  return out;
};
var _calcHtml = (expr, result) => {
  return `<div class="fend-calc" data-fend-calc>
  <div class="fend-calc-screen">
    <input class="fend-calc-expr" type="text" value="${_esc(expr)}" spellcheck="false" autocomplete="off" />
    <div class="fend-calc-result">${result ? `= ${_esc(result)}` : ""}</div>
  </div>
  <div class="fend-calc-keys">${CALC_KEYS_HTML}</div>
</div>`;
};
var _json = (body, status = 200) => {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" }
  });
};
var slot = {
  isClientExposed: false,
  id: "fend-calculator",
  name: "Fend",
  position: "at-a-glance",
  description: "Arbitrary-precision natural-language unit-aware calculator powered by fend.",
  settingsSchema: [
    {
      key: "enabled",
      label: "Enabled",
      type: "toggle"
    }
  ],
  init(ctx) {
    evalCache = ctx.useCache("fend-eval", 30000);
  },
  configure(settings) {
    fendEnabled = settings?.enabled !== "false";
  },
  async trigger(query) {
    if (!fendEnabled)
      return false;
    const expr = _normalise(query);
    if (!expr || expr.length > MAX_EXPR_LEN)
      return false;
    const out = await _evaluate(expr, 250);
    return out.ok;
  },
  async execute(query) {
    const expr = _normalise(query);
    const out = await _evaluate(expr);
    return { html: _calcHtml(expr, out.ok ? out.result : "") };
  }
};
var routes = [
  {
    method: "get",
    path: "/eval",
    handler: async (req) => {
      if (!fendEnabled)
        return _json({ ok: false, error: "disabled" }, 403);
      const expr = _normalise(new URL(req.url).searchParams.get("expr") || "");
      if (!expr)
        return _json({ ok: false, error: "empty" }, 400);
      if (expr.length > MAX_EXPR_LEN) {
        return _json({ ok: false, error: "too-long" }, 400);
      }
      const out = await _evaluate(expr);
      return _json(out);
    }
  }
];
var src_default = { slot, routes };
export {
  src_default as default,
  routes,
  slot
};
