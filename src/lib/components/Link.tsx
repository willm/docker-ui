import {FC, PropsWithChildren} from "hono/jsx";

export const Link: FC<PropsWithChildren<{href: string; alt: string}>> = (
  props
) => (
  <a
    class="font-medium text-blue-600 dark:text-blue-500 hover:underline visited:text-purple-600"
    href={props.href}
    alt={props.alt}
  >
    {props.children}
  </a>
);
