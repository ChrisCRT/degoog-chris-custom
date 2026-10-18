const _decodeXml = (value = "") =>
  value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .trim();

const _getTag = (xml, tag) => {
  const match = xml.match(
    new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}\\s*>`, "i"),
  );

  return match ? _decodeXml(match[1]) : "";
};

const _stripHtml = (html) =>
  html
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();

export const parseResults = (data, baseUrl, source) => {
  if (typeof data !== "string" || !data) return [];
  const items = data.match(/<item\b[^>]*>[\s\S]*?<\/item\s*>/gi) ?? [];
  const results = [];
  for (const item of items) {
    const title = _stripHtml(_getTag(item, "title"));
    const rawUrl = _getTag(item, "link");
    const description = _getTag(item, "description");
    if (!title || !rawUrl) continue;

    let url;
    try {
      url = new URL(rawUrl, baseUrl).href;
    } catch {
      continue;
    }

    results.push({
      title,
      url,
      snippet: _stripHtml(description),
      source,
    });
  }

  return results;
};
