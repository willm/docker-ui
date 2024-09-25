import {createServer} from "http";
import {
  listContainers,
  deleteContainer,
  createContainer,
  startContainer,
} from "./lib/docker-client.js";
import * as containersView from "./lib/containers-view.js";
import {respondWithHTML, Router} from "./lib/router.js";

createServer(async (req, res) => {
  const respond = respondWithHTML.bind(null, res);
  const router = Router(req, res);
  router.get(new RegExp("/$"), async () => {
    const containerList = await listContainers();
    respond(
      200,
      {},
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

  router.delete(/\/containers\/(?<id>[0-9a-z]+)$/, async (matches) => {
    const deleteRes = await deleteContainer({id: matches.groups.id});
    const containerList = await listContainers();
    respond(200, {}, containersView.render(containerList));
  });

  router.post(/\/containers$/, async (matches) => {
    const container = await createContainer({
      image: "alpine",
      cmd: ["sleep", "10000"],
    });
    const res = await startContainer({id: container.Id});
    const containerList = await listContainers();
    respond(200, {}, containersView.render(containerList));
  });

  router.route();
}).listen(4000);
