import * as fendModule from "fend-wasm-web";

let fendInitPromise = null;
let evalCache = null;
let fendEnabled = true;

const MAX_EXPR_LEN = 300;
const EVAL_TIMEOUT = 500;

const CALC_KEYS = [
  ["C", "(", ")", "back"],
  ["7", "8", "9", "/"],
  ["4", "5", "6", "*"],
  ["1", "2", "3", "-"],
  ["0", ".", "^", "+"],
  ["sqrt(", "%", ",", "="],
];

const KEY_LABEL = {
  "/": "÷",
  "*": "×",
  "-": "−",
  "sqrt(": "√",
  back: "⌫",
};

const _esc = (s) => {
  if (typeof s !== "string") return "";
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const CALC_KEYS_HTML = CALC_KEYS.map((row) => {
  const keys = row
    .map((k) => {
      const label = KEY_LABEL[k] ?? k;
      const cls =
        k === "="
          ? "fend-calc-key fend-calc-eq"
          : k === "C" || k === "back"
            ? "fend-calc-key fend-calc-fn"
            : "fend-calc-key";
      return `<button type="button" class="${cls}" data-k="${_esc(k)}">${_esc(label)}</button>`;
    })
    .join("");
  return `<div class="fend-calc-row">${keys}</div>`;
}).join("");

const _loadFend = async () => {
  if (!fendInitPromise) {
    fendInitPromise = (async () => {
      if (typeof fendModule.default === "function") await fendModule.default();
      return fendModule;
    })();
  }
  return fendInitPromise;
};

const _normalise = (expr) => {
  const input = String(expr || "").trim();
  if (!input) return "";
  return input.endsWith("=") ? input.slice(0, -1).trim() : input;
};

const _evaluate = async (expr, timeout = EVAL_TIMEOUT) => {
  if (!expr || expr.length > MAX_EXPR_LEN) return { ok: false, result: "" };

  try {
    const cached = await evalCache.get(expr);
    if (cached !== undefined && cached !== null) return cached;

    const fend = await _loadFend();
    const result = fend.evaluateFendWithTimeout(expr, timeout);
    if (typeof result !== "string" || !result) return { ok: false, result: "" };
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
      error: err instanceof Error ? err.message : String(err),
    };
  }
};

const _calcHtml = (expr, result) => {
  return `<div class="fend-calc" data-fend-calc>
              <div class="fend-calc-screen">
                <input class="fend-calc-expr" type="text" value="${_esc(expr)}" spellcheck="false" autocomplete="off" />
                <div class="fend-calc-result">${result ? `= ${_esc(result)}` : ""}</div>
              </div>
              <div class="fend-calc-keys">${CALC_KEYS_HTML}</div>
          </div>`;
};

const _json = (body, status = 200) => {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
};

const _init = (ctx) => {
  evalCache = ctx.useCache("fend-eval", 30_000);
};

const _configure = (settings) => {
  fendEnabled = settings?.enabled !== "false";
};

export const plugin = {
  id: "fend-calculator",
  name: "Fend Calculator",
  description:
    "Arbitrary-precision natural-language unit-aware calculator powered by fend.",

  settingsSchema: [
    {
      key: "enabled",
      label: "Enabled",
      type: "toggle",
    },
  ],
};

export const slot = {
  isClientExposed: false,
  name: "Fend Calculator",
  description:
    "Arbitrary-precision natural-language unit-aware calculator powered by fend.",
  position: "at-a-glance",

  settingsSchema: [],

  init: _init,
  configure: _configure,

  async trigger(query) {
    if (!fendEnabled) return false;
    const expr = _normalise(query);
    if (!expr || expr.length > MAX_EXPR_LEN) return false;
    const out = await _evaluate(expr, 250);
    return out.ok;
  },

  async execute(query) {
    const expr = _normalise(query);
    const out = await _evaluate(expr);
    return { html: _calcHtml(expr, out.ok ? out.result : "") };
  },
};

export const command = {
  isClientExposed: false,
  name: "Fend Calculator",
  description:
    "Arbitrary-precision natural-language unit-aware calculator powered by fend.",
  trigger: "fend",
  aliases: ["calc", "calculate", "math"],

  settingsSchema: [],

  init: _init,
  configure: _configure,

  async execute(args) {
    if (!fendEnabled) {
      return {
        title: "Fend",
        html: `<div class="command-result"><p>Fend is disabled.</p></div>`,
      };
    }

    const expr = _normalise(args);
    if (!expr) {
      return {
        title: "Fend",
        html: `<div class="command-result"><p>Usage: <code>!fend &lt;expression&gt;</code></p></div>`,
      };
    }

    const out = await _evaluate(expr);
    if (!out.ok) {
      return {
        title: "Fend",
        html: `<div class="command-result">
                  <p>Could not evaluate <code>${_esc(expr)}</code></p>
              </div>`,
      };
    }

    return {
      title: `Fend: ${expr}`,
      html: `<div class="command-result">
                <div class="fend-query">${_esc(expr)}</div>
                <div class="fend-equals">=</div>
                <div class="fend-result">${_esc(out.result)}</div>
            </div>`,
    };
  },
};

export const routes = [
  {
    method: "get",
    path: "/eval",
    handler: async (req) => {
      if (!fendEnabled) return _json({ ok: false, error: "disabled" }, 403);

      const expr = _normalise(new URL(req.url).searchParams.get("expr") || "");
      if (!expr) return _json({ ok: false, error: "empty" }, 400);
      if (expr.length > MAX_EXPR_LEN) {
        return _json({ ok: false, error: "too-long" }, 400);
      }

      const out = await _evaluate(expr);
      return _json(out);
    },
  },
];
