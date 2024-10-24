import {FC, PropsWithChildren} from "hono/jsx";

export const Label: FC<PropsWithChildren<{for: string}>> = (props) => (
  <label class="block text-gray-700 text-sm font-bold mb-2" for={props.for}>
    {props.children}
  </label>
);
