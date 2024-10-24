import {FC, PropsWithChildren} from "hono/jsx";

export const Button: FC = (
  props: PropsWithChildren<{
    id?: string;
    type?: "submit" | "button";
    className?: string;
  }>
) => (
  <button
    type={props.type || "button"}
    class={
      "bg-blue-500 text-white rounded py-2 px-4 hover:bg-blue-700 " +
        props.className || ""
    }
    id={props.id || ""}
    {...props}
  >
    {props.children}
  </button>
);
