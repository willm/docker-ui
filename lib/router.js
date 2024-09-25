export const respondWithHTML = (res, statusCode, headers, body) => {
  res.writeHead(statusCode, {"Content-Type": "text/html", ...headers});
  res.end(body);
};

export const Router = (req, res) => {
  const routes = [];
  return {
    get: (urlPattern, fn) => {
      routes.push(["GET", urlPattern, fn]);
    },
    delete: async (urlPattern, fn) => {
      routes.push(["DELETE", urlPattern, fn]);
    },
    post: async (urlPattern, fn) => {
      routes.push(["POST", urlPattern, fn]);
    },
    route: async () => {
      for (const route of routes) {
        const [method, pattern, fn] = route;
        const matches = req.url.match(pattern);
        if (req.method === method && matches) {
          return await fn(matches);
        }
      }
      const respond = respondWithHTML.bind(null, res);
      respond(404, {}, `<html></html>`);
    },
  };
};
