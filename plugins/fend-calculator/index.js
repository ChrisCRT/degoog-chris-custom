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
    fendInitPromise = (async () => {
      if (typeof __wbg_init === "function")
        await __wbg_init();
      return exports_fend_wasm;
    })();
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
  try {
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
  } catch (err) {
    console.error("[fend-calculator] Fend evaluation failed:", err);
    return {
      ok: false,
      result: "",
      error: err instanceof Error ? err.message : String(err)
    };
  }
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
    const expr = _normalise(args);
    if (!expr) {
      return {
        title: "Fend",
        html: `<div class="command-result"><p>Usage: <code>!fend &lt;expression&gt;</code></p></div>`
      };
    }
    const out = await _evaluate(expr);
    if (!out.ok) {
      return {
        title: "Fend",
        html: `<div class="command-result">
                  <p>Could not evaluate <code>${_esc(expr)}</code></p>
              </div>`
      };
    }
    return {
      title: `Fend: ${expr}`,
      html: `<div class="command-result">
                <div class="fend-query">${_esc(expr)}</div>
                <div class="fend-equals">=</div>
                <div class="fend-result">${_esc(out.result)}</div>
            </div>`
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
var src_default = { slot, command, routes };
export {
  command,
  src_default as default,
  plugin,
  routes,
  slot
};
