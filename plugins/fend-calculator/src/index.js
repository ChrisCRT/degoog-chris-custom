import * as fendModule from "fend-wasm-web";
import { initCurrency, fetchCurrencyRates } from "./currency";
import { dateCommands } from "./date";

let fendEnabled = true;
let doFetch = null;
let fendInitPromise = null;
let evalCache = null;

const MAX_EXPR_LEN = 300;
const EVAL_TIMEOUT = 500;

const _loadFend = async () => {
  if (!fendInitPromise) {
    fendInitPromise = (async () => {
      if (typeof fendModule.default === "function") await fendModule.default();
      const currencyData = await fetchCurrencyRates(doFetch);
      fendModule.initialiseWithHandlers(currencyData);
      return fendModule;
    })();
  }
  return fendInitPromise;
};

const _parseLanguage = (query) => {
  let expr = String(query || "")
    .replace(
      /^(please\s+)?(calculate|compute|convert|evaluate|work out)\s+/i,
      "",
    )
    .replace(/^(what(?:'s| is)\s+)/i, "")
    .replace(/\?+$/, "")
    .trim();

  expr = expr
    .replace(/^(.+?)\s+plus\s+(.+)$/i, "$1 + $2")
    .replace(/^(.+?)\s+minus\s+(.+)$/i, "$1 - $2")
    .replace(/^(.+?)\s+(?:times|multiplied\s+by)\s+(.+)$/i, "$1 * $2")
    .replace(/^(.+?)\s+(?:divided\s+by|over)\s+(.+)$/i, "$1 / $2")
    .replace(/^square\s+root\s+of\s+(.+)$/i, "sqrt($1)")
    .replace(/^cube\s+root\s+of\s+(.+)$/i, "cbrt($1)")
    .replace(/^(.+?)\s+squared$/i, "($1)^2")
    .replace(/^(.+?)\s+cubed$/i, "($1)^3")
    .replace(/^(.+?)\s+to\s+the\s+power\s+of\s+(.+)$/i, "$1^($2)")
    .replace(/^sine\s+of\s+(.+)$/i, "sin($1)")
    .replace(/^cosine\s+of\s+(.+)$/i, "cos($1)")
    .replace(/^tangent\s+of\s+(.+)$/i, "tan($1)")
    .replace(/^natural\s+log(?:arithm)?\s+of\s+(.+)$/i, "ln($1)")
    .replace(/^log(?:arithm)?\s+of\s+(.+)$/i, "log($1)")
    .replace(/^log(?:arithm)?\s+base\s+2\s+of\s+(.+)$/i, "log2($1)")
    .replace(/^absolute\s+value\s+of\s+(.+)$/i, "abs($1)")
    .replace(/^(.+?)\s+factorial$/i, "$1!")
    .replace(/^(.+?)\s+percent\s+of\s+(.+)$/i, "$1% of $2")
    .replace(/\bdecimal\s+places?\b/gi, "dp");

  expr = dateCommands(expr);

  expr = expr.endsWith("=") ? expr.slice(0, -1).trim() : expr;

  return { expression: expr, raw: query };
};

const _isNoCacheExpression = (expr) => {
  let type = "calc";
  if (/^\s*roll\b/i.test(expr)) type = "roll";
  if (/^\s*sample\b/i.test(expr)) type = "sample";

  return type === "calc";
};

const _evaluate = async (query, timeout = EVAL_TIMEOUT) => {
  if (query.length > MAX_EXPR_LEN) return { ok: false, result: "" };
  const intent = _parseLanguage(query);
  const expr = intent.expression;
  const isNoCache = _isNoCacheExpression(expr);
  if (!expr) return { ok: false, result: "" };

  try {
    if (!isNoCache) {
      const cached = await evalCache.get(expr);
      if (cached !== undefined && cached !== null) return cached;
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
      error: err instanceof Error ? err.message : String(err),
    };
  }
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

const _calcHtml = (intent, result) => {
  return `<div class="fend-calc" data-fend-calc>
              <div class="fend-calc-screen">
                <input id="fend-calc-expression" name="expression" class="fend-calc-expr" type="text" value="${_esc(intent.expression)}" spellcheck="false" autocomplete="off" />
                <div class="fend-calc-result">${result ? `= ${_esc(result)}` : ""}</div>
              </div>
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

  const currencyCache = ctx.useCache("fend-currency-rates", 259_200_000);
  initCurrency(currencyCache);

  doFetch = ctx.fetch ?? fetch;
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
    if (!fendEnabled || query.length > MAX_EXPR_LEN) return false;
    const intent = _parseLanguage(query);
    if (!intent?.expression) return false;
    const out = await _evaluate(intent.expression, 250);
    return out.ok;
  },

  async execute(query) {
    const intent = _parseLanguage(query);
    const out = await _evaluate(intent.expression);
    return { html: _calcHtml(intent, out.ok ? out.result : "") };
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

    const intent = _parseLanguage(args);
    if (!intent?.expression) {
      return {
        title: "Fend",
        html: `<div class="command-result"><p>Usage: <code>!fend &lt;expression&gt;</code></p></div>`,
      };
    }

    const out = await _evaluate(intent.expression);
    if (!out.ok) {
      return {
        title: "Fend",
        html: `<div class="command-result">
                  <p>Could not evaluate <code>${_esc(intent.expression)}</code></p>
              </div>`,
      };
    }

    return {
      title: `Fend: ${args}`,
      html: _calcHtml(intent, out.result),
    };
  },
};

export const routes = [
  {
    method: "get",
    path: "/eval",
    handler: async (req) => {
      if (!fendEnabled) return _json({ ok: false, error: "disabled" }, 403);
      if (req.length > MAX_EXPR_LEN) {
        return _json({ ok: false, error: "too-long" }, 400);
      }

      const expr = _parseLanguage(
        new URL(req.url).searchParams.get("expr") || "",
      );
      if (!expr) return _json({ ok: false, error: "empty" }, 400);
      const out = await _evaluate(expr.expression);
      return _json(out);
    },
  },
];
