export const buildUrl = (baseUrl, bookName, query) => {
  const url = new URL("/search", `${baseUrl}/`);

  if (bookName) url.searchParams.set("books.name", bookName);

  url.searchParams.set("pattern", query);
  url.searchParams.set("pageLength", "1");
  url.searchParams.set("format", "xml");

  return url.href;
};
