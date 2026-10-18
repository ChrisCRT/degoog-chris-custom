import { DEFAULT_INSTANCE } from "./const/kiwix.js";
import { buildUrl } from "./request.js";
import { parseResults } from "./parse.js";

export default class KiwixEngine {
  isClientExposed = false;
  name = "Kiwix";
  bangShortcut = "kiwix";

  settingsSchema = [
    {
      key: "instanceUrl",
      label: "Instance URL",
      type: "url",
      placeholder: DEFAULT_INSTANCE,
      description: "Base URL of your kiwix-serve instance",
      default: DEFAULT_INSTANCE,
    },
    {
      key: "bookName",
      label: "Book Name",
      type: "text",
      placeholder: "wikipedia_en_all_maxi_2026-08",
      description:
        "Optional ZIM book name to search. Leave blank to search all books",
      default: "",
    },
  ];

  configure(settings) {
    this.instanceUrl = (settings.instanceUrl || DEFAULT_INSTANCE).replace(
      /\/+$/,
      "",
    );
    this.bookName = (settings.bookName || "").trim();
  }

  async executeSearch(query, page = 1, _timeFilter, context) {
    const q = query.trim();
    if (!q) return [];
    const doFetch = context?.fetch ?? fetch;
    const baseUrl = this.instanceUrl || DEFAULT_INSTANCE;
    const response = await doFetch(buildUrl(baseUrl, this.bookName, q, page), {
      headers: { Accept: "application/xml, text/xml" },
    });
    context?.sentinel?.(response, this.name);

    let data;
    try {
      data = await response.text();
    } catch {
      return [];
    }
    return parseResults(data, baseUrl, this.name);
  }
}
