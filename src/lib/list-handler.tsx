import type {Handler} from "hono";
import {listContainers} from "./docker-client.js";
import {HTTPError} from "./request.js";
import {ContainersList} from "./components/ContainersList.js";
import {Button} from "./components/Button.js";

export const listHandler: Handler = async (ctx) => {
  let body;
  try {
    const containerList = await listContainers();
    body = <ContainersList containers={containerList} />;
  } catch (err) {
    body = <p>${(err as HTTPError).statusCode}</p>;
  }
  return ctx.html(
    <html>
      <head>
        <script
          src="https://unpkg.com/htmx.org@2.0.2"
          integrity="sha384-Y7hw+L/jvKeWIRRkqWYfPcvVxHzVzn5REgzbawhxAuQGwX1XWe70vji+VSeHOThJ"
          crossorigin="anonymous"
        ></script>
        <script src="https://unpkg.com/htmx.org@1.9.12/dist/ext/response-targets.js"></script>
        <script
          src="/static/src/htmx-chunked.js"
          type="text/javascript"
        ></script>
        <script src="https://cdn.tailwindcss.com"></script>
        <script src="/static/src/index.js" defer></script>
        <link rel="stylesheet" href="/static/src/style.css"></link>
        <title>Docker</title>
      </head>
      <body hx-ext="chunked-transfer">
        <article>
          <aside id="error"></aside>
        </article>
        <form
          hx-post="/containers"
          hx-target="#container-loading"
          hx-target-error="#error"
          {...{
            "hx-on:htmx:after-request":
              "htmx.trigger('#containers', 'newContainer', {})",
          }}
        >
          <h2>Launch Container</h2>
          <label for="image">image</label>
          <input required type="text" name="image" id="image" />
          <label for="cmd">command</label>
          <input required type="text" name="cmd" id="cmd" />
          <Button id="add-port-mapping-button">Add port mapping</Button>
          <fieldset id="port-mapping-form">
            <legend>Port mappings</legend>
            <label for="host-port">Host</label>
            <input
              type="number"
              name="hostPort"
              id="host-port"
              min="1000"
              max="10000"
              increment="1"
            ></input>
            <label for="containerPort">Container</label>
            <input
              type="number"
              name="containerPort"
              id="containerPort"
              min="1"
              max="10000"
              increment="1"
            ></input>
          </fieldset>
          <div id="container-loading">
            <Button type="submit">
              +<span class="htmx-indicator">...</span>
            </Button>
          </div>
        </form>
        {body}
      </body>
    </html>
  );
};
