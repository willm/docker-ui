import type {Handler} from "hono";
import {html, raw} from "hono/html";
import {listContainers} from "./docker-client.js";
import {HTTPError} from "./request.js";
import * as containersView from "./containers-view.js";

export const listHandler: Handler = async (ctx) => {
  let body: string;
  try {
    const containerList = await listContainers();
    body = containersView.render(containerList);
  } catch (err) {
    body = `<p>${(err as HTTPError).statusCode}<p>`;
  }
  return ctx.html(
    html`<!doctype html>
    <html>
    <head>
      <link rel="stylesheet" href="https://unpkg.com/mvp.css">
      <script src="https://unpkg.com/htmx.org@2.0.2" integrity="sha384-Y7hw+L/jvKeWIRRkqWYfPcvVxHzVzn5REgzbawhxAuQGwX1XWe70vji+VSeHOThJ" crossorigin="anonymous"></script>
      <script src="https://unpkg.com/htmx.org@1.9.12/dist/ext/response-targets.js"></script>
      <script type="text/javascript">

(function() {
  let api;
  htmx.defineExtension("chunked-transfer", {
    init: function(apiRef) {
      api = apiRef;
    },
    onEvent: function(name, evt) {
      const elt = evt.target;
      if (name === "htmx:beforeRequest") {
        const xhr = evt.detail.xhr;
        xhr.onprogress = function() {
          const is_chunked = xhr.getResponseHeader("Transfer-Encoding") === "chunked";
          if (!is_chunked)
            return;
          let response = xhr.response;
          api.withExtensions(elt, function(extension) {
            if (!extension.transformResponse)
              return;
            response = extension.transformResponse(response, xhr, elt);
          });
          var swapSpec = api.getSwapSpecification(elt);
          var target = api.getTarget(elt);
          var settleInfo = api.makeSettleInfo(elt);
          api.swap(target, response, { swapStyle: swapSpec.swapStyle });
          api.settleImmediately(settleInfo.tasks);
        };
      }
    }
  });
})();

      </script>
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
    <body hx-ext="chunked-transfer">
      <article>
        <aside id="error"></aside>
      </article>
      <form hx-post="/containers" hx-target="#container-loading" hx-target-error="#error" hx-on:htmx:after-request="htmx.trigger('#containers', 'newContainer', {})">
        <h2>Launch Container</h2>
        <label for="image">image</label>
        <input required type="text" name="image" id="image" />
        <label for="cmd">command</label>
        <input required type="text" name="cmd" id="cmd" />
        <button id="add-port-mapping-button">Add port mapping</button>
        <fieldset id="port-mapping-form">
          <legend>Port mappings</legend>
          <label for="host-port">Host</label>
          <input type="number" name="hostPort" id="host-port" min="1000" max="10000" increment=@1"></input>
          <label for="containerPort">Container</label>
          <input type="number" name="containerPort" id="containerPort" min="1" max="10000" increment=@1"></input>
        </fieldset>
        <div id="container-loading">
          <button type="submit">
            +
            <span class="htmx-indicator">...</span>
          </button>
        </div>
      </form>
      ${raw(body)}
    </body>
</html>`
  );
};
