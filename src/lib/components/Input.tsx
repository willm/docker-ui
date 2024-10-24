import {FC} from "hono/jsx";

export const TextInput: FC<{
  name: string;
  id: string;
  required?: boolean;
  className?: string;
  list?: string;
  autocomplete?: "on" | "off";
}> = (props) => (
  <input
    {...props}
    class={
      "shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline " +
        props.className || ""
    }
    required={props.required}
    type="text"
    name={props.name}
    id={props.id}
    list={props.list}
  />
);

export const NumberInput: FC<{
  name: string;
  id: string;
  required?: boolean;
  min?: number;
  max?: number;
  increment?: number;
  className?: string;
}> = (props) => (
  <input
    class={
      "shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline " +
        props.className || ""
    }
    required={props.required}
    min={props.min}
    max={props.max}
    type="number"
    name={props.name}
    id={props.id}
    increment={props.increment}
  />
);
