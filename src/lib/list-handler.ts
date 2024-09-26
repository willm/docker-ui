import {listContainers} from "./docker-client.js";
import * as containersView from "./containers-view.js";
import type {Handler} from "./router.js";

export const listHandler: Handler = async ({respond}) => {
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
};
