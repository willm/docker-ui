import {FC} from "hono/jsx";
import {TextInput} from "./Input.js";
import {Label} from "./Label.js";

export const ActiveSearch: FC<{id: string}> = (props) => (
  <div class="static">
    <Label for="image">Image</Label>
    <TextInput
      hx-get={`/images/search`}
      hx-trigger="input changed delay:500ms, search"
      hx-target="#active-search-suggestions"
      autocomplete="off"
      required={true}
      name={props.id}
      id={props.id}
    />
    <div
      id="active-search-suggestions"
      class="absolute bg-white flex flex-col w-48 border"
    ></div>
  </div>
);
