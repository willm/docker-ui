import type {ListContainerResponse} from "../docker-client.js";
import {ContainerCard} from "./ContainerCard.js";
import {FC} from "hono/jsx";

export const ContainersList: FC<{containers: ListContainerResponse}> = (
  props
) => {
  return (
    <section id="containers" hx-ext="response-targets">
      <section
        hx-get="/containers"
        hx-trigger="newContainer from:body, every 10s"
      >
        {props.containers.map((c) => (
          <ContainerCard container={c} />
        ))}
      </section>
    </section>
  );
};
