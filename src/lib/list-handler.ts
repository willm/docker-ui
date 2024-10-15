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
        <div id="container-loading">
          <button type="submit">
            +
            <span class="htmx-indicator">...</span>
          </button>
        </div>
      </form>
      ${body}
    </body>
</html>`
  );
};
