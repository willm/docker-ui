import type {Handler} from "hono";
import {listContainers} from "./docker-client.js";
import {HTTPError} from "./request.js";
import {ContainersList} from "./components/ContainersList.js";
import {Button} from "./components/Button.js";
import {Label} from "./components/Label.js";
import {TextInput, NumberInput} from "./components/Input.js";
import {ArrowSquare} from "./components/Icons.js";
import {ActiveSearch} from "./components/ActiveSearch.js";
import {Header} from "./components/Header.js";
import {Head} from "./components/Head.js";

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
      <Head />
      <body hx-ext="chunked-transfer">
        <Header />
        <main class="px-20 py-10">
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
            <ActiveSearch id="image" />
            <Label for="cmd">Command</Label>
            <div class="inline-flex">
              <TextInput required={true} name="cmd" id="cmd" />
              <Button className="ml-2" id="add-port-mapping-button">
                <ArrowSquare />
              </Button>
            </div>
            <fieldset id="port-mapping-form" class="hidden">
              <legend>Port mappings</legend>
              <Label for="host-port">Host</Label>
              <NumberInput
                name="hostPort"
                id="host-port"
                min={1000}
                max={10000}
                increment={1}
              />
              <Label for="container-port">Container</Label>
              <NumberInput
                name="containerPort"
                id="containerPort"
                min={1}
                max={10000}
                increment={1}
              />
            </fieldset>
            <div id="container-loading">
              <Button type="submit" className="mt-2">
                +<span class="htmx-indicator">...</span>
              </Button>
            </div>
          </form>
          {body}
        </main>
      </body>
    </html>
  );
};
