import type {ListContainerResponse} from "../docker-client.js";
import {ContainerCard} from "./ContainerCard.js";
import {FC} from "hono/jsx";

export const ContainersList: FC<{containers: ListContainerResponse}> = (
  props
) => {
  return (
    <section
      id="containers"
      class="grid grid-cols-4 gap-4"
      hx-get="/containers"
      hx-trigger="newContainer from:body, every 120s"
    >
      {props.containers.map((c) => (
        <ContainerCard container={c} />
      ))}
    </section>
  );
};
