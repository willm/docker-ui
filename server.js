import {createServer} from "http";
import {listContainers, deleteContainer} from "./docker-client.js";
import * as containersView from "./containers-view.js";

const respondWith = (res, statusCode, headers, body) => {
  res.writeHead(statusCode, headers);
  res.end(body);
};

const Router = (req, res) => {
  const routes = [];
  return {
    get: (urlPattern, fn) => {
      routes.push(["GET", urlPattern, fn]);
    },
    delete: async (urlPattern, fn) => {
      routes.push(["DELETE", urlPattern, fn]);
    },
    route: async (req, res) => {
      for (const route of routes) {
        const [method, pattern, fn] = route;
        const matches = req.url.match(pattern);
        if (req.method === method && matches) {
          return await fn(matches);
        }
      }
      const respond = respondWith.bind(null, res);
      respond(404, {"Content-Type": "text/html"}, `<html></html>`);
    },
  };
};

createServer(async (req, res) => {
  const respond = respondWith.bind(null, res);
  const router = Router(req, res);
  router.get(new RegExp("/"), async () => {
    const containerList = await listContainers();
    respond(
      200,
      {"Content-Type": "text/html"},
      `<!doctype html>
    <html>
    <head>
      <script src="https://unpkg.com/htmx.org@2.0.2" integrity="sha384-Y7hw+L/jvKeWIRRkqWYfPcvVxHzVzn5REgzbawhxAuQGwX1XWe70vji+VSeHOThJ" crossorigin="anonymous"></script>
      <title>Docker</title>
    </head>
    <body>
      ${containersView.render(containerList)}
    </body>
</html>`
    );
  });

  router.delete(/\/containers\/(?<id>[0-9a-z]+)/, async (matches) => {
    const deleteRes = await deleteContainer({id: matches.groups.id});
    const containerList = await listContainers();
    respond(
      200,
      {"Content-Type": "text/html"},
      containersView.render(containerList)
    );
  });

  router.route(req, res);
}).listen(4000);
