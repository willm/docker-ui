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
      let context = {req, res};
      const requestBody = await new Promise((resolve, reject) => {
        let data = "";

        req.on("data", (chunk) => {
          data += chunk;
        });
        req.on("end", (chunk) => {
          resolve(data);
        });
      });
      for (const route of routes) {
        const [method, pattern, fn] = route;
        const matches = req.url.match(pattern);
        context = {...context, matches, body: requestBody};
        if (req.method === method && matches) {
          return await fn(context);
        }
      }
      const respond = respondWithHTML.bind(null, res);
      respond(404, {}, `<html></html>`);
    },
  };
};
