(() => {
  const SELECTOR = "[data-kiwix-lazy]";
  const observed = new WeakSet();
  const loading = new WeakSet();
  if (!("IntersectionObserver" in window)) return;
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const element = entry.target;
        observer.unobserve(element);
        if (loading.has(element)) continue;
        loading.add(element);
        loadDetails(element);
      }
    },
    { rootMargin: "300px 0px", threshold: 0 },
  );
  async function loadDetails(element) {
    const articleUrl = element.dataset.articleUrl;
    const detailsRoute = element.dataset.detailsRoute;
    if (!articleUrl || !detailsRoute) return;
    try {
      const endpoint = new URL(detailsRoute, window.location.href);
      endpoint.searchParams.set("path", articleUrl);
      const response = await fetch(endpoint, { credentials: "same-origin" });
      if (!response.ok)
        throw new Error(`Details request failed: ${response.status}`);
      const html = await response.text();
      const template = document.createElement("template");
      template.innerHTML = html;
      if (template.content.querySelector(SELECTOR)) {
        element.dataset.lazyState = "unavailable";
        return;
      }
      element.replaceWith(template.content);
    } catch (error) {
      console.warn("Kiwix lazy loading failed:", error);
      element.dataset.lazyState = "error";
    }
  }
  function scan(root) {
    if (root.matches?.(SELECTOR) && !observed.has(root)) {
      observed.add(root);
      observer.observe(root);
    }
    root.querySelectorAll?.(SELECTOR).forEach((element) => {
      if (observed.has(element)) return;
      observed.add(element);
      observer.observe(element);
    });
  }
  scan(document);
  const mutationObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) scan(node);
      }
    }
  });
  mutationObserver.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();
