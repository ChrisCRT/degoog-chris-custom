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
    fendInitPromise = import("fend-wasm").then(async (mod) => {
      if (typeof mod.default === "function") await mod.default();
      return mod;
    });
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

export const slot = {
  isClientExposed: false,
  id: "fend-calculator",
  name: "Fend",
  position: "at-a-glance",
  description:
    "Arbitrary-precision natural-language unit-aware calculator powered by fend.",

  settingsSchema: [
    {
      key: "enabled",
      label: "Enabled",
      type: "toggle",
    },
  ],

  init(ctx) {
    evalCache = ctx.useCache("fend-eval", 30_000);
  },

  configure(settings) {
    fendEnabled = settings?.enabled !== "false";
  },

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

export default { slot, routes };
