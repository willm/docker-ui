import type {ListContainerResponse} from "./docker-client.js";

export const render = (containers: ListContainerResponse) => {
  return `<section id="containers" hx-ext="response-targets">
    <form hx-post="/containers" hx-target="#containers" hx-target-error="#error">
      <h2>Launch Container</h2>
      <label for="image">image</label>
      <input required type="text" name="image" id="image" />
      <label for="cmd">command</label>
      <input required type="text" name="cmd" id="cmd" />
      <button type="submit">
        +
        <span class="htmx-indicator">...</span>
      </button>
    </form>
    <section>
      ${containers
        .map(
          (c) => `<aside>
            <h3>${c.Image}</h3>
            <h4>${c.Id.substring(0, 12)}</h4>
            <span>${new Date(c.Created * 1000).toISOString()}</span>
            <code>${c.Command}</code>
            </br>
            <button
              hx-target="#containers"
              hx-swap="outerHTML"
              hx-delete="/containers/${c.Id.substring(0, 12)}">
                Delete
            </button>
          </aside>`
        )
        .join("")}
    </section>
  </section>`;
};
