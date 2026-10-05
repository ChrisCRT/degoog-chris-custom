import * as fendModule from "fend-wasm-web";
import { normalise, getLanguage } from "../natural-language";

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

const _getRollSides = (expression) => {
  if (typeof expression !== "string") return null;
  const s = expression.trim().toLowerCase();
  const dice = s.match(/(?:^|\s)(\d*)d(\d+)\b/);
  if (!dice) return null;
  const sides = Number(dice[2]);
  return Number.isInteger(sides) && sides > 0 ? sides : null;
};

const _getLanguage = (parsed) => {
  if (!parsed?.language) return getLanguage("en");
  return getLanguage(parsed.language) || getLanguage("en");
};

const _normalise = (input, language) => {
  const parsed = normalise(input, { language: language || undefined });
  if (!parsed || !parsed.expression) return null;
  return parsed;
};

const _evaluate = async (parsed, timeout = EVAL_TIMEOUT) => {
  if (!parsed?.expression || parsed.expression.length > MAX_EXPR_LEN) {
    return { ok: false, result: "" };
  }
  const expression = parsed.expression;
  const cacheable = parsed.cacheable !== false;
  const cacheKey = `${parsed.language || "en"}:${parsed.expression}`;
  try {
    if (cacheable && evalCache) {
      const cached = await evalCache.get(cacheKey);
      if (cached !== undefined && cached !== null) return cached;
    }

    const fend = await _loadFend();
    const result = fend.evaluateFendWithTimeout(expression, timeout);
    if (typeof result !== "string" || !result) return { ok: false, result: "" };
    if (result.startsWith("Error:")) {
      return { ok: false, result: "", error: result.trim() };
    }

    const out = { ok: true, result };
    if (cacheable && evalCache) await evalCache.set(cacheKey, out);
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

const _formatNumber = (result, language) => {
  if (typeof result !== "string" || !result) {
    return result || "";
  }

  const decimalSeparator = language?.output?.number?.decimalSeparator;

  if (
    typeof decimalSeparator !== "string" ||
    decimalSeparator.length !== 1 ||
    decimalSeparator === "."
  ) {
    return result;
  }

  if (/^-?(?:\d+|\d*\.\d+)$/.test(result.trim())) {
    return result.replace(".", decimalSeparator);
  }

  return result;
};

const _formatResult = (result, parsed) => {
  if (!result || !parsed) {
    return result || "";
  }
  const language = _getLanguage(parsed);
  return _formatNumber(result, language);
};

const _getUi = (parsed) => {
  const language = _getLanguage(parsed);
  return (
    language?.output?.ui || {
      disabled: "Fend is disabled.",
      usage: "Usage: !fend <expression>",
      tooLong: "Expression is too long.",
      couldNotEvaluate: "Could not evaluate",
    }
  );
};

const _rollHtml = () => `
  <div class="fend-die-wrap" data-fend-die>
    <div class="fend-die" data-fend-die-value>?</div>
    <div class="fend-die-shadow"></div>
  </div>
`;
const _calcHtml = (expression, result) => {
  const isRoll = _getRollSides(expression) !== null;
  return `
  <div class="fend-calc" data-fend-calc>
    <div class="fend-calc-screen">
      <input id="fend-calc-expression" name="expression" class="fend-calc-expr" type="text" value="${_esc(expression)}" spellcheck="false" autocomplete="off" />
      <div class="fend-calc-result" data-fend-calc-result>${isRoll ? _rollHtml() : result ? `= ${_esc(result)}` : ""}</div>
    </div>
    <div class="fend-calc-keys">${CALC_KEYS_HTML}</div>
  </div>
  `;
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
    if (!fendEnabled || query.length > MAX_EXPR_LEN) return false;
    const parsed = _normalise(query);
    if (!parsed?.expression) return false;
    const out = await _evaluate(parsed, 250);
    return out.ok;
  },

  async execute(query, context) {
    const parsed = _normalise(query, context?.lang);
    if (!parsed?.expression) {
      return { html: _calcHtml(typeof query === "string" ? query : "", "") };
    }
    const out = await _evaluate(parsed);
    const result = out.ok ? _formatResult(out.result, parsed) : "";
    return { html: _calcHtml(parsed.original || parsed.expression, result) };
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

  async execute(args, context) {
    if (!fendEnabled) {
      const language = getLanguage(context?.lang || "en");
      const ui = language?.output?.ui || {};

      return {
        title: "Fend Calculator",
        html: `<div class="command-result">
                 <p>${_esc(ui.disabled || "Fend is disabled.")}</p>
               </div>`,
      };
    }
    const parsed = _normalise(args, context?.lang);
    const ui = _getUi(parsed);
    if (!parsed?.expression) {
      return {
        title: "Fend Calculator",
        html: `<div class="command-result">
                 <p>${_esc(ui.usage || "Usage: !fend <expression>")}</p>
               </div>`,
      };
    }
    if (parsed.expression.length > MAX_EXPR_LEN) {
      return {
        title: "Fend Calculator",
        html: `<div class="command-result">
                <p>${_esc(ui.tooLong || "Expression is too long.")}</p>
              </div>`,
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
              </div>`,
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
             </div>`,
    };
  },
};

export const routes = [
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
          expression: parsed.expression,
        });
      }

      return _json({
        ...out,
        language: parsed.language,
        type: parsed.type,
        original: parsed.original,
        expression: parsed.expression,
        result: _formatResult(out.result, parsed),
      });
    },
  },
];
