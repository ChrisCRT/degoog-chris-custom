const ECB_RATES_URL =
  "https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml";

const UN_RATES_URL = "https://treasury.un.org/operationalrates/xsql2XML.php";

let currencyCache = null;
let currencyRatePromise = null;

export const initCurrency = (cache) => {
  currencyCache = cache;
};

const _parseEcbRates = (xml) => {
  const rates = new Map([["EUR", 1]]);

  for (const line of xml.split(/\r?\n/)) {
    const l = line.trim();

    if (!l.startsWith("<Cube currency=")) continue;

    const match = l.match(/^<Cube currency='([A-Z]{3})' rate='([^']+)'/);

    if (!match) continue;

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

const _parseUnRates = (xml) => {
  const rates = new Map([["USD", 1]]);

  const start = xml.indexOf("<UN_OPERATIONAL_RATES>");

  if (start === -1) {
    throw new Error("UN exchange-rate response has no operational rates");
  }

  let data = xml.slice(start);

  while (data.length > 0) {
    const currencyStart = data.indexOf("<f_curr_code>");

    if (currencyStart === -1) break;

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

    if (!/^[A-Z]{3}$/.test(currency)) continue;

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

const _normalizeToUsd = (rates, sourceBase) => {
  const baseToUsd = rates.get("USD");

  if (sourceBase === "USD") {
    return rates;
  }

  if (!Number.isFinite(baseToUsd) || baseToUsd <= 0) {
    throw new Error("Exchange-rate source does not provide USD");
  }

  const normalized = new Map();

  for (const [currency, rate] of rates) {
    if (!Number.isFinite(rate) || rate <= 0) continue;

    normalized.set(currency, baseToUsd / rate);
  }

  normalized.set("USD", 1);

  return normalized;
};

const _fetchEcbRates = async (doFetch) => {
  const response = await doFetch(ECB_RATES_URL);

  if (!response.ok) {
    throw new Error(`ECB request failed: HTTP ${response.status}`);
  }

  const xml = await response.text();

  return _normalizeToUsd(_parseEcbRates(xml), "EUR");
};

const _fetchUnRates = async (doFetch) => {
  const response = await doFetch(UN_RATES_URL);

  if (!response.ok) {
    throw new Error(`UN Treasury request failed: HTTP ${response.status}`);
  }

  const xml = await response.text();

  return _parseUnRates(xml);
};

export const fetchCurrencyRates = async (doFetch) => {
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
        console.warn(
          "[fend-calculator] ECB exchange rates failed; trying UN Treasury:",
          ecbError,
        );
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
