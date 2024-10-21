import {Button} from "./Button.js";
import type {Container, Port} from "../docker-client.js";
import {FC} from "hono/jsx";

const PortsTable: FC<{ports: Port[]}> = (props) => (
  <>
    <h5>Ports</h5>
    <table>
      <thead>
        <th>Host</th>
        <th>Container</th>
      </thead>
      <tbody>
        {props.ports.map((p) => (
          <tr>
            <td>
              <a href="http://localhost:${p.PublicPort}">{p.PublicPort}</a>
            </td>
            <td>{p.PrivatePort}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </>
);

export const ContainerCard: FC<{container: Container}> = (props) => {
  const c = props.container;
  const ports = c.Ports.filter((p) => p.PublicPort && p.IP !== "::");
  return (
    <aside>
      <h3>{c.Image}</h3>
      <h4>{c.Id.substring(0, 12)}</h4>
      <span>{new Date(c.Created * 1000).toLocaleString()}</span>
      <code>{c.Command}</code>
      <PortsTable ports={ports} />
      <br />
      <Button
        type="button"
        hx-target="#containers"
        hx-swap="outerHTML"
        hx-delete={`/containers/${c.Id.substring(0, 12)}`}
      >
        Delete
      </Button>
    </aside>
  );
};