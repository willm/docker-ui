import type {ListContainerResponse} from "./docker-client.js";

export const render = (containers: ListContainerResponse) => {
  return `<section id="containers" hx-ext="response-targets">
    <section hx-get="/containers" hx-trigger="newContainer from:body">
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
