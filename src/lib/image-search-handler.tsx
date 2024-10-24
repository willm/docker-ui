import type {Handler} from "hono";
import {search} from "./docker-hub-client.js";

export const imageSearchHandler: Handler = async (ctx) => {
  const imageList = await search(ctx.req.query("image")!);

  return ctx.html(
    <>
      {imageList.results.map((i: {name: string}) => (
        <button
          hx-on:click={`
            document.getElementById('image').value = this.textContent;
            this.parentElement.innerHTML = '';
          `}
          type="button"
        >
          {i.name}
        </button>
      ))}
    </>
  );
};
