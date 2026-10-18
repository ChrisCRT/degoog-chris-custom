import { PAGE_SIZE } from "./const/kiwix.js";

export const buildUrl = (baseUrl, bookName, query, page) => {
  const offset = (Math.max(1, Number(page) || 1) - 1) * PAGE_SIZE;
  const url = new URL("/search", `${baseUrl}/`);

  if (bookName) url.searchParams.set("books.name", bookName);

  url.searchParams.set("pattern", query);
  url.searchParams.set("start", String(offset));
  url.searchParams.set("pageLength", String(PAGE_SIZE));
  url.searchParams.set("format", "xml");

  return url.href;
};
