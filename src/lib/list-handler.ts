import {HTTPError, listContainers} from "./docker-client.js";
import * as containersView from "./containers-view.js";
import type {Handler} from "./router.js";

export const listHandler: Handler = async ({respond}) => {
  let body: string;
  try {
    const containerList = await listContainers();
    body = containersView.render(containerList);
  } catch (err) {
    body = `<p>${(err as HTTPError).statusCode}<p>`;
  }
  respond(
    200,
    {},
    `<!doctype html>
    <html>
    <head>
      <link rel="stylesheet" href="https://unpkg.com/mvp.css">
      <script src="https://unpkg.com/htmx.org@2.0.2" integrity="sha384-Y7hw+L/jvKeWIRRkqWYfPcvVxHzVzn5REgzbawhxAuQGwX1XWe70vji+VSeHOThJ" crossorigin="anonymous"></script>
      <script src="https://unpkg.com/htmx.org@1.9.12/dist/ext/response-targets.js"></script>
      <script src="https://unpkg.com/htmx.ext...chunked-transfer/dist/index.js"></script>
      <title>Docker</title>
      <style>
       .htmx-indicator{
         display: none;
         transition: opacity 500ms ease-in;
       }
       .htmx-request .htmx-indicator{
         display: block;
       }
       .htmx-request.htmx-indicator{
         display: block;
       }
       </style>
    </head>
    <body>
      <article>
        <aside id="error"></aside>
      </article>
      ${body}
    </body>
</html>`
  );
};
