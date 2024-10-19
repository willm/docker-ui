import type {ListContainerResponse, Port} from "./docker-client.js";

const portsTable = (ports: Port[]) =>
  ports.length
    ? `
<h5>Ports</h5>
<table>
  <thead>
    <th>Host</th>
    <th>Container</th>
  </thead>
  <tbody>
    ${ports
      .map(
        (p) => `<tr>
        <td><a href="http://localhost:${p.PublicPort}">${p.PublicPort}</a></td>
        <td>${p.PrivatePort}</td>
      </tr>`
      )
      .join("")}
  </tbody>
</table>
`
    : "";

export const render = (containers: ListContainerResponse) => {
  return `<section id="containers" hx-ext="response-targets">
    <section hx-get="/containers" hx-trigger="newContainer from:body, every 1s">
      ${containers
        .map((c) => {
          const ports = c.Ports.filter((p) => p.PublicPort && p.IP !== "::");
          return `<aside>
            <h3>${c.Image}</h3>
            <h4>${c.Id.substring(0, 12)}</h4>
            <span>${new Date(c.Created * 1000).toLocaleString()}</span>
            <code>${c.Command}</code>
            ${portsTable(ports)}
            </br>
            <button
              hx-target="#containers"
              hx-swap="outerHTML"
              hx-delete="/containers/${c.Id.substring(0, 12)}">
                Delete
            </button>
          </aside>`;
        })
        .join("")}
    </section>
  </section>`;
};
